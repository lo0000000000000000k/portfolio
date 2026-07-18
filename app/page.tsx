'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

import Loader         from '@/components/ui/Loader';
import NotebookSpine  from '@/components/ui/NotebookSpine';
import Navbar         from '@/components/layout/Navbar';
import Hero           from '@/components/sections/Hero';
import About          from '@/components/sections/About';
import Projects       from '@/components/sections/Projects';
import Certifications from '@/components/sections/Certifications';
import Contact        from '@/components/sections/Contact';
import NowSection     from '@/components/sections/Now';

const VibesBoard    = dynamic(() => import('@/components/sections/VibesBoard'),    { ssr: false });
const SpotifyPopup  = dynamic(() => import('@/components/ui/SpotifyPopup'),        { ssr: false });
const ReviewNote    = dynamic(() => import('@/components/sections/ReviewNote'),     { ssr: false });
const LanyardSection = dynamic(() => import('@/components/sections/LanyardSection'), { ssr: false });

/* ─────────────────────────────────────────────
   PAPER BACKGROUND — fixed decorations z-index:0
   (margin line + punched holes + tape only)
───────────────────────────────────────────── */
function PaperBackground() {
  return (
    <div
      aria-hidden="true"
      style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }}
    >
      {/* Red margin line — 3px, dark */}
      <div style={{
        position:'absolute', top:0, bottom:0, left:72,
        width:3,
        background:'rgba(180,60,60,0.5)',
      }} />

      {/* Punched holes — 22×22px */}
      {[20, 50, 80].map((pct) => (
        <div key={pct} style={{
          position:'absolute',
          left:10,
          top:`${pct}%`,
          transform:'translateY(-50%)',
          width:22, height:22,
          borderRadius:'50%',
          background:'rgba(240,232,219,0.6)',
          boxShadow:
            'inset 0 3px 7px rgba(0,0,0,0.45),' +
            'inset 0 0 0 1.5px rgba(0,0,0,0.2),' +
            '0 1px 2px rgba(255,255,255,0.6)',
          border:'1px solid rgba(0,0,0,0.18)',
        }} />
      ))}

      {/* Scotch tape — top */}
      <div style={{
        position:'absolute', top:72, left:'38%',
        width:64, height:18,
        background:'rgba(255,230,120,0.32)',
        borderRadius:2,
        transform:'rotate(-3deg)',
        boxShadow:'0 1px 2px rgba(0,0,0,0.06)',
        border:'0.5px solid rgba(200,180,60,0.15)',
      }} />

      {/* Scotch tape — bottom */}
      <div style={{
        position:'absolute', bottom:120, left:'62%',
        width:64, height:18,
        background:'rgba(255,230,120,0.32)',
        borderRadius:2,
        transform:'rotate(2deg)',
        boxShadow:'0 1px 2px rgba(0,0,0,0.06)',
        border:'0.5px solid rgba(200,180,60,0.15)',
      }} />

      {/* Paper vignette — gives notebook page depth without glow */}
      <div style={{
        position:'absolute', inset:0,
        background:
          'radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(180,160,130,0.12) 100%)',
        pointerEvents:'none',
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   STICKY NOTE — absolutely inside Hero area
   so it lives on page 1, not fixed to screen
───────────────────────────────────────────── */
function StickyNote() {
  return (
    <div
      aria-hidden="true"
      style={{
        position:'absolute',
        top:100, right:32,
        zIndex:4,
        pointerEvents:'none',
        width:152,
        background:'#fff9c4',
        padding:'10px 12px 12px',
        borderRadius:2,
        boxShadow:'2px 4px 10px rgba(0,0,0,0.14), -1px -1px 0 rgba(0,0,0,0.06)',
        transform:'rotate(1.5deg)',
        fontFamily:'"Courier New", Courier, monospace',
        fontSize:11,
        lineHeight:1.75,
        color:'#4a4030',
      }}
    >
      <div style={{ fontWeight:700, marginBottom:5, fontSize:10, letterSpacing:'0.06em', color:'#8a7a5a' }}>
        TODO ✏️
      </div>
      <div>☐ Ship portfolio</div>
      <div>☐ Touch grass</div>
      <div>☑ Drink coffee</div>
      <div>☐ Sleep (optional)</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DOODLE CANVAS — black + white pen colours
───────────────────────────────────────────── */
type DrawTool = 'pen' | 'eraser' | null;
type InkColor = 'black' | 'white';

function DoodleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool]       = useState<DrawTool>(null);
  const [inkColor, setInkColor] = useState<InkColor>('black');
  const drawing   = useRef(false);
  const lastPos   = useRef<{ x:number; y:number } | null>(null);

  /* Size canvas to viewport, preserve drawing on resize */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const ctx   = canvas.getContext('2d');
      const saved = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      if (saved) ctx?.putImageData(saved, 0, 0);
    };
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const getXY = (e: React.MouseEvent) => ({ x: e.clientX, y: e.clientY });

  const startDraw = useCallback((e: React.MouseEvent) => {
    if (!tool) return;
    drawing.current = true;
    lastPos.current = getXY(e);
  }, [tool]);

  const onDraw = useCallback((e: React.MouseEvent) => {
    if (!drawing.current || !tool || !lastPos.current) return;
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext('2d');
    if (!ctx) return;
    const pos = getXY(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);

    if (tool === 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = inkColor === 'black'
        ? 'rgba(42,30,14,0.55)'
        : 'rgba(255,255,255,0.85)';
      ctx.lineWidth = 1.5;
      ctx.lineCap   = 'round';
      ctx.lineJoin  = 'round';
    } else {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 24;
      ctx.lineCap   = 'round';
    }
    ctx.stroke();
    lastPos.current = pos;
  }, [tool, inkColor]);

  const stopDraw = useCallback(() => {
    drawing.current = false;
    lastPos.current = null;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.globalCompositeOperation = 'source-over';
  }, []);

  const clearAll = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext('2d');
    if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const btnBase: React.CSSProperties = {
    width:38, height:38,
    borderRadius:'50%',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:16,
    cursor:'pointer',
    transition:'all 0.18s ease',
    border:'1.5px solid rgba(42,30,14,0.2)',
    background:'rgba(247,242,232,0.92)',
    boxShadow:'0 2px 6px rgba(0,0,0,0.10)',
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position:'fixed', inset:0,
          zIndex:2,
          pointerEvents: tool ? 'all' : 'none',
          cursor: tool === 'pen' ? 'crosshair' : tool === 'eraser' ? 'cell' : 'default',
        }}
        onMouseDown={startDraw}
        onMouseMove={onDraw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
      />

      {/* Toolbar — always visible, always above everything */}
      <div style={{
        position:'fixed', bottom:24, right:24,
        zIndex:100,
        display:'flex', flexDirection:'column', gap:7,
        pointerEvents:'all',
      }}>

        {/* Pen */}
        <motion.button
          title="Pen"
          onClick={() => setTool(t => t === 'pen' ? null : 'pen')}
          whileHover={{ scale: 1.18, y: -2 }}
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          style={{
            ...btnBase,
            border: tool === 'pen' ? '2px solid rgba(42,30,14,0.7)' : btnBase.border,
            background: tool === 'pen' ? 'rgba(42,30,14,0.12)' : btnBase.background,
            boxShadow: tool === 'pen'
              ? '0 0 0 3px rgba(42,30,14,0.1), 0 4px 12px rgba(0,0,0,0.15)'
              : btnBase.boxShadow,
          }}
        >✏️</motion.button>

        {/* Ink colour toggle — only shows when pen active */}
        <AnimatePresence>
          {tool === 'pen' && (
            <motion.button
              key="color-toggle"
              initial={{ opacity: 0, scale: 0.7, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: -6 }}
              whileHover={{ scale: 1.1, y: -1 }}
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              title={`Switch to ${inkColor === 'black' ? 'white' : 'black'} ink`}
              onClick={() => setInkColor(c => c === 'black' ? 'white' : 'black')}
              style={{
                ...btnBase,
                border:'1.5px solid rgba(100,80,50,0.35)',
                background: inkColor === 'black' ? '#2a1e0e' : '#f5f0e8',
                color: inkColor === 'black' ? '#fff' : '#2a1e0e',
                fontSize:10,
                fontWeight:700,
                letterSpacing:'0.04em',
                fontFamily:'monospace',
                borderRadius:8,
                width:38, height:26,
              }}
            >
              {inkColor === 'black' ? '⬛ BLK' : '⬜ WHT'}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Eraser */}
        <motion.button
          title="Eraser"
          onClick={() => setTool(t => t === 'eraser' ? null : 'eraser')}
          whileHover={{ scale: 1.18, y: -2 }}
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          style={{
            ...btnBase,
            border: tool === 'eraser' ? '2px solid rgba(42,30,14,0.7)' : btnBase.border,
            background: tool === 'eraser' ? 'rgba(42,30,14,0.12)' : btnBase.background,
            boxShadow: tool === 'eraser'
              ? '0 0 0 3px rgba(42,30,14,0.1), 0 4px 12px rgba(0,0,0,0.15)'
              : btnBase.boxShadow,
          }}
        >🧹</motion.button>

        {/* Clear */}
        <motion.button
          title="Clear all doodles"
          onClick={clearAll}
          whileHover={{ scale: 1.18, rotate: -12, y: -2 }}
          whileTap={{ scale: 0.85, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 16 }}
          style={{
            ...btnBase,
            border:'1.5px solid rgba(180,60,60,0.35)',
          }}
        >🗑️</motion.button>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   HERO WRAPPER — contains sticky note absolutely
───────────────────────────────────────────── */
function HeroWithNote() {
  return (
    <div style={{ position:'relative' }}>
      <Hero />
      <StickyNote />
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Loader onComplete={() => setLoaded(true)} />

      {loaded && (
        <>
          {/* z-index 0 — flat paper decorations */}
          <PaperBackground />

          {/* z-index 2 — doodle canvas + toolbar */}
          <DoodleCanvas />

          <SpotifyPopup />
          <Navbar />

          {/* z-index 1 — all real content, notebook pages */}
          <main style={{ position:'relative', zIndex:1 }}>
            <HeroWithNote />
            <LanyardSection />
            <NotebookSpine />
            <About />
            <NotebookSpine />
            <Projects />
            <NotebookSpine />
            <NowSection />
            <NotebookSpine />
            <VibesBoard />
            <NotebookSpine />
            <Certifications />
            <NotebookSpine />
            <ReviewNote />
            <NotebookSpine />
            <Contact />
          </main>
        </>
      )}
    </>
  );
}
