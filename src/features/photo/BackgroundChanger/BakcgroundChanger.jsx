import React, { useState, useEffect, useRef } from 'react';
import { useCareerUp } from '../../../context/CareerUpContext';
import Navbar from '../../../components/layout/Navbar/Navbar';
import Footer from '../../../components/layout/Footer/Footer';
import PhotoNav from '../PhotoNav/PhotoNav';
import styles from './BackgroundChanger.module.css';

export default function BackgroundChanger() {
  const { photoData, updatePhoto } = useCareerUp();
  const canvasRef = useRef(null);
  
  const presets = [
    { label: 'Merah Resmi (Ganjil)', hex: '#db1514' },
    { label: 'Biru Resmi (Genap)', hex: '#0b42a1' },
    { label: 'Putih Standar', hex: '#ffffff' },
  ];

  const [selectedColor, setSelectedColor] = useState(photoData.backgroundColor || '#db1514');

  useEffect(() => {
    if (!photoData.processedImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.crossOrigin = 'anonymous';
    img.src = photoData.processedImage;

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx.fillStyle = selectedColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, 0, 0);
    };
  }, [photoData.processedImage, selectedColor]);

  const handleColorChange = (hex) => {
    setSelectedColor(hex);
    updatePhoto({ backgroundColor: hex });
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `pasfoto-resmi-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flex: 1 }} className={styles.container}>
        {/* PhotoNav ditaruh di sini agar selalu muncul meski belum ada foto */}
        <PhotoNav />

        <header className={styles.header}>
          <h2 className={styles.title}>Ganti Warna Latar Pasfoto</h2>
          <p className={styles.subtitle}>
            Ubah latar belakang pasfoto Anda menjadi warna resmi instansi atau kustom.
          </p>
        </header>

        {!photoData.processedImage ? (
          <div className={styles.emptyState}>
            <i className={`fa-solid fa-image ${styles.emptyIcon}`}></i>
            <p>Silakan hapus latar belakang foto terlebih dahulu di menu <strong>AI Background Remover</strong>.</p>
          </div>
        ) : (
          <div className={styles.workspaceGrid}>
            <div className={styles.controlsCard}>
              <div>
                <div className={styles.sectionLabel}>Warna Resmi Standar</div>
                <div className={styles.colorPresets}>
                  {presets.map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      className={`${styles.colorBtn} ${selectedColor === preset.hex ? styles.colorBtnActive : ''}`}
                      onClick={() => handleColorChange(preset.hex)}
                    >
                      <span className={styles.colorDot} style={{ backgroundColor: preset.hex }}></span>
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className={styles.sectionLabel}>Pilih Warna Custom</div>
                <div className={styles.customColorWrapper}>
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className={styles.colorInput}
                  />
                  <span className={styles.colorHexText}>{selectedColor.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className={styles.previewCard}>
              <div className={styles.canvasWrapper}>
                <canvas ref={canvasRef} className={styles.canvas} />
              </div>

              <button type="button" onClick={handleDownload} className={styles.btnPrimary}>
                <i className="fa-solid fa-download"></i>
                <span>Unduh Pasfoto Resmi HD</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}