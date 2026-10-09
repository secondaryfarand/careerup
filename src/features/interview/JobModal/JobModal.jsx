import React, { useState } from 'react';
import styles from './JobModal.module.css';

export default function JobModal({ onSubmit }) {
  const [jobInput, setJobInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!jobInput.trim()) return;
    onSubmit(jobInput.trim());
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <div className={styles.iconWrapper}>
          <i className="fa-solid fa-briefcase"></i>
        </div>
        <h3 className={styles.modalTitle}>Target Pekerjaan</h3>
        <p className={styles.modalSubtitle}>
          Masukkan posisi atau deskripsi pekerjaan yang ingin Anda tuju untuk memulai sesi latihan wawancara interaktif.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Posisi / Job Title</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Contoh: Frontend Developer, Data Analyst, HR Specialist..."
              value={jobInput}
              onChange={(e) => setJobInput(e.target.value)}
              required
              autoFocus
            />
          </div>

          <button type="submit" className={styles.btnSubmit}>
            <span>Mulai Latihan Wawancara</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>
      </div>
    </div>
  );
}