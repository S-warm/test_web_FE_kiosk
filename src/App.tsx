// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { KioskLogProvider } from './context/KioskLogContext';
import AgePage from './pages/Agepage';
import SplashPage from './pages/SplashPage';
import MenuPage from './pages/MenuPage';
import OptionPage from './pages/OptionPage';
import PaymentsPage from './pages/PaymentsPage';
import PointPage from './pages/PointPage';

const App: React.FC = () => {
  const [personaAge, setPersonaAge] = useState<number>(0);

  return (
    <BrowserRouter>
      {/* key={personaAge}: 나이 바뀌면 Provider 리셋 → 새 세션 시작 */}
      <KioskLogProvider key={personaAge} personaAge={personaAge}>
        <Routes>
          <Route path="/" element={<AgePage onAgeSet={setPersonaAge} />} />
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