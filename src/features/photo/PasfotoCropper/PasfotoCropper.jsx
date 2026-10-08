import React, { useState, useEffect, useRef } from 'react';
import { useCareerUp } from '../../../context/CareerUpContext';

import PhotoNav from '../PhotoNav/PhotoNav';
import styles from './PasfotoCropper.module.css';

export default function PasfotoCropper() {
  const { photoData, updatePhoto } = useCareerUp();
  const canvasRef = useRef(null);

  const activeImage = photoData.processedImage || photoData.originalImage;

  const ratios = [
    { label: '2 x 3', width: 2, height: 3, targetW: 236, targetH: 354 },
    { label: '3 x 4', width: 3, height: 4, targetW: 354, targetH: 472 },
    { label: '4 x 6', width: 4, height: 6, targetW: 472, targetH: 709 },
  ];

  const [selectedRatio, setSelectedRatio] = useState(ratios[1]);
  const [zoom, setZoom] = useState(1);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    if (!activeImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.crossOrigin = 'anonymous';
    img.src = activeImage;

    img.onload = () => {
      canvas.width = selectedRatio.targetW;
      canvas.height = selectedRatio.targetH;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (photoData.backgroundColor && photoData.isBackgroundRemoved) {
        ctx.fillStyle = photoData.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const imgAspect = img.naturalWidth / img.naturalHeight;
      const cropAspect = selectedRatio.width / selectedRatio.height;

      let drawWidth, drawHeight;

      if (imgAspect > cropAspect) {
        drawHeight = canvas.height * zoom;
        drawWidth = drawHeight * imgAspect;
      } else {
        drawWidth = canvas.width * zoom;
        drawHeight = drawWidth / imgAspect;
      }

      const drawX = (canvas.width - drawWidth) / 2;
      const drawY = (canvas.height - drawHeight) / 2 + offsetY;

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    };
  }, [activeImage, selectedRatio, zoom, offsetY, photoData.backgroundColor, photoData.isBackgroundRemoved]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `pasfoto-${selectedRatio.label.replace(/\s+/g, '')}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!activeImage) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>Pemotong Rasio Pasfoto</h2>
          <p className={styles.subtitle}>
            Potong foto Anda secara presisi sesuai ukuran standar pasfoto resmi cetak atau berkas digital.
          </p>
        </header>
        <div className={styles.emptyState}>
          <i className={`fa-solid fa-crop-simple ${styles.emptyIcon}`}></i>
          <p>Silakan unggah foto terlebih dahulu di menu <strong>AI Background Remover</strong>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
        <PhotoNav />
      <header className={styles.header}>
        <h2 className={styles.title}>Pemotong Rasio Pasfoto</h2>
        <p className={styles.subtitle}>
          Atur rasio ukuran pasfoto (2x3, 3x4, 4x6), perbesaran, serta posisi vertikal secara presisi.
        </p>
      </header>

      <div className={styles.workspaceGrid}>
        <div className={styles.controlsCard}>
          <div>
            <div className={styles.sectionLabel}>Pilih Ukuran Rasio</div>
            <div className={styles.ratioGroup}>
              {ratios.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`${styles.ratioBtn} ${selectedRatio.label === item.label ? styles.ratioBtnActive : ''}`}
                  onClick={() => {
                    setSelectedRatio(item);
                    updatePhoto({ aspectRatio: item.label });
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <span>Skala Zoom</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <span>Posisi Vertikal</span>
              <span>{offsetY}px</span>
            </div>
            <input
              type="range"
              min="-150"
              max="150"
              step="2"
              value={offsetY}
              onChange={(e) => setOffsetY(parseInt(e.target.value))}
              className={styles.slider}
            />
          </div>
        </div>

        <div className={styles.previewCard}>
          <div className={styles.canvasWrapper}>
            <canvas ref={canvasRef} className={styles.canvas} />
          </div>

          <button type="button" onClick={handleDownload} className={styles.btnPrimary}>
            <i className="fa-solid fa-crop"></i>
            <span>Unduh Pasfoto ({selectedRatio.label})</span>
          </button>
        </div>
      </div>
    </div>
  );
}