// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { KioskLogProvider } from './context/KioskLogContext';
import SplashPage from './pages/SplashPage';
import MenuPage from './pages/MenuPage';
import OptionPage from './pages/OptionPage';
import PaymentsPage from './pages/PaymentsPage';
import PointPage from './pages/PointPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <KioskLogProvider>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/splash" element={<SplashPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/option" element={<OptionPage />} />
          <Route path="/point" element={<PointPage />} />
          <Route path="/payment" element={<PaymentsPage />} />
        </Routes>
      </KioskLogProvider>
    </BrowserRouter>
  );
};

export default App;