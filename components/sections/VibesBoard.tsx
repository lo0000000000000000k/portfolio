'use client';
import { useState, useRef, memo, useCallback, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';

interface Card {
  id: string; emoji: string; category: string;
  front: string; back: string;
  color: string; pin: string; rotate: number; size: 'sm'|'md'|'lg';
  image?: string;
}
const CARDS: Card[] = [
  { id:'food',     emoji:'🍕', category:'Food Obsession',     front:'Chole Bhature 🫶',          back:'What are you eating too much of?',  color:'#e8924f', pin:'#8b5cf6', rotate:2,  size:'sm', image:'/chole-bhature.png' },
  { id:'watching', emoji:'📺', category:'Watching',           front:'The Mentalist',             back:'Anime? Series? Let me know!',       color:'#8b5cf6', pin:'#14b8a6', rotate:-1, size:'md', image:'/the-mentalist.jpg' },
  { id:'travel',   emoji:'✈️', category:'Wanna Go',           front:'Switzerland 🏔️',            back:'Where do you want to go next?',    color:'#14b8a6', pin:'#f43f5e', rotate:3,  size:'sm', image:'/switzerland.jpg' },
  { id:'shower',   emoji:'💭', category:'Shower Thought',     front:'',                          back:"What's on your mind at 3am?",      color:'#f43f5e', pin:'#e8924f', rotate:-2, size:'lg', image:'/thinker.jpg' },
  { id:'game',     emoji:'🎮', category:'Playing',            front:'Black Myth: Wukong 🐒',     back:'What game has you hooked?',        color:'#ec4899', pin:'#8b5cf6', rotate:1,  size:'sm', image:'/black-myth.jpg' },
  { id:'reading',  emoji:'📖', category:'Reading (non-tech)', front:'A Song of Ice and Fire 🐉',  back:"Any non-tech book you're reading?", color:'#d97706', pin:'#ec4899', rotate:2,  size:'sm', image:'/books.jpg' },
];
const POSITIONS: [number,number][] = [
  [12,48],[262,18],[528,38],
  [60,310],[340,290],[620,305],
];

/* ── Cartoon Arm SVG (white glove + sleeve) ── */
function ArmSVG({ mirrored }: { mirrored?: boolean }) {
  return (
    <svg width="54" height="92" viewBox="0 0 54 92" fill="none"
      style={{ display:'block', transform: mirrored ? 'scaleX(-1)' : undefined }}>
      {/* Sleeve */}
      <rect x="17" y="0" width="20" height="52" rx="10" fill="white" stroke="#1c1108" strokeWidth="2.5"/>
      {/* Wrist cuff */}
      <rect x="13" y="44" width="28" height="10" rx="5" fill="#f0e4d0" stroke="#1c1108" strokeWidth="2"/>
      {/* Fist */}
      <ellipse cx="27" cy="70" rx="19" ry="16" fill="white" stroke="#1c1108" strokeWidth="2.5"/>
      {/* Thumb */}
      <ellipse cx="9" cy="69" rx="7.5" ry="9" fill="white" stroke="#1c1108" strokeWidth="2" transform="rotate(-18 9 69)"/>
      {/* Knuckle lines */}
      <line x1="21" y1="61" x2="20" y2="76" stroke="#1c1108" strokeWidth="1.7" strokeLinecap="round"/>
      <line x1="27" y1="59" x2="26" y2="77" stroke="#1c1108" strokeWidth="1.7" strokeLinecap="round"/>
      <line x1="33" y1="61" x2="32" y2="76" stroke="#1c1108" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Cartoon Leg SVG ── */
function LegSVG({ mirrored }: { mirrored?: boolean }) {
  return (
    <svg width="52" height="90" viewBox="0 0 52 90" fill="none"
      style={{ display:'block', transform: mirrored ? 'scaleX(-1)' : undefined }}>
      <rect x="15" y="0" width="22" height="52" rx="11" fill="white" stroke="#1c1108" strokeWidth="2.5"/>
      <rect x="17" y="48" width="18" height="10" rx="4" fill="#555" stroke="#1c1108" strokeWidth="2"/>
      <ellipse cx="26" cy="77" rx="23" ry="13" fill="#222" stroke="#1c1108" strokeWidth="2.2"/>
      <ellipse cx="37" cy="74" rx="9" ry="6.5" fill="#333" stroke="#1c1108" strokeWidth="1.5"/>
      <ellipse cx="19" cy="71" rx="7" ry="4" fill="white" opacity="0.15"/>
    </svg>
  );
}

/* ── Sweat drops ── */
const SWEAT_POSITIONS = [
  [-30,-20],[900,30],[-20,120],[920,200],
  [100,-30],[820,-20],[200,520],[700,520],
  [50,260],[870,280],
];
function SweatDrops({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && SWEAT_POSITIONS.map(([x,y],i) => (
        <motion.div key={i}
          className="absolute pointer-events-none select-none z-20"
          style={{ left:x, top:y }}
          initial={{ opacity:0, scale:0.4, y:0 }}
          animate={{ opacity:[0,1,1,0], scale:[0.4,1,1,0.6], y:[0,-18,-18,-30] }}
          exit={{ opacity:0 }}
          transition={{ duration:0.9, delay:i*0.08, repeat:Infinity, repeatDelay:0.3 }}
        >
          <svg width="18" height="24" viewBox="0 0 18 24" fill="none">
            <path d="M9 0 C9 0 0 10 0 15 A9 9 0 0 0 18 15 C18 10 9 0 9 0Z" fill="#60b8f0" opacity="0.85"/>
            <ellipse cx="6" cy="14" rx="2.5" ry="4" fill="white" opacity="0.35"/>
          </svg>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

/* ── Angry burst symbols ── */
const ANGRY_SPOTS = [[-10,60],[890,60],[-10,380],[890,380],[250,-25],[650,-25],[250,510],[650,510]];
function AngryBurst({ active }: { active: boolean }) {
  const symbols = ['?!','!!','?!','!!','?!','!!','!?','!!'];
  return (
    <AnimatePresence>
      {active && ANGRY_SPOTS.map(([x,y],i) => (
        <motion.div key={i}
          className="absolute pointer-events-none select-none z-30 font-syne font-black"
          style={{ left:x, top:y, color:'#ef4444', fontSize:i%2===0?'1.3rem':'1rem', textShadow:'0 0 8px #ef444488' }}
          initial={{ scale:0, opacity:0, rotate: i%2===0?-15:15 }}
          animate={{ scale:[0,1.4,1], opacity:[0,1,1], rotate: i%2===0?-10:10 }}
          exit={{ scale:0, opacity:0 }}
          transition={{ type:'spring', stiffness:400, damping:15, delay:i*0.05 }}
        >
          {symbols[i]}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

/* ── Draggable arm ── */
function DraggableArm({
  mirrored, top, left, right, onStretchEnd,
}: { mirrored?:boolean; top:number; left?:number|string; right?:number|string; onStretchEnd:()=>void }) {
  const [stretching, setStretching] = useState(false);
  const distRef = useRef(0);
  const ax = useMotionValue(0);
  const ay = useMotionValue(0);

  const onDrag = useCallback((_:unknown, info: { offset: { x:number; y:number } }) => {
    const d = Math.sqrt(info.offset.x**2 + info.offset.y**2);
    distRef.current = d;
    if (d > 55 && !stretching) setStretching(true);
    if (d <= 55 && stretching) setStretching(false);
  }, [stretching]);

  const onDragEnd = useCallback(() => {
    if (distRef.current > 55) onStretchEnd();
    setStretching(false);
    distRef.current = 0;
  }, [onStretchEnd]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.25}
      style={{ position:'absolute', top, left, right, x:ax, y:ay, transformOrigin:'top center', zIndex:12, cursor:'grab' }}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.08 }}
      animate={stretching ? { rotate: mirrored ? [0,8,-8,8] : [0,-8,8,-8] } : { rotate:0 }}
      transition={stretching ? { repeat:Infinity, duration:0.25 } : { type:'spring', stiffness:300, damping:20 }}
    >
      <ArmSVG mirrored={mirrored}/>
    </motion.div>
  );
}

/* ── Pin ── */
function Pin({ color }: { color:string }) {
  return (
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
      <div className="w-4 h-4 rounded-full border-2 border-white/40 shadow-md" style={{ background:color }}/>
      <div className="w-0.5 h-2" style={{ background:`${color}66` }}/>
    </div>
  );
}

/* ── Shower Thoughts — rotating funny one-liners ── */
const SHOWER_THOUGHTS = [
  "8 is just 0 wearing a belt 🥋",
  "If you're waiting for the waiter... aren't you the waiter? 🤔",
  "A staircase is just a ramp with trust issues",
  "Sleeping is a free trial of death 💀",
  "Every odd number has the letter E in it. OnE, thrEE, fivE...",
  "We say 'sleep like a baby' but babies cry every 2hrs 😭",
  "If you drop soap, is the floor clean or is the soap dirty?",
  "Technically, when you clean a vacuum, you become the vacuum",
  "You've never seen your own face — only reflections & photos lie",
  "Why do we park in a driveway and drive on a parkway? 🚗",
  "A mirror has never seen your face. Only your reflection's face.",
  "Your skeleton is always wet 🦴",
];

function ShowerThoughtFront() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(prev => (prev + 1) % SHOWER_THOUGHTS.length);
        setVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={idx}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -8 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="font-grotesk text-[0.66rem] text-center leading-snug italic px-1"
        style={{ color: '#3d2818' }}
      >
        &ldquo;{SHOWER_THOUGHTS[idx]}&rdquo;
      </motion.p>
    </AnimatePresence>
  );
}

/* ── Music Card Back — playlist submission form ── */
type SendState = 'idle' | 'sending' | 'sent' | 'error';

function MusicCardBack({ color }: { color: string }) {
  const [value, setValue] = useState('');
  const [state, setState] = useState<SendState>('idle');

  const handleSend = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const trimmed = value.trim();
    if (!trimmed || state === 'sending') return;

    setState('sending');
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          name: 'Portfolio Visitor',
          email: 'teddywhiff@gmail.com',
          message: trimmed,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      );
      setState('sent');
      setValue('');
      setTimeout(() => setState('idle'), 3500);
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  }, [value, state]);

  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full px-1" onClick={e => e.stopPropagation()}>
      <span style={{ fontSize: 22 }}>🎵</span>
      <p className="font-grotesk text-[0.65rem] text-center font-semibold leading-snug"
        style={{ color: 'rgba(255,255,255,0.95)' }}>
        Drop your fav playlist!
      </p>

      <AnimatePresence mode="wait">
        {state === 'sent' ? (
          <motion.div
            key="sent"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            className="flex flex-col items-center gap-1"
          >
            <span style={{ fontSize: 20 }}>✅</span>
            <p className="font-jetbrains text-[0.55rem] tracking-wider text-center"
              style={{ color: 'rgba(255,255,255,0.9)' }}>
              Sent to Harshit!
            </p>
          </motion.div>
        ) : state === 'error' ? (
          <motion.div
            key="error"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            className="flex flex-col items-center gap-1"
          >
            <span style={{ fontSize: 18 }}>⚠️</span>
            <p className="font-jetbrains text-[0.5rem] tracking-wider text-center"
              style={{ color: 'rgba(255,255,255,0.8)' }}>
              Failed — try again
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            onSubmit={handleSend}
            className="flex flex-col gap-1.5 w-full"
          >
            <input
              type="text"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="playlist name or link..."
              maxLength={200}
              className="w-full rounded-lg px-2.5 py-1.5 font-grotesk text-[0.6rem] outline-none placeholder:opacity-60"
              style={{
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.35)',
                color: '#fff',
                backdropFilter: 'blur(4px)',
              }}
            />
            <motion.button
              type="submit"
              disabled={!value.trim() || state === 'sending'}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full rounded-lg py-1.5 font-jetbrains text-[0.55rem] tracking-widest font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'rgba(255,255,255,0.92)',
                color: color,
                cursor: value.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              {state === 'sending' ? 'SENDING...' : 'SEND 🎧'}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
      <div className="mt-0.5 font-jetbrains text-[0.42rem] tracking-widest opacity-40 text-white">
        CLICK TO FLIP BACK
      </div>
    </div>
  );
}

/* ── Polaroid Card ── */
function PolaroidCard({ card, flipped, onFlip }:{ card:Card; flipped:boolean; onFlip:()=>void }) {
  const w = { sm:218, md:260, lg:300 }[card.size];
  const h = { sm:210, md:245, lg:280 }[card.size];

  const isShowerCard = card.id === 'shower';

  return (
    <motion.div drag dragMomentum={false}
      className="absolute cursor-grab active:cursor-grabbing"
      style={{ width:w, rotate:card.rotate }}
      whileDrag={{ scale:1.06, zIndex:60, rotate:0 }}
      whileHover={{ scale:1.03, zIndex:40 }}
      transition={{ type:'spring', stiffness:300, damping:25 }}
    >
      <Pin color={card.pin}/>
      <div className="relative" style={{ perspective:900, height:h }}>
        <motion.div className="relative w-full h-full" style={{ transformStyle:'preserve-3d' }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration:0.5, ease:[0.4,0,0.2,1] }}
          onClick={onFlip}
        >
          {/* FRONT */}
          <div className="absolute inset-0 rounded-xl flex flex-col overflow-hidden"
            style={{ backfaceVisibility:'hidden', background:'#fffcf7', boxShadow:'0 6px 20px rgba(0,0,0,0.11),0 1px 0 rgba(255,255,255,0.9) inset', padding:'10px 10px 8px' }}>

            {card.image ? (
              /* Image card — photo fills the top, label at bottom */
              <>
                <div className="flex-1 rounded-lg overflow-hidden mb-2 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt={card.front}
                    className="w-full h-full object-cover"
                    style={{ borderRadius: '8px' }}
                  />
                  <div className="absolute bottom-0 inset-x-0 px-1 py-0.5 flex justify-center"
                    style={{ background: `${card.color}cc`, borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
                    <span className="font-jetbrains text-[0.62rem] tracking-[0.18em] text-white">{card.category.toUpperCase()}</span>
                  </div>
                </div>
                <div className="font-grotesk text-[0.9rem] text-center leading-snug font-semibold" style={{ color:'#3d2818' }}>
                  {isShowerCard ? <ShowerThoughtFront /> : card.front}
                </div>
                <div className="text-center mt-1"><span className="font-jetbrains text-[0.58rem] tracking-widest" style={{ color:'#c0a890' }}>CLICK TO FLIP</span></div>
              </>
            ) : (
              <>
                <div className="flex-1 rounded-lg flex flex-col items-center justify-center gap-1 mb-2"
                  style={{ background:`${card.color}12`, border:`1px solid ${card.color}35` }}>
                  <span style={{ fontSize:card.size==='lg'?46:34 }}>{card.emoji}</span>
                  <span className="font-jetbrains text-[0.62rem] tracking-[0.2em] text-center px-1" style={{ color:card.color }}>{card.category.toUpperCase()}</span>
                </div>
                {isShowerCard ? (
                  <div className="flex flex-col items-center gap-1">
                    <ShowerThoughtFront />
                    <div className="text-center mt-1">
                      <span className="font-jetbrains text-[0.58rem] tracking-widest" style={{ color:'#c0a890' }}>CLICK TO FLIP</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="font-grotesk text-[0.9rem] text-center leading-snug" style={{ color:'#3d2818' }}>{card.front}</div>
                    <div className="text-center mt-1"><span className="font-jetbrains text-[0.58rem] tracking-widest" style={{ color:'#c0a890' }}>CLICK TO FLIP</span></div>
                  </>
                )}
              </>
            )}
          </div>

          {/* BACK */}
          <div className="absolute inset-0 rounded-xl flex flex-col items-center justify-center p-3"
            style={{ backfaceVisibility:'hidden', transform:'rotateY(180deg)', background:`linear-gradient(135deg,${card.color}ee,${card.color}aa)`, boxShadow:`0 6px 24px ${card.color}55` }}>
            <span style={{ fontSize:30 }}>{card.emoji}</span>
            <p className="font-grotesk text-[0.9rem] text-center leading-snug mt-2 font-medium" style={{ color:'rgba(255,255,255,0.96)' }}>{card.back}</p>
            <div className="mt-2 font-jetbrains text-[0.58rem] tracking-widest" style={{ color:'rgba(255,255,255,0.55)' }}>CLICK TO FLIP BACK</div>
          </div>

        </motion.div>
      </div>
    </motion.div>
  );
}

/* ── VibesBoard ── */
const VibesBoard = memo(function VibesBoard() {
  const [flippedCard, setFlippedCard] = useState<string|null>(null);
  const [sweat, setSweat] = useState(false);
  const [angry, setAngry] = useState(false);
  const [angryBorder, setAngryBorder] = useState(false);
  const boardCtrl = useAnimation();
  const leftLegCtrl = useAnimation();
  const rightLegCtrl = useAnimation();
  const animatingRef = useRef(false);

  const handleStretchEnd = useCallback(async () => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    setSweat(true);
    setAngryBorder(true);
    setAngry(true);

    boardCtrl.start({ x:[0,-8,8,-6,6,-3,3,0], rotate:[0,-1,1,-0.5,0.5,0], transition:{ duration:0.5 } });

    await new Promise(r => setTimeout(r, 1000));
    setAngry(false);
    setAngryBorder(false);

    await Promise.all([
      leftLegCtrl.start({ rotate:[0,-20,16,-12,8,-4,0], y:[0,-8,4,-3,1,0], transition:{ duration:0.55 } }),
      rightLegCtrl.start({ rotate:[0,20,-16,12,-8,4,0], y:[0,-8,4,-3,1,0], transition:{ duration:0.55 } }),
    ]);

    await new Promise(r => setTimeout(r, 300));
    setSweat(false);
    animatingRef.current = false;
  }, [boardCtrl, leftLegCtrl, rightLegCtrl]);

  return (
    <section id="vibes" className="relative z-[2]">
      <div className="max-w-[1100px] mx-auto px-6 py-[100px]">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.7 }} className="mb-16">
          <div className="flex items-center gap-3 font-jetbrains text-[0.68rem] tracking-[0.35em] mb-3" style={{ color:'var(--neon-blue)' }}>
            <span className="block w-[30px] h-px" style={{ background:'var(--neon-blue)' }}/>
            BEYOND THE CODE
          </div>
          <h2 className="font-syne font-bold" style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', background:'linear-gradient(135deg,#1c1108,#e8924f)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            My Vibes Board
          </h2>

        </motion.div>

        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.8 }}
          className="relative"
          style={{ paddingLeft:72, paddingRight:72, paddingBottom:100 }}
        >
          <DraggableArm top={170} left={0} onStretchEnd={handleStretchEnd}/>
          <DraggableArm top={170} right={0} mirrored onStretchEnd={handleStretchEnd}/>

          <motion.div animate={leftLegCtrl}
            style={{ position:'absolute', bottom:2, left:'32%', transformOrigin:'top center', zIndex:10 }}>
            <LegSVG/>
          </motion.div>
          <motion.div animate={rightLegCtrl}
            style={{ position:'absolute', bottom:2, left:'51%', transformOrigin:'top center', zIndex:10 }}>
            <LegSVG mirrored/>
          </motion.div>

          <motion.div animate={boardCtrl}
            className="relative rounded-2xl"
            style={{
              height:630,
              backgroundImage:`
                linear-gradient(rgba(200,149,42,0.07) 1px, transparent 1px),
                linear-gradient(90deg, rgba(200,149,42,0.07) 1px, transparent 1px),
                radial-gradient(ellipse at 20% 30%, rgba(232,146,79,0.10) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 70%, rgba(139,92,246,0.08) 0%, transparent 50%),
                linear-gradient(135deg, #fff8f0 0%, #fdf4ee 100%)
              `,
              backgroundSize:'38px 38px, 38px 38px, 100% 100%, 100% 100%, 100% 100%',
              border: angryBorder ? '2.5px solid #ef4444' : '2.5px solid rgba(200,149,42,0.22)',
              transition:'border-color 0.2s ease',
              boxShadow: angryBorder
                ? '0 0 30px rgba(239,68,68,0.25), 0 30px 80px rgba(0,0,0,0.06)'
                : '0 8px 40px rgba(200,149,42,0.10), 0 30px 80px rgba(0,0,0,0.06)',
              overflow:'visible',
              zIndex:5,
            }}
          >
            <div style={{ position:'absolute', inset:0, overflow:'hidden', borderRadius:'inherit', pointerEvents:'none' }}>
              <SweatDrops active={sweat}/>
            </div>
            <AngryBurst active={angry}/>

            <div style={{ position:'absolute', inset:0, overflow:'hidden', borderRadius:'inherit' }}>
              {CARDS.map((card, i) => {
                const [left, top] = POSITIONS[i] ?? [80+i*170, 70];
                return (
                  <div key={card.id} style={{ position:'absolute', left, top }}>
                    <PolaroidCard card={card} flipped={flippedCard===card.id}
                      onFlip={() => setFlippedCard(p => p===card.id ? null : card.id)}/>
                  </div>
                );
              })}
            </div>

            <div className="absolute bottom-3 right-4 pointer-events-none z-10">
              <span className="font-jetbrains text-[0.52rem] tracking-[0.15em]" style={{ color:'rgba(100,70,40,0.28)' }}>
                DRAG · CLICK TO FLIP · PULL ARMS
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

export default VibesBoard;

