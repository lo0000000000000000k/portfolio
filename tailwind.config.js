/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue':   '#e8924f',
        'neon-purple': '#8b5cf6',
        'neon-cyan':   '#14b8a6',
        'neon-pink':   '#f43f5e',
        'bg-void':     '#faf6f0',
        'bg-dark':     '#f3ede5',
        'bg-card':     'rgba(255,255,255,0.85)',
        'amber':       '#e8924f',
        'violet':      '#8b5cf6',
        'teal':        '#14b8a6',
        'coral':       '#f43f5e',
        'cream':       '#f5ede0',
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        grotesk: ['var(--font-space-grotesk)', 'sans-serif'],
        jetbrains: ['var(--font-jetbrains)', 'monospace'],
        // Legacy aliases kept so existing className="font-orbitron/rajdhani" still compiles
        orbitron: ['var(--font-syne)', 'sans-serif'],
        rajdhani: ['var(--font-space-grotesk)', 'sans-serif'],
      },
      animation: {
        'pulse-dot': 'pulseDot 2s infinite',
        'spin-slow': 'spin 4s linear infinite',
        blink: 'blink 1s step-end infinite',
        'scroll-line': 'scrollLine 2s ease infinite',
        'float-piece': 'floatPiece 3s ease-in-out infinite',
        'board-glow': 'boardGlow 4s ease-in-out infinite',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(232,146,79,0.35)' },
          '50%': { opacity: '0.7', boxShadow: '0 0 0 6px rgba(232,146,79,0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scrollLine: {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'top' },
          '50%': { transform: 'scaleY(1)', transformOrigin: 'top' },
          '51%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
        },
        floatPiece: {
          '0%, 100%': { transform: 'translateZ(14px) translateY(0px)' },
          '50%': { transform: 'translateZ(14px) translateY(-3px)' },
        },
        boardGlow: {
          '0%, 100%': { boxShadow: '0 0 40px rgba(155,89,255,0.15), 0 20px 50px rgba(0,0,0,0.5)' },
          '50%': { boxShadow: '0 0 60px rgba(0,212,255,0.2), 0 20px 60px rgba(0,0,0,0.6)' },
        },
      },
      backgroundImage: {
        'hero-ambient': 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,255,0.07) 0%, transparent 60%)',
        'grid-overlay': 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(0,212,255,0.5), 0 0 60px rgba(0,212,255,0.15)',
        'glow-purple': '0 0 20px rgba(155,89,255,0.5), 0 0 60px rgba(155,89,255,0.15)',
        'glow-cyan': '0 0 20px rgba(0,255,204,0.5)',
      },
    },
  },
  plugins: [],
}
