import React, { createContext, useContext, useState } from 'react';

const CareerUpContext = createContext();

const initialCvData = {
  targetJob: '',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    address: '',
    summary: '',
  },
  workExperience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  cvSummary: {
    summary: '',
    highlights: [],
  },
};

const initialPhotoData = {
  originalImage: null,
  processedImage: null,
  backgroundColor: '#3b82f6',
  aspectRatio: '3x4',
  isBackgroundRemoved: false,
};

const initialQuizData = {
  quizHistory: [],
  validatedSkills: [],
  activeQuiz: null,
};

export function CareerUpProvider({ children }) {
  const [cvData, setCvData] = useState(initialCvData);
  const [photoData, setPhotoData] = useState(initialPhotoData);
  const [quizData, setQuizData] = useState(initialQuizData);
  const [activeTab, setActiveTab] = useState('landing');

  const updateTargetJob = (targetJob) => {
    setCvData((prev) => ({
      ...prev,
      targetJob,
    }));
  };

  const updatePersonalInfo = (info) => {
    setCvData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }));
  };

  const addExperience = (exp) => {
    setCvData((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, { id: Date.now(), ...exp }],
    }));
  };

  const updateExperience = (id, updatedExp) => {
    setCvData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((exp) =>
        exp.id === id ? { ...exp, ...updatedExp } : exp
      ),
    }));
  };

  const removeExperience = (id) => {
    setCvData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((exp) => exp.id !== id),
    }));
  };

  const addEducation = (edu) => {
    setCvData((prev) => ({
      ...prev,
      education: [...prev.education, { id: Date.now(), ...edu }],
    }));
  };

  const removeEducation = (id) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const addSkill = (skillName) => {
    if (!skillName.trim()) return;
    setCvData((prev) => {
      if (prev.skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) {
        return prev;
      }
      return {
        ...prev,
        skills: [...prev.skills, { id: Date.now(), name: skillName, isValidated: false, score: null, level: 'Intermediate' }],
      };
    });
  };

  const removeSkill = (id) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.id !== id),
    }));
  };

  const updateSkillLevel = (skillId, level) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) =>
        skill.id === skillId ? { ...skill, level } : skill
      ),
    }));
  };

  const updateCvSummary = (summaryData) => {
    setCvData((prev) => ({
      ...prev,
      cvSummary: typeof summaryData === 'string' 
        ? { ...prev.cvSummary, summary: summaryData } 
        : { ...prev.cvSummary, ...summaryData },
    }));
  };

  const updatePhoto = (data) => {
    setPhotoData((prev) => ({ ...prev, ...data }));
  };

  const resetPhoto = () => {
    setPhotoData(initialPhotoData);
  };

  const saveQuizResult = (skillId, score, totalQuestions) => {
    const isPassed = score / totalQuestions >= 0.7;

    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) =>
        skill.id === skillId
          ? { 
              ...skill, 
              isValidated: isPassed, 
              score: `${score}/${totalQuestions}`,
              level: isPassed ? 'Advanced' : 'Intermediate'
            }
          : skill
      ),
    }));

    setQuizData((prev) => ({
      ...prev,
      quizHistory: [
        ...prev.quizHistory,
        { id: Date.now(), skillId, score, totalQuestions, date: new Date().toISOString() },
      ],
    }));
  };

  const resetAllData = () => {
    setCvData(initialCvData);
    setPhotoData(initialPhotoData);
    setQuizData(initialQuizData);
  };

  const value = {
    cvData,
    setCvData,
    photoData,
    quizData,
    activeTab,
    setActiveTab,
    updateTargetJob,
    updatePersonalInfo,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    removeEducation,
    addSkill,
    removeSkill,
    updateSkillLevel,
    updateCvSummary,
    updatePhoto,
    resetPhoto,
    saveQuizResult,
    resetAllData,
  };

  return (
    <CareerUpContext.Provider value={value}>
      {children}
    </CareerUpContext.Provider>
  );
}

export function useCareerUp() {
  const context = useContext(CareerUpContext);
  if (!context) {
    throw new Error('useCareerUp harus digunakan di dalam CareerUpProvider');
  }
  return context;
}