import React from 'react';
import styles from '../CVPreview.module.css';

export default function CvPaper({ personalInfo, summaryText, skills, highlightsList }) {
  return (
    <div className={styles.paper}>
      <header className={styles.cvHeader}>
        <h1 className={styles.cvName}>{personalInfo.fullName || 'NAMA LENGKAP'}</h1>
        <div className={styles.cvContact}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo.linkedin && <span>| {personalInfo.linkedin}</span>}
        </div>
      </header>

      <section className={styles.cvSection}>
        <h2 className={styles.cvSectionTitle}>Ringkasan Profesional</h2>
        <p className={styles.cvText}>{summaryText}</p>
      </section>

      <section className={styles.cvSection}>
        <h2 className={styles.cvSectionTitle}>Keahlian Utama (Validated Skills)</h2>
        <ul className={styles.skillList}>
          {skills && skills.length > 0 ? (
            skills.map((s) => (
              <li key={s.id || s.name} className={styles.skillItem}>
                {s.name} {s.level ? `(${s.level})` : ''}
              </li>
            ))
          ) : (
            <li className={styles.skillItem}>Keahlian Belum Didaftarkan</li>
          )}
        </ul>
      </section>

      <section className={styles.cvSection}>
        <h2 className={styles.cvSectionTitle}>Kualifikasi & Kompetensi ATS</h2>
        <ul className={styles.bulletList}>
          {highlightsList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}