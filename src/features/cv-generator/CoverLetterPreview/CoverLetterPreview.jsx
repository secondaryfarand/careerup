import React from 'react';
import { saveAs } from 'file-saver';

import CoverLetterDownloadActions from './components/CoverLetterDownloadActions';
import styles from './CoverLetterPreview.module.css';

export default function CoverLetterPreview({ suratLamaran, personalInfo, targetJob }) {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={styles.cardBox}>
      <div className={styles.cardHeader}>
        <h4><i className="fa-solid fa-file-lines"></i> Surat Lamaran (Cover Letter)</h4>
        <CoverLetterDownloadActions 
          suratLamaran={suratLamaran} 
          personalInfo={personalInfo} 
          targetJob={targetJob} 
        />
      </div>
      
      <div className={styles.cardBody}>
        <div id='coverLetterPaper' className={styles.documentPaper}>
          <div className={styles.senderHeader}>
            <p className={styles.senderName}>{personalInfo?.fullName || 'Nama Lengkap'}</p>
            <p>{personalInfo?.address || 'Alamat Tempat Tinggal'}</p>
            <p>{personalInfo?.phone || '+62xxxxxxxxxx'}</p>
            <p>{personalInfo?.email || 'email@domain.com'}</p>
          </div>

          <div className={styles.docSpacing}></div>

          <div className={styles.docMeta}>
            <p>[Kota], {currentDate}</p>
            <p style={{ marginTop: '8px' }}>
              <strong>Perihal:</strong> Lamaran Kerja untuk Posisi {targetJob || 'Profesional'}
            </p>
          </div>

          <div className={styles.docSpacing}></div>

          <div className={styles.recipient}>
            <p>Kepada Yth.,</p>
            <p><strong>HRD Manager</strong></p>
            <p>Perusahaan Tujuan</p>
          </div>

          <div className={styles.docSpacing}></div>

          <p className={styles.salutation}>Dengan Hormat,</p>

          <div className={styles.letterBody}>
            <p>{suratLamaran?.opening || 'Paragraf pembuka surat lamaran akan muncul di sini.'}</p>
            <p>{suratLamaran?.body || 'Paragraf isi yang menghubungkan pengalaman dengan posisi.'}</p>
            <p>{suratLamaran?.closing || 'Paragraf penutup.'}</p>
          </div>

          <div className={styles.closingSection}>
            <p>Terima kasih atas perhatian Anda terhadap lamaran saya.</p>
            <div className={styles.signatureArea}>
              <p>[Kota], {currentDate}</p>
              <p>Hormat saya,</p>
              <div className={styles.signSpace}></div>
              <p className={styles.signedName}><strong>{personalInfo?.fullName || 'Nama Lengkap'}</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}