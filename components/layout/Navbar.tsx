'use client';
import dynamic from 'next/dynamic';
import { useTheme } from '@/hooks/useTheme';
import { AnimatePresence, motion } from 'framer-motion';

const StaggeredMenu = dynamic(
  () => import('@/components/ui/StaggeredMenu').then(m => m.StaggeredMenu),
  { ssr: false }
);

const NAV_ITEMS = [
  { label: 'Home',     ariaLabel: 'Go to home section',         href: '#hero'     },
  { label: 'About',   ariaLabel: 'Learn about me',              href: '#about'    },
  { label: 'Projects',ariaLabel: 'View my projects',            href: '#projects' },
  { label: 'Vibes',   ariaLabel: 'See my vibes board',          href: '#vibes'    },
  { label: 'Certs',   ariaLabel: 'View my certifications',      href: '#certs'    },
  { label: 'Contact', ariaLabel: 'Get in touch',                href: '#contact'  },
];

const SOCIAL_ITEMS = [
  { label: 'GitHub',   href: 'https://github.com/lo0000000000000000k'              },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/harshitmalik015248/'      },
];

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function Navbar() {
  const { theme, toggle, isDark } = useTheme();

  const themeToggle = (
    <div className="flex items-center gap-3">
      <span className="font-jetbrains text-[0.65rem] tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
        THEME
      </span>
      <motion.button
        onClick={toggle}
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.08 }}
        aria-label="Toggle theme"
        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
        style={{
          background: isDark ? 'rgba(232,146,79,0.15)' : 'rgba(28,17,8,0.08)',
          color: '#00d4ff',
          border: '1px solid rgba(0,212,255,0.2)',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={theme}
            initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0,   opacity: 1, scale: 1   }}
            exit={{    rotate:  30, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.22 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );

  return (
    <StaggeredMenu
      position="right"
      items={NAV_ITEMS}
      socialItems={SOCIAL_ITEMS}
      displaySocials
      displayItemNumbering={false}
      logoText="HM"
      menuButtonColor="#ffffff"
      openMenuButtonColor="#ffffff"
      changeMenuColorOnOpen
      accentColor="#00d4ff"
      colors={['#0a0a18', '#0d0d22']}
      extraPanelContent={themeToggle}
    />
  );
}
