// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SplashPage from './pages/SplashPage';
import MenuPage from './pages/MenuPage';
import OptionPage from './pages/OptionPage';
import PaymentsPage from './pages/PaymentsPage';

import './App.css';

const App: React.FC = () => {
  return (
    // 기계 프레임을 제거하고 브라우저 전체를 사용하는 구조로 변경
    <div className="web-app-wrapper"> 
      <Router>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/option" element={<OptionPage />} />
          <Route path="/payment" element={<PaymentsPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;