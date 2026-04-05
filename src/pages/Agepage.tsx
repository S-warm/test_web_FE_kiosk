// src/pages/AgePage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AgePageProps {
  onAgeSet: (age: number) => void;
}

const AgePage: React.FC<AgePageProps> = ({ onAgeSet }) => {
  const navigate = useNavigate();
  const [age, setAge] = useState<number>(28);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ages = Array.from({ length: 85 }, (_, i) => i + 15);
  const itemHeight = 50;

  const handleScroll = () => {
    if (!isTyping && scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollTop / itemHeight);
      if (ages[index] !== undefined) setAge(ages[index]);
    }
  };

  const handleBlur = () => {
    setIsTyping(false);
    let v = parseInt(String(age), 10);
    if (isNaN(v) || v < 15) v = 15;
    if (v > 99) v = 99;
    setAge(v);
  };

  useEffect(() => {
    if (!isTyping && scrollRef.current) {
      const index = ages.indexOf(age);
      if (index !== -1) scrollRef.current.scrollTop = index * itemHeight;
    }
  }, [isTyping, age]);

  const handleNext = () => {
    onAgeSet(age);
    sessionStorage.setItem('persona_age', String(age));
    setTimeout(() => { navigate('/splash'); }, 0);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a110b' }}>
      <div style={{ backgroundColor: '#2a1b12', border: '1px solid #4a3322', borderRadius: '20px', padding: '50px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
        <h2 style={{ color: '#e6c598', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '8px' }}>테스터 연령 설정</h2>
        <p style={{ color: '#bfa386', fontSize: '0.8rem', marginBottom: '30px' }}>숫자를 스크롤하거나 클릭해서 입력하세요</p>

        {/* 드럼 피커 */}
        <div style={{ position: 'relative', width: '90px', height: '150px', overflow: 'hidden', cursor: 'pointer', marginBottom: '10px' }}>
          <div style={{ position: 'absolute', top: '50px', left: 0, width: '100%', height: '50px', borderTop: '2px solid #c49a6c', borderBottom: '2px solid #c49a6c', pointerEvents: 'none', boxSizing: 'border-box', zIndex: 2 }} />
          {isTyping ? (
            <input
              type="number" value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              onBlur={handleBlur}
              onKeyDown={(e) => { if (e.key === 'Enter') handleBlur(); }}
              autoFocus
              style={{ position: 'absolute', top: '50px', left: 0, width: '100%', height: '50px', border: 'none', backgroundColor: 'transparent', textAlign: 'center', fontSize: '28px', fontWeight: 'bold', color: '#c49a6c', outline: 'none', boxSizing: 'border-box' }}
            />
          ) : (
            <div
              ref={scrollRef} onScroll={handleScroll} onClick={() => setIsTyping(true)}
              style={{ height: '100%', overflowY: 'scroll', scrollSnapType: 'y mandatory', scrollbarWidth: 'none' } as React.CSSProperties}
            >
              <div style={{ height: `${itemHeight}px` }} />
              {ages.map((a) => (
                <div key={a} style={{ height: `${itemHeight}px`, display: 'flex', justifyContent: 'center', alignItems: 'center', scrollSnapAlign: 'center', fontSize: '24px', color: a === age ? '#c49a6c' : 'rgba(255,255,255,0.3)', fontWeight: a === age ? 'bold' : 'normal', transform: a === age ? 'scale(1.2)' : 'scale(1)', transition: 'all 0.1s ease-in-out' }}>
                  {a}
                </div>
              ))}
              <div style={{ height: `${itemHeight}px` }} />
            </div>
          )}
        </div>
        <p style={{ color: '#e6c598', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '30px' }}>세</p>

        <button onClick={handleNext}
          style={{ width: '100%', padding: '16px 0', backgroundColor: '#c49a6c', border: 'none', borderRadius: '8px', color: '#1a110b', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
          다음 →
        </button>
      </div>
    </div>
  );
};

export default AgePage;