import React, { useState } from 'react';
import { useCareerUp } from '../../../context/CareerUpContext';
import styles from './SkillQuiz.module.css';

export default function SkillQuiz({ onNextStep, onPrevStep }) {
  const { cvData, updateSkillLevel } = useCareerUp();

  const generateQuestions = () => {
    if (!cvData.skills || cvData.skills.length === 0) {
      return [
        {
          id: 1,
          skill: 'Keahlian Umum',
          question: 'Bagaimana pendekatan terbaik Anda saat menyelesaikan kendala teknis pada proyek?',
          options: [
            'Menganalisis akar masalah dan mendokumentasikan solusi secara terstruktur',
            'Langsung mencoba berbagai opsi tanpa perencanaan',
            'Menunggu anggota tim lain menyelesaikan masalah',
            'Mengabaikan masalah jika tidak terlalu mendesak'
          ],
          correct: 0
        }
      ];
    }

    return cvData.skills.map((skill, index) => ({
      id: index + 1,
      skill: skill.name,
      question: `Manakah dari pernyataan berikut yang paling tepat merefleksikan penerapan terbaik dari ${skill.name}?`,
      options: [
        `Memanfaatkan ${skill.name} untuk meningkatkan efisiensi dan skalabilitas sistem sesuai best practices.`,
        `Menggunakan ${skill.name} hanya untuk kebutuhan sintaks dasar tanpa mempertimbangkan optimasi.`,
        `Menerapkan ${skill.name} secara acak tanpa mengikuti standar dokumentasi resmi.`,
        `Menghindari integrasi ${skill.name} dalam alur kerja pengembangan utama.`
      ],
      correct: 0
    }));
  };

  const [questions] = useState(generateQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: optionIndex
    });
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        correctCount += 1;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setIsCompleted(true);

    cvData.skills.forEach((skill) => {
      updateSkillLevel(skill.id, finalScore >= 70 ? 'Advanced' : 'Intermediate');
    });
  };

  if (isCompleted) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>Langkah 2: Hasil Validasi Skill</h2>
          <p className={styles.subtitle}>
            Kuis selesai. Skor berikut akan digunakan untuk mengukur bobot kualifikasi pada narasi CV Anda.
          </p>
        </header>

        <div className={styles.resultCard}>
          <i className={`fa-solid fa-award ${styles.scoreIcon}`}></i>
          <h3 className={styles.scoreText}>{score} / 100</h3>
          <p className={styles.scoreDesc}>
            {score >= 70
              ? 'Luar biasa! Keahlian Anda terbukti sangat solid. Narasi CV akan disusun dengan bobot kualifikasi tingkat tinggi.'
              : 'Hasil validasi cukup baik. Narasi CV akan disesuaikan secara proporsional sesuai tingkat pemahaman Anda.'}
          </p>

          <div className={styles.actionFooter} style={{ width: '100%', justifyContent: 'center' }}>
            <button type="button" onClick={onNextStep} className={styles.btnPrimary}>
              <span>Generate CV Standar ATS</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Langkah 2: Kuis Validasi Skill</h2>
        <p className={styles.subtitle}>
          Jawab pertanyaan singkat di bawah ini untuk menguji dan memvalidasi keahlian yang Anda daftarkan.
        </p>
      </header>

      <div className={styles.quizCard}>
        <div className={styles.progressHeader}>
          <span>Pertanyaan {currentIndex + 1} dari {questions.length}</span>
          <span className={styles.skillBadge}>{currentQ.skill}</span>
        </div>

        <h3 className={styles.questionText}>{currentQ.question}</h3>

        <div className={styles.optionsGrid}>
          {currentQ.options.map((option, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.optionBtn} ${selectedAnswers[currentIndex] === idx ? styles.optionSelected : ''}`}
              onClick={() => handleSelectOption(idx)}
            >
              <span className={styles.optionIndex}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span>{option}</span>
            </button>
          ))}
        </div>

        <div className={styles.actionFooter}>
          <button
            type="button"
            onClick={currentIndex === 0 ? onPrevStep : () => setCurrentIndex(currentIndex - 1)}
            className={styles.btnSecondary}
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>{currentIndex === 0 ? 'Kembali ke Form' : 'Sebelumnya'}</span>
          </button>

          <button
            type="button"
            onClick={handleNextQuestion}
            disabled={selectedAnswers[currentIndex] === undefined}
            className={styles.btnPrimary}
          >
            <span>{currentIndex === questions.length - 1 ? 'Selesaikan Kuis' : 'Lanjut'}</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}