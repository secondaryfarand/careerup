import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

        <Link to="/" className={styles.logo}>
          <img 
            src="/assets/favicon.png" 
            alt="Logo" 
            style={{ width: 'auto', height: '45px', objectFit: 'contain' }} 
          />
          <span>Career<span className={styles.logoTextSpan}>-Up</span></span>
        </Link>

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
              <Link 
                to="/" 
                className={styles.navLink}
                onClick={() => setIsOpen(false)}
              >
                <i className={`fa-solid fa-file-contract ${styles.navLinkIcon}`}></i>
                Beranda
              </Link>
            </li>
            {/* <li>
              <Link 
                to="/" 
                className={styles.navLink}
                onClick={() => setIsOpen(false)}
              ></Link>
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
            </li> */}
            <li>
              <Link 
                to="/background-remover" 
                className={styles.navLink}
                onClick={() => setIsOpen(false)}
              >
                <i className={`fa-solid fa-scissors ${styles.navLinkIcon}`}></i>
                BG Remover
              </Link>
            </li>
            <li>
              <Link 
                to="/cv-generator" 
                className={styles.navLink}
                onClick={() => setIsOpen(false)}
              >
                <i className={`fa-solid fa-file-contract ${styles.navLinkIcon}`}></i>
                CV Generator
              </Link>
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