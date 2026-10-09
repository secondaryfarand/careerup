import React, { useState, useEffect } from 'react';
import { useCareerUp } from '../../../context/CareerUpContext';
import { getRandomThreeQuestions } from '../../../data/interviewQuestions';
import { evaluateInterviewFromAI } from '../../../services/aiService';

import Navbar from '../../../components/layout/Navbar/Navbar';
import Footer from '../../../components/layout/Footer/Footer';
import JobModal from '../JobModal/JobModal';
import styles from './AiInterview.module.css';

export default function AiInterview() {
  const { cvData, updateTargetJob } = useCareerUp();

  // Ambil dari Context jika ada, atau gunakan local state jika user langsung akses /interview
  const initialJob = cvData?.targetJob || cvData?.personalInfo?.targetJob || '';
  const [targetJob, setTargetJob] = useState(initialJob);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Jika targetJob sudah terisi (baik dari Context maupun Modal Form)
  useEffect(() => {
    if (targetJob) {
      const randomQ = getRandomThreeQuestions(targetJob);
      setQuestions(randomQ);
    }
  }, [targetJob]);

  // Handler saat user submit pekerjaan dari Modal
  const handleSetJob = (jobTitle) => {
    setTargetJob(jobTitle);
    if (typeof updateTargetJob === 'function') {
      updateTargetJob(jobTitle); // Simpan juga ke Context agar ter-sync
    }
  };

  const handleAnswerChange = (e) => {
    setAnswers({
      ...answers,
      [questions[currentIndex].id]: e.target.value,
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitAndEvaluate = async () => {
    setIsSubmitting(true);

    const qnaPayload = questions.map((q) => ({
      id: q.id,
      category: q.category,
      question: q.questionText,
      answer: answers[q.id] || '',
    }));

    try {
      const result = await evaluateInterviewFromAI(targetJob, qnaPayload);
      setEvaluationResult(result);
    } catch (err) {
      console.error('Gagal mengevaluasi interview:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setQuestions(getRandomThreeQuestions(targetJob));
    setCurrentIndex(0);
    setAnswers({});
    setEvaluationResult(null);
  };

  // 1. TAMPILKAN MODAL JIKA PADA AWAL USER BELUM MENGISI TARGET JOB
  if (!targetJob) {
    return <JobModal onSubmit={handleSetJob} />;
  }

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <>
    <Navbar />
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          <i className="fa-solid fa-comments"></i> AI Interview Simulator
        </h2>
        <p className={styles.subtitle}>
          Latihan wawancara interaktif untuk posisi <strong>{targetJob}</strong>.{' '}
          <button 
            type="button" 
            onClick={() => setTargetJob('')} 
            style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.85rem' }}
          >
            (Ubah Posisi)
          </button>
        </p>
      </header>

      {!evaluationResult ? (
        <div className={styles.card}>
          {/* Progress Bar & Steps */}
          <div className={styles.progressTracker}>
            <span>Pertanyaan {currentIndex + 1} dari 3</span>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${((currentIndex + 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Box */}
          <div className={styles.questionBox}>
            <span className={styles.categoryBadge}>{currentQ.category}</span>
            <h3 className={styles.questionText}>{currentQ.questionText}</h3>
          </div>

          {/* Answer Textarea */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Jawaban Anda:</label>
            <textarea
              className={styles.textarea}
              rows="6"
              placeholder="Tuliskan jawaban Anda secara jelas dan mendalam..."
              value={answers[currentQ.id] || ''}
              onChange={handleAnswerChange}
            />
          </div>

          {/* Navigation Controls */}
          <div className={styles.actionFooter}>
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0 || isSubmitting}
              className={styles.btnSecondary}
            >
              <i className="fa-solid fa-arrow-left"></i> Sebelumnya
            </button>

            {!isLastQuestion ? (
              <button type="button" onClick={handleNext} className={styles.btnPrimary}>
                Selanjutnya <i className="fa-solid fa-arrow-right"></i>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitAndEvaluate}
                disabled={isSubmitting}
                className={styles.btnSuccess}
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Mengevaluasi dengan AI...
                  </>
                ) : (
                  <>
                    Lihat Evaluasi Akhir <i className="fa-solid fa-square-poll-vertical"></i>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        
      ) : (
        <div className={styles.resultContainer}>
          
          <div className={styles.scoreOverview}>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreNumber}>{evaluationResult.overallScore}%</span>
              <span className={styles.scoreLabel}>Skor Kesiapan</span>
            </div>
            <div className={styles.summaryText}>
              <h3>Hasil Evaluasi Wawancara</h3>
              <p>{evaluationResult.summaryFeedback}</p>
            </div>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailCard}>
              <h4 className={styles.greenText}>
                <i className="fa-solid fa-circle-check"></i> Hal yang Sudah Bagus
              </h4>
              <ul>
                {evaluationResult.strengths?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className={styles.detailCard}>
              <h4 className={styles.amberText}>
                <i className="fa-solid fa-circle-exclamation"></i> Area Perbaikan
              </h4>
              <ul>
                {evaluationResult.improvements?.map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.perQuestionSection}>
            <h4>Detail Evaluasi Per Pertanyaan:</h4>
            {questions.map((q, idx) => {
              const feedbackItem = evaluationResult.perQuestionFeedback?.find(
                (f) => f.questionId === q.id
              );
              return (
                <div key={q.id} className={styles.questionReviewCard}>
                  <h5>
                    #{idx + 1} {q.questionText}
                  </h5>
                  <p className={styles.userAnswerText}>
                    <strong>Jawaban Anda:</strong> {answers[q.id] || '(Tidak ada jawaban)'}
                  </p>
                  <div className={styles.feedbackNote}>
                    <small>Umpan Balik AI:</small>
                    <p>{feedbackItem?.feedback || 'Jawaban telah ditinjau.'}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button type="button" onClick={handleReset} className={styles.btnPrimary}>
            <i className="fa-solid fa-rotate-right"></i> Coba Sesi Latihan Baru
          </button>
        </div>
      )}
    </div>
    <Footer />
   </>
  );
}