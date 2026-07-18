'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';
import emailjs from '@emailjs/browser';

type State = 'idle' | 'sending' | 'sent' | 'error';

/* ── rating stars ── */
function Stars({ rating, onChange }: { rating: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.button
          key={n}
          type="button"
          whileHover={{ scale: 1.3, y: -3 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 18 }}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          fontSize: 22,
          color: n <= (hovered || rating) ? '#c8922a' : '#c8c0a0',
          transition: 'color 0.15s',
          fontFamily: 'monospace',
          fontWeight: 700,
          lineHeight: 1,
          filter: 'none',
        }}
        >
          ★
        </motion.button>
      ))}
    </div>
  );
}

export default function ReviewNote() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const [name, setName]       = useState('');
  const [review, setReview]   = useState('');
  const [rating, setRating]   = useState(0);
  const [state, setState]     = useState<State>('idle');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!review.trim() || state === 'sending') return;

    setState('sending');
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          name:    name.trim() || 'Anonymous Visitor',
          email:   'portfolio-review@noreply.com',
          message: `⭐ Rating: ${rating}/5\n\n${review.trim()}`,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      );
      setState('sent');
      setName('');
      setReview('');
      setRating(0);
      setTimeout(() => setState('idle'), 4000);
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  }, [name, review, rating, state]);

  /* shared input style */
  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.55)',
    border: '1.5px solid rgba(180,150,80,0.35)',
    borderRadius: 6,
    padding: '9px 12px',
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: 13,
    color: '#3a2c10',
    outline: 'none',
    resize: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  };

  return (
    <div ref={ref} style={{ display: 'flex', justifyContent: 'center', padding: '60px 24px 80px' }}>
      <motion.div
        initial={{ opacity: 0, y: 60, rotate: -1.5 }}
        animate={isInView ? { opacity: 1, y: 0, rotate: -1.2 } : {}}
        transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.1 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 520,
          background: '#fff9c4',
          borderRadius: 4,
          padding: '32px 36px 36px',
          boxShadow:
            '4px 8px 24px rgba(0,0,0,0.13),' +
            '-2px -2px 0 rgba(0,0,0,0.05),' +
            'inset 0 -3px 8px rgba(180,150,60,0.08)',
        }}
      >
        {/* Tape strip at top */}
        <div style={{
          position: 'absolute',
          top: -12, left: '50%',
          transform: 'translateX(-50%) rotate(-1deg)',
          width: 72, height: 20,
          background: 'rgba(255,230,100,0.55)',
          border: '0.5px solid rgba(200,180,60,0.2)',
          borderRadius: 2,
          zIndex: 2,
        }} />

        {/* Pin at top right */}
        <div style={{
          position: 'absolute',
          top: -10, right: 28,
          width: 14, height: 14,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #ff6b6b, #c0392b)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          zIndex: 3,
        }} />

        {/* Ruled lines */}
        {[0,1,2,3,4,5,6,7].map(i => (
          <div key={i} style={{
            position: 'absolute',
            left: 36, right: 36,
            top: 80 + i * 32,
            height: 1,
            background: 'rgba(180,150,80,0.18)',
            pointerEvents: 'none',
          }} />
        ))}

        {/* Header */}
        <div style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 11,
          letterSpacing: '0.18em',
          color: '#a08040',
          marginBottom: 6,
          textAlign: 'center',
        }}>
          — LEAVE A NOTE —
        </div>

        <motion.h3
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.35 }}
          style={{
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: 22,
            fontWeight: 700,
            color: '#3a2810',
            textAlign: 'center',
            marginBottom: 20,
            letterSpacing: '-0.01em',
          }}
        >
          What do you think?
        </motion.h3>

        <AnimatePresence mode="wait">
          {state === 'sent' ? (
            /* ── Thank you state ── */
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ textAlign: 'center', padding: '24px 0' }}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -6, 4, 0] }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{ fontSize: 44, marginBottom: 12, color: '#3a2810', fontFamily: '"Courier New", Courier, monospace' }}
              >
                ✓
              </motion.div>
              <p style={{
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 16, fontWeight: 700, color: '#3a2810',
                marginBottom: 6,
              }}>Note delivered!</p>
              <p style={{
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 12, color: '#8a7a50',
              }}>Thank you — it means a lot.</p>
            </motion.div>
          ) : (
            /* ── Form ── */
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              {/* Stars */}
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 11, color: '#8a7a50', marginBottom: 6,
                }}>RATING</label>
                <Stars rating={rating} onChange={setRating} />
              </div>

              {/* Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 11, color: '#8a7a50', marginBottom: 5,
                }}>YOUR NAME (optional)</label>
                <input
                  type="text"
                  placeholder="Anonymous Visitor"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={60}
                  style={inputStyle}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = 'rgba(160,120,40,0.6)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200,160,60,0.12)';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = 'rgba(180,150,80,0.35)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Review */}
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 11, color: '#8a7a50', marginBottom: 5,
                }}>YOUR THOUGHTS *</label>
                <textarea
                  placeholder="Scribble your thoughts here — feedback, appreciation, or random musings…"
                  value={review}
                  onChange={e => setReview(e.target.value)}
                  required
                  rows={4}
                  maxLength={500}
                  style={{ ...inputStyle, lineHeight: 1.65 }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = 'rgba(160,120,40,0.6)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200,160,60,0.12)';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = 'rgba(180,150,80,0.35)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <div style={{
                  textAlign: 'right',
                  fontFamily: 'monospace', fontSize: 10,
                  color: review.length > 450 ? '#c0392b' : '#a08040',
                  marginTop: 3,
                }}>{review.length}/500</div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={state === 'sending' || !review.trim()}
                whileHover={review.trim() ? { scale: 1.03, y: -2 } : {}}
                whileTap={review.trim() ? { scale: 0.97 } : {}}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  borderRadius: 6,
                  border: 'none',
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  cursor: review.trim() ? 'pointer' : 'not-allowed',
                  transition: 'background 0.2s',
                  background: state === 'error'
                    ? 'rgba(192,57,43,0.85)'
                    : state === 'sending'
                    ? 'rgba(120,100,50,0.5)'
                    : 'rgba(60,40,14,0.82)',
                  color: '#fff9c4',
                  opacity: !review.trim() ? 0.5 : 1,
                  boxShadow: '0 3px 10px rgba(0,0,0,0.12)',
                }}
              >
                {state === 'sending' ? 'POSTING…' : state === 'error' ? 'FAILED — TRY AGAIN' : 'SEND NOTE'}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
