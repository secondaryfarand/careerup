import React from 'react';
import styles from '../SkillQuiz.module.css';

export default function QuizLanding({ targetJob,  onStart, onSkip, onPrev, isGeneratingCv, loading }) {
  return (
    <div className={styles.quizCard} style={{ textAlign: 'center', padding: '10px' }}>
      <i className="fa-solid fa-graduation-cap" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '16px' }}></i>
      <h3>Uji Keahlian Anda dengan AI</h3>
      <p style={{ margin: '12px 0 24px', color: 'var(--text-secondary)' }}>
        AI akan membuatkan kuis singkat khusus untuk menguji keahlian Anda pada posisi <strong>{targetJob || 'Target Pekerjaan'}</strong>.
      </p>
      
      <div className={styles.actionFooter} style={{ justifyContent: 'center', gap: '12px' }}>
        <button type="button" onClick={onPrev} className={styles.btnSecondary}>
          <i className="fa-solid fa-arrow-left"></i> Kembali
        </button>
        <button type="button" onClick={onSkip} disabled={loading || isGeneratingCv} className={styles.btnSecondary}>
          <span>{isGeneratingCv ? 'Menyusun CV...' : 'Lewati Kuis'}</span>
        </button>
        <button type="button" onClick={onStart} disabled={loading || isGeneratingCv} className={styles.btnPrimary}>
          <span>{loading ? 'Menyusun Kuis...' : 'Mulai Kuis AI'}</span>
          <i className="fa-solid fa-play"></i>
        </button>
      </div>
    </div>
  );
}