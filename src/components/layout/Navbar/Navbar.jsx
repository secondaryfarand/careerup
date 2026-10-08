import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export default function Navbar({ onStartApp }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        
        {/* <a href="#" className={styles.logo}>
          <i className={`fa-solid fa-briefcase ${styles.logoIcon}`}></i>
          <span>Career<span className={styles.logoTextSpan}>-Up</span></span>
        </a> */}

        <a href="#" className={styles.logo}>
          <img 
            src="/assets/favicon.png" 
            alt="Logo" 
            // className={styles.logoIcon}
            style={{ width: 'auto', height: '45px', objectFit: 'contain' }} 
          />
          <span>Career<span className={styles.logoTextSpan}>-Up</span></span>
        </a>
        <button 
          className={styles.toggleBtn} 
          onClick={toggleMenu}
          aria-label={isOpen ? "Tutup Menu Navigasi" : "Buka Menu Navigasi"}
        >
          <i className={isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
        </button>

        {/* Navigasi Utama */}
        <nav className={`${styles.navMenu} ${isOpen ? styles.navMenuOpen : ''}`}>
          <ul className={styles.navList}>
            <li>
              <a 
                href="#features" 
                className={styles.navLink}
                onClick={() => setIsOpen(false)}
              >
                <i className={`fa-solid fa-wand-magic-sparkles ${styles.navLinkIcon}`}></i>
                Fitur
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className={styles.navLink}
                onClick={() => setIsOpen(false)}
              >
                <i className={`fa-solid fa-circle-info ${styles.navLinkIcon}`}></i>
                Tentang
              </a>
            </li>
            <li>
              <a 
                href="#faq" 
                className={styles.navLink}
                onClick={() => setIsOpen(false)}
              >
                <i className={`fa-solid fa-circle-question ${styles.navLinkIcon}`}></i>
                FAQ
              </a>
            </li>
          </ul>

          <button 
            className={styles.ctaBtn}
            onClick={() => {
              setIsOpen(false);
              if (onStartApp) onStartApp();
            }}
          >
            <span>Mulai Sekarang</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </nav>
      </div>
    </header>
  );
}