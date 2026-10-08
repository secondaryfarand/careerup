import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar/Navbar';
import Footer from '../../components/layout/Footer/Footer';
import styles from './LandingPage.module.css';

export default function LandingPage({ onStartApp }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const features = [
    {
      icon: "fa-solid fa-file-contract",
      title: "ATS CV Generator",
      desc: "Menghasilkan narasi CV terstruktur yang disesuaikan secara presisi dengan kata kunci deskripsi pekerjaan tujuan."
    },
    {
      icon: "fa-solid fa-scissors",
      title: "AI Background Remover",
      desc: "Menghapus dan mengganti latar belakang foto formal secara otomatis langsung di browser tanpa mengunggah file ke luar."
    },
    {
      icon: "fa-solid fa-vial-circle-check",
      title: "Skill Validation Quiz",
      desc: "Menguji klaim keahlian dengan kuis interaktif untuk menghasilkan penulisan kualifikasi yang terukur dan objektif."
    },
    {
      icon: "fa-solid fa-camera-rotate",
      title: "CV Photo Assessor",
      desc: "Mengevaluasi kesimetrisan dan proporsi pose pasfoto menggunakan analisis visi komputer berbasis TensorFlow.js."
    },
    {
      icon: "fa-solid fa-user-astronaut",
      title: "Mock Interview Copilot",
      desc: "Simulasi wawancara kerja berbasis teks dan suara untuk melatih kesiapan serta kejelasan dalam menjawab pertanyaan."
    },
    {
      icon: "fa-solid fa-shield-halved",
      title: "Absolute Data Privacy",
      desc: "Jaminan penuh data pribadi dan foto sensitif tidak disimpan di server pihak ketiga karena diproses secara lokal."
    }
  ];

  const faqs = [
    {
      q: "Bagaimana Career-Up menjaga keamanan privasi data foto saya?",
      a: "Seluruh pengolahan foto seperti penghapusan dan penggantian latar belakang dilakukan 100% di peramban (Client-Side AI) menggunakan WebAssembly dan TensorFlow.js. Berkas foto Anda tidak pernah dikirimkan atau disimpan di server luar."
    },
    {
      q: "Apakah format CV yang dihasilkan benar-benar ramah ATS?",
      a: "Ya. Struktur tata letak dan ekstraksi teks diformat sesuai standar keterbacaan mesin Applicant Tracking System, serta diselaraskan dengan kata kunci dari deskripsi pekerjaan yang Anda targetkan."
    },
    {
      q: "Bagaimana kuis validasi keahlian bekerja?",
      a: "AI akan menyusun beberapa pertanyaan kuis singkat secara dinamis berdasarkan daftar klaim skill Anda. Hasil kuis digunakan untuk memberikan bobot narasi yang objektif dan terukur pada CV."
    },
    {
      q: "Apakah platform ini gratis untuk digunakan?",
      a: "Seluruh fitur utama seperti penyuntingan foto formal, pembuat CV ATS, dan kuis validasi dapat diakses secara penuh tanpa biaya."
    }
  ];

  return (
    <div className={styles.landing}>
      <Navbar onStartApp={onStartApp} />

      <main className={styles.main}>
        {/* HERO SECTION WITH BACKGROUND IMAGE */}
        <section className={styles.hero}>
          <div className={`container ${styles.heroContainer}`}>
            <div className={styles.heroContent}>
              <div className={styles.badge}>
                <i className={`fa-solid fa-square ${styles.badgeIcon}`}></i>
                <span>Hybrid AI Career Suite Solution</span>
              </div>
              
              <h1 className={styles.heroTitle}>
                Tingkatkan Peluang Karir dengan <span className={styles.highlight}>Career-Up</span>.
              </h1>
              
              <p className={styles.heroSubtitle}>
                Ekosistem terpadu untuk membuat CV standar ATS, olah pasfoto formal aman di browser, dan validasi keahlian objektif dalam satu pintu.
              </p>

              <div className={styles.ctaGroup}>
                <button className={styles.btnPrimary} onClick={onStartApp}>
                  <span>Mulai Buat CV Sekarang</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
                <a href="#features" className={styles.btnSecondary}>
                  <span>Eksplorasi Fitur</span>
                </a>
              </div>
            </div>

            <div className={styles.heroBottomBar}>
              <div className={styles.contactInfoGroup}>
                <div className={styles.infoBlock}>
                  <span className={styles.infoLabel}>Panggilan Bantuan:</span>
                  <span className={styles.infoValue}>(+62) 812-3456-7890</span>
                </div>
                <div className={styles.infoBlock}>
                  <span className={styles.infoLabel}>Alamat Email:</span>
                  <span className={styles.infoValue}>info@careerup.id</span>
                </div>
              </div>

              <div className={styles.floatingBadgeCard}>
                <div className={styles.badgeTitle}>Career-Up Suite 24/7</div>
                <div className={styles.badgeSubtitle}>Client-Side AI & Trusted ATS Format</div>
                <div className={styles.stars}>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>Fitur Unggulan</span>
              <h2 className={styles.sectionTitle}>Semua Alat Persiapan Lamaran dalam Satu Tempat</h2>
              <p className={styles.sectionDesc}>Dirancang khusus untuk membantu pencari kerja bersaing secara profesional.</p>
            </div>

            <div className={styles.grid}>
              {features.map((item, index) => (
                <div key={index} className={styles.card}>
                  <div className={styles.cardIconWrapper}>
                    <i className={item.icon}></i>
                  </div>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardText}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className={styles.section}>
          <div className="container">
            <div className={styles.aboutGrid}>
              <div>
                <span className={styles.sectionTag}>Konsep Arsitektur</span>
                <h2 className={styles.sectionTitle}>Pendekatan Hybrid AI untuk Kecepatan & Privasi</h2>
                <p className={styles.cardText} style={{ marginBottom: '20px' }}>
                  Career-Up mengombinasikan pemrosesan lokal (*Client-Side AI*) untuk keamanan data sensitif dan *Third-Party LLM API* untuk penalar teks yang cerdas.
                </p>
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>100%</div>
                  <div className={styles.statLabel}>Privasi Foto (On-Device)</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>0ms</div>
                  <div className={styles.statLabel}>Latensi Server Foto</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>ATS</div>
                  <div className={styles.statLabel}>Format Standar Rekrutmen</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>Free</div>
                  <div className={styles.statLabel}>Akses Fitur Utama</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>FAQ</span>
              <h2 className={styles.sectionTitle}>Pertanyaan Umum</h2>
            </div>

            <div className={styles.faqList}>
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`${styles.faqItem} ${openFaq === index ? styles.faqItemOpen : ''}`}
                >
                  <button 
                    className={styles.faqQuestion} 
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.q}</span>
                    <i className={openFaq === index ? "fa-solid fa-minus" : "fa-solid fa-plus"}></i>
                  </button>
                  {openFaq === index && (
                    <div className={styles.faqAnswer}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}