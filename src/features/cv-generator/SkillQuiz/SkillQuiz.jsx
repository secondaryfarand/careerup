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
  const { cvData, updateSkillLevel, updateCvSummary, updateCvSection, } = useCareerUp();
  
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
      const aiQuestions = await generateQuizFromAI(cvData.skills, cvData.targetJob);
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
      const aiContent = await generateCvContentFromAI(cvData.skills, cvData.targetJob, cvData.jobDescription, cvData.workExperience, cvData.education);
      if (typeof updateCvSummary === 'function') {
        updateCvSummary({
          summary: aiContent.summary,
          highlights: aiContent.highlights,
          // coverLetter: aiContent.coverLetter,
          // emailPitch: aiContent.emailPitch
        });
      }
      if (aiContent.coverLetter && typeof updateCvSection === 'function') {
        updateCvSection('suratLamaran', aiContent.coverLetter);
      }

      if (aiContent.emailPitch && typeof updateCvSection === 'function') {
        updateCvSection('emailPitch', aiContent.emailPitch);
      }

      if (aiContent.workExperience && typeof updateCvSection === 'function') {
        updateCvSection('workExperience', aiContent.workExperience);
      }

      if (aiContent.education && typeof updateCvSection === 'function') {
        updateCvSection('education', aiContent.education);
      }
    } catch (error) {
      console.warn('Gagal membuat ringkasan CV:', error);
      if (typeof updateCvSummary === 'function') {
        const skillsText = cvData.skills?.map((s) => s.name).join(', ') || 'kompetensi profesional';
        const targetPosition = cvData.targetJob || 'posisi yang dilamar';

        updateCvSummary({
          summary: `Seorang individu yang antusias, adaptif, dan berdedikasi tinggi dengan penguasaan mendalam pada keahlian utama dalam bidang ${skillsText}. Memiliki rekam jejak dalam menghadapi berbagai tantangan profesional melalui pendekatan yang solutif, analitis, teliti, serta senantiasa berorientasi pada pencapaian hasil yang optimal bagi perusahaan. Berbekal kemampuan komunikasi yang baik serta etika kerja yang kuat, saya siap untuk membawa semangat proaktif, berkolaborasi secara efektif dalam tim lintas divisi, serta memberikan kontribusi nyata dalam mendukung perkembangan serta pencapaian target strategis pada ${targetPosition}.`,
          
          highlights: [
            `Memiliki kompetensi teknis dan penguasaan mendalam di bidang ${targetPosition} yang teruji melalui serangkaian evaluasi keterampilan.`,
            `Terbiasa menerapkan standar kerja profesional, problem-solving yang tajam, serta berorientasi pada pencapaian target perusahaan.`,
            `Memiliki kemampuan komunikasi yang baik, adaptif terhadap teknologi modern, serta mampu berkolaborasi secara efektif baik secara mandiri maupun dalam tim lintas divisi.`,
            `Memegang teguh etika kerja profesional, berdedikasi tinggi terhadap kualitas deliverable, dan selalu proaktif dalam mempelajari hal-hal baru demi inovasi berkelanjutan.`
          ], 

          coverLetter: {
            opening: `Dengan hormat,\n\nSehubungan dengan lowongan pekerjaan untuk posisi ${targetPosition} di perusahaan yang Anda pimpin, melalui surat ini saya ingin menyampaikan ketertarikan serta kesiapan saya untuk bergabung dan memberikan kontribusi terbaik.`,
            body: `Saya memiliki latar belakang keahlian yang selaras dengan kualifikasi yang dibutuhkan, khususnya dalam hal penguasaan ${skillsText}. Pengalaman dan keterampilan analitis yang saya miliki membekali saya untuk dapat langsung beradaptasi, menyelesaikan tantangan operasional, serta mendukung produktivitas tim di ${targetPosition}.`,
            closing: `Besar harapan saya untuk diberikan kesempatan mengikuti sesi wawancara guna menjelaskan lebih lanjut mengenai potensi dan kecocokan diri saya dengan kebutuhan perusahaan. Terima kasih atas waktu dan pertimbangan Anda.`
          },

          emailPitch: {
            subject: `Lamaran Pekerjaan - ${targetPosition} - [Nama Anda]`,
            body: `Halo Tim Rekrutmen,\n\nBerikut saya lampirkan dokumen ringkasan profil dan portofolio terkait lamaran saya untuk posisi ${targetPosition}. Dengan keahlian utama pada ${skillsText}, saya sangat antusias untuk bisa berdiskusi lebih lanjut mengenai bagaimana saya dapat berkontribusi untuk kemajuan perusahaan.\n\nTerima kasih,\n[Nama Anda]`
          }
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
      const skillPerformance = {};
      questions.forEach((q, idx) => {
        const isCorrect = selectedAnswers[idx] === q.correct;
        const skillName = q.skill;

        if (skillName) {
          if (!skillPerformance[skillName]) {
            skillPerformance[skillName] = { correct: 0, total: 0 };
          }
          skillPerformance[skillName].total += 1;
          if (isCorrect) {
            skillPerformance[skillName].totalCorrect += 1; 
            skillPerformance[skillName].correct += 1;
          }
        }
      });
      cvData.skills.forEach((skill) => {
        const stats = skillPerformance[skill.name];
        
        if (stats && stats.total > 0) {
          const individualScore = (stats.correct / stats.total) * 100;
          
          let dynamicLevel = 'Intermediate';
          if (individualScore >= 80) {
            dynamicLevel = 'Advanced';
          } else if (individualScore >= 50) {
            dynamicLevel = 'Intermediate';
          } else {
            dynamicLevel = 'Beginner';
          }

          updateSkillLevel(skill.id, dynamicLevel);
        } else {
          updateSkillLevel(skill.id, finalScore >= 70 ? 'Advanced' : 'Intermediate');
        }
      });
    }
    setIsGeneratingCv(true);
    try {
      const aiContent = await generateCvContentFromAI(cvData.skills, cvData.targetJob, cvData.jobDescription, cvData.workExperience, cvData.education);
      if (typeof updateCvSummary === 'function') {
        updateCvSummary({
          summary: aiContent.summary,
          highlights: aiContent.highlights,
        });
        if (aiContent.coverLetter && typeof updateCvSection === 'function') {
          updateCvSection('suratLamaran', aiContent.coverLetter);
        }

        if (aiContent.emailPitch && typeof updateCvSection === 'function') {
          updateCvSection('emailPitch', aiContent.emailPitch);
        }

        if (aiContent.workExperience && typeof updateCvSection === 'function') {
          updateCvSection('workExperience', aiContent.workExperience);
        }

        if (aiContent.education && typeof updateCvSection === 'function') {
          updateCvSection('education', aiContent.education);
        }
      }
    } catch (error) {
      console.warn('Gagal membuat ringkasan CV:', error);
      if (typeof updateCvSummary === 'function') {
        const skillsText = cvData.skills?.map((s) => s.name).join(', ') || 'kompetensi profesional';
        const targetPosition = cvData.targetJob || 'posisi yang dilamar';

        updateCvSummary({
          summary: `Seorang individu yang antusias, adaptif, dan berdedikasi tinggi dengan penguasaan mendalam pada keahlian utama dalam bidang ${skillsText}. Memiliki rekam jejak dalam menghadapi berbagai tantangan profesional melalui pendekatan yang solutif, analitis, teliti, serta senantiasa berorientasi pada pencapaian hasil yang optimal bagi perusahaan. Berbekal kemampuan komunikasi yang baik serta etika kerja yang kuat, saya siap untuk membawa semangat proaktif, berkolaborasi secara efektif dalam tim lintas divisi, serta memberikan kontribusi nyata dalam mendukung perkembangan serta pencapaian target strategis pada ${targetPosition}.`,
          
          highlights: [
            `Memiliki kompetensi teknis dan penguasaan mendalam di bidang ${targetPosition} yang teruji melalui serangkaian evaluasi keterampilan.`,
            `Terbiasa menerapkan standar kerja profesional, problem-solving yang tajam, serta berorientasi pada pencapaian target perusahaan.`,
            `Memiliki kemampuan komunikasi yang baik, adaptif terhadap teknologi modern, serta mampu berkolaborasi secara efektif baik secara mandiri maupun dalam tim lintas divisi.`,
            `Memegang teguh etika kerja profesional, berdedikasi tinggi terhadap kualitas deliverable, dan selalu proaktif dalam mempelajari hal-hal baru demi inovasi berkelanjutan.`
          ], 

          coverLetter: {
            opening: `Dengan hormat,\n\nSehubungan dengan lowongan pekerjaan untuk posisi ${targetPosition} di perusahaan yang Anda pimpin, melalui surat ini saya ingin menyampaikan ketertarikan serta kesiapan saya untuk bergabung dan memberikan kontribusi terbaik.`,
            body: `Saya memiliki latar belakang keahlian yang selaras dengan kualifikasi yang dibutuhkan, khususnya dalam hal penguasaan ${skillsText}. Pengalaman dan keterampilan analitis yang saya miliki membekali saya untuk dapat langsung beradaptasi, menyelesaikan tantangan operasional, serta mendukung produktivitas tim di ${targetPosition}.`,
            closing: `Besar harapan saya untuk diberikan kesempatan mengikuti sesi wawancara guna menjelaskan lebih lanjut mengenai potensi dan kecocokan diri saya dengan kebutuhan perusahaan. Terima kasih atas waktu dan pertimbangan Anda.`
          },

          emailPitch: {
            subject: `Lamaran Pekerjaan - ${targetPosition} - [Nama Anda]`,
            body: `Halo Tim Rekrutmen,\n\nBerikut saya lampirkan dokumen ringkasan profil dan portofolio terkait lamaran saya untuk posisi ${targetPosition}. Dengan keahlian utama pada ${skillsText}, saya sangat antusias untuk bisa berdiskusi lebih lanjut mengenai bagaimana saya dapat berkontribusi untuk kemajuan perusahaan.\n\nTerima kasih,\n[Nama Anda]`
          }
        });
        
      }
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
        <QuizLoading 
          targetJob={targetJob|| cvData.targetJob || ''}
          onStart={handleStartQuiz}
          onSkip={handleSkipQuiz}
          onPrev={onPrevStep}
          isGeneratingCv={isGeneratingCv}
          loading={loading}
        />
      ) : questions.length === 0 ? (
        <QuizLanding
          targetJob={targetJob|| cvData.targetJob || ''}
          skills={cvData.skills}
          onStart={handleStartQuiz}
          onSkip={handleSkipQuiz}
          onPrev={onPrevStep}
          isGeneratingCv={isGeneratingCv}
          loading={loading}
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