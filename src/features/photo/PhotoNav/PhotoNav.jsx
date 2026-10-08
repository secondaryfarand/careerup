import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './PhotoNav.module.css';

export default function PhotoSuiteNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: '1. Hapus Latar', path: '/background-remover', icon: 'fa-wand-magic-sparkles' },
    { label: '2. Ganti Warna', path: '/background-changer', icon: 'fa-palette' },
    { label: '3. Potong Pasfoto', path: '/pasfoto-cropper', icon: 'fa-crop-simple' },
  ];

  return (
    <div className={styles.navWrapper}>
      {navItems.map((item) => (
        <button
          key={item.path}
          type="button"
          className={`${styles.navTab} ${location.pathname === item.path ? styles.activeTab : ''}`}
          onClick={() => navigate(item.path)}
        >
          <i className={`fa-solid ${item.icon}`}></i>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}