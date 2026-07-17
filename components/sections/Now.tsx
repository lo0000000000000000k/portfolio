'use client';
import { memo } from 'react';
import { motion } from 'framer-motion';
import { NOW_STATUS } from '@/lib/data';


const cards = Object.values(NOW_STATUS);

const NowSection = memo(function NowSection() {
  return (
    <section id="now" className="relative z-[2]">
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
            NOW
          </div>
          <h2 className="font-syne font-bold" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', background: 'linear-gradient(135deg, var(--text-primary), var(--neon-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            What I&apos;m Up To
          </h2>
          <p className="mt-2 font-grotesk text-[0.95rem]" style={{ color: 'var(--text-secondary)' }}>
            A live snapshot of what I&apos;m focused on right now — drag the cards around.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Draggable status cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {cards.map((card, i) => (
              <motion.div
                key={card.label}
                drag
                dragMomentum={false}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileDrag={{ scale: 1.05, zIndex: 50, boxShadow: `0 0 40px ${card.color}30` }}
                className="rounded-xl p-5 cursor-grab active:cursor-grabbing"
                style={{
                  background: 'var(--bg-card)',
                  border: `1.5px solid ${card.color}35`,
                  backdropFilter: 'blur(8px)',
                  boxShadow: `0 4px 24px ${card.color}12`,
                }}
              >
                <div className="text-2xl mb-2">{card.emoji}</div>
                <div className="font-jetbrains text-[0.6rem] tracking-[0.2em] mb-1" style={{ color: card.color }}>
                  {card.label.toUpperCase()}
                </div>
                <div className="font-grotesk text-[0.95rem] font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>
                  {card.value}
                </div>
                {/* Color accent bar */}
                <div className="h-0.5 rounded-full mt-3 w-12" style={{ background: `linear-gradient(90deg, ${card.color}, transparent)` }} />
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
});

export default NowSection;
