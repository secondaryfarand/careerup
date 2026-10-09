import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.brandCol}>
          <a href="#" className={styles.logo}>
            <i className={`fa-solid fa-briefcase ${styles.logoIcon}`}></i>
            <span>Career<span className={styles.logoSpan}>-Up</span></span>
          </a>
          <p className={styles.brandDesc}>
            Platform Career & CV Suite berbasis Hybrid AI untuk membantu pencari kerja menyiapkan berkas lamaran yang ramah ATS, profesional, dan 100% aman.
          </p>
        </div>

        <div className={styles.linksGrid}>
          <div>
            <h4 className={styles.colTitle}>Navigasi</h4>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}><a href="#features">Fitur</a></li>
              <li className={styles.linkItem}><a href="#about">Tentang</a></li>
              <li className={styles.linkItem}><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className={styles.colTitle}>Fitur Suite</h4>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}><a href="#features">ATS CV Generator</a></li>
              <li className={styles.linkItem}><a href="#features">Background Remover</a></li>
              <li className={styles.linkItem}><a href="#features">Skill Validation Quiz</a></li>
              <li className={styles.linkItem}><a href="#features">Mock Interview</a></li>
            </ul>
          </div>

          {/* <div>
            <h4 className={styles.colTitle}>Kompetisi</h4>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}><a href="#about">Informatics Festival 2026</a></li>
              <li className={styles.linkItem}><a href="#about">Hybrid AI Suite</a></li>
              <li className={styles.linkItem}><a href="#about">Privasi Data</a></li>
            </ul>
          </div> */}
        </div>
      </div>

      <div className={`container ${styles.bottomBar}`}>
        <p>© 2026 Career-Up Team. All rights reserved.</p>
        <p>semogaya Web Dev</p>
      </div>
    </footer>
  );
}