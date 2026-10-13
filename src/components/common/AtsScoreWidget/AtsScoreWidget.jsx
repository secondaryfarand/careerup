import React, { useMemo } from 'react';
import { calculateAtsScore } from '../../../utils/atsScorer';
import styles from './AtsScoreWidget.module.css';

export default function AtsScoreWidget({ jobDescription, cvContent }) {
  const { score, matchedKeywords } = useMemo(() => {
    return calculateAtsScore(jobDescription, cvContent);
  }, [jobDescription, cvContent]);

  const getScoreStatus = (val) => {
    if (val >= 75) return { text: 'Sangat Cocok dengan ATS', color: '#10b981' };
    if (val >= 50) return { text: 'Cukup Relevan', color: '#f59e0b' };
    if (val > 0) return { text: 'Perlu Penyesuaian Kata Kunci', color: '#ef4444' };
    return { text: 'Masukkan Deskripsi Pekerjaan', color: '#94a3b8' };
  };

  const status = getScoreStatus(score);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h4 className={styles.title}>Analisis Skor ATS Real-time</h4>
        </div>

      </div>

      <div className={styles.scoreContainer}>
        <div 
          className={styles.scoreCircle} 
          style={{ '--score-percent': score }}
        >
          <div className={styles.scoreCircleInner}>
            {score}%
          </div>
        </div>

        <div className={styles.scoreInfo}>
          <div className={styles.scoreStatus} style={{ color: status.color }}>
            {status.text}
          </div>
          <p className={styles.scoreDesc}>
            Skor dihitung secara lokal di browser mengukur kerapatan kata kunci antara CV Anda dan target pekerjaan.
          </p>
        </div>
      </div>

      <div className={styles.keywordsSection}>
        <div className={styles.keywordsTitle}>Kata Kunci Terdeteksi ({matchedKeywords.length})</div>
        {matchedKeywords.length > 0 ? (
          <div className={styles.keywordTags}>
            {matchedKeywords.map((kw, index) => (
              <span key={index} className={styles.tag}>
                ✓ {kw}
              </span>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            Belum ada kata kunci yang cocok. Tambahkan keahlian atau ringkasan yang relevan.
          </div>
        )}
      </div>
    </div>
  );
}