import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, totalPrice } = (location.state as any) || { cart: [], totalPrice: 0 };

  // ★ 선택 상태 관리를 위한 State 추가
  const [selectedDiscount, setSelectedDiscount] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  // 결제 완료 처리
  const handlePaymentComplete = () => {
    if (!selectedPayment) {
      alert('결제 수단을 선택해주세요.');
      return;
    }
    const discountText = selectedDiscount ? `(${selectedDiscount} 적용)` : '';
    alert(`${selectedPayment}${discountText}으로 ${totalPrice.toLocaleString()}원 결제가 완료되었습니다.`);
    navigate('/'); 
  };

  return (
    <div className="page-container" style={{ backgroundColor: '#f4f4f4', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 상단바 (청녹색 테마) */}
      <div className="top-control-bar" style={{ backgroundColor: '#004d4d', padding: '15px' }}>
        <div className="nav-buttons">
          <button className="icon-btn" onClick={() => navigate('/')}>🏠</button>
          <button className="icon-btn" onClick={() => navigate(-1)}>⬅️</button>
        </div>
        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>결제하기</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        
        {/* STEP 1: 제휴할인 선택 (클릭 가능하도록 수정) */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ backgroundColor: '#ff9800', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', marginRight: '10px', fontWeight: 'bold' }}>STEP 1</span>
            <span style={{ fontWeight: 'bold', color: '#333' }}>제휴할인을 선택해주세요.</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            {['KT 멤버십', 'T 우주패스', 'CJ ONE', '기아멤버스', '현대카드', '기타할인'].map(item => (
              <button 
                key={item} 
                onClick={() => setSelectedDiscount(item === selectedDiscount ? null : item)}
                style={{ 
                  padding: '15px 5px', 
                  border: selectedDiscount === item ? '2px solid #008080' : '1px solid #ddd', 
                  borderRadius: '8px', 
                  background: selectedDiscount === item ? '#e0f2f1' : '#fff', 
                  color: selectedDiscount === item ? '#004d4d' : '#333',
                  fontWeight: selectedDiscount === item ? 'bold' : 'normal',
                  fontSize: '0.85rem', 
                  cursor: 'pointer',
                  transition: '0.2s'
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* STEP 2: 결제수단 선택 (클릭 및 하이라이트 추가) */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ backgroundColor: '#ff9800', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', marginRight: '10px', fontWeight: 'bold' }}>STEP 2</span>
            <span style={{ fontWeight: 'bold', color: '#333' }}>결제수단을 선택해주세요.</span>
          </div>
          
          {/* 큰 버튼 영역 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <button 
              onClick={() => setSelectedPayment('신용카드')}
              style={{ 
                padding: '20px', 
                border: selectedPayment === '신용카드' ? '3px solid #008080' : '1px solid #ddd', 
                borderRadius: '10px', 
                background: selectedPayment === '신용카드' ? '#e0f2f1' : '#fff', 
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' 
              }}
            >
              <span style={{ fontSize: '1.8rem' }}>💳</span>
              <span style={{ fontWeight: 'bold', color: '#004d4d' }}>신용카드 / 삼성페이</span>
            </button>
            <button 
              onClick={() => setSelectedPayment('앱카드')}
              style={{ 
                padding: '20px', 
                border: selectedPayment === '앱카드' ? '3px solid #008080' : '1px solid #ddd', 
                borderRadius: '10px', 
                background: selectedPayment === '앱카드' ? '#e0f2f1' : '#fff', 
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' 
              }}
            >
              <span style={{ fontSize: '1.8rem' }}>📱</span>
              <span style={{ fontWeight: 'bold', color: '#004d4d' }}>앱카드 / QR결제</span>
            </button>
          </div>

          {/* 작은 격자형 버튼 영역 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            {['카카오페이', '네이버페이', '페이코', '애플페이', '제로페이', '신한 SOL'].map(pay => (
              <button 
                key={pay} 
                onClick={() => setSelectedPayment(pay)}
                style={{ 
                  padding: '15px 5px', 
                  border: selectedPayment === pay ? '2px solid #008080' : '1px solid #eee', 
                  borderRadius: '8px', 
                  background: selectedPayment === pay ? '#e0f2f1' : '#fff', 
                  fontSize: '0.85rem', 
                  cursor: 'pointer',
                  fontWeight: selectedPayment === pay ? 'bold' : 'normal'
                }}
              >
                {pay}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 최종 금액 바 */}
      <div style={{ padding: '20px', background: '#fff', borderTop: '2px solid #004d4d', boxShadow: '0 -4px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: '#888', fontSize: '0.9rem' }}>주문금액</span>
          <span style={{ color: '#333' }}>₩{totalPrice.toLocaleString()}</span>
        </div>
        {selectedDiscount && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#007bff' }}>
            <span style={{ fontSize: '0.9rem' }}>제휴할인 ({selectedDiscount})</span>
            <span>- ₩0 (추후 로직 추가 가능)</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>결제할 금액</span>
          <span style={{ fontWeight: 'bold', fontSize: '1.8rem', color: '#e5001a' }}>₩{totalPrice.toLocaleString()}</span>
        </div>
        
        {/* 최종 결제 버튼 */}
        <button 
          onClick={handlePaymentComplete}
          style={{ 
            width: '100%', padding: '18px', marginTop: '15px', background: selectedPayment ? '#008080' : '#ccc', 
            color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', cursor: selectedPayment ? 'pointer' : 'not-allowed' 
          }}
        >
          {selectedPayment ? `${selectedPayment}로 결제하기` : '결제수단을 선택해주세요'}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;