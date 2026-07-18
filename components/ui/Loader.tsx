'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface LoaderProps {
  onComplete: () => void;
}

const BG      = '#0c0c18';
const PRIMARY = '#3f64ce';
const SKIN    = '#f1c5b4';

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible]   = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(prev + Math.random() * 4 + 1.5, 100);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setVisible(false);
            setTimeout(onComplete, 700);
          }, 800);
        }
        return next;
      });
    }, 280);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: BG,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* ── Scene ── */}
          <div className="wiz-scene">

            {/* Floating objects */}
            <div className="wiz-objects">
              <div className="wiz-square"   />
              <div className="wiz-circle"   />
              <div className="wiz-triangle" />
            </div>

            {/* Wizard */}
            <div className="wiz-wizard">
              <div className="wiz-body" />

              <div className="wiz-right-arm">
                <div className="wiz-right-hand" />
              </div>

              <div className="wiz-left-arm">
                <div className="wiz-left-hand" />
              </div>

              <div className="wiz-head">
                <div className="wiz-beard" />
                <div className="wiz-face">
                  <div className="wiz-adds" />
                </div>
                <div className="wiz-hat">
                  <div className="wiz-hat-of-the-hat" />
                  <div className="wiz-four-point-star wiz-star--first"  />
                  <div className="wiz-four-point-star wiz-star--second" />
                  <div className="wiz-four-point-star wiz-star--third"  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Progress bar ── */}
          <div className="wiz-progress-wrap">
            <div className="wiz-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          {/* ── Title ── */}
          <div style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.05rem',
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: 'rgba(154,179,245,0.7)',
            marginTop: '20px',
            userSelect: 'none',
          }}>
            abra cadabra
          </div>

          {/* ── Noise overlay ── */}
          <div className="wiz-noise" aria-hidden="true" />

          {/* ── All CSS ── */}
          <style>{`
            /* ─ Layout ─ */
            .wiz-scene   { display: flex; align-items: flex-end; }

            /* ─ Wizard ─ */
            .wiz-wizard  { position: relative; width: 190px; height: 240px; }

            .wiz-body {
              position: absolute; bottom: 0; left: 68px;
              height: 100px; width: 60px; background: ${PRIMARY};
            }
            .wiz-body::after {
              content: ""; position: absolute; bottom: 0; left: 20px;
              height: 100px; width: 60px; background: ${PRIMARY};
              transform: skewX(14deg);
            }

            /* Right arm */
            .wiz-right-arm {
              position: absolute; bottom: 74px; left: 110px;
              height: 44px; width: 90px;
              background: ${PRIMARY}; border-radius: 22px;
              transform-origin: 16px 22px; transform: rotate(70deg);
              animation: wiz_right_arm 10s ease-in-out infinite;
            }
            .wiz-right-hand {
              position: absolute; right: 8px; bottom: 8px;
              width: 30px; height: 30px; border-radius: 50%;
              background: ${SKIN};
              transform-origin: center center; transform: rotate(-40deg);
              animation: wiz_right_hand 10s ease-in-out infinite;
            }
            .wiz-right-hand::after {
              content: ""; position: absolute; right: 0; top: -8px;
              width: 15px; height: 30px; border-radius: 10px;
              background: ${SKIN};
              transform: translateY(16px);
              animation: wiz_right_finger 10s ease-in-out infinite;
            }

            /* Left arm */
            .wiz-left-arm {
              position: absolute; bottom: 74px; left: 26px;
              height: 44px; width: 70px;
              background: ${PRIMARY}; border-bottom-left-radius: 8px;
              transform-origin: 60px 26px; transform: rotate(-70deg);
              animation: wiz_left_arm 10s ease-in-out infinite;
            }
            .wiz-left-hand {
              position: absolute; left: -18px; top: 0;
              width: 18px; height: 30px;
              border-top-left-radius: 35px; border-bottom-left-radius: 35px;
              background: ${SKIN};
            }
            .wiz-left-hand::after {
              content: ""; position: absolute; right: 0; top: 0;
              width: 30px; height: 15px; border-radius: 20px;
              background: ${SKIN};
              transform-origin: right bottom; transform: scaleX(0);
              animation: wiz_left_finger 10s ease-in-out infinite;
            }

            /* Head */
            .wiz-head {
              position: absolute; top: 0; left: 14px;
              width: 160px; height: 210px;
              transform-origin: center center; transform: rotate(-3deg);
              animation: wiz_head 10s ease-in-out infinite;
            }
            .wiz-beard {
              position: absolute; bottom: 0; left: 38px;
              height: 106px; width: 80px;
              border-bottom-right-radius: 55%; background: ${BG};
            }
            .wiz-beard::after {
              content: ""; position: absolute; top: 16px; left: -10px;
              width: 40px; height: 20px; border-radius: 20px; background: ${BG};
            }
            .wiz-face {
              position: absolute; bottom: 76px; left: 38px;
              height: 30px; width: 60px; background: ${SKIN};
            }
            .wiz-face::before {
              content: ""; position: absolute; top: 0; left: 40px;
              width: 20px; height: 40px;
              border-bottom-right-radius: 20px; border-bottom-left-radius: 20px;
              background: ${SKIN};
            }
            .wiz-face::after {
              content: ""; position: absolute; top: 16px; left: -10px;
              width: 50px; height: 20px;
              border-radius: 20px; border-bottom-right-radius: 0;
              background: ${BG};
            }
            .wiz-adds {
              position: absolute; top: 0; left: -10px;
              width: 40px; height: 20px; border-radius: 20px; background: ${SKIN};
            }
            .wiz-adds::after {
              content: ""; position: absolute; top: 5px; left: 80px;
              width: 15px; height: 20px;
              border-bottom-right-radius: 20px; border-top-right-radius: 20px;
              background: ${SKIN};
            }

            /* Hat */
            .wiz-hat {
              position: absolute; bottom: 106px; left: 0;
              width: 160px; height: 20px;
              border-radius: 20px; background: ${PRIMARY};
            }
            .wiz-hat::before {
              content: ""; position: absolute; top: -70px; left: 50%;
              transform: translateX(-50%); width: 0; height: 0;
              border-style: solid; border-width: 0 34px 70px 50px;
              border-color: transparent transparent ${PRIMARY} transparent;
            }
            .wiz-hat::after {
              content: ""; position: absolute; top: 0; left: 0;
              width: 160px; height: 20px;
              background: ${PRIMARY}; border-radius: 20px;
            }
            .wiz-hat-of-the-hat {
              position: absolute; bottom: 78px; left: 79px;
              width: 0; height: 0; border-style: solid;
              border-width: 0 25px 25px 19px;
              border-color: transparent transparent ${PRIMARY} transparent;
            }
            .wiz-hat-of-the-hat::after {
              content: ""; position: absolute; top: 6px; left: -4px;
              width: 35px; height: 10px;
              border-radius: 10px; border-bottom-left-radius: 0;
              background: ${PRIMARY}; transform: rotate(40deg);
            }

            /* Stars on hat */
            .wiz-four-point-star { position: absolute; width: 12px; height: 12px; }
            .wiz-four-point-star::before,
            .wiz-four-point-star::after {
              content: ""; position: absolute; background: ${BG};
              display: block; left: 0; width: 141.4213%;
              top: 0; bottom: 0; border-radius: 10%;
              transform: rotate(66.66deg) skewX(45deg);
            }
            .wiz-four-point-star::after { transform: rotate(156.66deg) skew(45deg); }
            .wiz-star--first  { bottom: 28px; left: 46px; }
            .wiz-star--second { bottom: 40px; left: 80px; }
            .wiz-star--third  { bottom: 15px; left: 108px; }

            /* ─ Floating objects ─ */
            .wiz-objects { position: relative; width: 200px; height: 240px; }

            .wiz-square {
              position: absolute; bottom: -60px; left: -5px;
              width: 120px; height: 120px; border-radius: 50%;
              animation: wiz_path_square 10s ease-in-out infinite;
            }
            .wiz-square::after {
              content: ""; position: absolute; top: 10px; left: 0;
              width: 50px; height: 50px; background: #9ab3f5;
            }
            .wiz-circle {
              position: absolute; bottom: 10px; left: 0;
              width: 100px; height: 100px; border-radius: 50%;
              animation: wiz_path_circle 10s ease-in-out infinite;
            }
            .wiz-circle::after {
              content: ""; position: absolute; bottom: -10px; left: 25px;
              width: 50px; height: 50px; border-radius: 50%; background: #c56183;
            }
            .wiz-triangle {
              position: absolute; bottom: -62px; left: -10px;
              width: 110px; height: 110px; border-radius: 50%;
              animation: wiz_path_triangle 10s ease-in-out infinite;
            }
            .wiz-triangle::after {
              content: ""; position: absolute; top: 0; right: -10px;
              width: 0; height: 0; border-style: solid;
              border-width: 0 28px 48px 28px;
              border-color: transparent transparent #89beb3 transparent;
            }

            /* ─ Progress bar ─ */
            .wiz-progress-wrap {
              position: relative; margin-top: 56px;
              width: 360px; height: 5px;
              background: rgba(255,255,255,0.07); border-radius: 4px; overflow: hidden;
            }
            .wiz-progress-fill {
              position: absolute; top: 0; left: 0; height: 100%;
              background: linear-gradient(90deg, ${PRIMARY}, #9ab3f5, #89beb3);
              border-radius: 4px; transition: width 0.18s linear;
            }

            /* ─ Noise ─ */
            .wiz-noise {
              position: absolute; top: 50%; left: 50%;
              transform: translate(-50%, -50%);
              width: 100%; height: 100%; z-index: 10; pointer-events: none;
              opacity: 0.025;
              background-image: url(data:image/png;base64,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);
            }

            /* ─ Keyframes ─ */
            @keyframes wiz_right_arm {
              0%  { transform: rotate(70deg); }
              10% { transform: rotate(8deg); }
              15% { transform: rotate(20deg); }
              20% { transform: rotate(10deg); }
              25% { transform: rotate(26deg); }
              30% { transform: rotate(10deg); }
              35% { transform: rotate(28deg); }
              40% { transform: rotate(9deg); }
              45% { transform: rotate(28deg); }
              50% { transform: rotate(8deg); }
              58% { transform: rotate(74deg); }
              62% { transform: rotate(70deg); }
            }
            @keyframes wiz_left_arm {
              0%  { transform: rotate(-70deg); }
              10% { transform: rotate(6deg); }
              15% { transform: rotate(-18deg); }
              20% { transform: rotate(5deg); }
              25% { transform: rotate(-18deg); }
              30% { transform: rotate(5deg); }
              35% { transform: rotate(-17deg); }
              40% { transform: rotate(5deg); }
              45% { transform: rotate(-18deg); }
              50% { transform: rotate(6deg); }
              58% { transform: rotate(-74deg); }
              62% { transform: rotate(-70deg); }
            }
            @keyframes wiz_right_hand {
              0%  { transform: rotate(-40deg); }
              10% { transform: rotate(-20deg); }
              15% { transform: rotate(-5deg); }
              20% { transform: rotate(-60deg); }
              25% { transform: rotate(0deg); }
              30% { transform: rotate(-60deg); }
              35% { transform: rotate(0deg); }
              40% { transform: rotate(-40deg); }
              45% { transform: rotate(-60deg); }
              50% { transform: rotate(10deg); }
              60% { transform: rotate(-40deg); }
            }
            @keyframes wiz_right_finger {
              0%  { transform: translateY(16px); }
              10% { transform: none; }
              50% { transform: none; }
              60% { transform: translateY(16px); }
            }
            @keyframes wiz_left_finger {
              0%  { transform: scaleX(0); }
              10% { transform: scaleX(1) rotate(6deg); }
              15% { transform: scaleX(1) rotate(0deg); }
              20% { transform: scaleX(1) rotate(8deg); }
              25% { transform: scaleX(1) rotate(0deg); }
              30% { transform: scaleX(1) rotate(7deg); }
              35% { transform: scaleX(1) rotate(0deg); }
              40% { transform: scaleX(1) rotate(5deg); }
              45% { transform: scaleX(1) rotate(0deg); }
              50% { transform: scaleX(1) rotate(6deg); }
              58% { transform: scaleX(0); }
            }
            @keyframes wiz_head {
              0%  { transform: rotate(-3deg); }
              10% { transform: translateX(10px) rotate(7deg); }
              50% { transform: translateX(0px) rotate(0deg); }
              56% { transform: rotate(-3deg); }
            }
            @keyframes wiz_path_circle {
              0%  { transform: translateY(0); }
              10% { transform: translateY(-100px) rotate(-5deg); }
              55% { transform: translateY(-100px) rotate(-360deg); }
              58% { transform: translateY(-100px) rotate(-360deg); }
              63% { transform: rotate(-360deg); }
            }
            @keyframes wiz_path_square {
              0%  { transform: translateY(0); }
              10% { transform: translateY(-155px) translateX(-15px) rotate(10deg); }
              55% { transform: translateY(-155px) translateX(-15px) rotate(-350deg); }
              57% { transform: translateY(-155px) translateX(-15px) rotate(-350deg); }
              63% { transform: rotate(-360deg); }
            }
            @keyframes wiz_path_triangle {
              0%  { transform: translateY(0); }
              10% { transform: translateY(-172px) translateX(10px) rotate(-10deg); }
              55% { transform: translateY(-172px) translateX(10px) rotate(-365deg); }
              58% { transform: translateY(-172px) translateX(10px) rotate(-365deg); }
              63% { transform: rotate(-360deg); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
