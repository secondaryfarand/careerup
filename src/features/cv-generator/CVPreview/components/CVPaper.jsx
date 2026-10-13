import React from 'react';
import styles from '../CVPreview.module.css';

export default function CvPaper({ cvData }) {
  const { 
    personalInfo = {}, 
    cvSummary = {}, 
    skills = [], 
    workExperience = [], 
    education = [], 
    projects = [] 
  } = cvData || {};

  const summaryText = cvSummary.summary || cvData.summaryText || 'Ringkasan profesional belum tersedia.';
  const highlightsList = cvSummary.highlights || cvData.highlightsList || [];

  return (
    <div id='cvPaperElement' className={styles.paper}>
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

      {workExperience && workExperience.length > 0 && (
        <section className={styles.cvSection}>
          <h2 className={styles.cvSectionTitle}>Pengalaman Kerja</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {workExperience.map((work, index) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                  <span>{work.role}</span>
                  <span style={{ fontWeight: 'normal', fontSize: '0.9rem', color: '#64748b' }}>{work.period}</span>
                </div>
                <div style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#475569', marginBottom: '2px' }}>{work.company}</div>
                <p className={styles.cvText} style={{ fontSize: '0.9rem' }}>{work.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {education && education.length > 0 && (
        <section className={styles.cvSection}>
          <h2 className={styles.cvSectionTitle}>Pendidikan</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {education.map((edu, index) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                  <span>{edu.degree}</span>
                  <span style={{ fontWeight: 'normal', fontSize: '0.9rem', color: '#64748b' }}>{edu.year}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#475569' }}>{edu.institution}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={styles.cvSection}>
        <h2 className={styles.cvSectionTitle}>Keahlian Utama (Validated Skills)</h2>
        <ul className={styles.skillList}>
          {skills && skills.length > 0 ? (
            skills.map((s) => (
              <li key={s.id || s.name} className={styles.skillItem}>
                {s.name || s} {s.level ? `(${s.level})` : ''}
              </li>
            ))
          ) : (
            <li className={styles.skillItem}>Keahlian Belum Didaftarkan</li>
          )}
        </ul>
      </section>

      {highlightsList.length > 0 && (
        <section className={styles.cvSection}>
          <h2 className={styles.cvSectionTitle}>Kualifikasi & Kompetensi ATS</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {highlightsList.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'flex-start', textAlign: 'left' }}>
                <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>•</span>
                <span style={{ flex: 1, fontSize: "11px" }}>{item}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}