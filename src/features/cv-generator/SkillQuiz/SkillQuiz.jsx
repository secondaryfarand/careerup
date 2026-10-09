import React, { useState, useEffect } from 'react';
import { useCareerUp } from '../../../context/CareerUpContext';
import { generateQuizFromAI, generateCvSummaryFromAI } from '../../../services/aiService';
import styles from './SkillQuiz.module.css';

export default function SkillQuiz({ onNextStep, onPrevStep, targetJob }) {
  const { cvData, updateSkillLevel, updateCvSummary } = useCareerUp();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [isGeneratingCv, setIsGeneratingCv] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        const aiQuestions = await generateQuizFromAI(cvData.skills, targetJob);
        setQuestions(aiQuestions);
      } catch (error) {
        console.error('Gagal mengambil kuis AI:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [cvData.skills, targetJob]);

  const handleSelectOption = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: optionIndex,
    });
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = async () => {
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

    setIsGeneratingCv(true);
    try {
      const aiContent = await generateCvContentFromAI(cvData.skills, targetJob);
      
      updateCvSummary({
        summary: aiContent.summary,
        highlights: aiContent.highlights,
      });
    } catch (error) {
      console.error('Gagal generate konten CV dari AI:', error);
    } finally {
      setIsGeneratingCv(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.quizCard} style={{ textAlign: 'center', padding: '40px' }}>
          <i className="fa-solid fa-robot fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
          <p style={{ marginTop: '16px' }}>AI sedang menyusun pertanyaan kuis khusus berdasarkan target posisi Anda...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  if (isCompleted) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>Langkah 2: Hasil Validasi Skill</h2>
          <p className={styles.subtitle}>
            Kuis selesai. AI sedang menyesuaikan ringkasan narasi CV berdasarkan hasil pengujian Anda.
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
            <button
              type="button"
              onClick={onNextStep}
              disabled={isGeneratingCv}
              className={styles.btnPrimary}
            >
              <span>{isGeneratingCv ? 'AI Sedang Menyusun CV...' : 'Lihat & Unduh CV Standar ATS'}</span>
              <i className={isGeneratingCv ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-arrow-right"}></i>
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
          <span className={styles.skillBadge}>{currentQ?.skill}</span>
        </div>

        <h3 className={styles.questionText}>{currentQ?.question}</h3>

        <div className={styles.optionsGrid}>
          {currentQ?.options.map((option, idx) => (
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