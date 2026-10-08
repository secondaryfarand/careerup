import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './features/landing/LandingPage';
import BackgroundRemover from './features/photo/BackgroundRemover';
import BackgroundChanger from './features/photo/BackgroundChanger/BakcgroundChanger';
import PasfotoCropper from './features/photo/PasfotoCropper/PasfotoCropper';

function AppContent() {
  const navigate = useNavigate();

  const handleStartApp = () => {
    navigate('/background-remover');
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage onStartApp={handleStartApp} />} />
      <Route path="/background-remover" element={<BackgroundRemover />} />
      <Route path="/background-changer" element={<BackgroundChanger />} />
      <Route path="/pasfoto-cropper" element={<PasfotoCropper />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}