// src/pages/SplashPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashPage.css';

const SplashPage: React.FC = () => {
  const navigate = useNavigate();

  // ★ 세련되고 분위기 있는 고화질 커피 이미지 URL
  // 이 주소는 2000px 이상의 고해상도 이미지를 브라우저 크기에 맞춰 최적화해서 불러옵니다.
  const posterUrl = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="splash-wrapper">
      
      {/* 1. 상단 이미지 영역 */}
      <div className="poster-section">
        <img 
          src={posterUrl} 
          alt="Premium Coffee Poster" 
          className="poster-img" 
        />
      </div>

      {/* 2. 하단 디자인된 버튼 영역 */}
      <div className="splash-footer">
        <div className="splash-notice">
          PREMIUM COFFEE | SEASON MENU | 상기 이미지는 연출된 것으로 실제와 다를 수 있습니다.
        </div>
        
        <div className="splash-btns">
          <button className="splash-btn" onClick={() => navigate('/menu')}>
            매장에서 먹어요
          </button>
          <button className="splash-btn" onClick={() => navigate('/menu')}>
            포장해서 갈래요
          </button>
        </div>
      </div>

    </div>
  );
};

export default SplashPage;