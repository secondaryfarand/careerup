import React, { useState } from 'react';
import { useCareerUp } from '../../../context/CareerUpContext';
import { generateQuizFromAI, generateCvContentFromAI } from '../../../services/aiService';

import AtsScoreWidget  from '../../../components/common/AtsScoreWidget/AtsScoreWidget';
import QuizLanding from './components/QuizLanding';
import QuizLoading from './components/QuizLoading';
import QuizQuestion from './components/QuizQuestion';
import QuizResult from './components/QuizResult';
import styles from './SkillQuiz.module.css';

export default function SkillQuiz({ onNextStep, onPrevStep, targetJob }) {
  const { cvData, updateSkillLevel, updateCvSummary } = useCareerUp();
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [isGeneratingCv, setIsGeneratingCv] = useState(false);

  const handleStartQuiz = async () => {
    setLoading(true);
    try {
      const aiQuestions = await generateQuizFromAI(cvData.skills, targetJob);
      setQuestions(aiQuestions);
    } catch (error) {
      console.warn('AI Error / Rate Limit. Menggunakan fallback kuis lokal:', error);
      const fallback = cvData.skills?.length > 0
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
  };

  const handleSkipQuiz = async () => {
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
      console.warn('Gagal membuat ringkasan CV:', error);
      if (typeof updateCvSummary === 'function') {
        updateCvSummary({
          summary: `Profesional dengan keahlian ${cvData.skills?.map((s) => s.name).join(', ')} yang siap berkontribusi pada posisi ${targetJob || 'target'}.`,
          highlights: [
            'Memiliki kompetensi teknis yang teruji.',
            'Mampu bekerja secara mandiri maupun dalam tim.',
            'Cepat beradaptasi dengan lingkungan kerja modern.'
          ]
        });
      }
    } finally {
      setIsGeneratingCv(false);
      onNextStep();
    }
  };

  const calculateResult = async () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) correctCount += 1;
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
      console.warn('Gagal membuat ringkasan CV standar:', error);
    } finally {
      setIsGeneratingCv(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          {isCompleted ? 'Langkah 2: Hasil Validasi Skill' : 'Langkah 2: Validasi Skill'}
        </h2>
        <p className={styles.subtitle}>
          {isCompleted
            ? 'Kuis selesai. Narasi CV telah disesuaikan berdasarkan hasil pengujian Anda.'
            : 'Uji pemahaman skill Anda atau lewati langsung ke pembuatan dokumen CV ATS.'}
        </p>
      </header>

      {isCompleted ? (
        <QuizResult
          score={score}
          isGeneratingCv={isGeneratingCv}
          onNextStep={onNextStep}
        />
      ) : loading ? (
        <QuizLoading />
      ) : questions.length === 0 ? (
        <QuizLanding
          targetJob={targetJob|| cvData.targetJob || ''}
          skills={cvData.skills}
          onStart={handleStartQuiz}
          onSkip={handleSkipQuiz}
          onPrev={onPrevStep}
          isGeneratingCv={isGeneratingCv}
        />
      ) : (
        <QuizQuestion
          currentQ={questions[currentIndex]}
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          selectedAnswer={selectedAnswers[currentIndex]}
          onSelectOption={(idx) => setSelectedAnswers({ ...selectedAnswers, [currentIndex]: idx })}
          onNext={() => currentIndex < questions.length - 1 ? setCurrentIndex(currentIndex + 1) : calculateResult()}
          onPrev={() => currentIndex === 0 ? setQuestions([]) : setCurrentIndex(currentIndex - 1)}
        />
      )}
      {/* <AtsScoreWidget 
        jobDescription={targetJob} 
        cvContent={`${cvData.skills.map(s => s.name).join(' ')} ${cvData.summary || ''}`} 
      /> */}
    </div>
  );
}