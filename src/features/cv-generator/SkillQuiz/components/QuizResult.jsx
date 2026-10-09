import React from 'react';
import styles from '../SkillQuiz.module.css';

export default function QuizResult({ score, isGeneratingCv, onNextStep }) {
  return (
    <div className={styles.resultCard}>
      <i className={`fa-solid fa-award ${styles.scoreIcon}`}></i>
      <h3 className={styles.scoreText}>{score} / 100</h3>
      <p className={styles.scoreDesc}>
        {score >= 70
          ? 'Luar biasa! Keahlian Anda terbukti sangat solid. Narasi CV disusun dengan bobot kualifikasi tingkat tinggi.'
          : 'Hasil validasi cukup baik. Narasi CV disesuaikan secara proporsional sesuai tingkat pemahaman Anda.'}
      </p>

      <div className={styles.actionFooter} style={{ width: '100%', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={onNextStep}
          disabled={isGeneratingCv}
          className={styles.btnPrimary}
        >
          <span>{isGeneratingCv ? 'AI Sedang Menyusun CV...' : 'Lihat & Unduh CV Standar ATS'}</span>
          <i className={isGeneratingCv ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-arrow-right'}></i>
        </button>
      </div>
    </div>
  );
}