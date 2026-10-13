import React, { useState } from 'react';
import styles from './JobPosterScanner.module.css'; 
import { createWorker } from 'tesseract.js';


const JobPosterScanner = ({ onExtractSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');

  // Fungsi untuk memproses gambar (Grayscale & Peningkatan Kontras via Canvas)
  const preprocessImage = (imageFile) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Skala ukuran agar optimal untuk OCR (tidak terlalu besar/kecil)
          canvas.width = img.width;
          canvas.height = img.height;

          // Gambar ke canvas
          ctx.drawImage(img, 0, 0);

          // Ambil data piksel untuk manipulasi warna (Grayscale & Kontras)
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;

          for (let i = 0; i < data.length; i += 4) {
            // Ubah ke grayscale
            let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            
            // Tingkatkan kontras sederhana (Thresholding manual untuk mempertegas teks)
            let contrast = avg > 140 ? 255 : 0; 

            data[i]     = contrast; // R
            data[i + 1] = contrast; // G
            data[i + 2] = contrast; // B
          }

          ctx.putImageData(imgData, 0, 0);
          
          // Kembalikan sebagai URL gambar baru
          resolve(canvas.toDataURL('image/jpeg'));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(imageFile);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setProgress(10);
    setStatusText('Memproses dan mempertajam gambar...');

    try {
      // 1. Jalankan prapemrosesan gambar
      const processedImageUrl = await preprocessImage(file);

      setProgress(30);
      setStatusText('Menyiapkan mesin OCR...');

      // 2. Inisialisasi Tesseract worker dengan parameter khusus poster
      const worker = await createWorker('ind+eng');
      await worker.setParameters({
        tessedit_pageseg_mode: '3', // Fully automatic page segmentation
      });

      setProgress(50);
      setStatusText('Mengekstrak teks dari poster...');

      const ret = await worker.recognize(processedImageUrl);
      const rawText = ret.data.text;

      setProgress(85);
      setStatusText('Menganalisis hasil teks...');
      await worker.terminate();

      // 3. Jalankan pemilahan teks cerdas
      const parsedData = parseJobPosterSmart(rawText);

      setProgress(100);
      setLoading(false);

      if (onExtractSuccess) {
        onExtractSuccess(parsedData);
      }
    } catch (error) {
      console.error('Gagal melakukan OCR:', error);
      alert('Terjadi kesalahan saat memindai gambar.');
      setLoading(false);
    }
  };

  // Algoritma Heuristik Cerdas untuk Mencari Posisi & Deskripsi Loker
    const parseJobPosterSmart = (text) => {
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        
        let detectedJobTitle = '';
        let detectedDescription = text; // Keseluruhan teks masuk ke jobDescription

        // Cari baris yang berada setelah kata kunci posisi / untuk posisi
        for (let i = 0; i < lines.length; i++) {
        const lowerLine = lines[i].toLowerCase();
        
        if (lowerLine.includes('posisi') || lowerLine.includes('untuk posisi') || lowerLine.includes('sebagai')) {
            if (lines[i + 1] && lines[i + 1].length < 30) {
            detectedJobTitle = lines[i + 1];
            break;
            }
        }
        }

        // Jika tidak ketemu dengan kata kunci, cari kata kunci peran umum
        if (!detectedJobTitle) {
        const commonRoles = ['admin', 'developer', 'engineer', 'manager', 'staff', 'analyst', 'designer', 'officer'];
        for (const line of lines) {
            const lower = line.toLowerCase();
            if (commonRoles.some(role => lower.includes(role)) && line.length < 35) {
            detectedJobTitle = line;
            break;
            }
        }
        }

        return {
            targetJob: detectedJobTitle,         
            jobDescription: detectedDescription  
        };
    };

  return (
    <div className={styles.scannerContainer}>
      <h4 className={styles.scannerHeader}>
        {/* <i className={`fa-solid fa-wand-magic-sparkles ${styles.scannerIcon}`}></i> */}
        {/* Upload Poster / Screenshot Info Loker (Auto-Fill) */}
      </h4>

      {/* Modern Custom Dropzone */}
      <div className={styles.fileDropzone}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          disabled={loading}
          className={styles.fileInputHidden}
        />
        <div className={styles.dropzoneContent}>
            <i className={`${styles.dropzoneIcon} fa-solid fa-cloud-arrow-up`}></i>
            <p className={styles.dropzoneText}>
            {loading ? 'Sedang memproses poster...' : 'Klik atau seret gambar poster loker di sini'}
          </p>
          <p className={styles.dropzoneSubtext}>Mendukung format PNG, JPG, JPEG (Ekstraksi lokal otomatis)</p>
        </div>
      </div>

      {/* Styled Progress Bar */}
      {loading && (
        <div className={styles.progressContainer}>
          <div className={styles.progressInfo}>
            <span>{statusText}</span>
            <span>{progress}%</span>
          </div>
          <div className={styles.progressBarTrack}>
            <div className={styles.progressBarFill} style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPosterScanner;