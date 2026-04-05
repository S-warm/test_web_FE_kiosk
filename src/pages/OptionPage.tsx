// src/pages/OptionPage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import shot1Img from '../assets/shot1.png';
import shot2Img from '../assets/shot2.png';
import { useKioskLog } from '../context/KioskLogContext';
import { useClickTracker } from '../hooks/useKioskTrackers';

const OptionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { enterPage, leavePage, logAction, finishSession, resetSession } = useKioskLog();

  const menu = location.state?.menu || { id: 0, name: '(ICE)카푸치노', price: 2900 };
  const currentCart = location.state?.currentCart || [];

  const [quantity, setQuantity] = useState(1);
  const [flashMsg, setFlashMsg] = useState<string | null>(null);
  const [selections, setSelections] = useState<Record<string, string>>(
    { temp: '', cinnamon: '', strength: '', syrup: '', stevia: '', milk: '', cup: '', whip: '' }
  );

  React.useEffect(() => { enterPage('/option'); }, []);
  useClickTracker();

  const optionGroups = [
    { id: 'temp', title: '온도(필수)', options: [{ id: 'ice', label: 'ICE', price: 0, icon: '🧊', img: '' }, { id: 'hot', label: 'HOT', price: 0, icon: '🔥', img: '' }] },
    { id: 'cinnamon', title: '시나몬 여부(필수)', options: [{ id: 'O', label: '시나몬 O', price: 0, icon: '☕', img: 'https://m.cookienbaking.co.kr/web/product/big/202409/7b6e0ff47e00e1b32f65fc1ec47b4766.jpg' }, { id: 'X', label: '시나몬 X', price: 0, icon: '❌', img: '' }] },
    { id: 'strength', title: '농도(필수)', options: [{ id: 'light', label: '연하게', price: 0, icon: '💧', img: '' }, { id: 'normal', label: '보통', price: 0, icon: '☕', img: '' }, { id: 'shot', label: '샷 추가', price: 500, icon: '☕', img: shot1Img }, { id: 'twoshot', label: '2샷 추가', price: 1000, icon: '☕☕', img: shot2Img }] },
    { id: 'syrup', title: '시럽추가(필수)', options: [{ id: 'none', label: '선택안함', price: 0, icon: '❌', img: '' }, { id: 'hazelnut', label: '헤이즐넛', price: 500, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIoR3R6tH4g9ZoHsN7L8XsXPK-JegDOCT1xw&s' }, { id: 'vanilla', label: '바닐라', price: 500, icon: '🍯', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLdkP-XS0dI1iGuYsN7h5TEMgjZ3Kc1x6PQA&s' }, { id: 'lightv', label: '라이트바닐라', price: 800, icon: '🍯', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxtStUDupk37bytkc2YYegsrzWeyPCBQR0Qg&s' }] },
    { id: 'stevia', title: '저당 스테비아(필수)', options: [{ id: 'none', label: '선택안함', price: 0, icon: '❌', img: '' }, { id: 'add', label: '스테비아 추가', price: 600, icon: '🌿', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_S9EEMxEsHHgaWBCgRwjbt22Id1LiZieXFw&s' }] },
    { id: 'milk', title: '우유 변경(필수)', options: [{ id: 'none', label: '선택안함', price: 0, icon: '❌', img: '' }, { id: 'almond', label: '아몬드밀크', price: 500, icon: '🥛', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlhHiN2sAkk4ZJGFlxcH-vvI-pLCAD_Yqgmg&s' }] },
    { id: 'cup', title: '컵 선택(필수)', options: [{ id: 'paper', label: '종이컵', price: 0, icon: '🥤', img: '' }, { id: 'personal', label: '개인컵 할인', price: -200, icon: '♻️', img: '' }, { id: 'tumbler', label: '텀블러', price: 0, icon: '🧉', img: '' }] },
    { id: 'whip', title: '휘핑크림(필수)', options: [{ id: 'none', label: '선택안함', price: 0, icon: '❌', img: '' }, { id: 'add', label: '휘핑 추가', price: 500, icon: '🍦', img: '' }, { id: 'extra', label: '휘핑 많이', price: 800, icon: '🍦🍦', img: '' }] },
  ];

  const showFlash = (msg: string) => {
    setFlashMsg(msg);
    setTimeout(() => setFlashMsg(null), 2000);
  };

  const optionAdditionalPrice = optionGroups.reduce((total, group) => {
    const opt = group.options.find(o => o.id === selections[group.id]);
    return total + (opt?.price || 0);
  }, 0);
  const finalPrice = menu.price + optionAdditionalPrice;

  const selectedOptionsText = optionGroups.map(group => {
    const opt = group.options.find(o => o.id === selections[group.id]);
    return opt?.label || '미선택';
  }).join(', ');

  const handleRestart = () => {
    resetSession();
    navigate('/');
  };

  const handleCancel = () => {
    logAction('click', '<button>취소</button>');
    leavePage(false);
    navigate('/menu', { state: { updatedCart: currentCart } });
  };

  const handleSkip = () => {
    logAction('click', '<button>스킵</button>');
    leavePage(true);
    const total = currentCart.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
    navigate('/point', { state: { cart: currentCart, totalPrice: total } });
  };

  const handleAbandon = () => {
    logAction('click', '<button>포기하기</button>');
    leavePage(false);
    const log = finishSession(false);
    console.log(JSON.stringify(log, null, 2));
    navigate('/');
  };

  const handleAddToCart = () => {
    const unselected = optionGroups.filter(g => !selections[g.id]);
    if (unselected.length > 0) {
      showFlash(`[${unselected.map(g => g.title.replace('(필수)', '')).join(', ')}] 항목을 선택해주세요.`);
      return;
    }
    logAction('click', `<button>장바구니 담기 - ${menu.name}</button>`);
    leavePage(false);
    const optionsString = Object.values(selections).join('-');
    const newItemId = `${menu.id}-${optionsString}`;
    const newItem = {
      id: newItemId, menuId: menu.id, name: menu.name,
      price: finalPrice, quantity, img: menu.img,
      options: optionGroups.map(g => g.options.find(o => o.id === selections[g.id])?.label || '').filter(Boolean),
    };
    let updatedCart = [...currentCart];
    const idx = updatedCart.findIndex(i => i.id === newItemId);
    if (idx > -1) updatedCart[idx].quantity += quantity;
    else updatedCart.push(newItem);
    navigate('/menu', { state: { updatedCart } });
  };

  return (
    <div style={{ backgroundColor: '#f9f8f6', display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'sans-serif' }}>

      {flashMsg && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#b3472e', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 'bold', zIndex: 9999, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          ⚠️ {flashMsg}
        </div>
      )}

      <div style={{ backgroundColor: '#2a1b12', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#e6c598', fontWeight: 'bold' }}>선택하신 상품의 옵션을 모두 선택해주세요</h2>
        <button onClick={handleCancel} style={{ background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: '#e6c598' }}>✕</button>
      </div>

      {/* 처음부터 / 포기 / 스킵 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 15px', backgroundColor: '#fff', borderBottom: '1px solid #e0dcd9' }}>
        <button onClick={handleRestart} style={{ padding: '4px 12px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '20px', fontSize: '0.75rem', color: '#16a34a', cursor: 'pointer' }}>↩ 처음부터</button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleAbandon} style={{ padding: '4px 12px', background: '#fee2e2', border: '1px solid #f87171', borderRadius: '20px', fontSize: '0.75rem', color: '#dc2626', cursor: 'pointer' }}>포기하기</button>
          <button onClick={handleSkip} style={{ padding: '4px 12px', background: '#e0f2fe', border: '1px solid #38bdf8', borderRadius: '20px', fontSize: '0.75rem', color: '#0284c7', cursor: 'pointer' }}>스킵 →</button>
        </div>
      </div>

      <div style={{ display: 'flex', padding: '20px', backgroundColor: '#fff', borderBottom: '1px solid #e0dcd9' }}>
        <div style={{ width: '80px', height: '100px', backgroundColor: '#f5f3f0', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem', borderRadius: '8px', marginRight: '20px', overflow: 'hidden' }}>
          {menu.img ? <img src={menu.img} alt={menu.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : '☕'}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem', color: '#2a1b12' }}>{menu.name}</h3>
            <span style={{ color: '#b3472e', fontWeight: 'bold', fontSize: '1.3rem' }}>{menu.price.toLocaleString()}원</span>
          </div>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem', lineHeight: '1.4' }}>
            (20oz)에스프레소 위에 올려진 우유 거품, 그리고 시나몬 파우더로 완성한 조화로운 맛의 커피
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: '#faf8f6', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0dcd9' }}>
        <div style={{ fontSize: '0.9rem', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '10px' }}>
          <span style={{ color: '#888', marginRight: '5px' }}>선택된 옵션 |</span>
          <strong style={{ color: '#2a1b12' }}>{selectedOptionsText}</strong>
        </div>
        <button onClick={() => setSelections({ temp: '', cinnamon: '', strength: '', syrup: '', stevia: '', milk: '', cup: '', whip: '' })}
          style={{ flexShrink: 0, padding: '5px 12px', backgroundColor: '#fff', border: '1px solid #b3472e', color: '#b3472e', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>
          ⟳ 초기화
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {optionGroups.map((group) => (
          <div key={group.id} style={{ marginBottom: '30px' }}>
            {/* ★ WCAG 위반: 옵션 제목 #ccc (대비 1.6:1) */}
            <h4 style={{ margin: '0 0 15px 0', fontSize: '1.05rem', color: '#ccc' }}>{group.title}</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {group.options.map((opt) => {
                const isSelected = selections[group.id] === opt.id;
                return (
                  <button key={opt.id} onClick={() => setSelections(p => ({ ...p, [group.id]: opt.id }))}
                    style={{
                      position: 'relative',
                      // ★ WCAG 위반: 버튼 70×70px (SENIOR 기준 48px 이하로 터치 어려움)
                      width: '70px', height: '70px',
                      backgroundColor: '#fff',
                      border: isSelected ? '2px solid #b3472e' : '1px solid #e0dcd9',
                      borderRadius: '12px',
                      display: 'flex', flexDirection: 'column',
                      justifyContent: 'center', alignItems: 'center',
                      cursor: 'pointer', boxSizing: 'border-box',
                      boxShadow: isSelected ? '0 4px 10px rgba(179,71,46,0.15)' : '0 2px 5px rgba(0,0,0,0.02)',
                    }}>
                    {isSelected && (
                      <div style={{ position: 'absolute', top: '-6px', left: '-6px', backgroundColor: '#b3472e', color: '#fff', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '9px', fontWeight: 'bold', border: '2px solid #fff', zIndex: 10 }}>✔</div>
                    )}
                    <div style={{ width: '28px', height: '28px', marginBottom: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {opt.img ? <img src={opt.img} alt={opt.label} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '1px solid #eee' }} /> : <span style={{ fontSize: '1.5rem' }}>{opt.icon}</span>}
                    </div>
                    {/* ★ WCAG 위반: 라벨 #bbb, 가격 #e8c4b8 (거의 안 보임) */}
                    <span style={{ fontSize: '0.65rem', fontWeight: isSelected ? 'bold' : 'normal', color: '#bbb', marginBottom: '2px', textAlign: 'center', lineHeight: '1.1' }}>{opt.label}</span>
                    <span style={{ fontSize: '0.6rem', color: '#e8c4b8' }}>{opt.price > 0 ? `+${opt.price.toLocaleString()}` : opt.price < 0 ? `${opt.price.toLocaleString()}` : '무료'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '20px', background: '#fff', borderTop: '1px solid #e0dcd9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <span style={{ fontWeight: 'bold', color: '#b3472e', fontSize: '1.4rem' }}>{(finalPrice * quantity).toLocaleString()}원</span>
          <div style={{ display: 'flex', border: '1px solid #e0dcd9', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '45px', height: '40px', border: 'none', background: '#f5f3f0', cursor: 'pointer', fontSize: '1.2rem', color: '#2a1b12' }}>-</button>
            <div style={{ width: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderLeft: '1px solid #e0dcd9', borderRight: '1px solid #e0dcd9', fontWeight: 'bold', fontSize: '1.1rem', color: '#2a1b12' }}>{quantity}</div>
            <button onClick={() => setQuantity(quantity + 1)} style={{ width: '45px', height: '40px', border: 'none', background: '#f5f3f0', cursor: 'pointer', fontSize: '1.2rem', color: '#2a1b12' }}>+</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleCancel} style={{ flex: 1, padding: '8px', background: '#4a3322', color: '#e6c598', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>취소</button>
          <button onClick={handleAddToCart} style={{ flex: 2, padding: '8px', background: '#2a1b12', color: '#e6c598', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>장바구니 담기</button>
        </div>
      </div>
    </div>
  );
};

export default OptionPage;