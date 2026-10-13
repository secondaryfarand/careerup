import React, { useState } from 'react';
import { useCareerUp } from '../../../context/CareerUpContext';

import JobPosterScanner from './components/JobPosterScanner';
import styles from './CvForm.module.css';

export default function CvForm({ onNextStep }) {
  const { cvData, updatePersonalInfo, addSkill, removeSkill, updateTargetJob, updateJobDescription, updateCvSection } = useCareerUp();
  const [skillInput, setSkillInput] = useState('');
  const [workList, setWorkList] = useState(cvData.workExperience || []);
  const [eduList, setEduList] = useState(cvData.education || []);

  const targetJobValue = cvData.targetJob || '';

  const handleTargetJobChange = (e) => {
    const val = e.target.value;
    if (typeof updateTargetJob === 'function') {
      updateTargetJob(val);
    } else if (typeof updatePersonalInfo === 'function') {
      updatePersonalInfo({ targetJob: val });
    }
  };

  const handleAddWork = () => {
    const updated = [...workList, { role: '', company: '', period: '', description: '' }];
    setWorkList(updated);
    if (updateCvSection) updateCvSection('workExperience', updated);
  };

  const handleWorkChange = (index, field, value) => {
    const updated = [...workList];
    updated[index][field] = value;
    setWorkList(updated);
    if (updateCvSection) updateCvSection('workExperience', updated);
  };

  const handleRemoveWork = (index) => {
    const updated = workList.filter((_, i) => i !== index);
    setWorkList(updated);
    if (updateCvSection) updateCvSection('workExperience', updated);
  };

  const handleAddEdu = () => {
    const updated = [...eduList, { degree: '', institution: '', year: '' }];
    setEduList(updated);
    if (updateCvSection) updateCvSection('education', updated);
  };

  const handleEduChange = (index, field, value) => {
    const updated = [...eduList];
    updated[index][field] = value;
    setEduList(updated);
    if (updateCvSection) updateCvSection('education', updated);
  };

  const handleRemoveEdu = (index) => {
    const updated = eduList.filter((_, i) => i !== index);
    setEduList(updated);
    if (updateCvSection) updateCvSection('education', updated);
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

  const handlePosterExtracted = (parsedData) => {
    // 1. Otomatis isi Target Pekerjaan jika terdeteksi
    if (parsedData.targetJob) {
      updateTargetJob(parsedData.targetJob);
    }
    if (parsedData.jobDescription) {
      updateJobDescription(parsedData.jobDescription);
    }

    // 2. Masukkan seluruh teks hasil OCR poster ke deskripsi pekerjaan pertama (atau buat baru)
    if (parsedData.jobDescription && workList.length > 0) {
      const updatedWorkList = [...workList];
      updatedWorkList[0].description = parsedData.jobDescription;
      
      // Jika judul pekerjaan di form masih kosong, bisa juga diisi otomatis dari hasil scan
      if (!updatedWorkList[0].role && parsedData.targetJob) {
        updatedWorkList[0].role = parsedData.targetJob;
      }

      setWorkList(updatedWorkList);
    }
  };

  return (
    <div className={styles.container}>

      <div className={styles.formCard}>
        <JobPosterScanner onExtractSuccess={handlePosterExtracted} />
      </div>
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
            <span>Target Pekerjaan</span>
          </div>
            <div className={styles.fieldGroup}>
            <label className={styles.label}>Posisi yang Dilamar (Target Job)</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Contoh: Admin Kantor"
              value={cvData.targetJob}
              onChange={(e) => updateJobDesc(e.target.value)}
            />
            </div>
        </div>
        
        {/*  */}
        <div>
          <div className={styles.sectionTitle}>
            <i className="fa-solid fa-file-lines"></i>
            <span>Deskripsi atau Kriteria Pekerjaan</span>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Job Description / Persyaratan Lowongan</label>
            <textarea
              className={styles.textarea}
              placeholder="Tempelkan deskripsi pekerjaan atau kualifikasi yang dipersyaratkan oleh perusahaan di sini..."
              value={cvData.jobDescription || ''}
              onChange={(e) => updateTargetJob(e.target.value)}
              required
            />
          </div>
        </div>
        {/*  */}

        
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
                value={cvData.personalInfo?.fullName || ''}
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
                value={cvData.personalInfo?.email || ''}
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
                value={cvData.personalInfo?.phone || ''}
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
                value={cvData.personalInfo?.linkedin || ''}
                onChange={handlePersonalChange}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>
        </div>

        <div>
          <div className={`${styles.sectionTitle} ${styles.sectionTitleJustify}`}>
            <div>
              <i className="fa-solid fa-briefcase"></i>
              <span>Riwayat Pengalaman Kerja</span>
            </div>
            <button type="button" onClick={handleAddWork} className={styles.btnSecondary} style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
              <i className="fa-solid fa-plus"></i> Tambah Pengalaman
            </button>
          </div>
          {workList.map((work, idx) => (
            <div key={idx} className={styles.formCard} style={{ padding: '16px', marginBottom: '12px', gap: '12px' }}>
              <div className={styles.gridTwo}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Posisi / Role (Contoh: Full-stack Developer)"
                  value={work.role}
                  onChange={(e) => handleWorkChange(idx, 'role', e.target.value)}
                />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Perusahaan / Instansi"
                  value={work.company}
                  onChange={(e) => handleWorkChange(idx, 'company', e.target.value)}
                />
              </div>
              <div className={styles.skillInputWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Periode (Contoh: Jan 2025 - Sekarang)"
                  value={work.period}
                  onChange={(e) => handleWorkChange(idx, 'period', e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="button" onClick={() => handleRemoveWork(idx)} className={styles.btnSecondary} style={{ background: 'var(--danger-light)', color: 'var(--danger)', border: 'none', padding: '0 12px' }}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
              <textarea
                className={styles.textarea}
                placeholder="Deskripsi singkat tugas atau pencapaian..."
                value={work.description}
                onChange={(e) => handleWorkChange(idx, 'description', e.target.value)}
                style={{ minHeight: '60px' }}
              />
            </div>
          ))}
        </div>

        <div>
          <div className={`${styles.sectionTitle} ${styles.sectionTitleJustify}`}>
            <div>
              <i className="fa-solid fa-graduation-cap"></i>
              <span>Riwayat Pendidikan</span>
            </div>
            <button type="button" onClick={handleAddEdu} className={styles.btnSecondary} style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
              <i className="fa-solid fa-plus"></i> Tambah Pendidikan
            </button>
          </div>
          {eduList.map((edu, idx) => (
            <div key={idx} className={styles.formCard} style={{ padding: '16px', marginBottom: '12px', gap: '12px' }}>
              <div className={styles.gridTwo}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Gelar / Jurusan (Contoh: S1 Teknik Informatika)"
                  value={edu.degree}
                  onChange={(e) => handleEduChange(idx, 'degree', e.target.value)}
                />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Nama Universitas / Institusi"
                  value={edu.institution}
                  onChange={(e) => handleEduChange(idx, 'institution', e.target.value)}
                />
              </div>
              <div className={styles.skillInputWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Tahun (Contoh: 2022 - 2026)"
                  value={edu.year}
                  onChange={(e) => handleEduChange(idx, 'year', e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="button" onClick={() => handleRemoveEdu(idx)} className={styles.btnSecondary} style={{ background: 'var(--danger-light)', color: 'var(--danger)', border: 'none', padding: '0 12px' }}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
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
            {cvData.skills?.map((skill) => (
              <span key={skill.id || skill.name} className={styles.skillBadge}>
                {skill.name}
                <button
                  type="button"
                  onClick={() => removeSkill(skill.id || skill.name)}
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