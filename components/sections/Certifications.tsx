'use client';
import { memo } from 'react';
import { motion } from 'framer-motion';
import { CERTIFICATIONS } from '@/lib/data';
import GlassCard from '@/components/ui/GlassCard';

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ACHIEVEMENT = {
  title: 'In-House AI Bootcamp',
  org: 'Sharda University',
  period: 'June 2025 – July 2025',
  bullets: [
    'Completed a summer bootcamp on data structures and core programming',
    'Gained hands-on ML experience in data cleaning, preprocessing, visualization, and model evaluation',
    'Built multiple capstone and mini projects applying ML to real problems',
    'Developed Power BI dashboard skills and improved communication through MIP, GD, and soft-skills sessions',
  ],
};

const Certifications = memo(function Certifications() {
  return (
    <section id="certs" className="relative z-[2]">
      <div className="max-w-[1100px] mx-auto px-6 py-[100px]">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 font-jetbrains text-[0.68rem] tracking-[0.35em] mb-3" style={{ color: 'var(--neon-cyan)' }}>
            <span className="block w-[30px] h-px" style={{ background: 'var(--neon-cyan)' }} />
            CREDENTIALS
          </div>
          <h2
            className="font-syne font-bold"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              background: 'linear-gradient(135deg, var(--text-primary), var(--neon-blue))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Certifications & Achievements
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Certs grid */}
          <div>
            <div className="font-jetbrains text-[0.62rem] tracking-[0.25em] mb-5" style={{ color: 'var(--text-dim)' }}>
              CERTIFICATIONS
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CERTIFICATIONS.map((cert, i) => (
                <motion.div
                  key={cert.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <GlassCard className="p-5 h-full" hoverGlow>
                    {/* Color bar */}
                    <div className="w-8 h-1 rounded-full mb-4" style={{ background: `linear-gradient(90deg, ${cert.color}, transparent)` }} />
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                      style={{ background: `${cert.color}15`, border: `1px solid ${cert.color}30` }}
                    >
                      <span style={{ color: cert.color }}><CheckIcon /></span>
                    </div>
                    <h3 className="font-grotesk font-semibold text-[0.95rem] mb-1 leading-snug" style={{ color: 'var(--text-primary)' }}>
                      {cert.title}
                    </h3>
                    <div className="font-jetbrains text-[0.62rem] tracking-[0.05em] mb-1" style={{ color: cert.color }}>
                      {cert.issuer}
                    </div>
                    <div className="font-jetbrains text-[0.6rem] tracking-[0.1em]" style={{ color: 'var(--text-dim)' }}>
                      {cert.date}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Achievement */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <div className="font-jetbrains text-[0.62rem] tracking-[0.25em] mb-5" style={{ color: 'var(--text-dim)' }}>
              ACHIEVEMENT
            </div>
            <GlassCard className="p-6" hoverGlow>
              <div
                className="inline-flex items-center gap-2 font-jetbrains text-[0.62rem] tracking-[0.15em] px-3 py-1.5 rounded-full mb-4"
                style={{ color: '#f5c542', background: 'rgba(245,197,66,0.08)', border: '1px solid rgba(245,197,66,0.2)' }}
              >
                ⚡ ACHIEVEMENT
              </div>
              <h3 className="font-syne text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                {ACHIEVEMENT.title}
              </h3>
              <div className="font-jetbrains text-[0.72rem] mb-1" style={{ color: 'var(--neon-cyan)' }}>
                {ACHIEVEMENT.org}
              </div>
              <div className="font-jetbrains text-[0.62rem] mb-5" style={{ color: 'var(--text-dim)' }}>
                {ACHIEVEMENT.period}
              </div>
              <ul className="space-y-3">
                {ACHIEVEMENT.bullets.map((b, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-3 items-start"
                  >
                    <span
                      className="mt-0.5 w-4 h-4 rounded flex-shrink-0 flex items-center justify-center"
                      style={{ color: 'var(--neon-cyan)', background: 'rgba(0,255,204,0.1)', border: '1px solid rgba(0,255,204,0.2)' }}
                    >
                      <CheckIcon />
                    </span>
                    <span className="font-grotesk text-[0.92rem] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {b}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default Certifications;
