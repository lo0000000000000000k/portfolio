'use client';
import { useEffect, useRef } from 'react';

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  ox: number; oy: number;
  r: number; alpha: number;
  color: string;
}

const COLORS = ['#e8924f', '#8b5cf6', '#14b8a6', '#f43f5e', '#d97706', '#ec4899'];
const CONNECT_DIST = 220;
const CURSOR_RADIUS = 260;
const ATTRACT_STRENGTH = 0.022;
const REPEL_RADIUS = 80;
const SPRING_STRENGTH = 0.0025;
const DAMPING = 0.88;

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let animId: number;

    const nodeCount = Math.min(140, Math.floor((W * H) / 9000));

    const nodes: Node[] = Array.from({ length: nodeCount }, () => {
      const x = Math.random() * W;
      const y = Math.random() * H;
      return {
        x, y, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        ox: x, oy: y, r: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.7 + 0.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    });

    const animate = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Update physics
      for (const n of nodes) {
        const dx = mx - n.x;
        const dy = my - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CURSOR_RADIUS && dist > 0) {
          if (dist < REPEL_RADIUS) {
            // Repel when very close
            const f = (1 - dist / REPEL_RADIUS) * 0.06;
            n.vx -= (dx / dist) * f * 12;
            n.vy -= (dy / dist) * f * 12;
          } else {
            // Attract in outer ring
            const f = (1 - dist / CURSOR_RADIUS) * ATTRACT_STRENGTH;
            n.vx += (dx / dist) * f * dist * 0.1;
            n.vy += (dy / dist) * f * dist * 0.1;
          }
        }
        n.vx += (n.ox - n.x) * SPRING_STRENGTH;
        n.vy += (n.oy - n.y) * SPRING_STRENGTH;
        n.vx *= DAMPING; n.vy *= DAMPING;
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0) n.x += W; if (n.x > W) n.x -= W;
        if (n.y < 0) n.y += H; if (n.y > H) n.y -= H;
      }

      ctx.clearRect(0, 0, W, H);

      // Lines — visible on light background
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d >= CONNECT_DIST) continue;
          const aNear = Math.hypot(a.x - mx, a.y - my) < CURSOR_RADIUS;
          const bNear = Math.hypot(b.x - mx, b.y - my) < CURSOR_RADIUS;
          const near = aNear || bNear;
          const fade = 1 - d / CONNECT_DIST;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          if (near) {
            // Use the color of the nearest node when cursor is close
            ctx.strokeStyle = aNear ? a.color : b.color;
            ctx.globalAlpha = fade * 0.65;
            ctx.lineWidth = 1.2;
          } else {
            ctx.strokeStyle = 'rgba(160,120,80,1)';
            ctx.globalAlpha = fade * 0.18;
            ctx.lineWidth = 0.5;
          }
          ctx.stroke();
        }
      }

      // Cursor glow
      if (mx > 0) {
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, CURSOR_RADIUS * 0.5);
        g.addColorStop(0, 'rgba(232,146,79,0.08)');
        g.addColorStop(0.5, 'rgba(139,92,246,0.04)');
        g.addColorStop(1, 'rgba(232,146,79,0)');
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(mx, my, CURSOR_RADIUS * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nodes
      for (const n of nodes) {
        const dCursor = Math.hypot(n.x - mx, n.y - my);
        const near = dCursor < CURSOR_RADIUS;
        const boost = near ? (1 - dCursor / CURSOR_RADIUS) : 0;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (1 + boost * 1.2), 0, Math.PI * 2);
        ctx.fillStyle = near ? n.color : n.color;
        ctx.globalAlpha = near ? Math.min(1, n.alpha * 1.8) : n.alpha * 0.85;
        ctx.fill();
        if (near && boost > 0.3) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
          ctx.fillStyle = n.color;
          ctx.globalAlpha = boost * 0.08;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    };
    animate();

    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    let rf: number;
    const onResize = () => {
      cancelAnimationFrame(rf);
      rf = requestAnimationFrame(() => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        for (const n of nodes) { n.ox = n.x = Math.random() * W; n.oy = n.y = Math.random() * H; }
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true" style={{ willChange: 'transform' }} />
  );
}
