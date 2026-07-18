'use client';
import { memo } from 'react';
import { motion } from 'framer-motion';
import { SKILLS, EDUCATION, ABOUT_SUMMARY } from '@/lib/data';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 15 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] } },
};

const About = memo(function About() {
  return (
    <section id="about" className="relative z-[2]">
      <div className="max-w-[1100px] mx-auto px-6 py-[100px]">

        {/* Section header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-14"
        >
          <div
            className="flex items-center gap-3 font-jetbrains text-[0.68rem] tracking-[0.35em] mb-3"
            style={{ color: 'var(--neon-cyan)' }}
          >
            <span className="block w-[30px] h-px" style={{ background: 'var(--neon-cyan)' }} />
            ABOUT
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
            Who I Am
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Summary + Education */}
          <div className="space-y-8">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="font-grotesk text-[1.05rem] leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {ABOUT_SUMMARY}
            </motion.p>

            {/* Education timeline */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div
                className="font-jetbrains text-[0.68rem] tracking-[0.25em] mb-4"
                style={{ color: 'var(--text-dim)' }}
              >
                EDUCATION
              </div>
              <div className="relative border-l pl-6 space-y-6" style={{ borderColor: 'var(--border-glass)' }}>
                {EDUCATION.map((edu, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="relative"
                  >
                    {/* Timeline dot */}
                    <div
                      className="absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2"
                      style={{ background: edu.color, borderColor: 'var(--bg-void)' }}
                    />
                    <div
                      className="font-jetbrains text-[0.62rem] tracking-[0.15em] mb-0.5"
                      style={{ color: edu.color }}
                    >
                      {edu.period}
                    </div>
                    <div className="font-grotesk font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
                      {edu.institution}
                    </div>
                    <div className="font-grotesk text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {edu.degree}
                    </div>
                    <div
                      className="font-jetbrains text-[0.68rem] mt-1 px-2 py-0.5 rounded-md inline-block"
                      style={{ color: edu.color, background: `${edu.color}15`, border: `1px solid ${edu.color}30` }}
                    >
                      {edu.score}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Skills */}
          <div className="space-y-8">
            {SKILLS.map((skillGroup, gi) => (
              <motion.div
                key={gi}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: gi * 0.1 } } }}
              >
                <div
                  className="font-jetbrains text-[0.62rem] tracking-[0.25em] mb-3"
                  style={{ color: skillGroup.color }}
                >
                  {skillGroup.category.toUpperCase()}
                </div>
                <motion.div className="flex flex-wrap gap-2" variants={container}>
                  {skillGroup.items.map((skill) => (
                    <motion.span
                      key={skill}
                      variants={item}
                      className="font-jetbrains text-[0.68rem] tracking-[0.05em] px-3 py-1.5 rounded-lg cursor-default transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        color: skillGroup.color,
                        background: `${skillGroup.color}10`,
                        border: `1px solid ${skillGroup.color}30`,
                      }}
                      whileHover={{ background: `${skillGroup.color}18`, borderColor: `${skillGroup.color}55` }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default About;
