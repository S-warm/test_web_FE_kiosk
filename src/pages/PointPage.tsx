// src/pages/PointPage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useKioskLog } from '../context/KioskLogContext';
import { useClickTracker, useInputTracker } from '../hooks/useKioskTrackers';

const PointPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { enterPage, leavePage, logAction, finishSession, resetSession } = useKioskLog();
  const { cart, totalPrice } = (location.state as any) || { cart: [], totalPrice: 0 };

  const [rawPhone, setRawPhone] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  React.useEffect(() => { enterPage('/point'); }, []);
  useClickTracker();
  useInputTracker();

  const digitsOnly = rawPhone.replace(/\D/g, '').slice(0, 11);

  const getMasked = (digits: string) => {
    if (!digits.length) return '';
    const p1 = digits.slice(0, 3);
    const p2 = digits.slice(3, 7);
    const p3 = digits.slice(7, 11);
    return p1 + (p2 ? '-' + '*'.repeat(p2.length) : '') + (p3 ? '-' + '*'.repeat(p3.length) : '');
  };

  const handleRestart = () => {
    resetSession();
    navigate('/');
  };

  const handlePageSkip = () => {
    logAction('click', '<button>스킵</button>');
    leavePage(true);
    navigate('/payment', { state: { cart, totalPrice } });
  };

  const handleAbandon = () => {
    logAction('click', '<button>포기하기</button>');
    leavePage(false);
    const log = finishSession(false);
    console.log(JSON.stringify(log, null, 2));
    navigate('/');
  };

  const handleSkip = () => {
    logAction('click', '<button>적립 안함</button>');
    leavePage(false);
    navigate('/payment', { state: { cart, totalPrice } });
  };

  const handleConfirm = () => {
    if (digitsOnly.length < 10) { alert('올바른 휴대폰 번호를 입력해주세요.'); return; }
    logAction('click', '<button>적립하고 결제하기</button>');
    leavePage(false);
    navigate('/payment', { state: { cart, totalPrice } });
  };

  return (
    <div style={{ backgroundColor: '#f4f4f4', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ backgroundColor: '#2a1b12', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => { logAction('click', '<button>뒤로가기</button>'); navigate(-1); }} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>⬅️</button>
        <div style={{ color: '#e6c598', fontWeight: 'bold', fontSize: '1.1rem' }}>포인트 적립</div>
        <div style={{ width: '30px' }} />
      </div>

      {/* 처음부터 / 포기 / 스킵 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 15px', backgroundColor: '#fff', borderBottom: '1px solid #e0dcd9' }}>
        <button onClick={handleRestart} style={{ padding: '4px 12px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '20px', fontSize: '0.75rem', color: '#16a34a', cursor: 'pointer' }}>↩ 처음부터</button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleAbandon} style={{ padding: '4px 12px', background: '#fee2e2', border: '1px solid #f87171', borderRadius: '20px', fontSize: '0.75rem', color: '#dc2626', cursor: 'pointer' }}>포기하기</button>
          <button onClick={handlePageSkip} style={{ padding: '4px 12px', background: '#e0f2fe', border: '1px solid #38bdf8', borderRadius: '20px', fontSize: '0.75rem', color: '#0284c7', cursor: 'pointer' }}>스킵 →</button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 30px' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '500px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h2 style={{ textAlign: 'center', color: '#2a1b12', marginBottom: '10px' }}>포인트 적립</h2>
          <p style={{ textAlign: 'center', color: '#888', fontSize: '0.9rem', marginBottom: '30px' }}>
            휴대폰 번호를 입력하시면 구매금액의 1%가 적립됩니다.
          </p>

          <div style={{ position: 'relative', marginBottom: '20px' }}>
            {/* ★ WCAG 위반: 라벨 #eee (흰 배경 대비 1.2:1, 완전 안 보임) */}
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#eee', fontWeight: 'bold' }}>
              휴대폰 번호
            </label>
            <input
              type="tel" value={rawPhone}
              onChange={(e) => setRawPhone(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={13}
              style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', top: 0, left: 0, cursor: 'text', zIndex: 2 }}
            />
            {/* ★ WCAG 위반: 마스킹 텍스트 #e8e8e8 (배경 #fafafa랑 거의 구분 불가) */}
            <div style={{ padding: '15px 20px', border: isFocused ? '2px solid #2a1b12' : '1px solid #ddd', borderRadius: '10px', fontSize: '1.3rem', fontWeight: 'bold', letterSpacing: '2px', color: digitsOnly.length > 0 ? '#e8e8e8' : '#eee', backgroundColor: '#fafafa', minHeight: '55px', display: 'flex', alignItems: 'center' }}>
              {digitsOnly.length > 0 ? getMasked(digitsOnly) : '010-0000-0000'}
            </div>
          </div>

          <p style={{ fontSize: '0.75rem', color: '#ccc', marginBottom: '30px', textAlign: 'center' }}>
            * 번호는 암호화되어 안전하게 처리됩니다.
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            {/* ★ WCAG 위반: 적립 안함 버튼 텍스트 #ccc, 패딩 축소 */}
            <button onClick={handleSkip} style={{ flex: 1, padding: '8px', background: '#f0f0f0', color: '#ccc', border: 'none', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>
              적립 안함
            </button>
            <button onClick={handleConfirm} style={{ flex: 2, padding: '8px', background: '#2a1b12', color: '#e6c598', border: 'none', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer' }}>
              적립하고 결제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointPage;