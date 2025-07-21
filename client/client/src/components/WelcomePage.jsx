import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const { width, height } = useWindowSize();
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);
  // const [showPodium, setShowPodium] = useState(false);
  const [showWord1, setShowWord1] = useState(false);
  const [showWord2, setShowWord2] = useState(false);
  const [showWord3, setShowWord3] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 2500);
    const Word1 = setTimeout(() => {
      setShowWord1(true);
    }, 1000);
    const Word2 = setTimeout(() => {
      setShowWord2(true);
    }, 1500);
    const Word3 = setTimeout(() => {
      setShowWord3(true);
    }, 2000);
    return () => {
      clearTimeout(timer);
      clearTimeout(Word1);
      clearTimeout(Word2);
      clearTimeout(Word3);
    };
  }, []);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && showButton) {
        navigate('/school-id');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showButton, navigate]);

  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <Confetti width={width} height={height} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }} />

      <div style={{ zIndex: 1 }}>

        {/* טקסט פודיום בלולאה */}
        <h1
          style={{
            fontSize: '6rem',
            margin: 0,
            fontWeight: 'bold',
            fontFamily: 'Varela Round, sans-serif',
            animation: 'slideLoop 5s infinite',
            display: 'inline-block',
          }}
        >
          פודיום
        </h1>

        {/* שלוש המילים בשורה אחת בלולאה */}
        <div style={{ marginTop: '2rem', fontSize: '2rem', fontFamily: 'Varela Round, sans-serif', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          {showWord1 && <span style={{ display: 'inline-block', animation: 'slideLoop 5s infinite 1.5s' }}>במה</span>}
          {showWord2 && <span style={{ display: 'inline-block', animation: 'slideLoop 5s infinite 2s' }}>לכל</span>}
          {showWord3 && <span style={{ display: 'inline-block', animation: 'slideLoop 5s infinite 2.5s' }}>אחת</span>}
        </div>

        {/* כפתור - נכנס פעם אחת ונשאר */}
        {showButton && (
          <button
            style={{
              marginTop: '2rem',
              padding: '0.8rem 1.5rem',
              fontSize: '1.2rem',
              backgroundColor: '#de779f',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transform: 'translateX(0)',
              animation: 'slideInOnce 1s forwards',
              transition: 'background-color 0.3s, transform 0.3s',
            }}
            onClick={() => navigate('/school-id')}
          >
            התחילי בהקשת קוד מוסד
          </button>
        )}
      </div>

      {/* אנימציות CSS */}
      <style>
        {`
          @keyframes slideLoop {
            0% { transform: translateX(100vw); opacity: 0; }
            20% { transform: translateX(0); opacity: 1; }
            80% { transform: translateX(0); opacity: 1; }
            100% { transform: translateX(-100vw); opacity: 0; }
          }

          @keyframes slideInOnce {
            from { transform: translateX(100vw); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}