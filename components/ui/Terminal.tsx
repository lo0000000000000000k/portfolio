'use client';
import { useState, useRef, useCallback, useEffect, memo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { PROJECTS } from '@/lib/data';

type TState = 'sleeping' | 'rising' | 'open' | 'angry';
type Mood = 'normal' | 'curious' | 'caught';
interface HistoryEntry { type: 'input' | 'output' | 'error'; text: string; }

const COMMANDS: Record<string, () => string[]> = {
  help: () => ['  <span style="color:#00d4ff">Commands:</span> about · skills · projects · chess · contact · spotify · clear'],
  about: () => ['  <span style="color:#9b59ff">Harshit Malik</span> — AI/ML Dev @ Sharda University', '  500+ DSA · Chess ♟ · ML builder 🤖'],
  skills: () => ['  <span style="color:#00d4ff">Lang:</span> Python · C++ · Java · SQL', '  <span style="color:#9b59ff">ML:</span> TensorFlow · YOLO · NumPy · Pandas'],
  projects: () => PROJECTS.map((p, i) => `  <span style="color:#00ffcc">${i + 1}. ${p.name}</span>`),
  chess: () => ["  ♟ Rating: 1450 Blitz"],
  contact: () => ['  <span style="color:#00d4ff">Email:</span> teddywhiff@gmail.com'],
  spotify: () => ['  <span style="color:#1db954">♫</span> Blinding Lights — The Weeknd'],
  clear: () => [],
};

/* ── Floating ZZZ (no bubble, freely around the strip) ── */
function FloatingZzz() {
  const zs = [
    { left: '15%', size: 28, delay: 0,   dur: 2.0 },
    { left: '35%', size: 20, delay: 0.7, dur: 2.4 },
    { left: '58%', size: 32, delay: 0.3, dur: 1.8 },
    { left: '75%', size: 18, delay: 1.1, dur: 2.6 },
    { left: '88%', size: 24, delay: 0.5, dur: 2.2 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 55, overflow: 'visible' }}>
      {zs.map((z, i) => (
        <motion.span key={i}
          className="absolute font-syne font-black select-none"
          style={{ left: z.left, bottom: 44, fontSize: z.size, color: '#FFD54F', textShadow: '0 0 10px #FF8F0099', lineHeight: 1 }}
          animate={{ y: [0, -50, -90], opacity: [0, 1, 0], rotate: [0, 10, -5] }}
          transition={{ repeat: Infinity, duration: z.dur, delay: z.delay, ease: 'easeOut' }}
        >z</motion.span>
      ))}
    </div>
  );
}

/* ── Angry Popups — BIG, outside, no cloud ── */
function AngryPopups() {
  const items = [
    { char: '?!', x: -70,  y: -40, size: 48, delay: 0,    rot: -20 },
    { char: '?!', x: 530,  y: -35, size: 42, delay: 0.12, rot: 15 },
    { char: '👀', x: -65,  y: 10,  size: 40, delay: 0.22, rot: 0 },
    { char: '?!', x: 510,  y: 15,  size: 52, delay: 0.08, rot: -12 },
    { char: '👀', x: 495,  y: -60, size: 36, delay: 0.30, rot: 5 },
    { char: '?!', x: -50,  y: -70, size: 36, delay: 0.18, rot: 18 },
  ];
  return (
    <div className="absolute pointer-events-none" style={{ inset: 0, zIndex: 60, overflow: 'visible' }}>
      {items.map((s, i) => (
        <motion.span key={i}
          className="absolute font-syne font-black select-none leading-none"
          style={{
            left: s.x, top: s.y, fontSize: s.size,
            color: s.char === '👀' ? undefined : '#EF4444',
            textShadow: s.char !== '👀' ? '0 0 20px #EF444466' : '0 0 10px rgba(0,0,0,0.3)',
          }}
          initial={{ scale: 0, opacity: 0, rotate: s.rot }}
          animate={{ scale: [0, 1.5, 1.2, 1.4, 1.2], opacity: [0, 1, 1, 1, 0.9] }}
          transition={{ delay: s.delay, duration: 0.5, repeat: Infinity, repeatDelay: 1.5, ease: 'backOut' }}
        >{s.char}</motion.span>
      ))}
    </div>
  );
}

/* ── Text-only Manga Bubble (no face, no emoji) ── */
function TextBubble({ text, lean = 0, shiftX = 0, borderColor = '#0d1b3e', noteFloat = false }:
  { text: string; lean?: number; shiftX?: number; borderColor?: string; noteFloat?: boolean }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ bottom: '100%', left: '50%', marginBottom: 14, zIndex: 52 }}
      animate={{ x: `calc(-50% + ${shiftX}px)`, rotate: lean }}
      transition={{ type: 'spring', stiffness: 160, damping: 20 }}
    >
      <div className="relative flex flex-col items-center">
        <motion.div
          className="relative px-5 py-2.5 rounded-2xl font-grotesk font-bold whitespace-nowrap text-sm"
          style={{
            background: 'rgba(255,255,255,0.97)',
            border: `2px solid ${borderColor}`,
            color: borderColor,
            boxShadow: `0 4px 24px ${borderColor}33, 0 0 0 3px rgba(255,255,255,0.06)`,
          }}
        >
          {text}
          {/* Floating music notes when "caught" / whistling */}
          {noteFloat && [0, 1, 2].map((i) => (
            <motion.span key={i}
              className="absolute font-normal"
              style={{ right: -14 - i * 8, top: -10 - i * 5, fontSize: 12 + i * 2, color: borderColor }}
              animate={{ opacity: [0, 1, 0], y: [0, -12, -20], x: [0, i * 3, i * 5] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.3 }}
            >♪</motion.span>
          ))}
        </motion.div>
        {/* Tail */}
        <div style={{ width: 0, height: 0, borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderTop: `10px solid ${borderColor}`, marginTop: -1 }} />
        <div style={{ width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '8px solid rgba(255,255,255,0.97)', marginTop: -10 }} />
      </div>
    </motion.div>
  );
}

/* ── Main Terminal ── */
const Terminal = memo(function Terminal() {
  const [tState, setTState] = useState<TState>('sleeping');
  const [mood, setMood] = useState<Mood>('normal');
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', text: '  Welcome to <span style="color:#00d4ff">harshit.dev</span> terminal' },
    { type: 'output', text: '  Type <span style="color:#00ffcc">help</span> for commands.' },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerCtrl = useAnimation();
  const shakeCtrl = useAnimation();
  const isHoveredRef = useRef(false);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);
  useEffect(() => { if (tState === 'open') setTimeout(() => inputRef.current?.focus(), 400); }, [tState]);

  const clearIdle = () => { if (idleRef.current) clearTimeout(idleRef.current); };
  const clearTyping = () => { if (typingRef.current) clearTimeout(typingRef.current); };

  const goSleep = useCallback(async () => {
    clearIdle(); clearTyping(); setMood('normal');
    await containerCtrl.start({ height: 48, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } });
    setTState('sleeping');
  }, [containerCtrl]);

  const goAngry = useCallback(async () => {
    clearIdle(); clearTyping(); setMood('normal');
    setTState('angry');
    await shakeCtrl.start({ x: [0, -8, 8, -6, 6, -4, 4, -2, 2, 0], transition: { duration: 0.7 } });
    await new Promise(r => setTimeout(r, 1100));
    await goSleep();
  }, [shakeCtrl, goSleep]);

  const startIdleTimer = useCallback(() => {
    clearIdle();
    idleRef.current = setTimeout(() => goAngry(), 8000);
  }, [goAngry]);

  const resetIdle = useCallback(() => { if (tState === 'open') startIdleTimer(); }, [tState, startIdleTimer]);

  const setCurious = useCallback(() => {
    if (tState !== 'open') return;
    setMood(isHoveredRef.current ? 'caught' : 'curious');
    clearTyping();
    typingRef.current = setTimeout(() => setMood('normal'), 2500);
  }, [tState]);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    setMood(prev => {
      if (prev === 'curious') {
        clearTyping();
        typingRef.current = setTimeout(() => setMood('normal'), 2000);
        return 'caught';
      }
      return prev;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    clearTyping();
    typingRef.current = setTimeout(() => setMood('normal'), 800);
  }, []);

  const handleClick = useCallback(async () => {
    if (tState !== 'sleeping') return;
    setTState('rising');
    await shakeCtrl.start({ x: [0, -3, 3, -2, 2, 0], transition: { duration: 0.25 } });
    await containerCtrl.start({ height: 290, transition: { type: 'spring', stiffness: 130, damping: 16, mass: 1.1 } });
    setTState('open');
    startIdleTimer();
  }, [tState, shakeCtrl, containerCtrl, startIdleTimer]);

  const runCommand = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    const entries: HistoryEntry[] = [{ type: 'input', text: `guest@harshit.dev:~$ ${raw}` }];
    if (cmd === 'clear') { setHistory([]); setCmdHistory(h => [raw, ...h]); setHistIdx(-1); return; }
    const fn = COMMANDS[cmd];
    if (fn) fn().forEach(l => entries.push({ type: 'output', text: l }));
    else entries.push({ type: 'error', text: `  bash: ${cmd}: not found — try <span style="color:#00ffcc">help</span>` });
    setHistory(h => [...h, ...entries]);
    setCmdHistory(h => [raw, ...h]);
    setHistIdx(-1);
  }, []);

  const handleKey = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    resetIdle(); setCurious();
    if (e.key === 'Enter') { runCommand(input); setInput(''); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); const n = Math.min(histIdx + 1, cmdHistory.length - 1); setHistIdx(n); setInput(cmdHistory[n] ?? ''); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); const n = Math.max(histIdx - 1, -1); setHistIdx(n); setInput(n === -1 ? '' : cmdHistory[n]); }
  }, [resetIdle, setCurious, runCommand, input, histIdx, cmdHistory]);

  const isSleeping = tState === 'sleeping';
  const isOpen = tState === 'open';

  return (
    <div className="relative w-full max-w-[580px] flex flex-col items-center">

      {/* ── Bubble — only for rising / curious / caught ── */}
      <div className="relative w-full" style={{ height: 0 }}>
        <AnimatePresence mode="wait">
          {tState === 'rising' && (
            <motion.div key="rising" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.2 }}>
              <TextBubble text="wassup?" borderColor="#0d1b3e" />
            </motion.div>
          )}
          {isOpen && mood === 'curious' && (
            <motion.div key="curious" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <TextBubble text="hmm... lemme see" lean={-16} shiftX={-10} borderColor="#1565C0" />
            </motion.div>
          )}
          {isOpen && mood === 'caught' && (
            <motion.div key="caught" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <TextBubble text="lalalala~" lean={10} shiftX={8} borderColor="#E65100" noteFloat />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Terminal box ── */}
      <motion.div
        animate={containerCtrl}
        initial={{ height: 48 }}
        onClick={isSleeping ? handleClick : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-full rounded-xl"
        style={{
          background: 'rgba(6,10,20,0.62)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${isSleeping ? 'rgba(255,143,0,0.4)' : tState === 'angry' ? 'rgba(239,68,68,0.6)' : mood === 'curious' ? 'rgba(21,101,192,0.45)' : mood === 'caught' ? 'rgba(230,81,0,0.45)' : 'rgba(0,212,255,0.22)'}`,
          boxShadow: tState === 'angry' ? '0 0 50px rgba(239,68,68,0.18)' : isSleeping ? '0 0 24px rgba(255,143,0,0.09)' : '0 0 40px rgba(0,212,255,0.07)',
          cursor: isSleeping ? 'pointer' : 'default',
          transition: 'border-color 0.3s, box-shadow 0.3s',
          overflow: 'visible',
        }}
      >
        {/* ZZZ — free floating when sleeping */}
        <AnimatePresence>{isSleeping && <FloatingZzz />}</AnimatePresence>
        {/* Angry popups — outside, no cloud */}
        <AnimatePresence>{tState === 'angry' && <AngryPopups />}</AnimatePresence>

        <motion.div animate={shakeCtrl} className="flex flex-col" style={{ borderRadius: 12, overflow: 'hidden', height: '100%' }}>
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 h-12 flex-shrink-0 select-none"
            style={{ background:'rgba(255,255,255,0.03)', borderBottom:isOpen?'1px solid rgba(255,255,255,0.08)':'none' }}>
            <button onClick={e=>{ e.stopPropagation(); if(isOpen) goAngry(); }}
              className="w-3 h-3 rounded-full" style={{background:isOpen?'#ff5f57':'#555'}}/>
            <div className="w-3 h-3 rounded-full" style={{background:isOpen?'#febc2e':'#555'}}/>
            <div className="w-3 h-3 rounded-full" style={{background:isOpen?'#28c840':'#555'}}/>
            <span className="ml-2 font-jetbrains text-[0.65rem] tracking-[0.15em] flex-1" style={{color:'rgba(245,237,224,0.4)'}}>bash — harshit.dev</span>
            {/* Blinking red ▶ when angry */}
            {tState === 'angry' && (
              <motion.span className="font-jetbrains text-base font-black" style={{ color: '#EF4444' }}
                animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.35 }}>▶</motion.span>
            )}
            {isSleeping && (
              <motion.span className="font-jetbrains text-[0.58rem] tracking-[0.12em]" style={{ color: '#FF8F00' }}
                animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.8 }}>click to wake</motion.span>
            )}
          </div>

          {/* Body */}
          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5 font-jetbrains text-[0.72rem] leading-relaxed"
                  style={{minHeight:0, color:'#d4c5b0'}}
                  onClick={()=>{inputRef.current?.focus();resetIdle();}}>
                  {history.map((h, i) => (
                    <div key={i}
                      style={{color: h.type==='input'?'#e8924f': h.type==='error'?'#f87171':'#d4c5b0'}}
                      dangerouslySetInnerHTML={{__html:h.text}}/>
                  ))}
                  <div ref={bottomRef} />
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 font-jetbrains text-[0.72rem] flex-shrink-0"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{color:'#e8924f'}}>guest@harshit.dev:~$</span>
                  <input ref={inputRef} value={input}
                    onChange={e=>{setInput(e.target.value);resetIdle();setCurious();}}
                    onKeyDown={handleKey} onClick={resetIdle}
                    spellCheck={false} className="flex-1 bg-transparent outline-none caret-[#e8924f]"
                    style={{color:'#f5ede0'}} aria-label="Terminal input"/>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
});

export default Terminal;
