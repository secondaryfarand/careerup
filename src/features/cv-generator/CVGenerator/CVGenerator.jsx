import React, { useState } from 'react';
import Navbar from '../../../components/layout/Navbar/Navbar';
import Footer from '../../../components/layout/Footer/Footer';
import CvForm from '../CVForm/CvForm';
import SkillQuiz from '../SkillQuiz/SkillQuiz';
import CvPreview from '../CVPreview/CVPreview';

export default function CvGenerator() {
  const [step, setStep] = useState(1);

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '20px 2rem' }}>
        {step === 1 && <CvForm onNextStep={handleNextStep} />}
        {step === 2 && <SkillQuiz onNextStep={handleNextStep} onPrevStep={handlePrevStep} />}
        {step === 3 && <CvPreview onPrevStep={handlePrevStep} />}
      </main>

      <Footer />
    </div>
  );
}