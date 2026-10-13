import React from 'react';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';
import styles from './CoverLetterDownloadActions.module.css';

export default function CoverLetterDownloadActions({ suratLamaran, personalInfo, targetJob }) {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  // const font = 'Times New Roman';
  const font = 'Arial';

  const handleDownloadDocx = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: personalInfo?.fullName || 'Nama Lengkap', bold: true, size: 20, font: font }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: personalInfo?.address || 'Alamat Tempat Tinggal', size: 18, font: font }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: personalInfo?.phone || '081234567890', size: 18, font: font }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: personalInfo?.email || 'alex@example.com', size: 18, font: font }),
              ],
            }),
            new Paragraph({ text: '' }),
            new Paragraph({
              children: [
                new TextRun({ text: `[Kota], ${currentDate}`, size: 20, font: font }),
              ],
            }),
            new Paragraph({ text: '' }),
            new Paragraph({
              children: [
                new TextRun({ text: `Perihal: Lamaran Kerja untuk Posisi ${targetJob || 'Profesional'}`, bold: true, size: 20, font: font }),
              ],
            }),
            new Paragraph({ text: '' }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Kepada Yth.,\nHRD Manager\nPerusahaan Tujuan', size: 20, font: font }),
              ],
            }),
            new Paragraph({ text: '' }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Dengan Hormat,', size: 20, font: font }),
              ],
            }),
            new Paragraph({ text: '' }),
            new Paragraph({
              children: [
                new TextRun({ text: suratLamaran?.opening || '', size: 20, font: font }),
              ],
            }),
            new Paragraph({ text: '' }),
            new Paragraph({
              children: [
                new TextRun({ text: suratLamaran?.body || '', size: 20, font: font }),
              ],
            }),
            new Paragraph({ text: '' }),
            new Paragraph({
              children: [
                new TextRun({ text: suratLamaran?.closing || '', size: 20, font: font }),
              ],
            }),
            new Paragraph({ text: '' }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Terima kasih atas perhatian Anda terhadap lamaran saya.', size: 20, font: font }),
              ],
            }),
            
            new Paragraph({ text: '' }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: `[Kota], ${currentDate}`, size: 20, font: font }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: 'Hormat saya,', size: 20, font: font }),
              ],
            }),
            new Paragraph({ text: '', spacing: { after: 720 } }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: personalInfo?.fullName || 'Nama Lengkap', bold: true, size: 20, font: font }),
              ],
            })
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `Surat_Lamaran_${(personalInfo?.fullName || 'Pelamar').replace(/\s+/g, '_')}.docx`;
    saveAs(blob, fileName);
  };

  const handleDownloadPdf = () => {
    const element = document.getElementById('coverLetterPaper');
    
    if (!element) {
      alert('Dokumen pratinjau surat lamaran tidak ditemukan.');
      return;
    }

    const options = {
      margin:       [10, 10, 10, 10],
      filename:     `Surat_Lamaran_${(personalInfo?.fullName || 'Pelamar').replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
        scale: 3,          
        useCORS: true,
        letterRendering: true
      },
      jsPDF:        { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    };

    html2pdf().from(element).set(options).toPdf().get('pdf').then((pdf) => {
    }).save();
  };

  return (
    <div className={styles.actionButtons}>
      <button onClick={handleDownloadPdf} className={styles.btnPrimary} title="Cetak atau Simpan sebagai PDF">
        <i className="fa-solid fa-file-pdf"></i> PDF
      </button>
      <button onClick={handleDownloadDocx} className={styles.btnSecondary} title="Unduh sebagai dokumen Microsoft Word">
        <i className="fa-solid fa-file-word"></i> Word
      </button>
    </div>
  );
}