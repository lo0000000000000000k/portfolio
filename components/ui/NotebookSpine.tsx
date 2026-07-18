import React from 'react';

/**
 * NotebookSpine — the center gutter/binding between two open notebook pages.
 * Rendered between every section to reinforce the "open notebook" feel.
 */
export default function NotebookSpine() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        width: '100%',
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      {/* Full-width horizontal rule — the page edge */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0,
        top: '50%',
        height: 1,
        background: 'var(--border-glass)',
        transform: 'translateY(-50%)',
      }} />

      {/* Spine center strip */}
      <div style={{
        position: 'relative',
        width: 28,
        height: 48,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        flexShrink: 0,
      }}>
        {/* The narrow spine shadow — like the book binding crease */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.07) 35%, rgba(0,0,0,0.13) 50%, rgba(0,0,0,0.07) 65%, transparent 100%)',
          borderRadius: 2,
        }} />

        {/* Stitching dots */}
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: 'rgba(120,90,60,0.35)',
            flexShrink: 0,
          }} />
        ))}
      </div>
    </div>
  );
}
