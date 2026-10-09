import React from 'react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { useCareerUp } from '../../../context/CareerUpContext';
import styles from './CVPreview.module.css';

export default function CvPreview({ onPrevStep }) {
  const { cvData } = useCareerUp();
  const { personalInfo, skills, cvSummary } = cvData;

  const defaultSummary = 'Profesional berorientasi pada hasil dengan keahlian teknis teruji, beradaptasi cepat dengan alur kerja modern, serta siap memberikan kontribusi nyata bagi pencapaian target perusahaan.';

  const summaryText = cvSummary?.summary || defaultSummary;
  const highlightsList = cvSummary?.highlights || [
    'Memiliki kompetensi teknis yang telah divalidasi melalui pengujian terstruktur.',
    'Mampu menyelaraskan kualifikasi diri dengan deskripsi dan kebutuhan spesifik posisi yang ditargetkan.',
    'Terbiasa bekerja secara mandiri maupun berkolaborasi dalam tim secara efektif.'
  ];

  const handleDownloadDocx = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: (personalInfo.fullName || 'NAMA LENGKAP').toUpperCase(),
                  bold: true,
                  size: 32,
                  font: 'Arial',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `${personalInfo.email || ''} | ${personalInfo.phone || ''} | ${personalInfo.linkedin || ''}`,
                  size: 20,
                  font: 'Arial',
                }),
              ],
            }),
            new Paragraph({ text: '' }),

            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              children: [
                new TextRun({
                  text: 'RINGKASAN PROFESIONAL',
                  bold: true,
                  size: 24,
                  font: 'Arial',
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: summaryText,
                  size: 20,
                  font: 'Arial',
                }),
              ],
            }),
            new Paragraph({ text: '' }),

            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              children: [
                new TextRun({
                  text: 'KEAHLIAN UTAMA (VALIDATED SKILLS)',
                  bold: true,
                  size: 24,
                  font: 'Arial',
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: skills && skills.length > 0
                    ? skills.map((s) => `${s.name}${s.level ? ` (${s.level})` : ''}`).join(' • ')
                    : 'Keahlian Belum Didaftarkan',
                  size: 20,
                  font: 'Arial',
                }),
              ],
            }),
            new Paragraph({ text: '' }),

            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              children: [
                new TextRun({
                  text: 'KUALIFIKASI & KOMPETENSI ATS',
                  bold: true,
                  size: 24,
                  font: 'Arial',
                }),
              ],
            }),
            ...highlightsList.map((item) => (
              new Paragraph({
                bullet: { level: 0 },
                children: [
                  new TextRun({
                    text: item,
                    size: 20,
                    font: 'Arial',
                  }),
                ],
              })
            )),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `CV_${(personalInfo.fullName || 'ATS').replace(/\s+/g, '_')}.docx`;
    saveAs(blob, fileName);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Langkah 3: Hasil Akhir CV Standar ATS</h2>
        <p className={styles.subtitle}>
          CV telah berhasil disesuaikan secara dinamis oleh AI berdasarkan deskripsi pekerjaan dan keahlian Anda.
        </p>
      </header>

      <div className={styles.actionBar}>
        {/* <button type="button" onClick={onPrevStep} className={styles.btnSecondary}>
          <i className="fa-solid fa-arrow-left"></i>
          <span>Kembali ke Kuis</span>
        </button> */}

        <button type="button" onClick={handleDownloadDocx} className={styles.btnPrimary}>
          <i className="fa-solid fa-file-word"></i>
          <span>Unduh Berkas Word (.docx)</span>
        </button>
      </div>

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
                <li key={s.id} className={styles.skillItem}>
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
    </div>
  );
}