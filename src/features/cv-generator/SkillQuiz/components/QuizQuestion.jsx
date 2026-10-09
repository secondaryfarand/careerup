import React from 'react';
import styles from '../SkillQuiz.module.css';

export default function QuizQuestion({
  currentQ,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onSelectOption,
  onNext,
  onPrev,
}) {
  return (
    <div className={styles.quizCard}>
      <div className={styles.progressHeader}>
        <span>Pertanyaan {currentIndex + 1} dari {totalQuestions}</span>
        <span className={styles.skillBadge}>{currentQ?.skill}</span>
      </div>

      <h3 className={styles.questionText}>{currentQ?.question}</h3>

      <div className={styles.optionsGrid}>
        {currentQ?.options.map((option, idx) => (
          <button
            key={idx}
            type="button"
            className={`${styles.optionBtn} ${selectedAnswer === idx ? styles.optionSelected : ''}`}
            onClick={() => onSelectOption(idx)}
          >
            <span className={styles.optionIndex}>
              {String.fromCharCode(65 + idx)}
            </span>
            <span>{option}</span>
          </button>
        ))}
      </div>

      <div className={styles.actionFooter}>
        <button type="button" onClick={onPrev} className={styles.btnSecondary}>
          <i className="fa-solid fa-arrow-left"></i>
          <span>{currentIndex === 0 ? 'Batal' : 'Sebelumnya'}</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={selectedAnswer === undefined}
          className={styles.btnPrimary}
        >
          <span>{currentIndex === totalQuestions - 1 ? 'Selesaikan Kuis' : 'Lanjut'}</span>
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}