'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverGlow?: boolean;
  style?: React.CSSProperties;
}

export default function GlassCard({ children, className = '', hoverGlow = true, style }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hoverGlow ? { y: -4, borderColor: 'rgba(0,212,255,0.2)' } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        ...style,
      }}
    >
      {/* Shine overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)',
        }}
      />
      {children}
    </motion.div>
  );
}
