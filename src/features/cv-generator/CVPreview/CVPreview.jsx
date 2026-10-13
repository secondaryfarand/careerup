import React from 'react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';
import { useCareerUp } from '../../../context/CareerUpContext';

import AtsScoreWidget from '../../../components/common/AtsScoreWidget/AtsScoreWidget';
import CvPaper from './components/CVPaper';
import CoverLetterPreview from '../CoverLetterPreview/CoverLetterPreview';
import EmailPitchPreview from '../EmailPitchPreview/EmailPitchPreview';

import styles from './CVPreview.module.css';

export default function CvPreview({ onPrevStep, targetJob }) {
  const { cvData } = useCareerUp();
  const { personalInfo, skills, cvSummary, suratLamaran, emailPitch } = cvData;

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
    try {
      const safeFullName = personalInfo?.fullName || 'NAMA LENGKAP';
      const safeEmail = personalInfo?.email || '';
      const safePhone = personalInfo?.phone || '';
      const safeLinkedin = personalInfo?.linkedin || '';
      const safeSummary = summaryText || cvSummary?.summary || '';
      const safeWork = cvData.workExperience || [];
      const safeEdu = cvData.education || [];
      const safeSkills = skills || [];
      const safeHighlights = highlightsList || cvSummary?.highlights || [];

      const createSectionHeading = (titleText) => {
        return [
          new Paragraph({
            children: [
              new TextRun({
                text: titleText,
                bold: true,
                size: 24,
                font: 'Arial',
                color: '000000',
              }),
            ],
            spacing: { before: 240, after: 40 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '_____________________________________________________________________________________________________',
                size: 16,
                font: 'Arial',
                color: 'D3D3D3', 
              }),
            ],
            spacing: { after: 120 },
          }),
        ];
      };

      const docChildren = [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: safeFullName.toUpperCase(),
              bold: true,
              size: 32,
              font: 'Arial',
              color: '000000',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `${safeEmail} | ${safePhone} ${safeLinkedin ? `| ${safeLinkedin}` : ''}`,
              size: 20,
              font: 'Arial',
              color: '333333',
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: '_____________________________________________________________________________________________________',
              size: 16,
              font: 'Arial',
              color: '000000',
            }),
          ],
          spacing: { after: 160 },
        }),

        ...createSectionHeading('RINGKASAN PROFESIONAL'),
        new Paragraph({
          children: [
            new TextRun({
              text: safeSummary,
              size: 20,
              font: 'Arial',
              color: '000000',
            }),
          ],
          spacing: { after: 160 },
        }),
      ];

      if (safeWork.length > 0) {
        docChildren.push(...createSectionHeading('PENGALAMAN KERJA'));
        safeWork.forEach((work) => {
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({ text: work.role || '', bold: true, size: 20, font: 'Arial', color: '000000' }),
                new TextRun({ text: ` — ${work.company || ''}`, italics: true, size: 20, font: 'Arial', color: '333333' }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: work.period || '', size: 18, font: 'Arial', color: '666666' }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: work.description || '', size: 20, font: 'Arial', color: '000000' }),
              ],
              spacing: { after: 120 },
            })
          );
        });
      }

      if (safeEdu.length > 0) {
        docChildren.push(...createSectionHeading('PENDIDIKAN'));
        safeEdu.forEach((edu) => {
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({ text: edu.degree || '', bold: true, size: 20, font: 'Arial', color: '000000' }),
                new TextRun({ text: ` (${edu.year || ''})`, size: 18, font: 'Arial', color: '666666' }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: edu.institution || '', size: 20, font: 'Arial', italics: true, color: '333333' }),
              ],
              spacing: { after: 120 },
            })
          );
        });
      }

      docChildren.push(
        ...createSectionHeading('KEAHLIAN UTAMA (VALIDATED SKILLS)'),
        new Paragraph({
          children: [
            new TextRun({
              text: safeSkills.length > 0
                ? safeSkills.map((s) => `${s.name || s}${s.level ? ` (${s.level})` : ''}`).join(' • ')
                : 'Keahlian Belum Didaftarkan',
              size: 20,
              font: 'Arial',
              color: '000000',
            }),
          ],
          spacing: { after: 160 },
        })
      );

      if (safeHighlights.length > 0) {
        docChildren.push(...createSectionHeading('KUALIFIKASI & KOMPETENSI ATS'));
        safeHighlights.forEach((item) => {
          docChildren.push(
            new Paragraph({
              bullet: { level: 0 },
              children: [
                new TextRun({
                  text: item,
                  size: 20,
                  font: 'Arial',
                  color: '000000',
                }),
              ],
            })
          );
        });
      }

      const doc = new Document({
        sections: [{ properties: {}, children: docChildren }],
      });

      const blob = await Packer.toBlob(doc);
      const fileName = `CV_${safeFullName.replace(/\s+/g, '_')}.docx`;
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Gagal mendownload dokumen Word:', error);
      alert('Terjadi kesalahan saat membuat file Word.');
    }
  };
  const handleDownloadPdf = () => {
    const element = document.getElementById('cvPaperElement');
    
    if (!element) {
      alert('Dokumen CV tidak ditemukan.');
      return;
    }
    const originalBoxShadow = element.style.boxShadow;
    const originalBorder = element.style.border;
    const originalBorderRadius = element.style.borderRadius;

    element.style.boxShadow = 'none';
    element.style.border = 'none';
    element.style.borderRadius = '0';

    const safeFullName = personalInfo?.fullName || 'CV';
    
    const options = {
      margin:       10, 
      filename:     `CV_${safeFullName.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };


    html2pdf().from(element).set(options).save().then(() => {
          element.style.boxShadow = originalBoxShadow;
          element.style.border = originalBorder;
          element.style.borderRadius = originalBorderRadius;
    });
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
        <div className={styles.btnContainer}>
          <button type="button" onClick={handleDownloadPdf} className={styles.btnPrimary}>
            <i className="fa-solid fa-file-pdf"></i>
            <span>PDF</span>
          </button>

          <button type="button" onClick={handleDownloadDocx} className={styles.btnSecondary}>
            <i className="fa-solid fa-file-word"></i>
            <span>Word</span>
          </button>
        </div>
      </div>

      <div className={styles.previewLayout}>
        {/* <CvPaper
          personalInfo={personalInfo}
          summaryText={summaryText}
          skills={skills}
          highlightsList={highlightsList}
        /> */}
        <CvPaper cvData={cvData} />

        <AtsScoreWidget
          jobDescription={targetJob || cvData.targetJob || ''}
          cvContent={fullCvTextContent}
        />
      </div>
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>
          Dokumen Pendukung
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <CoverLetterPreview 
            suratLamaran={suratLamaran} 
            personalInfo={personalInfo} 
            targetJob={targetJob} 
          />
          <EmailPitchPreview emailPitch={emailPitch} />
        </div>
      </div>
    </div>
  );
}