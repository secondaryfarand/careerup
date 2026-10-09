import React, { useState } from 'react';
import { useCareerUp } from '../../../context/CareerUpContext';
import styles from './CvForm.module.css';

export default function CvForm({ onNextStep }) {
  const { cvData, updatePersonalInfo, addSkill, removeSkill, updateTargetJob } = useCareerUp();
  const [skillInput, setSkillInput] = useState('');

  const targetJobValue = cvData.targetJob || '';

  const handleTargetJobChange = (e) => {
    const val = e.target.value;
    if (typeof updateTargetJob === 'function') {
      updateTargetJob(val);
    } else if (typeof updatePersonalInfo === 'function') {
      updatePersonalInfo({ targetJob: val });
    }
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    updatePersonalInfo({ [name]: value });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    addSkill(skillInput.trim());
    setSkillInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onNextStep) onNextStep(targetJobValue);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Langkah 1: Pengisian Data CV</h2>
        <p className={styles.subtitle}>
          Isi informasi pribadi, keahlian utama, serta deskripsi posisi pekerjaan yang ingin ditargetkan.
        </p>
      </header>

      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div>
          <div className={styles.sectionTitle}>
            <i className="fa-solid fa-bullseye"></i>
            <span>Target Posisi Pekerjaan</span>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Job Description / Persyaratan Lowongan</label>
            <textarea
              className={styles.textarea}
              placeholder="Tempelkan deskripsi pekerjaan atau kualifikasi yang dipersyaratkan oleh perusahaan di sini..."
              value={cvData.targetJob || ''}
              onChange={(e) => updateTargetJob(e.target.value)}
              required
            />
          </div>
        </div>

        {/* ... Sisa input Personal Info & Skills tetap sama ... */}
        <div>
          <div className={styles.sectionTitle}>
            <i className="fa-solid fa-user"></i>
            <span>Informasi Pribadi</span>
          </div>
          <div className={styles.gridTwo}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Nama Lengkap</label>
              <input
                type="text"
                name="fullName"
                className={styles.input}
                value={cvData.personalInfo.fullName}
                onChange={handlePersonalChange}
                placeholder="Contoh: Alex Wijaya"
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                className={styles.input}
                value={cvData.personalInfo.email}
                onChange={handlePersonalChange}
                placeholder="alex@example.com"
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Nomor Telepon</label>
              <input
                type="tel"
                name="phone"
                className={styles.input}
                value={cvData.personalInfo.phone}
                onChange={handlePersonalChange}
                placeholder="08123456789"
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Tautan LinkedIn / Portfolio</label>
              <input
                type="url"
                name="linkedin"
                className={styles.input}
                value={cvData.personalInfo.linkedin}
                onChange={handlePersonalChange}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>
        </div>

        <div>
          <div className={styles.sectionTitle}>
            <i className="fa-solid fa-code"></i>
            <span>Keahlian & Skill Utama</span>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Tambah Skill (Akan diuji pada kuis singkat)</label>
            <div className={styles.skillInputWrapper}>
              <input
                type="text"
                className={styles.input}
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Contoh: React.js, Node.js, Public Speaking"
              />
              <button type="button" onClick={handleAddSkill} className={styles.btnSecondary}>
                Tambah
              </button>
            </div>
          </div>

          <div className={styles.badgeGrid}>
            {cvData.skills.map((skill) => (
              <span key={skill.id} className={styles.skillBadge}>
                {skill.name}
                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className={styles.removeSkillBtn}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.actionFooter}>
          <button type="submit" className={styles.btnPrimary}>
            <span>Lanjut ke Kuis Validasi Skill</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </form>
    </div>
  );
}