'use client';
import { useEffect, useRef } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePosition();
  const rx = useRef(0);
  const ry = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      rx.current += (x - rx.current) * 0.18;
      ry.current += (y - ry.current) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.left = rx.current + 'px';
        ringRef.current.style.top = ry.current + 'px';
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [x, y]);

  useEffect(() => {
    if (dotRef.current) {
      dotRef.current.style.left = x + 'px';
      dotRef.current.style.top = y + 'px';
    }
  }, [x, y]);

  useEffect(() => {
    const interactables = document.querySelectorAll('a, button, .chess-sq, [data-hover]');
    const onEnter = () => {
      dotRef.current?.classList.add('scale-[2.5]', '!bg-[#9b59ff]');
      ringRef.current?.classList.add('scale-150', '!opacity-30');
    };
    const onLeave = () => {
      dotRef.current?.classList.remove('scale-[2.5]', '!bg-[#9b59ff]');
      ringRef.current?.classList.remove('scale-150', '!opacity-30');
    };
    interactables.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
    return () => {
      interactables.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={dotRef} />
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
}
