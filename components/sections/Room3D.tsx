'use client';
import { useState, Suspense, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS, NOW_STATUS, SPOTIFY_MOCK } from '@/lib/data';
import {
  RoomShell, Desk, Chair, Laptop, Headphones,
  ChessSetup, Books, DeskLamp, Plant, CeilingLight,
} from './RoomObjects';

/* ─── Overlay Content ─────────────────────────────────────── */
type OverlayKey = 'laptop' | 'headphones' | 'chess' | 'books' | null;

function OverlayPanel({ type, onClose }: { type: OverlayKey; onClose: () => void }) {
  if (!type) return null;

  const content: Record<NonNullable<OverlayKey>, { title: string; color: string; body: React.ReactNode }> = {
    laptop: {
      title: '🖥 Featured Projects',
      color: '#00d4ff',
      body: (
        <ul className="space-y-3 mt-4">
          {PROJECTS.map((p) => (
            <li key={p.name} className="p-3 rounded-xl" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}>
              <div className="font-syne font-semibold text-[0.9rem]" style={{ color: '#f0f4ff' }}>{p.icon} {p.name}</div>
              <div className="font-grotesk text-[0.75rem] mt-0.5" style={{ color: '#8892a4' }}>{p.tech.slice(0,3).join(' · ')}</div>
            </li>
          ))}
        </ul>
      ),
    },
    headphones: {
      title: '🎵 Coding Soundtrack',
      color: '#9b59ff',
      body: (
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(29,185,84,0.08)', border: '1px solid rgba(29,185,84,0.2)' }}>
            <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden" style={{ background: 'linear-gradient(135deg,#1db954,#156e38)' }}>
              <div className="w-full h-full flex items-center justify-center text-2xl">♫</div>
            </div>
            <div>
              <div className="font-syne font-bold text-sm" style={{ color: '#f0f4ff' }}>{SPOTIFY_MOCK.title}</div>
              <div className="font-grotesk text-xs" style={{ color: '#8892a4' }}>{SPOTIFY_MOCK.artist} · {SPOTIFY_MOCK.album}</div>
            </div>
          </div>
          <div className="font-jetbrains text-xs" style={{ color: '#1db954' }}>▶ CURRENTLY PLAYING (MOCK)</div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full" style={{ width: `${SPOTIFY_MOCK.progress}%`, background: '#1db954' }} />
          </div>
          <div className="font-jetbrains text-[0.65rem]" style={{ color: '#4a5568' }}>Spotify API integration coming soon</div>
        </div>
      ),
    },
    chess: {
      title: '♟ Chess Stats',
      color: '#00ffcc',
      body: (
        <div className="mt-4 space-y-3">
          {[
            ['Current Rating', NOW_STATUS.chess.value, '#00ffcc'],
            ['Openings', "Sicilian · King's Indian", '#9b59ff'],
            ['Style', 'Tactical aggressor', '#00d4ff'],
            ['Daily Puzzles', 'Solved 500+', '#ff3cac'],
          ].map(([label, val, color]) => (
            <div key={label} className="flex justify-between items-center p-3 rounded-lg" style={{ background: 'rgba(0,255,204,0.04)', border: '1px solid rgba(0,255,204,0.1)' }}>
              <span className="font-jetbrains text-[0.7rem]" style={{ color: '#8892a4' }}>{label}</span>
              <span className="font-syne text-sm font-bold" style={{ color }}>{val}</span>
            </div>
          ))}
          <div className="font-jetbrains text-[0.65rem] mt-2 p-2 rounded-lg text-center" style={{ color: '#9b59ff', background: 'rgba(155,89,255,0.06)', border: '1px solid rgba(155,89,255,0.15)' }}>
            💭 The knight is still thinking about that move...
          </div>
        </div>
      ),
    },
    books: {
      title: '📚 Currently Reading',
      color: '#ff3cac',
      body: (
        <div className="mt-4 space-y-3">
          {[
            { title: 'Deep Learning', author: 'Goodfellow et al.', status: 'Reading now', color: '#00d4ff' },
            { title: 'Hands-On Machine Learning', author: 'Aurélien Géron', status: 'In queue', color: '#9b59ff' },
            { title: 'The Algorithm Design Manual', author: 'Skiena', status: 'Reference', color: '#ff3cac' },
          ].map((b) => (
            <div key={b.title} className="p-3 rounded-xl" style={{ background: 'rgba(255,60,172,0.04)', border: `1px solid ${b.color}22` }}>
              <div className="font-syne font-semibold text-[0.88rem]" style={{ color: '#f0f4ff' }}>{b.title}</div>
              <div className="font-grotesk text-xs" style={{ color: '#8892a4' }}>{b.author}</div>
              <span className="font-jetbrains text-[0.6rem] mt-1 inline-block px-2 py-0.5 rounded-full" style={{ color: b.color, background: `${b.color}15`, border: `1px solid ${b.color}30` }}>{b.status}</span>
            </div>
          ))}
        </div>
      ),
    },
  };

  const c = content[type];
  return (
    <motion.div className="absolute inset-0 z-20 flex items-center justify-center p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ background: 'rgba(3,7,18,0.88)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <motion.div className="w-full max-w-md rounded-2xl p-6 max-h-[80%] overflow-y-auto"
        initial={{ scale: 0.88, y: 20 }} animate={{ scale: 1, y: 0 }}
        style={{ background: 'rgba(8,15,30,0.97)', border: `1px solid ${c.color}33`, boxShadow: `0 0 50px ${c.color}18` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-syne text-lg font-bold" style={{ color: c.color }}>{c.title}</h3>
          <button onClick={onClose} className="font-jetbrains text-[0.7rem] px-3 py-1 rounded-lg"
            style={{ color: 'var(--text-dim)', border: '1px solid var(--border-glass)' }}>ESC</button>
        </div>
        {c.body}
      </motion.div>
    </motion.div>
  );
}

/* ─── Scene ───────────────────────────────────────────────── */
function RoomScene({ onOpen }: { onOpen: (k: OverlayKey) => void }) {
  return (
    <>
      {/* Lighting — bright, warm room */}
      <ambientLight intensity={0.55} color="#d0d8ff" />
      <pointLight position={[0, 3.5, 1]} intensity={2.0} color="#fff8e8" />
      <pointLight position={[-4, 2, 0]} intensity={1.2} color="#c8d4ff" />
      <pointLight position={[4, 2, -1]} intensity={1.0} color="#ffd0a0" />
      <pointLight position={[0, 1, 4]} intensity={0.8} color="#ffffff" />
      <Environment preset="apartment" />

      <RoomShell />
      <Desk />
      <Chair />
      <DeskLamp />
      <CeilingLight />
      <Plant />
      <Laptop onOpen={() => onOpen('laptop')} />
      <Headphones onOpen={() => onOpen('headphones')} />
      <ChessSetup onOpen={() => onOpen('chess')} />
      <Books onOpen={() => onOpen('books')} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
}

/* ─── Room3D Section ──────────────────────────────────────── */
const Room3D = memo(function Room3D() {
  const [overlay, setOverlay] = useState<OverlayKey>(null);

  return (
    <section id="room" className="relative z-[2]">
      <div className="max-w-[1200px] mx-auto px-6 py-[100px]">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mb-10">
          <div className="flex items-center gap-3 font-jetbrains text-[0.68rem] tracking-[0.35em] mb-3" style={{ color: 'var(--neon-cyan)' }}>
            <span className="block w-[30px] h-px" style={{ background: 'var(--neon-cyan)' }} />
            MY SPACE
          </div>
          <h2 className="font-syne font-bold" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', background: 'linear-gradient(135deg,var(--text-primary),var(--neon-blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            The Room
          </h2>
          <p className="mt-2 font-grotesk text-[0.95rem]" style={{ color: 'var(--text-secondary)' }}>
            A peek into my world — click objects to explore.
          </p>
        </motion.div>

        {/* Window frame */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="relative rounded-none"
          style={{
            height: 540,
            /* Window frame styling */
            padding: '18px 20px',
            background: 'linear-gradient(180deg,#1a1a2e 0%,#0d0d1a 100%)',
            boxShadow: 'inset 0 0 0 3px rgba(255,255,255,0.06), 0 0 0 2px #0a0a14, 0 40px 120px rgba(0,0,0,0.8), inset 0 2px 0 rgba(255,255,255,0.08)',
            borderRadius: 8,
          }}
        >
          {/* Window pane top bar */}
          <div className="absolute top-0 left-0 right-0 h-[18px] flex items-center px-3 gap-1.5 rounded-t-lg z-10"
            style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['#ff5f57','#febc2e','#28c840'].map(c=>(
              <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }}/>
            ))}
            <span className="ml-2 font-jetbrains text-[0.52rem] tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.2)' }}>room.tsx — Harshit&apos;s Space</span>
          </div>

          {/* Canvas */}
          <div className="w-full h-full overflow-hidden relative" style={{ borderRadius: 4, marginTop: 2 }}>
            <Suspense fallback={
              <div className="flex h-full items-center justify-center font-jetbrains text-[0.75rem]" style={{ color: 'var(--text-dim)' }}>
                Loading room...
              </div>
            }>
              <Canvas camera={{ position: [0, 1.2, 7.5], fov: 58 }} shadows>
                <RoomScene onOpen={setOverlay} />
              </Canvas>
            </Suspense>

            {/* Overlay */}
            <AnimatePresence>
              {overlay && <OverlayPanel type={overlay} onClose={() => setOverlay(null)} />}
            </AnimatePresence>

            {/* Hint */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="font-jetbrains text-[0.58rem] tracking-[0.15em] px-3 py-1.5 rounded-full"
                style={{ color: 'rgba(255,255,255,0.25)', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                DRAG TO LOOK AROUND · CLICK OBJECTS
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

export default Room3D;
