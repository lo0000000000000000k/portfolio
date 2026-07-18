'use client';
import { memo } from 'react';
import { motion } from 'framer-motion';
import { PROJECTS } from '@/lib/data';
import GlassCard from '@/components/ui/GlassCard';

const GitHubIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const Projects = memo(function Projects() {
  return (
    <section id="projects" className="relative z-[2]">
      <div className="max-w-[1100px] mx-auto px-6 py-[100px]">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <div
            className="flex items-center gap-3 font-jetbrains text-[0.68rem] tracking-[0.35em] mb-3"
            style={{ color: 'var(--neon-cyan)' }}
          >
            <span className="block w-[30px] h-px" style={{ background: 'var(--neon-cyan)' }} />
            WORK
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
            Featured Projects
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
            >
              <GlassCard className="overflow-hidden cursor-pointer h-full flex flex-col" hoverGlow>
                {/* Preview */}
                <div
                  className="h-[180px] relative flex items-center justify-center overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${project.color1}18, ${project.color2}18)`,
                  }}
                >
                  {/* Animated grid lines in preview */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `linear-gradient(${project.color1}20 1px, transparent 1px), linear-gradient(90deg, ${project.color1}20 1px, transparent 1px)`,
                      backgroundSize: '30px 30px',
                    }}
                  />

                  {/* Period badge */}
                  <div
                    className="absolute top-3 right-3 font-jetbrains text-[0.6rem] tracking-[0.1em] px-2 py-1 rounded-md flex items-center gap-1.5"
                    style={
                      project.period.includes('Present')
                        ? {
                            color: '#00ff88',
                            background: 'rgba(0,255,136,0.1)',
                            border: '1px solid rgba(0,255,136,0.35)',
                          }
                        : {
                            color: project.color1,
                            background: `${project.color1}15`,
                            border: `1px solid ${project.color1}30`,
                          }
                    }
                  >
                    {project.period.includes('Present') && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#00ff88' }} />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#00ff88' }} />
                      </span>
                    )}
                    {project.period}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3
                    className="font-syne text-[1.05rem] font-semibold mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {project.name}
                  </h3>
                  <p
                    className="font-grotesk text-[0.95rem] leading-relaxed mb-4 flex-1"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {project.desc}
                  </p>

                  {/* Tech badges */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="font-jetbrains text-[0.62rem] tracking-[0.05em] px-2.5 py-1 rounded-md"
                        style={{
                          color: 'var(--neon-blue)',
                          background: 'rgba(0,212,255,0.08)',
                          border: '1px solid rgba(0,212,255,0.2)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-2.5">
                    <a
                      href={project.gh}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-jetbrains text-[0.68rem] tracking-[0.05em] flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all duration-200 hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.04)]"
                      style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-glass)' }}
                    >
                      <GitHubIcon /> GitHub
                    </a>

                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Projects;
