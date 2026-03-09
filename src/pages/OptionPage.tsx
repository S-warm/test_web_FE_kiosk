import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import shot1Img from '../assets/shot1.png';
import shot2Img from '../assets/shot2.png';

const OptionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 데이터 수신 및 기본값 설정
  const menu = location.state?.menu || { id: 0, name: '(ICE)카푸치노', price: 2900 };
  const currentCart = location.state?.currentCart || []; 

  // 수량
  const [quantity, setQuantity] = useState(1);

  // ★ 사진에 맞춘 옵션 데이터 구조화 (img 속성 추가 가능!)
  const optionGroups = [
    {
      id: 'cinnamon',
      title: '시나몬 여부(필수, 단일선택)',
      options: [
        // 여기에 img 주소를 넣으면 이모지 대신 사진이 나옵니다.
        { id: 'O', label: '시나몬 O', price: 0, icon: '☕', img: 'https://m.cookienbaking.co.kr/web/product/big/202409/7b6e0ff47e00e1b32f65fc1ec47b4766.jpg' },
        { id: 'X', label: '시나몬 X', price: 0, icon: '❌', img: '' },
      ]
    },
    {
      id: 'strength',
      title: '농도(필수, 단일선택)',
      options: [
        { id: 'none', label: '선택안함', price: 0, icon: '❌', img: '' },
        { id: 'light', label: '연하게', price: 0, icon: '💧', img: '' },
        { id: 'shot', label: '샷 추가', price: 500, icon: '☕', img: shot1Img },
        { id: 'twoshot', label: '2샷 추가', price: 1000, icon: '☕☕', img: shot2Img },
      ]
    },
    {
      id: 'syrup',
      title: '시럽추가(C)(필수, 단일선택)',
      options: [
        { id: 'none', label: '선택안함', price: 0, icon: '❌', img: '' },
        { id: 'hazelnut', label: '헤이즐넛 추가', price: 500, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIoR3R6tH4g9ZoHsN7L8XsXPK-JegDOCT1xw&s' },
        { id: 'vanilla', label: '바닐라 추가', price: 500, icon: '🍯', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLdkP-XS0dI1iGuYsN7h5TEMgjZ3Kc1x6PQA&s' },
        { id: 'light', label: '라이트바닐라 추가', price: 800, icon: '🍯', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxtStUDupk37bytkc2YYegsrzWeyPCBQR0Qg&s' },
      ]
    },
    {
      id: 'stevia',
      title: '저당 스테비아 슈가 추가(필수, 단일선택)',
      options: [
        { id: 'none', label: '선택안함', price: 0, icon: '❌', img: '' },
        // 나중에 여기 img: '' 안에 주소만 넣으시면 됩니다!
        { id: 'add', label: '스테비아 추가', price: 600, icon: '🌿', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_S9EEMxEsHHgaWBCgRwjbt22Id1LiZieXFw&s' },
      ]
    },
    {
      id: 'milk',
      title: '우유 변경(필수, 단일선택)',
      options: [
        { id: 'none', label: '선택안함', price: 0, icon: '❌', img: '' },
        // 나중에 여기 img: '' 안에 주소만 넣으시면 됩니다!
        { id: 'almond', label: '아몬드밀크변경', price: 500, icon: '🥛', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlhHiN2sAkk4ZJGFlxcH-vvI-pLCAD_Yqgmg&s' },
      ]
    }
  ];

  // ★ 선택된 옵션 상태 관리 (초기값 세팅)
  const defaultSelections: Record<string, string> = {
    cinnamon: 'O',
    strength: 'none',
    syrup: 'none',
    stevia: 'none',
    milk: 'none',
  };
  const [selections, setSelections] = useState<Record<string, string>>(defaultSelections);

  // 옵션 클릭 핸들러
  const handleSelectOption = (groupId: string, optionId: string) => {
    setSelections(prev => ({ ...prev, [groupId]: optionId }));
  };

  // 초기화 버튼 핸들러
  const handleReset = () => {
    setSelections(defaultSelections);
  };

  // 총 옵션 추가 금액 계산
  const optionAdditionalPrice = optionGroups.reduce((total, group) => {
    const selectedOptionId = selections[group.id];
    const selectedOption = group.options.find(opt => opt.id === selectedOptionId);
    return total + (selectedOption?.price || 0);
  }, 0);

  const finalPrice = menu.price + optionAdditionalPrice;

  // 선택된 옵션 텍스트 생성
  const selectedOptionsText = optionGroups.map(group => {
    const selectedOptionId = selections[group.id];
    const selectedOption = group.options.find(opt => opt.id === selectedOptionId);
    return selectedOption?.label;
  }).join(', ');

  // 취소
  const handleCancel = () => {
    navigate('/menu', { state: { updatedCart: currentCart } });
  };

  // 장바구니 담기
  const handleAddToCart = () => {
    const optionsString = Object.values(selections).join('-');
    const newItemId = `${menu.id}-${optionsString}`;
    
    const newItem = {
      id: newItemId,
      menuId: menu.id,
      name: menu.name,
      price: finalPrice,
      quantity: quantity,
      img: menu.img,
      options: optionGroups.map(g => {
        const opt = g.options.find(o => o.id === selections[g.id]);
        return opt?.label || '';
      }).filter(Boolean)
    };

    let updatedCart = [...currentCart];
    const existIndex = updatedCart.findIndex(item => item.id === newItemId);
    
    if (existIndex > -1) {
      updatedCart[existIndex].quantity += quantity;
    } else {
      updatedCart.push(newItem);
    }

    navigate('/menu', { state: { updatedCart } });
  };

  return (
    <div className="page-container" style={{ backgroundColor: '#f9f8f6', display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* 1. 상단 다크 브라운 헤더 */}
      <div style={{ backgroundColor: '#2a1b12', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#e6c598', fontWeight: 'bold' }}>선택하신 상품의 옵션을 모두 선택해주세요</h2>
        <button onClick={handleCancel} style={{ background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: '#e6c598' }}>✕</button>
      </div>

      {/* 2. 상품 정보 영역 */}
      <div style={{ display: 'flex', padding: '20px', backgroundColor: '#fff', borderBottom: '1px solid #e0dcd9' }}>
        <div style={{ width: '80px', height: '100px', backgroundColor: '#f5f3f0', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem', borderRadius: '8px', marginRight: '20px', overflow: 'hidden' }}>
          {menu.img ? (
            <img 
              src={menu.img} 
              alt={menu.name} 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          ) : (
            '☕'
          )}
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

      {/* 3. 선택된 옵션 요약 바 */}
      <div style={{ backgroundColor: '#faf8f6', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0dcd9' }}>
        <div style={{ fontSize: '0.9rem', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '10px' }}>
          <span style={{ color: '#888', marginRight: '5px' }}>선택된 옵션 |</span>
          <strong style={{ color: '#2a1b12' }}>{selectedOptionsText}</strong>
        </div>
        <button onClick={handleReset} style={{ flexShrink: 0, padding: '5px 12px', backgroundColor: '#fff', border: '1px solid #b3472e', color: '#b3472e', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          ⟳ 초기화
        </button>
      </div>

      {/* 4. 스크롤 가능한 옵션 리스트 영역 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {optionGroups.map((group) => (
          <div key={group.id} style={{ marginBottom: '30px' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '1.05rem', color: '#2a1b12' }}>{group.title}</h4>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {group.options.map((opt) => {
                const isSelected = selections[group.id] === opt.id;
                
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(group.id, opt.id)}
                    style={{
                      position: 'relative',
                      width: '110px',
                      height: '110px',
                      backgroundColor: '#fff',
                      border: isSelected ? '2px solid #b3472e' : '1px solid #e0dcd9',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                      boxShadow: isSelected ? '0 4px 10px rgba(179, 71, 46, 0.15)' : '0 2px 5px rgba(0,0,0,0.02)',
                      transition: 'all 0.1s'
                    }}
                  >
                    {isSelected && (
                      <div style={{ position: 'absolute', top: '-8px', left: '-8px', backgroundColor: '#b3472e', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', fontWeight: 'bold', border: '2px solid #fff', zIndex: 10 }}>
                        ✔
                      </div>
                    )}
                    
                    {/* ★ 여기가 수정된 핵심 부분입니다! (이미지가 있으면 사진 띄우기) */}
                    <div style={{ width: '45px', height: '45px', marginBottom: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {opt.img ? (
                        <img 
                          src={opt.img} 
                          alt={opt.label} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '1px solid #eee' }} 
                        />
                      ) : (
                        <span style={{ fontSize: '2.5rem' }}>{opt.icon}</span>
                      )}
                    </div>

                    <span style={{ fontSize: '0.85rem', fontWeight: isSelected ? 'bold' : 'normal', color: '#2a1b12', marginBottom: '4px' }}>{opt.label}</span>
                    <span style={{ fontSize: '0.8rem', color: '#b3472e' }}>+{opt.price.toLocaleString()}원</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 5. 하단 장바구니 담기 영역 */}
      <div style={{ padding: '20px', background: '#fff', borderTop: '1px solid #e0dcd9', boxShadow: '0 -4px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <span style={{ fontWeight: 'bold', color: '#b3472e', fontSize: '1.4rem' }}>
            {(finalPrice * quantity).toLocaleString()}원
          </span>
          <div style={{ display: 'flex', border: '1px solid #e0dcd9', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '45px', height: '40px', border: 'none', background: '#f5f3f0', cursor: 'pointer', fontSize: '1.2rem', color: '#2a1b12' }}>-</button>
            <div style={{ width: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderLeft: '1px solid #e0dcd9', borderRight: '1px solid #e0dcd9', fontWeight: 'bold', fontSize: '1.1rem', color: '#2a1b12' }}>{quantity}</div>
            <button onClick={() => setQuantity(quantity + 1)} style={{ width: '45px', height: '40px', border: 'none', background: '#f5f3f0', cursor: 'pointer', fontSize: '1.2rem', color: '#2a1b12' }}>+</button>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleCancel} style={{ flex: 1, padding: '15px', background: '#4a3322', color: '#e6c598', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>취소</button>
          <button onClick={handleAddToCart} style={{ flex: 2, padding: '15px', background: '#2a1b12', color: '#e6c598', border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}>장바구니 담기</button>
        </div>
      </div>

    </div>
  );
};

export default OptionPage;