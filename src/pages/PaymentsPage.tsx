// src/pages/PaymentsPage.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useKioskLog } from '../context/KioskLogContext';
import { useClickTracker } from '../hooks/useKioskTrackers';

const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalPrice } = (location.state as any) || { totalPrice: 0 };
  const { enterPage, leavePage, finishSession, resetSession } = useKioskLog();

  const [selectedDiscount, setSelectedDiscount] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  React.useEffect(() => { enterPage('/payment'); }, []);
  useClickTracker();

  const handleRestart = () => {
    resetSession();
    navigate('/');
  };

  const handleAbandon = () => {
    leavePage(false);
    const log = finishSession(false);
    axios.post('http://localhost:8080/api/kiosk-logs/session', log)
      .then(() => console.log('저장 완료'))
      .catch(e => console.error('저장 실패', e));
    navigate('/');
  };

  const handleSkip = () => {
    leavePage(true);
    const log = finishSession(false);
    axios.post('http://localhost:8080/api/kiosk-logs/session', log)
      .then(() => console.log('저장 완료'))
      .catch(e => console.error('저장 실패', e));
    navigate('/');
  };

  const handlePaymentComplete = () => {
    if (!selectedPayment) { alert('결제 수단을 선택해주세요.'); return; }
    if (isProcessing) return;
    setIsProcessing(true);
    leavePage(false);
    setTimeout(() => {
      const log = finishSession(true);
      axios.post('http://localhost:8080/api/kiosk-logs/session', log)
        .then(() => console.log('저장 완료'))
        .catch(e => console.error('저장 실패', e));
      alert(`${selectedPayment}으로 ${totalPrice.toLocaleString()}원 결제가 완료되었습니다.`);
      navigate('/');
    }, 1500);
  };

  return (
    <div style={{ backgroundColor: '#f4f4f4', display: 'flex', flexDirection: 'column', height: '100vh' }}>

      <div style={{ backgroundColor: '#004d4d', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>🏠</button>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>⬅️</button>
        </div>
        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>결제하기</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 15px', backgroundColor: '#fff', borderBottom: '1px solid #e0dcd9' }}>
        <button onClick={handleRestart} style={{ padding: '4px 12px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '20px', fontSize: '0.75rem', color: '#16a34a', cursor: 'pointer' }}>↩ 처음부터</button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleAbandon} style={{ padding: '4px 12px', background: '#fee2e2', border: '1px solid #f87171', borderRadius: '20px', fontSize: '0.75rem', color: '#dc2626', cursor: 'pointer' }}>포기하기</button>
          <button onClick={handleSkip} style={{ padding: '4px 12px', background: '#e0f2fe', border: '1px solid #38bdf8', borderRadius: '20px', fontSize: '0.75rem', color: '#0284c7', cursor: 'pointer' }}>스킵 →</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ backgroundColor: '#ff9800', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', marginRight: '10px', fontWeight: 'bold' }}>STEP 1</span>
            <span style={{ fontWeight: 'bold', color: '#333' }}>제휴할인을 선택해주세요.</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {['KT 멤버십', 'T 우주패스', 'CJ ONE', '기아멤버스', '현대카드', '기타할인'].map(item => (
              <button key={item} onClick={() => setSelectedDiscount(item === selectedDiscount ? null : item)}
                style={{
                  padding: '8px 3px',
                  border: selectedDiscount === item ? '2px solid #008080' : '1px solid #ddd',
                  borderRadius: '8px',
                  background: selectedDiscount === item ? '#e0f2f1' : '#fff',
                  color: selectedDiscount === item ? '#004d4d' : '#ccc',
                  fontWeight: selectedDiscount === item ? 'bold' : 'normal',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                }}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ backgroundColor: '#ff9800', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', marginRight: '10px', fontWeight: 'bold' }}>STEP 2</span>
            <span style={{ fontWeight: 'bold', color: '#333' }}>결제수단을 선택해주세요.</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            {[{ key: '신용카드', label: '신용카드 / 삼성페이', icon: '💳' }, { key: '앱카드', label: '앱카드 / QR결제', icon: '📱' }].map(({ key, label, icon }) => (
              <button key={key} onClick={() => setSelectedPayment(key)}
                style={{ padding: '20px', border: selectedPayment === key ? '3px solid #008080' : '1px solid #ddd', borderRadius: '10px', background: selectedPayment === key ? '#e0f2f1' : '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '1.8rem' }}>{icon}</span>
                <span style={{ fontWeight: 'bold', color: '#004d4d' }}>{label}</span>
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {['카카오페이', '네이버페이', '페이코', '애플페이', '제로페이', '신한 SOL'].map(pay => (
              <button key={pay} onClick={() => setSelectedPayment(pay)}
                style={{
                  padding: '8px 3px',
                  border: selectedPayment === pay ? '2px solid #008080' : '1px solid #eee',
                  borderRadius: '8px',
                  background: selectedPayment === pay ? '#e0f2f1' : '#fff',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  color: selectedPayment === pay ? '#004d4d' : '#ccc',
                  fontWeight: selectedPayment === pay ? 'bold' : 'normal',
                }}>
                {pay}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '20px', background: '#fff', borderTop: '2px solid #004d4d' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: '#888', fontSize: '0.9rem' }}>주문금액</span>
          <span>₩{totalPrice.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>결제할 금액</span>
          <span style={{ fontWeight: 'bold', fontSize: '1.8rem', color: '#e5001a' }}>₩{totalPrice.toLocaleString()}</span>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <button onClick={() => navigate('/')}
            style={{ flex: 1, padding: '18px', background: '#004d4d', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
            취소
          </button>
          {/* ★ WCAG 위반: 결제 버튼 배경 #b0b0b0, 텍스트 #c0c0c0 */}
          <button onClick={handlePaymentComplete}
            style={{ flex: 2, padding: '18px', background: '#b0b0b0', color: '#c0c0c0', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
            {selectedPayment ? `${selectedPayment}로 결제하기` : '결제하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;