'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

const NAV_ITEMS = [
  { label: 'HOME',     href: '#hero'     },
  { label: 'ABOUT',    href: '#about'    },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'VIBES',    href: '#vibes'    },
  { label: 'CERTS',    href: '#certs'    },
  { label: 'CONTACT',  href: '#contact'  },
];

/* ── Sun icon ── */
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

/* ── Moon icon ── */
function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle, isDark } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = NAV_ITEMS.map((n) => n.href.replace('#', ''));
      let current = 'hero';
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 120) current = id;
      });
      setActive(current);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    document.getElementById(href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-5 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-48px)] max-w-[1060px] h-14 px-5 flex items-center justify-between rounded-2xl"
        style={{
          background: scrolled ? 'var(--nav-bg-scrolled)' : 'var(--nav-bg)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid var(--border-glass)',
          boxShadow: scrolled ? 'var(--nav-shadow), 0 0 0 1px var(--border-glass)' : 'var(--nav-shadow)',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => scrollTo('#hero')}
          className="font-orbitron text-base font-bold tracking-[0.2em]"
          style={{ background: 'linear-gradient(135deg,var(--neon-blue),var(--neon-cyan))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}
        >
          HM
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => {
            const id = item.href.replace('#', '');
            const isActive = active === id;
            return (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className="font-jetbrains text-[0.7rem] tracking-[0.1em] px-3 py-1.5 rounded-lg relative transition-colors duration-200"
                style={{ color: isActive ? 'var(--neon-blue)' : 'var(--text-secondary)' }}
              >
                {item.label}
                {isActive && (
                  <motion.div layoutId="nav-indicator"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[1.5px] w-[60%] rounded-full"
                    style={{ background: 'var(--neon-blue)' }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right side: theme toggle + CTA */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <motion.button
            onClick={toggle}
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.08 }}
            aria-label="Toggle theme"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
            style={{
              background: isDark ? 'rgba(232,146,79,0.15)' : 'rgba(28,17,8,0.08)',
              color: 'var(--neon-blue)',
              border: '1px solid var(--border-glass)',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span key={theme}
                initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0,   opacity: 1, scale: 1   }}
                exit={{    rotate:  30, opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.22 }}
                style={{ display:'flex', alignItems:'center', justifyContent:'center' }}
              >
                {isDark ? <SunIcon/> : <MoonIcon/>}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* CTA */}
          <a
            href="mailto:teddywhiff@gmail.com"
            className="hidden md:block font-jetbrains text-[0.7rem] font-semibold tracking-[0.08em] px-4 py-[7px] rounded-lg transition-all duration-200 hover:-translate-y-0.5"
            style={{
              color: isDark ? '#1c1108' : '#fff8f0',
              background: 'var(--neon-blue)',
              boxShadow: '0 2px 16px rgba(232,146,79,0.35)',
            }}
          >
            HIRE ME
          </a>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-1"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {[0,1,2].map((i) => (
              <span key={i}
                className="block w-[22px] h-[1.5px] rounded-full transition-all duration-300"
                style={{
                  background: 'var(--text-secondary)',
                  transform: menuOpen
                    ? i===0 ? 'rotate(45deg) translateY(9px)' : i===2 ? 'rotate(-45deg) translateY(-9px)' : 'scaleX(0)'
                    : 'none',
                }}
              />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
            transition={{ duration:0.2 }}
            className="fixed top-[90px] left-6 right-6 z-[999] rounded-2xl p-5 flex flex-col gap-2"
            style={{ background:'var(--nav-bg-scrolled)', backdropFilter:'blur(24px)', border:'1px solid var(--border-glass)' }}
          >
            {NAV_ITEMS.map((item) => (
              <button key={item.label} onClick={() => scrollTo(item.href)}
                className="font-jetbrains text-[0.8rem] text-left px-4 py-2.5 rounded-lg transition-all duration-200"
                style={{ color:'var(--text-secondary)' }}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
