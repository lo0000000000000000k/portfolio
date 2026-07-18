'use client';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const Lanyard = dynamic(() => import('@/components/ui/Lanyard'), { ssr: false });

// ── Animated CSS wooden plank ─────────────────────────────────────────────────
function WoodenPlank() {
  return (
    <motion.div
      className="relative w-full"
      style={{ height: '68px', zIndex: 10 }}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Plank body */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #5c3a1e 0%, #7a4a28 18%, #8b5e35 35%, #6b4220 55%, #7d4f2a 75%, #4a2e12 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 2px 0 rgba(255,200,120,0.08) inset, 0 -2px 0 rgba(0,0,0,0.4) inset',
        }}
      >
        {/* Wood grain lines */}
        {[12, 22, 35, 47, 58].map((top, i) => (
          <div
            key={i}
            className="absolute left-0 right-0"
            style={{
              top,
              height: '1px',
              background: `linear-gradient(90deg, transparent 0%, rgba(${i % 2 === 0 ? '30,15,5' : '180,120,60'},0.${i % 2 === 0 ? '35' : '2'}) 15%, rgba(${i % 2 === 0 ? '30,15,5' : '180,120,60'},0.${i % 2 === 0 ? '4' : '25'}) 50%, rgba(${i % 2 === 0 ? '30,15,5' : '180,120,60'},0.${i % 2 === 0 ? '35' : '2'}) 85%, transparent 100%)`,
            }}
          />
        ))}
        {/* Highlight on top edge */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{ height: '2px', background: 'linear-gradient(90deg, transparent, rgba(255,210,130,0.25) 20%, rgba(255,210,130,0.35) 50%, rgba(255,210,130,0.25) 80%, transparent)' }}
        />
        {/* Shadow on bottom edge */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: '3px', background: 'rgba(0,0,0,0.5)' }}
        />
      </div>

      {/* Left screw */}
      <Screw style={{ left: '7%', top: '50%', transform: 'translateY(-50%)' }} delay={0.4} />
      {/* Right screw */}
      <Screw style={{ right: '7%', top: '50%', transform: 'translateY(-50%)' }} delay={0.55} />

      {/* Center rope drop */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5, ease: 'easeOut' }}
        style={{ transformOrigin: 'top', width: '3px', height: '36px' }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, #b8893a, #a07832, rgba(140,100,40,0))',
          borderRadius: '2px',
        }} />
      </motion.div>
    </motion.div>
  );
}

// ── Animated screw / nail ──────────────────────────────────────────────────────
function Screw({ style, delay }: { style: React.CSSProperties; delay: number }) {
  return (
    <motion.div
      className="absolute"
      style={style}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.4, type: 'spring', stiffness: 200 }}
    >
      {/* Outer ring */}
      <div
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #d4d4d4, #888, #444)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.8), 0 0 0 1.5px rgba(255,255,255,0.1) inset',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Phillips cross slot */}
        <div style={{ position: 'relative', width: '10px', height: '10px' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: 'rgba(0,0,0,0.6)', transform: 'translateY(-50%)', borderRadius: '1px' }} />
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: 'rgba(0,0,0,0.6)', transform: 'translateX(-50%)', borderRadius: '1px' }} />
        </div>
      </div>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function LanyardSection() {
  return (
    <section
      id="lanyard"
      className="relative z-[2] w-full"
      style={{ minHeight: '100vh' }}
    >
      <WoodenPlank />

      <div
        className="max-w-[1100px] mx-auto px-6 h-full flex items-stretch"
        style={{ minHeight: 'calc(100vh - 68px)' }}
      >
        {/* ── LEFT: Physics canvas ─────────────────────────────────── */}
        <div
          className="relative flex-1"
          style={{ minHeight: 'calc(100vh - 68px)', maxWidth: '55%' }}
        >
          <Lanyard
            position={[0, 0, 22]}
            gravity={[0, -40, 0]}
            fov={20}
            transparent
            lanyardWidth={0.9}
            frontImage="/863b11d7-3fbc-4064-b5b2-e657b52397f0.jpg"
            backImage="/dark-abstract-background_1048-1920.avif"
            imageFit="cover"
          />
        </div>

        {/* ── RIGHT: Label text ────────────────────────────────────── */}
        <div
          className="hidden md:flex flex-col justify-center gap-6 pl-10 pr-4"
          style={{ width: '45%' }}
        >
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <div
              className="flex items-center gap-3 font-jetbrains text-[0.68rem] tracking-[0.35em] mb-4"
              style={{ color: 'var(--neon-cyan)' }}
            >
              <span className="block w-[30px] h-px" style={{ background: 'var(--neon-cyan)' }} />
              INTERACTIVE
            </div>

            <h2
              className="font-syne font-bold mb-5 leading-[1.1]"
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                background: 'linear-gradient(135deg, var(--text-primary), var(--neon-blue))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              yeah, that&apos;s me.
            </h2>

            <p
              className="font-grotesk leading-relaxed"
              style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}
            >
              Everyone has an &ldquo;about me&rdquo; section. Mine just hangs from a lanyard.
              Instead of a boring bio box you scroll past — pick it up, throw it around, see what happens.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
