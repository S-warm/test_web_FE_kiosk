// src/pages/SplashPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKioskLog } from '../context/KioskLogContext';
import { useClickTracker } from '../hooks/useKioskTrackers';

const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const { enterPage, leavePage, logAction } = useKioskLog();

  useEffect(() => { enterPage('/splash'); }, []);
  useClickTracker();

  const posterUrl = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop";

  const handleStart = (orderType: '매장' | '포장') => {
    logAction('click', `<button>${orderType === '매장' ? '매장에서 먹어요' : '포장해서 갈래요'}</button>`);
    leavePage(false);
    navigate('/menu', { state: { orderType } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#111' }}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', backgroundColor: '#1a110b' }}>
        <img src={posterUrl} alt="Premium Coffee" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ backgroundColor: '#2a1b12', padding: '24px 30px 30px', borderTop: '1px solid #4a3322', flexShrink: 0 }}>
        <p style={{ color: '#bfa386', fontSize: '0.7rem', textAlign: 'center', marginBottom: '16px', letterSpacing: '-0.5px' }}>
          PREMIUM COFFEE | SEASON MENU | 상기 이미지는 연출된 것으로 실제와 다를 수 있습니다.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={() => handleStart('매장')} style={{ width: '100%', padding: '18px 0', backgroundColor: 'transparent', border: '2px solid #c49a6c', borderRadius: '5px', color: '#e6c598', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}>
            매장에서 먹어요
          </button>
          <button onClick={() => handleStart('포장')} style={{ width: '100%', padding: '18px 0', backgroundColor: 'transparent', border: '2px solid #c49a6c', borderRadius: '5px', color: '#e6c598', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}>
            포장해서 갈래요
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;