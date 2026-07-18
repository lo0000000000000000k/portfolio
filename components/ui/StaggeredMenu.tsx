'use client';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StaggeredMenuItem {
  label:     string;
  ariaLabel?: string;
  href:      string;      // section id e.g. '#about' or full URL
}

export interface StaggeredMenuSocialItem {
  label: string;
  href:  string;
}

interface StaggeredMenuProps {
  position?:             'left' | 'right';
  colors?:               string[];
  items?:                StaggeredMenuItem[];
  socialItems?:          StaggeredMenuSocialItem[];
  displaySocials?:       boolean;
  displayItemNumbering?: boolean;
  className?:            string;
  logoText?:             string;
  menuButtonColor?:      string;
  openMenuButtonColor?:  string;
  accentColor?:          string;
  changeMenuColorOnOpen?: boolean;
  closeOnClickAway?:     boolean;
  onMenuOpen?:           () => void;
  onMenuClose?:          () => void;
  /** Optional extra slot rendered inside the panel (e.g. theme toggle) */
  extraPanelContent?:    React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const StaggeredMenu = ({
  position              = 'right',
  colors                = ['#0d0d1a', '#1a0a2e'],
  items                 = [],
  socialItems           = [],
  displaySocials        = true,
  displayItemNumbering  = true,
  className,
  logoText              = 'HM',
  menuButtonColor       = '#fff',
  openMenuButtonColor   = '#fff',
  changeMenuColorOnOpen = true,
  accentColor           = '#00d4ff',
  closeOnClickAway      = true,
  onMenuOpen,
  onMenuClose,
  extraPanelContent,
}: StaggeredMenuProps) => {
  const [open, setOpen]           = useState(false);
  const openRef                   = useRef(false);
  const panelRef                  = useRef<HTMLElement>(null);
  const preLayersRef              = useRef<HTMLDivElement>(null);
  const preLayerElsRef            = useRef<Element[]>([]);
  const plusHRef                  = useRef<HTMLSpanElement>(null);
  const plusVRef                  = useRef<HTMLSpanElement>(null);
  const iconRef                   = useRef<HTMLSpanElement>(null);
  const textInnerRef              = useRef<HTMLSpanElement>(null);
  const textWrapRef               = useRef<HTMLSpanElement>(null);
  const [textLines, setTextLines] = useState<string[]>(['Menu', 'Close']);
  const openTlRef                 = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef             = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef              = useRef<gsap.core.Timeline | null>(null);
  const textCycleAnimRef          = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef             = useRef<gsap.core.Tween | null>(null);
  const toggleBtnRef              = useRef<HTMLButtonElement>(null);
  const busyRef                   = useRef(false);
  const itemEntranceTweenRef      = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel     = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH     = plusHRef.current;
      const plusV     = plusVRef.current;
      const icon      = iconRef.current;
      const textInner = textInnerRef.current;
      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      const preLayers = preContainer
        ? Array.from(preContainer.querySelectorAll('.sm-prelayer'))
        : [];
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
      if (preContainer) gsap.set(preContainer, { xPercent: 0, opacity: 1 });
      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon,  { rotate: 0, transformOrigin: '50% 50%' });
      gsap.set(textInner, { yPercent: 0 });
      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel  = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    closeTweenRef.current?.kill();
    closeTweenRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const itemEls     = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const numberEls   = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));

    const offscreen   = position === 'left' ? -100 : 100;
    const layerStates = layers.map(el => ({ el, start: offscreen }));

    if (itemEls.length)   gsap.set(itemEls,   { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as string]: 0 });
    if (socialTitle)      gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });

    const lastTime       = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration  = 0.65;

    tl.fromTo(panel, { xPercent: offscreen }, { xPercent: 0, duration: panelDuration, ease: 'power4.out' }, panelInsertTime);

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(itemEls, { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } }, itemsStart);
      if (numberEls.length) {
        tl.to(numberEls, { duration: 0.6, ease: 'power2.out', ['--sm-num-opacity' as string]: 1, stagger: { each: 0.08, from: 'start' } }, itemsStart + 0.1);
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle)      tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
      if (socialLinks.length) {
        tl.to(socialLinks, {
          y: 0, opacity: 1, duration: 0.55, ease: 'power3.out',
          stagger: { each: 0.08, from: 'start' },
          onComplete: () => gsap.set(socialLinks, { clearProps: 'opacity' }),
        }, socialsStart + 0.04);
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => { busyRef.current = false; });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel  = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const offscreen = position === 'left' ? -100 : 100;
    closeTweenRef.current?.kill();
    closeTweenRef.current = gsap.to([...layers, panel], {
      xPercent: offscreen, duration: 0.32, ease: 'power3.in', overwrite: 'auto',
      onComplete: () => {
        const itemEls   = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        const sTitle    = panel.querySelector('.sm-socials-title');
        const sLinks    = Array.from(panel.querySelectorAll('.sm-socials-link'));
        if (itemEls.length)   gsap.set(itemEls,   { yPercent: 140, rotate: 10 });
        if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as string]: 0 });
        if (sTitle)           gsap.set(sTitle,     { opacity: 0 });
        if (sLinks.length)    gsap.set(sLinks,     { y: 25, opacity: 0 });
        busyRef.current = false;
      },
    });
  }, [position]);

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;
    const h    = plusHRef.current;
    const v    = plusVRef.current;
    if (!icon || !h || !v) return;
    spinTweenRef.current?.kill();
    if (opening) {
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      spinTweenRef.current = gsap.timeline({ defaults: { ease: 'power4.out' } })
        .to(h, { rotate: 45,  duration: 0.5 }, 0)
        .to(v, { rotate: -45, duration: 0.5 }, 0);
    } else {
      spinTweenRef.current = gsap.timeline({ defaults: { ease: 'power3.inOut' } })
        .to(h,    { rotate: 0,  duration: 0.35 }, 0)
        .to(v,    { rotate: 90, duration: 0.35 }, 0)
        .to(icon, { rotate: 0,  duration: 0.001 }, 0);
    }
  }, []);

  const animateColor = useCallback((opening: boolean) => {
    const btn = toggleBtnRef.current;
    if (!btn) return;
    colorTweenRef.current?.kill();
    if (changeMenuColorOnOpen) {
      const target = opening ? openMenuButtonColor : menuButtonColor;
      colorTweenRef.current = gsap.to(btn, { color: target, delay: 0.18, duration: 0.3, ease: 'power2.out' });
    } else {
      gsap.set(btn, { color: menuButtonColor });
    }
  }, [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]);

  React.useEffect(() => {
    if (toggleBtnRef.current) {
      const target = changeMenuColorOnOpen
        ? (openRef.current ? openMenuButtonColor : menuButtonColor)
        : menuButtonColor;
      gsap.set(toggleBtnRef.current, { color: target });
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();
    const current = opening ? 'Menu' : 'Close';
    const target  = opening ? 'Close' : 'Menu';
    const cycles  = 3;
    const seq: string[] = [current];
    let last = current;
    for (let i = 0; i < cycles; i++) { last = last === 'Menu' ? 'Close' : 'Menu'; seq.push(last); }
    if (last !== target) seq.push(target);
    seq.push(target);
    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });
    const finalShift = ((seq.length - 1) / seq.length) * 100;
    textCycleAnimRef.current = gsap.to(inner, { yPercent: -finalShift, duration: 0.5 + seq.length * 0.07, ease: 'power4.out' });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);
    if (target) { onMenuOpen?.(); playOpen(); }
    else         { onMenuClose?.(); playClose(); }
    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  const closeMenu = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setOpen(false);
    onMenuClose?.();
    playClose();
    animateIcon(false);
    animateColor(false);
    animateText(false);
  }, [playClose, animateIcon, animateColor, animateText, onMenuClose]);

  // Scroll-aware link click
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.replace('#', '');
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => closeMenu(), 200);
    }
  }, [closeMenu]);

  // Click-away
  React.useEffect(() => {
    if (!closeOnClickAway || !open) return;
    const handle = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        toggleBtnRef.current && !toggleBtnRef.current.contains(e.target as Node)
      ) closeMenu();
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [closeOnClickAway, open, closeMenu]);

  const posRight = position === 'right';

  return (
    <div className="sm-scope fixed top-0 left-0 w-screen h-screen z-[900] pointer-events-none">
      <div
        className={(className ? className + ' ' : '') + 'staggered-menu-wrapper pointer-events-none relative w-full h-full'}
        style={accentColor ? { ['--sm-accent' as string]: accentColor } : undefined}
        data-position={position}
        data-open={open || undefined}
      >
        {/* Pre-layers */}
        <div
          ref={preLayersRef}
          className="sm-prelayers absolute top-0 bottom-0 pointer-events-none z-[5]"
          style={{ right: posRight ? 0 : 'auto', left: posRight ? 'auto' : 0 }}
          aria-hidden="true"
        >
          {(colors.length >= 3 ? [...colors.slice(0, 2), ...colors.slice(3)] : colors).map((c, i) => (
            <div key={i} className="sm-prelayer absolute top-0 right-0 h-full w-full" style={{ background: c }} />
          ))}
        </div>

        {/* Toggle button — floats in top corner, always pointer-events-auto */}
        <div
          className="absolute top-0 pointer-events-none z-[20] w-full flex items-center justify-between"
          style={{ padding: '1.5rem 2rem' }}
        >
          {/* Logo slot */}
          <button
            onClick={() => handleNavClick({ preventDefault: () => {} } as React.MouseEvent<HTMLAnchorElement>, '#hero')}
            className="font-orbitron text-base font-bold tracking-[0.2em] pointer-events-auto"
            style={{
              background: 'linear-gradient(135deg,#00d4ff,#00ffcc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {logoText}
          </button>

          {/* Menu toggle */}
          <button
            ref={toggleBtnRef}
            className="sm-toggle relative inline-flex items-center gap-2 bg-transparent border-0 cursor-pointer font-medium leading-none pointer-events-auto font-jetbrains text-[0.8rem] tracking-[0.1em]"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            type="button"
          >
            <span
              ref={textWrapRef}
              className="sm-toggle-textWrap relative inline-block h-[1em] overflow-hidden whitespace-nowrap"
              aria-hidden="true"
            >
              <span ref={textInnerRef} className="sm-toggle-textInner flex flex-col leading-none">
                {textLines.map((l, i) => (
                  <span className="sm-toggle-line block h-[1em] leading-none" key={i}>{l}</span>
                ))}
              </span>
            </span>

            <span
              ref={iconRef}
              className="sm-icon relative shrink-0 inline-flex items-center justify-center"
              style={{ width: 14, height: 14 }}
              aria-hidden="true"
            >
              <span ref={plusHRef} className="sm-icon-line absolute left-1/2 top-1/2 w-full bg-current rounded-sm" style={{ height: 2, transform: 'translate(-50%,-50%)' }} />
              <span ref={plusVRef} className="sm-icon-line absolute left-1/2 top-1/2 w-full bg-current rounded-sm" style={{ height: 2, transform: 'translate(-50%,-50%)' }} />
            </span>
          </button>
        </div>

        {/* Panel */}
        <aside
          id="staggered-menu-panel"
          ref={panelRef}
          className="staggered-menu-panel absolute top-0 h-full flex flex-col overflow-y-auto z-10 pointer-events-auto"
          style={{
            right:           posRight ? 0 : 'auto',
            left:            posRight ? 'auto' : 0,
            width:           'clamp(280px, 40vw, 460px)',
            padding:         '7em 2.5em 2.5em',
            background:      '#070712',
            borderLeft:      posRight ? '1px solid rgba(0,212,255,0.08)' : 'none',
            borderRight:     posRight ? 'none' : '1px solid rgba(0,212,255,0.08)',
          }}
          aria-hidden={!open}
        >
          <div className="sm-panel-inner flex-1 flex flex-col gap-5">
            <ul
              className="sm-panel-list list-none m-0 p-0 flex flex-col gap-1"
              role="list"
              data-numbering={displayItemNumbering || undefined}
            >
              {items.length ? items.map((it, idx) => (
                <li className="sm-panel-itemWrap relative overflow-hidden leading-none" key={it.label + idx}>
                  <a
                    className="sm-panel-item relative font-syne font-bold cursor-pointer leading-none uppercase inline-block no-underline"
                    href={it.href}
                    aria-label={it.ariaLabel}
                    data-index={idx + 1}
                    onClick={e => handleNavClick(e, it.href)}
                    style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-1px', color: '#e8e8f0', paddingRight: '1.4em' }}
                  >
                    <span className="sm-panel-itemLabel inline-block" style={{ transformOrigin: '50% 100%', willChange: 'transform' }}>
                      {it.label}
                    </span>
                  </a>
                </li>
              )) : (
                <li className="sm-panel-itemWrap" aria-hidden="true">
                  <span className="sm-panel-item font-syne font-bold text-[3rem] text-[#e8e8f0] uppercase inline-block">
                    <span className="sm-panel-itemLabel inline-block">No items</span>
                  </span>
                </li>
              )}
            </ul>

            {extraPanelContent && (
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(0,212,255,0.1)' }}>
                {extraPanelContent}
              </div>
            )}

            {displaySocials && socialItems.length > 0 && (
              <div className="sm-socials mt-auto pt-8 flex flex-col gap-3" aria-label="Social links">
                <h3 className="sm-socials-title m-0 font-jetbrains text-[0.68rem] tracking-[0.25em]" style={{ color: accentColor }}>
                  FIND ME
                </h3>
                <ul className="sm-socials-list list-none m-0 p-0 flex flex-row items-center gap-4 flex-wrap" role="list">
                  {socialItems.map((s, i) => (
                    <li key={s.label + i} className="sm-socials-item">
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm-socials-link font-grotesk text-[1rem] font-medium no-underline inline-block py-[2px]"
                        style={{ color: '#9ca3af', transition: 'color 0.2s ease' }}
                        onMouseEnter={e => (e.currentTarget.style.color = accentColor ?? '#00d4ff')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>

      <style>{`
        .sm-scope .staggered-menu-panel { position: absolute; top: 0; }
        .sm-scope .sm-prelayers { position: absolute; top: 0; bottom: 0; width: clamp(280px, 40vw, 460px); pointer-events: none; z-index: 5; }
        .sm-scope [data-position='left'] .sm-prelayers { right: auto; left: 0; }
        .sm-scope .sm-prelayer { position: absolute; top: 0; right: 0; height: 100%; width: 100%; }
        .sm-scope .sm-panel-list { counter-reset: smItem; }
        .sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
        .sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after {
          counter-increment: smItem;
          content: counter(smItem, decimal-leading-zero);
          position: absolute; top: 0.15em; right: 0.4em;
          font-size: 0.9rem; font-family: 'JetBrains Mono', monospace;
          font-weight: 400; letter-spacing: 0; pointer-events: none; user-select: none;
          opacity: var(--sm-num-opacity, 0);
          color: var(--sm-accent, #00d4ff);
        }
        .sm-scope .sm-panel-item { position: relative; }
        .sm-scope .sm-panel-item:hover .sm-panel-itemLabel { color: var(--sm-accent, #00d4ff); }
        .sm-scope .sm-panel-itemLabel { transition: color 0.2s ease; }
        .sm-scope .sm-toggle-textInner { display: flex; flex-direction: column; line-height: 1; }
        .sm-scope .sm-toggle-line { display: block; height: 1em; line-height: 1; }
        .sm-scope .sm-toggle-textWrap { height: 1em; overflow: hidden; white-space: nowrap; }
        .sm-scope .sm-icon-line { will-change: transform; }
        .sm-scope .sm-panel-itemWrap { position: relative; overflow: hidden; line-height: 1; }
        .sm-scope .sm-socials-list .sm-socials-link { opacity: 1; transition: opacity 0.3s ease; }
        .sm-scope .sm-socials-list:hover .sm-socials-link:not(:hover) { opacity: 0.4; }
        @media (max-width: 640px) {
          .sm-scope .staggered-menu-panel { width: 100% !important; left: 0 !important; right: 0 !important; }
          .sm-scope .sm-prelayers { width: 100% !important; left: 0 !important; right: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default StaggeredMenu;
