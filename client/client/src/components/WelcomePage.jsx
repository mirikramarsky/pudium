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
          {showWord1&&<span style={{ display: 'inline-block', animation: 'slideLoop 5s infinite 1.5s' }}>במה</span>}
          {showWord2&&<span style={{ display: 'inline-block', animation: 'slideLoop 5s infinite 2s' }}>לכל</span>}
          {showWord3&&<span style={{ display: 'inline-block', animation: 'slideLoop 5s infinite 2.5s' }}>אחת</span>}
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
// import React, { useEffect, useState } from 'react';
// import Confetti from 'react-confetti';
// import { useWindowSize } from 'react-use';
// import { useNavigate } from 'react-router-dom';

// export default function WelcomePage() {
//   const { width, height } = useWindowSize();
//   const navigate = useNavigate();

//   const [showTitle, setShowTitle] = useState(false);
//   const [showSubtitle, setShowSubtitle] = useState(false);
//   const [showButton, setShowButton] = useState(false);

//   useEffect(() => {
//     const timer1 = setTimeout(() => setShowTitle(true), 500);
//     const timer2 = setTimeout(() => setShowSubtitle(true), 1500);
//     const timer3 = setTimeout(() => setShowButton(true), 2500);

//     return () => {
//       clearTimeout(timer1);
//       clearTimeout(timer2);
//       clearTimeout(timer3);
//     };
//   }, []);

//   return (
//     <div
//       style={{
//         height: '100vh',
//         width: '100%',
//         position: 'relative',
//         overflow: 'hidden',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         flexDirection: 'column',
//         color: 'white',
//         textAlign: 'center',
//       }}
//     >
//       <Confetti width={width} height={height} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }} />

//       <div style={{ zIndex: 1 }}>
//         {showTitle && (
//           <h1
//             style={{
//               fontSize: '6rem',
//               margin: 0,
//               fontWeight: 'bold',
//               fontFamily: 'Varela Round, sans-serif',
//               animation: 'slideIn 2s infinite linear',
//               whiteSpace: 'nowrap',
//             }}
//           >
//             פודיום
//           </h1>
//         )}

//         {showSubtitle && (
//           <p
//             style={{
//               fontSize: '2rem',
//               marginTop: '1rem',
//               fontFamily: 'Varela Round, sans-serif',
//               animation: 'slideIn 2s infinite linear',
//               whiteSpace: 'nowrap',
//             }}
//           >
//             במה לכל אחת
//           </p>
//         )}

//         {showButton && (
//           <button
//             style={{
//               marginTop: '2rem',
//               padding: '0.8rem 1.5rem',
//               fontSize: '1.2rem',
//               backgroundColor: '#de779f',
//               color: 'white',
//               border: 'none',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               transition: 'background-color 0.3s, transform 0.3s',
//             }}
//             onClick={() => navigate('/school-id')}
//           >
//             התחילי בהקשת קוד מוסד
//           </button>
//         )}
//       </div>

//       {/* אנימציה בסיסית ב-CSS */}
//       <style>
//         {`
//           @keyframes slideIn {
//             0% { transform: translateX(100vw); opacity: 0; }
//             20% { opacity: 1; }
//             80% { opacity: 1; }
//             100% { transform: translateX(-100vw); opacity: 0; }
//           }
//         `}
//       </style>
//     </div>
//   );
// // }
// import React, { useEffect, useState } from 'react';
// import Confetti from 'react-confetti';
// import { useWindowSize } from 'react-use';
// import { useNavigate } from 'react-router-dom';

// export default function WelcomePage() {
//   const { width, height } = useWindowSize();
//   const navigate = useNavigate();

//   const [showPodium, setShowPodium] = useState(false);
//   const [showWord1, setShowWord1] = useState(false);
//   const [showWord2, setShowWord2] = useState(false);
//   const [showWord3, setShowWord3] = useState(false);

//   useEffect(() => {
//     const loop = () => {
//       setShowPodium(true);
//       const t1 = setTimeout(() => setShowPodium(false), 500);
//       const t2 = setTimeout(() => setShowWord1(true), 1000);
//       const t3 = setTimeout(() => setShowWord2(true), 1500);
//       const t4 = setTimeout(() => setShowWord3(true), 2000);

//       const t5 = setTimeout(() => {
//         setShowPodium(false);
//         setShowWord1(false);
//         setShowWord2(false);
//         setShowWord3(false);
//       }, 5000);

//       const total = setTimeout(() => loop(), 8000);

//       return () => {
//         clearTimeout(t1);
//         clearTimeout(t2);
//         clearTimeout(t3);
//         clearTimeout(t4);
//         clearTimeout(t5);
//         clearTimeout(total);
//       };
//     };

//     const clear = loop();
//     return clear;
//   }, []);

//   return (
//     <div
//       style={{
//         height: '100vh',
//         width: '100%',
//         position: 'relative',
//         overflow: 'hidden',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         flexDirection: 'column',
//         color: 'white',
//         textAlign: 'center',
//       }}
//     >
//       <Confetti width={width} height={height} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }} />

//       <div style={{ zIndex: 1 }}>
//         {showPodium && (
//           <h1 className="animated-word big">פודיום</h1>
//         )}

//         <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center' }}>
//           {showWord1 && <span className="animated-word small">במה</span>}
//           {showWord2 && <span className="animated-word small">לכל</span>}
//           {showWord3 && <span className="animated-word small">אחת</span>}
//         </div>

//         <button
//           style={{
//             marginTop: '3rem',
//             padding: '0.8rem 1.5rem',
//             fontSize: '1.2rem',
//             backgroundColor: '#de779f',
//             color: 'white',
//             border: 'none',
//             borderRadius: '8px',
//             cursor: 'pointer',
//             transition: 'background-color 0.3s, transform 0.3s',
//           }}
//           onClick={() => navigate('/school-id')}
//         >
//           התחילי בהקשת קוד מוסד
//         </button>
//       </div>

//       <style>
//         {`
//           .animated-word {
//             animation: slideInOut 5s forwards;
//             display: inline-block;
//             white-space: nowrap;
//           }

//           .big {
//             font-size: 6rem;
//             font-family: 'Varela Round', sans-serif;
//             font-weight: bold;
//           }

//           .small {
//             font-size: 2rem;
//             font-family: 'Varela Round', sans-serif;
//           }

//           @keyframes slideInOut {
//             0% { transform: translateX(100vw); opacity: 0; }
//             10% { opacity: 1; transform: translateX(0); }
//             90% { opacity: 1; transform: translateX(0); }
//             100% { transform: translateX(-100vw); opacity: 0; }
//           }
//         `}
//       </style>
//     </div>
//   );
// }
