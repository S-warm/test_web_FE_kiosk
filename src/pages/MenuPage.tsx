// src/pages/MenuPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useKioskLog } from '../context/KioskLogContext';
import { useClickTracker, useInputTracker } from '../hooks/useKioskTrackers';

interface CartItem {
  id: string;
  menuId: number;
  name: string;
  price: number;
  quantity: number;
  options: string[];
  img?: string;
}

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { enterPage, leavePage, logAction, finishSession, resetSession } = useKioskLog();
  const [activeCat, setActiveCat] = useState('커피');
  const [lang, setLang] = useState('KR');
  const [timeLeft, setTimeLeft] = useState(180);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [extensionTime, setExtensionTime] = useState(10);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    return (location.state as any)?.updatedCart || [];
  });

  useEffect(() => { enterPage('/menu'); }, []);
  useClickTracker();
  useInputTracker();

  const categories = ['NEW', '커피', '디카페인', '콜드브루', '논커피', '티 & 에이드', '프라페', '디저트'];

  const allMenus: { [key: string]: any[] } = {
    'NEW': [
      { id: 1, name: '생초콜릿 라떼', price: 4500, img: 'https://composecoffee.com/files/attach/images/152/851/242/8e21b5d20e2c005e057a9d0bbcda05ba.jpg', desc: '벨기에산 생초콜릿을 녹여 만든 진한 라떼. 당도 조절 가능.' },
      { id: 2, name: '버터비어 크림커피', price: 4500, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt2rd0KDrw7Lq6mFLHyQ0SwpaB5iGgHPR-zw&s', desc: '버터 풍미의 크림이 올라간 달콤한 커피.' },
      { id: 3, name: '스페니쉬 뱅쇼', price: 4000, img: 'https://kurlylog-img.kurly.com/hdims/resize/%3E720x%3E720/quality/85/src/recipe/red-wine-mulled-wine-recipe-step-7.jpg', desc: '계피와 정향을 넣은 스페인식 따뜻한 과일 음료.' },
    ],
    '커피': [
      { id: 11, name: '아메리카노', price: 2000, img: 'https://d2afncas1tel3t.cloudfront.net/wp-content/uploads/211001_%EB%B9%85%EC%95%84%EC%9D%B4%EC%8A%A4%EC%95%84%EB%A9%94%EB%A6%AC%EC%B9%B4%EB%85%B8-1280.jpg', desc: '에스프레소에 물을 더한 기본 커피.' },
      { id: 12, name: '꿀 커피', price: 2000, img: 'https://imagecdn.dpon.gift/images/merchandises/mmd%EA%BF%80%EC%BB%A4%ED%94%BCICE.jpg', desc: '국내산 아카시아 꿀이 들어간 달콤한 커피.' },
      { id: 13, name: '카페 라떼', price: 2900, img: 'https://media.sodagift.com/img/image/666189745453581.jpg', desc: '에스프레소와 스팀밀크의 부드러운 조화.' },
      { id: 14, name: '바닐라 라떼', price: 3300, img: 'https://thebreadbag.co.kr/wp-content/uploads/2025/03/%EB%B9%B5%EB%B0%B1%ED%99%94%EC%A0%90_%EC%A0%95%EC%82%AC%EA%B0%81-1280x1280_0000s_0005_%EB%B0%B0%EB%AF%BC1280x960_%EC%9D%8C%EB%A3%8C_%EB%B3%B4%EC%A0%95%EB%B3%B8_0005_%EB%B0%94%EB%8B%90%EB%9D%BC%EB%9D%BC%EB%96%BC-%EB%B3%B5%EC%82%AC.jpg', desc: '바닐라 시럽이 들어간 달콤한 라떼.' },
      { id: 15, name: '헤이즐넛 라떼', price: 3300, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBd8j8DR-gvRnyTr6Vu4Oj2x80rfTZQhQnbQ&s', desc: '헤이즐넛 향의 고소한 라떼.' },
      { id: 16, name: '카페 모카', price: 3500, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc5lq7c7CRexLHQk_ltLErSjj_Gm0EH0p-_A&s', desc: '초콜릿 시럽과 에스프레소의 달콤한 조합.' },
    ],
    '디카페인': [
      { id: 21, name: '디카페인 아메리카노', price: 2100, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs2GmTpNv8PNDvZ-AmiwNVIXDDFE1oDuZE7g&s', desc: '카페인을 99% 제거한 디카페인 아메리카노.' },
      { id: 22, name: '디카페인 라떼', price: 3400, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3D2vLruHOnYpe2ClKyopm-gICa6razUJxVw&s', desc: '카페인 걱정 없이 즐기는 부드러운 라떼.' },
    ],
    '콜드브루': [
      { id: 31, name: '콜드브루 블랙', price: 3000, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8omMfO0m7h4VKqaOlmbQMTJqBLT2Tuw_3dQ&s', desc: '12시간 저온 추출한 깊고 진한 콜드브루.' },
      { id: 32, name: '콜드브루 라떼', price: 3700, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEkSX-djdnqFg-QPONnihJNywrPk7Nf1ABRQ&s', desc: '콜드브루에 우유를 더한 부드러운 라떼.' },
    ],
    '논커피': [
      { id: 41, name: '초코 라떼', price: 3300, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBJ2NRRWyNwPW7EGFLXuAsgGxVTWspu7xucg&s', desc: '벨기에산 초코 파우더로 만든 진한 초코 라떼.' },
      { id: 42, name: '딸기 라떼', price: 3800, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaCAxZtGq2RSgUtBdV2-tobRgfSWpFC1Hy-w&s', desc: '생딸기를 갈아 넣은 신선한 딸기 라떼.' },
    ],
    '티 & 에이드': [
      { id: 51, name: '복숭아 아이스티', price: 3000, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-OfM-El4cMKjp0_pDu7Ebsu-9l3zY5uXzKw&s', desc: '복숭아 과즙이 들어간 시원한 아이스티.' },
      { id: 52, name: '청포도 에이드', price: 3900, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxJJ_ke_K8P81Dejdu7q8-PCu4vU39jFqx5A&s', desc: '청포도와 탄산수의 상큼한 에이드.' },
    ],
    '프라페': [
      { id: 61, name: '쿠키 프라페', price: 3900, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7KT4SGeAaMWHPLhgnRKw2VVdgOGy4xmsYLA&s', desc: '오레오 쿠키가 들어간 달콤한 프라페.' },
      { id: 62, name: '민트초코 프라페', price: 4200, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStdGT_4paYyhJjqNBVlq1x_pXQSo_8Bc0AoA&s', desc: '상쾌한 민트와 초코칩의 시원한 프라페.' },
    ],
    '디저트': [
      { id: 71, name: '초코쿠키', price: 1200, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRuGnIMYjKbmV2U4KR3z4rSwIDjvDcCKB7ag&s', desc: '버터향 가득한 수제 초코칩 쿠키.' },
      { id: 72, name: '치즈케이크', price: 4500, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNibcwlqAaEx6_OF5Gp6a5MpsrsHV5bNIu0A&s', desc: '뉴욕식 진한 치즈케이크. 당일 제조.' },
    ],
  };

  useEffect(() => {
    const state = location.state as any;
    if (state?.updatedCart) setCart(state.updatedCart);
  }, [location.state]);

  useEffect(() => {
    let timer: any;
    if (timeLeft > 0 && !isModalOpen) {
      timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    } else if (timeLeft === 0 && !isModalOpen) {
      setIsModalOpen(true);
    }
    return () => clearInterval(timer);
  }, [timeLeft, isModalOpen]);

  useEffect(() => {
    let t: any;
    if (isModalOpen && extensionTime > 0) {
      t = setInterval(() => setExtensionTime(p => p - 1), 1000);
    } else if (isModalOpen && extensionTime === 0) {
      leavePage(false);
      navigate('/splash');
    }
    return () => clearInterval(t);
  }, [isModalOpen, extensionTime, navigate]);

  const handleScroll = (dir: 'L' | 'R') => {
    scrollRef.current?.scrollBy({ left: dir === 'L' ? -200 : 200, behavior: 'smooth' });
  };

  const handleClearCart = () => { if (window.confirm('전체 취소하시겠습니까?')) setCart([]); };
  const handleRemoveItem = (id: string) => setCart(p => p.filter(i => i.id !== id));
  const handleQuantityChange = (id: string, delta: number) => {
    setCart(p => p.map(item => {
      if (item.id !== id) return item;
      const q = item.quantity + delta;
      return q > 0 ? { ...item, quantity: q } : item;
    }));
  };

  const handleRestart = () => {
    resetSession();
    navigate('/');
  };

  const handleSkip = () => {
    logAction('click', '<button data-testid="skip-btn">스킵</button>');
    leavePage(true);
    navigate('/option', { state: { menu: allMenus[activeCat][0], currentCart: cart, skipped: true } });
  };

  const handleAbandon = () => {
    logAction('click', '<button data-testid="abandon-btn">포기하기</button>');
    leavePage(false);
    const log = finishSession(false);
    console.log(JSON.stringify(log, null, 2));
    navigate('/');
  };

  const handleMenuClick = (menu: any) => {
    logAction('click', `<div data-menu="${menu.name}">${menu.name} 선택</div>`);
    leavePage(false);
    setTimeLeft(180);
    navigate('/option', { state: { menu, currentCart: cart } });
  };

  const handlePayClick = () => {
    logAction('click', '<button data-testid="pay-btn">결제하기</button>');
    leavePage(false);
    navigate('/point', { state: { cart, totalPrice } });
  };

  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const displayCart = [...cart];
  while (displayCart.length < 3) displayCart.push({ isPlaceholder: true, id: `empty-${displayCart.length}` } as any);
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f9f8f6', overflow: 'hidden' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', alignItems: 'center', backgroundColor: '#2a1b12' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['KR', 'US', 'JP', 'CN'].map(l => (
            <span key={l} onClick={() => setLang(l)} style={{ color: lang === l ? '#e6c598' : 'rgba(255,255,255,0.4)', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>{l}</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 15px', backgroundColor: '#fff', borderBottom: '1px solid #e0dcd9' }}>
        <button data-testid="restart-btn" onClick={handleRestart} style={{ padding: '4px 12px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '20px', fontSize: '0.75rem', color: '#16a34a', cursor: 'pointer' }}>↩ 처음부터</button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button data-testid="abandon-btn" onClick={handleAbandon} style={{ padding: '4px 12px', background: '#fee2e2', border: '1px solid #f87171', borderRadius: '20px', fontSize: '0.75rem', color: '#dc2626', cursor: 'pointer' }}>포기하기</button>
          <button data-testid="skip-btn" onClick={handleSkip} style={{ padding: '4px 12px', background: '#e0f2fe', border: '1px solid #38bdf8', borderRadius: '20px', fontSize: '0.75rem', color: '#0284c7', cursor: 'pointer' }}>스킵하기</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '15px', backgroundColor: '#fff', borderBottom: '1px solid #e0dcd9' }}>
        {categories.map(cat => (
          <button key={cat} data-testid={`category-${cat}`} onClick={() => { setActiveCat(cat); setTimeLeft(180); }}
            style={{ padding: '4px 6px', flex: '1 1 calc(25% - 10px)', background: activeCat === cat ? '#2a1b12' : '#fff', color: activeCat === cat ? '#e6c598' : '#666', border: '1px solid #d4cdc7', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer', fontSize: '10px' }}>
            {cat}
          </button>
        ))}
      </div>

      <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignContent: 'start' }}>
        {allMenus[activeCat]?.map(menu => (
          <div key={menu.id} style={{ backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 6px 15px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
            <div onClick={() => handleMenuClick(menu)}
              style={{ cursor: 'pointer', padding: '20px 15px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '20px 20px 0 0', overflow: 'hidden' }}>
              {menu.img
                ? <img src={menu.img} alt={menu.name} style={{ width: '70px', height: '70px', objectFit: 'contain', marginBottom: '8px', pointerEvents: 'none' }} />
                : <div style={{ fontSize: '3rem', marginBottom: '10px' }}>☕</div>
              }
              <div style={{ fontWeight: '900', fontSize: '0.85rem', color: '#333' }}>{menu.name}</div>
              <div style={{ color: '#c97a5e', fontWeight: 'bold', fontSize: '0.95rem', marginTop: '6px' }}>₩ {menu.price.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', height: '160px', backgroundColor: '#fff', borderTop: '2px solid #e0dcd9', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 20px' }}>
          <button onClick={() => handleScroll('L')} style={{ flexShrink: 0, background: '#f5f3f0', border: '1px solid #e0dcd9', borderRadius: '10px', cursor: 'pointer', width: '50px', height: '120px', fontSize: '1.5rem' }}>◀</button>
          <div ref={scrollRef} className="hide-scrollbar" style={{ display: 'flex', gap: '20px', overflowX: 'auto', scrollBehavior: 'smooth', flex: 1, padding: '0 20px', alignItems: 'center' }}>
            {displayCart.map((item: any) => (
              <div key={item.id} style={{ minWidth: '120px', flexShrink: 0, height: '135px', border: item.isPlaceholder ? '2px dashed #e0dcd9' : '1px solid #e0dcd9', borderRadius: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: item.isPlaceholder ? '#faf8f6' : '#fff', position: 'relative', padding: '10px' }}>
                {!item.isPlaceholder && (
                  <>
                    <button data-testid={`remove-item-${item.id}`} onClick={() => handleRemoveItem(item.id)} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#b3472e', color: '#fff', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                    {item.img ? <img src={item.img} style={{ width: '55px', height: '55px', objectFit: 'contain' }} alt="" /> : <span style={{ fontSize: '2rem' }}>☕</span>}
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', margin: '5px 0', textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button data-testid="qty-minus" onClick={() => handleQuantityChange(item.id, -1)} style={{ width: '18px', height: '18px', borderRadius: '3px', border: '1px solid #ddd', cursor: 'pointer', fontSize: '0.7rem', padding: 0 }}>-</button>
                      <span style={{ fontWeight: 'bold' }}>{item.quantity}</span>
                      <button data-testid="qty-plus" onClick={() => handleQuantityChange(item.id, 1)} style={{ width: '18px', height: '18px', borderRadius: '3px', border: '1px solid #ddd', cursor: 'pointer', fontSize: '0.7rem', padding: 0 }}>+</button>
                    </div>
                  </>
                )}
                {item.isPlaceholder && <span style={{ color: '#ccc', fontWeight: 'bold' }}>빈 칸</span>}
              </div>
            ))}
          </div>
          <button onClick={() => handleScroll('R')} style={{ flexShrink: 0, background: '#f5f3f0', border: '1px solid #e0dcd9', borderRadius: '10px', cursor: 'pointer', width: '50px', height: '120px', fontSize: '1.5rem' }}>▶</button>
        </div>

        <div style={{ display: 'flex', borderLeft: '2px solid #e0dcd9' }}>
          <div style={{ width: '260px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, display: 'flex', borderBottom: '1px solid #e0dcd9' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#faf8f6', borderRight: '1px solid #e0dcd9' }}>
                <span style={{ fontSize: '0.9rem', color: '#888' }}>총 결제금액</span>
                <span style={{ color: '#b3472e', fontWeight: 'bold', fontSize: '1.7rem' }}>₩{totalPrice.toLocaleString()}</span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#fdfbf7' }}>
                <span style={{ fontSize: '0.9rem', color: '#a67c52' }}>남은 시간</span>
                <span style={{ color: '#2a1b12', fontWeight: 'bold', fontSize: '1.7rem' }}>{formatTime(timeLeft)}</span>
              </div>
            </div>
            <button data-testid="clear-cart-btn" onClick={handleClearCart} style={{ height: '60px', background: '#4a3322', color: '#e6c598', border: 'none', fontWeight: 'bold', fontSize: '1.3rem', cursor: 'pointer' }}>전체취소</button>
          </div>
          <button data-testid="pay-btn" onClick={handlePayClick} disabled={cart.length === 0}
            style={{ width: '80px', background: cart.length > 0 ? '#2a1b12' : '#d4cdc7', color: '#3d2a1e', border: 'none', fontSize: '0.75rem', fontWeight: '900', cursor: 'pointer' }}>
            결제하기
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', padding: '40px', borderRadius: '25px', textAlign: 'center', width: '400px' }}>
            <h2 style={{ color: '#2a1b12' }}>주문 시간을 연장할까요?</h2>
            <p style={{ color: '#b3472e', fontWeight: 'bold', fontSize: '4rem', margin: '30px 0' }}>{extensionTime}</p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button data-testid="extend-btn" onClick={() => { logAction('click', '<button data-testid="extend-btn">연장하기</button>'); setTimeLeft(180); setIsModalOpen(false); setExtensionTime(10); }} style={{ flex: 1, padding: '20px', background: '#2a1b12', color: '#e6c598', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.2rem' }}>연장하기</button>
              <button data-testid="exit-btn" onClick={async () => { logAction('click', '<button data-testid="exit-btn">종료</button>'); leavePage(false); await new Promise(r => setTimeout(r, 50)); navigate('/splash'); }} style={{ flex: 1, padding: '20px', background: '#888', color: '#fff', borderRadius: '12px', fontSize: '1.2rem' }}>종료</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;