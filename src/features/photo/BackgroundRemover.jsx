import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeBackground } from '@imgly/background-removal';
import { useCareerUp } from '../../context/CareerUpContext';
import Navbar from '../../components/layout/Navbar/Navbar';
import Footer from '../../components/layout/Footer/Footer';
import PhotoNav from './PhotoNav/PhotoNav';
import styles from './BackgroundRemover.module.css';

export default function BackgroundRemover() {
  const navigate = useNavigate();
  const { photoData, updatePhoto } = useCareerUp();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      updatePhoto({
        originalImage: reader.result,
        processedImage: null,
        isBackgroundRemoved: false,
      });
      setStatus('');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackground = async (e) => {
    if (e) e.preventDefault();
    if (!photoData.originalImage) return;

    setLoading(true);
    setStatus('Memuat model AI & memproses gambar...');

    try {
      const blob = await removeBackground(photoData.originalImage, {
        numThreads: 1,
        progress: (key, current, total) => {
          if (total > 0) {
            const percent = Math.round((current / total) * 100);
            setStatus(`Memproses AI (${key}): ${percent}%`);
          }
        },
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        updatePhoto({
          processedImage: reader.result,
          isBackgroundRemoved: true,
        });
        setStatus('Selesai! Latar belakang berhasil dihapus.');
        setLoading(false);

        navigate('/background-changer');
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error remove background:', error);
      setStatus('Gagal memproses gambar. Pastikan koneksi internet stabil.');
      setLoading(false);
    }
  };

  const handleDownload = (e) => {
    if (e) e.preventDefault();
    if (!photoData.processedImage) return;

    const link = document.createElement('a');
    link.href = photoData.processedImage;
    link.download = `pasfoto-nobg-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flex: 1 }} className={styles.container}>
        <PhotoNav />
        <header className={styles.header}>
          <h2 className={styles.title}>AI Background Remover</h2>
          <p className={styles.subtitle}>
            Hapus latar belakang foto formal secara otomatis langsung di peramban tanpa mengunggah berkas ke server luar.
          </p>
        </header>

        <div className={styles.uploadSection}>
          <label className={styles.fileLabel}>
            <i className={`fa-solid fa-cloud-arrow-up ${styles.uploadIcon}`}></i>
            <span className={styles.uploadText}>Pilih Foto / Pasfoto</span>
            <span className={styles.uploadSubtext}>Format JPG atau PNG (Maksimal 5MB)</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className={styles.hiddenInput}
            />
          </label>
        </div>

        {status && (
          <div className={styles.status}>
            <i className="fa-solid fa-circle-info"></i>
            <span>{status}</span>
          </div>
        )}

        <div className={styles.previewGrid}>
          {photoData.originalImage && (
            <div className={styles.card}>
              <h4 className={styles.cardTitle}>Foto Asli</h4>
              <div className={styles.imageWrapper}>
                <img src={photoData.originalImage} alt="Original" className={styles.media} />
              </div>
              <button
                type="button"
                onClick={handleRemoveBackground}
                disabled={loading}
                className={styles.btnPrimary}
              >
                <i className={loading ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-wand-magic-sparkles"}></i>
                <span>{loading ? 'Memproses...' : 'Hapus Latar Belakang'}</span>
              </button>
            </div>
          )}

          {photoData.processedImage && (
            <div className={styles.card}>
              <h4 className={styles.cardTitle}>Hasil Transparan (PNG)</h4>
              <div className={`${styles.imageWrapper} ${styles.transparentBg}`}>
                <img src={photoData.processedImage} alt="Result Transparan" className={styles.media} />
              </div>
              <button
                type="button"
                onClick={handleDownload}
                className={styles.btnSecondary}
              >
                <i className="fa-solid fa-download"></i>
                <span>Unduh Gambar PNG</span>
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}