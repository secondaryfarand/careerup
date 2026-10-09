import React from 'react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { useCareerUp } from '../../../context/CareerUpContext';
import AtsScoreWidget from '../../../components/common/AtsScoreWidget/AtsScoreWidget';
import CvPaper from './components/CVPaper';
import styles from './CVPreview.module.css';

export default function CvPreview({ onPrevStep, targetJob }) {
  const { cvData } = useCareerUp();
  const { personalInfo, skills, cvSummary } = cvData;

  const defaultSummary =
    'Profesional berorientasi pada hasil dengan keahlian teknis teruji, beradaptasi cepat dengan alur kerja modern, serta siap memberikan kontribusi nyata bagi pencapaian target perusahaan.';

  const summaryText = cvSummary?.summary || defaultSummary;
  const highlightsList = cvSummary?.highlights || [
    'Memiliki kompetensi teknis yang telah divalidasi melalui pengujian terstruktur.',
    'Mampu menyelaraskan kualifikasi diri dengan deskripsi dan kebutuhan spesifik posisi yang ditargetkan.',
    'Terbiasa bekerja secara mandiri maupun berkolaborasi dalam tim secara efektif.',
  ];

  const fullCvTextContent = `
    ${summaryText} 
    ${skills?.map((s) => s.name).join(' ') || ''} 
    ${highlightsList.join(' ')}
  `;

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
                  text:
                    skills && skills.length > 0
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
            ...highlightsList.map(
              (item) =>
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
            ),
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
        {onPrevStep && (
          <button type="button" onClick={onPrevStep} className={styles.btnSecondary}>
            <i className="fa-solid fa-arrow-left"></i>
            <span>Kembali</span>
          </button>
        )}

        <button type="button" onClick={handleDownloadDocx} className={styles.btnPrimary}>
          <i className="fa-solid fa-file-word"></i>
          <span>Unduh Berkas Word (.docx)</span>
        </button>
      </div>

      {/* Grid Komponen Modular: Kertas CV & Widget Skor ATS */}
      <div className={styles.previewLayout}>
        <CvPaper
          personalInfo={personalInfo}
          summaryText={summaryText}
          skills={skills}
          highlightsList={highlightsList}
        />

        {/* Widget Skor ATS Lokal dimunculkan di sini */}
        <AtsScoreWidget
          jobDescription={targetJob || cvData.targetJob || ''}
          cvContent={fullCvTextContent}
        />
      </div>
    </div>
  );
}