import React, { useState, useEffect, useRef } from 'react';
import { useCareerUp } from '../../../context/CareerUpContext';
import { generateQuizFromAI, generateCvContentFromAI } from '../../../services/aiService';
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

  // Ref untuk memastikan API AI HANYA dipanggil 1 kali
  const isFetchedRef = useRef(false);

  useEffect(() => {
    if (isFetchedRef.current) return;
    isFetchedRef.current = true;

    async function fetchQuestions() {
      setLoading(true);
      try {
        const aiQuestions = await generateQuizFromAI(cvData.skills, targetJob);
        setQuestions(aiQuestions);
      } catch (error) {
        console.warn('AI Rate Limit Exceeded / Error. Menggunakan fallback kuis lokal:', error);
        
        // Fallback Kuis Lokal jika API terlimit
        const fallback = cvData.skills.length > 0
          ? cvData.skills.map((s) => ({
              skill: s.name,
              question: `Seberapa jauh pemahaman Anda mengenai implementasi ${s.name}?`,
              options: [
                'Memahami konsep dasar dan sintaksis dasar',
                'Mampu mengimplementasikan pada proyek nyata',
                'Terbiasa dengan optimasi dan arsitektur tingkat lanjut',
                'Baru mempelajari teori dasar'
              ],
              correct: 1
            }))
          : [
              {
                skill: 'Umum',
                question: 'Seberapa familiar Anda dengan kebutuhan target pekerjaan ini?',
                options: ['Sangat Familiar', 'Cukup Familiar', 'Masih Mempelajari', 'Baru Memulai'],
                correct: 0
              }
            ];

        setQuestions(fallback);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, []); // Kosongkan dependency array agar tidak tertrigger ulang saat props/state berubah

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

    if (typeof updateSkillLevel === 'function' && cvData.skills) {
      cvData.skills.forEach((skill) => {
        updateSkillLevel(skill.id, finalScore >= 70 ? 'Advanced' : 'Intermediate');
      });
    }

    setIsGeneratingCv(true);
    try {
      const aiContent = await generateCvContentFromAI(cvData.skills, targetJob);
      if (typeof updateCvSummary === 'function') {
        updateCvSummary({
          summary: aiContent.summary,
          highlights: aiContent.highlights,
        });
      }
    } catch (error) {
      console.warn('Gagal membuat ringkasan CV dari AI (menggunakan ringkasan standar):', error);
      if (typeof updateCvSummary === 'function') {
        updateCvSummary({
          summary: `Profesional dengan keahlian ${cvData.skills.map((s) => s.name).join(', ')} yang berfokus pada hasil dan siap berkontribusi pada posisi ${targetJob || 'target'}.`,
          highlights: [
            'Memiliki kompetensi teknis yang teruji.',
            'Mampu bekerja secara mandiri maupun dalam tim.',
            'Cepat beradaptasi dengan lingkungan kerja modern.'
          ]
        });
      }
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
            Kuis selesai. Narasi CV telah disesuaikan berdasarkan hasil pengujian Anda.
          </p>
        </header>

        <div className={styles.resultCard}>
          <i className={`fa-solid fa-award ${styles.scoreIcon}`}></i>
          <h3 className={styles.scoreText}>{score} / 100</h3>
          <p className={styles.scoreDesc}>
            {score >= 70
              ? 'Luar biasa! Keahlian Anda terbukti sangat solid. Narasi CV disusun dengan bobot kualifikasi tingkat tinggi.'
              : 'Hasil validasi cukup baik. Narasi CV disesuaikan secara proporsional sesuai tingkat pemahaman Anda.'}
          </p>

          <div className={styles.actionFooter} style={{ width: '100%', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={onNextStep}
              disabled={isGeneratingCv}
              className={styles.btnPrimary}
            >
              <span>{isGeneratingCv ? 'AI Sedang Menyusun CV...' : 'Lihat & Unduh CV Standar ATS'}</span>
              <i className={isGeneratingCv ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-arrow-right'}></i>
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