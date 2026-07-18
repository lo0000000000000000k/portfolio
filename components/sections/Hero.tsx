'use client';
import { memo } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useTypingEffect } from '@/hooks/useTypingEffect';
import { HERO_PHRASES } from '@/lib/data';

const Terminal  = dynamic(() => import('@/components/ui/Terminal'),  { ssr: false });
const SplitText = dynamic(() => import('@/components/ui/SplitText'), { ssr: false });

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] },
});

const Hero = memo(function Hero() {
  const typed = useTypingEffect(HERO_PHRASES);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-[120px] pb-20 text-center overflow-hidden z-[2]"
    >



      <SplitText
        tag="h1"
        text="HARSHIT MALIK"
        className="font-syne font-extrabold mb-5 leading-[1.05]"
        style={{
          fontSize: 'clamp(3rem, 8vw, 6.5rem)',
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
        }}
        delay={80}
        duration={0.9}
        ease="power4.out"
        splitType="chars"
        from={{ opacity: 0, y: 60 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="0px"
        textAlign="center"
      />

      {/* Typing subtitle */}
      <motion.div
        {...fadeUp(0.5)}
        className="font-jetbrains mb-12 h-7 flex items-center justify-center"
        style={{
          fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
          color: 'var(--text-secondary)',
          letterSpacing: '0.05em',
        }}
      >
        <span style={{ color: 'var(--neon-blue)' }}>{typed}</span>
        <span className="animate-blink ml-0.5" style={{ color: 'var(--neon-purple)' }}>
          █
        </span>
      </motion.div>

      {/* CTA buttons */}
      <motion.div {...fadeUp(0.7)} className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          className="font-jetbrains text-[0.8rem] font-semibold tracking-[0.1em] px-[30px] py-[13px] rounded-[10px] transition-all duration-300 hover:-translate-y-[3px]"
          style={{
            color: 'var(--bg-void)',
            background: 'var(--neon-blue)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          }}
        >
          VIEW PROJECTS
        </button>
        <button
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="font-jetbrains text-[0.8rem] tracking-[0.1em] px-7 py-3 rounded-[10px] transition-all duration-300 hover:-translate-y-[3px] hover:bg-[rgba(0,212,255,0.08)]"
          style={{
            color: 'var(--neon-blue)',
            border: '1px solid rgba(0,212,255,0.4)',
          }}
        >
          CONTACT
        </button>
        <a
          href="/resume.pdf"
          download
          className="font-jetbrains text-[0.8rem] tracking-[0.1em] px-7 py-3 rounded-[10px] transition-all duration-300 hover:-translate-y-[3px] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.07)]"
          style={{
            color: 'var(--text-secondary)',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border-glass)',
          }}
        >
          RESUME ↗
        </a>
      </motion.div>

      {/* Terminal widget */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="mt-24 mb-8 w-full flex justify-center px-4"
      >
        <Terminal />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5"
      >
        <div
          className="w-px h-[50px] animate-scroll-line"
          style={{ background: 'linear-gradient(to bottom, var(--neon-blue), transparent)' }}
        />
        <span className="font-jetbrains text-[0.6rem] tracking-[0.3em]" style={{ color: 'var(--text-dim)' }}>
          SCROLL
        </span>
      </motion.div>
    </section>
  );
});

export default Hero;
