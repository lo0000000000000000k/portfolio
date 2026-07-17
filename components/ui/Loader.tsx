'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = ['LOADING ASSETS...', 'RENDERING UI...', 'COMPILING SHADERS...', 'SYNCING DATA...', 'READY.'];

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(MESSAGES[0]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.random() * 18 + 5, 100);
        setMessage(MESSAGES[Math.floor(next / 25)] ?? 'READY.');
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setVisible(false);
            setTimeout(onComplete, 600);
          }, 400);
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-6"
          style={{ background: 'var(--bg-void)' }}
        >
          <div
            className="font-orbitron text-3xl font-bold tracking-[0.3em]"
            style={{
              background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            HM
          </div>

          <div
            className="font-jetbrains text-[0.62rem] tracking-[0.3em] mb-1"
            style={{ color: 'var(--text-dim)' }}
          >
            INITIALIZING PORTFOLIO
          </div>

          <div
            className="w-[280px] h-[2px] rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, var(--neon-blue), var(--neon-purple), var(--neon-cyan))',
                boxShadow: '0 0 12px var(--neon-blue)',
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.05, ease: 'linear' }}
            />
          </div>

          <div
            className="font-jetbrains text-[0.65rem] tracking-[0.2em]"
            style={{ color: 'var(--text-dim)' }}
          >
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
