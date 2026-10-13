import React, { useState } from 'react';
import styles from './EmailPitchPreview.module.css';

export default function EmailPitchPreview({ emailPitch }) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    if (!emailPitch) return;
    const emailText = `Subjek: ${emailPitch.subject}\n\n${emailPitch.body}`;
    navigator.clipboard.writeText(emailText);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  return (
    <div className={styles.cardBox}>
      <div className={styles.cardHeader}>
        <h4><i className="fa-solid fa-envelope"></i> Email Pengantar</h4>
        <button onClick={handleCopyEmail} className={styles.btnAction}>
          <i className="fa-solid fa-copy"></i> {copiedEmail ? 'Berhasil Disalin!' : 'Salin Teks Email'}
        </button>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.previewText}>
          <p><strong>Subjek:</strong> <code>{emailPitch?.subject || 'Belum tersedia.'}</code></p>
          <hr className={styles.divider} />
          <p className={styles.emailBodyText}>{emailPitch?.body || 'Belum tersedia.'}</p>
        </div>
      </div>
    </div>
  );
}