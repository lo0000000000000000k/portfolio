'use client';
import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHESS_PUZZLES } from '@/lib/data';
import GlassCard from '@/components/ui/GlassCard';

const PIECES: Record<string, string> = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟',
};

function sqToAlg(r: number, c: number) {
  return 'abcdefgh'[c] + (8 - r);
}

function parseFen(fen: string): string[][] {
  return fen.split(' ')[0].split('/').map((row) => {
    const cells: string[] = [];
    for (const ch of row) {
      if ('12345678'.includes(ch)) for (let i = 0; i < parseInt(ch); i++) cells.push('');
      else cells.push(ch);
    }
    return cells;
  });
}

const Chess = memo(function Chess() {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const puzzle = CHESS_PUZZLES[puzzleIdx];
  const [board, setBoard] = useState<string[][]>(() => parseFen(puzzle.fen));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [hints, setHints] = useState<Set<string>>(new Set());
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState<string[]>([]);
  const [moveIdx, setMoveIdx] = useState(0);
  const [solved, setSolved] = useState(false);
  const [timerSec, setTimerSec] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 3D tilt — stored as refs so mouse events never trigger re-render
  const boardWrapRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef({ rx: 32, ry: 0 });

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerSec(0);
    timerRef.current = setInterval(() => setTimerSec((s) => s + 1), 1000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  // Board mouse-tilt — mutates DOM directly for zero lag
  const handleBoardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = 32 + ((e.clientY - cy) / rect.height) * 6;
    const ry = ((e.clientX - cx) / rect.width) * -8;
    tiltRef.current = { rx, ry };
    if (boardWrapRef.current) {
      boardWrapRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
  }, []);

  const handleBoardMouseLeave = useCallback(() => {
    tiltRef.current = { rx: 32, ry: 0 };
    if (boardWrapRef.current) {
      boardWrapRef.current.style.transform = 'rotateX(32deg) rotateY(0deg)';
    }
  }, []);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const clearSelection = useCallback(() => {
    setSelected(null);
    setHints(new Set());
    setHighlighted(new Set());
  }, []);

  const handleSquareClick = useCallback((r: number, c: number) => {
    if (solved) return;
    const key = `${r},${c}`;
    const piece = board[r][c];

    if (selected) {
      const [sr, sc] = selected;
      if (sr === r && sc === c) { clearSelection(); return; }
      const move = sqToAlg(sr, sc) + sqToAlg(r, c);
      setBoard((prev) => {
        const next = prev.map((row) => [...row]);
        next[r][c] = next[sr][sc];
        next[sr][sc] = '';
        return next;
      });
      setMoves((prev) => [...prev, move]);
      setHighlighted(new Set([`${sr},${sc}`, key]));
      clearSelection();
      setMoveIdx((prev) => {
        const nextIdx = prev + 1;
        if (nextIdx >= puzzle.solution.length) {
          setSolved(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
        return nextIdx;
      });
    } else if (piece) {
      setSelected([r, c]);
      const offsets = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
      const hSet = new Set<string>();
      offsets.forEach(([dr, dc]) => {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) hSet.add(`${nr},${nc}`);
      });
      setHints(hSet);
    }
  }, [solved, board, selected, clearSelection, puzzle.solution.length]);

  const showSolution = useCallback(() => {
    puzzle.solution.forEach((m, i) => {
      setTimeout(() => {
        const fc = m.charCodeAt(0) - 97, fr = 8 - parseInt(m[1]);
        const tc = m.charCodeAt(2) - 97, tr = 8 - parseInt(m[3]);
        setBoard((prev) => {
          const next = prev.map((r) => [...r]);
          next[tr][tc] = next[fr][fc];
          next[fr][fc] = '';
          return next;
        });
        setHighlighted(new Set([`${fr},${fc}`, `${tr},${tc}`]));
        setMoves((prev) => [...prev, m]);
        if (i === puzzle.solution.length - 1) {
          setSolved(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, i * 700);
    });
  }, [puzzle.solution]);

  const resetPuzzle = useCallback(() => {
    const next = (puzzleIdx + 1) % CHESS_PUZZLES.length;
    setPuzzleIdx(next);
    const np = CHESS_PUZZLES[next];
    setBoard(parseFen(np.fen));
    setSelected(null); setHints(new Set()); setHighlighted(new Set());
    setMoves([]); setMoveIdx(0); setSolved(false);
    startTimer();
  }, [puzzleIdx, startTimer]);

  return (
    <section id="chess" className="relative z-[2]" style={{ background: 'linear-gradient(180deg, transparent, rgba(155,89,255,0.025) 50%, transparent)' }}>
      <div className="max-w-[1100px] mx-auto px-6 py-[100px]">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }} className="mb-14">
          <div className="flex items-center gap-3 font-jetbrains text-[0.68rem] tracking-[0.35em] mb-3" style={{ color: 'var(--neon-cyan)' }}>
            <span className="block w-[30px] h-px" style={{ background: 'var(--neon-cyan)' }} />
            CHESS
          </div>
          <h2 className="font-syne font-bold" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', background: 'linear-gradient(135deg, var(--text-primary), var(--neon-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Daily Puzzle
          </h2>
          <p className="mt-2 font-grotesk text-[0.95rem]" style={{ color: 'var(--text-secondary)' }}>
            3D interactive chess — click a piece then a target square
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

          {/* ── 3D Board ── */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="p-6 rounded-2xl" style={{ background: 'rgba(8,15,30,0.85)', border: '1px solid var(--border-glass)', backdropFilter: 'blur(20px)' }}>

              {/* Timer bar */}
              <div className="flex justify-between items-center mb-5">
                <div className="font-syne text-[0.85rem] font-semibold tracking-[0.12em]" style={{ color: 'var(--neon-purple)' }}>
                  ♟ PUZZLE MODE
                </div>
                <div className="font-jetbrains text-[0.9rem] font-bold tracking-[0.1em] px-3.5 py-1.5 rounded-lg" style={{ color: 'var(--neon-cyan)', background: 'rgba(0,255,204,0.07)', border: '1px solid rgba(0,255,204,0.2)' }}>
                  {formatTime(timerSec)}
                </div>
              </div>

              {/* 3D scene wrapper */}
              <div className="chess-3d-scene select-none" onMouseMove={handleBoardMouseMove} onMouseLeave={handleBoardMouseLeave}>
                <div ref={boardWrapRef} className="chess-3d-board-wrap">
                  <div className="chess-3d-grid relative" style={{ aspectRatio: '1' }}>

                    {board.map((row, r) =>
                      row.map((piece, c) => {
                        const key = `${r},${c}`;
                        const isLight = (r + c) % 2 === 0;
                        const isSelected = selected?.[0] === r && selected?.[1] === c;
                        const isHint = hints.has(key);
                        const isHighlighted = highlighted.has(key);
                        const isWhitePiece = piece && piece === piece.toUpperCase();
                        return (
                          <div
                            key={key}
                            onClick={() => handleSquareClick(r, c)}
                            className={`sq ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''} ${isHint ? 'hint-sq' : ''} ${isHighlighted ? 'highlight' : ''}`}
                          >
                            {piece && (
                              <span className={`piece-char ${isWhitePiece ? 'piece-white' : 'piece-black'}`}>
                                {PIECES[piece]}
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}

                    {/* Solved overlay */}
                    <AnimatePresence>
                      {solved && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-lg z-10" style={{ background: 'rgba(8,15,30,0.92)', backdropFilter: 'blur(12px)' }}>
                          <div className="text-6xl animate-solved-king">♚</div>
                          <div className="font-syne text-xl font-bold tracking-[0.08em]" style={{ color: 'var(--neon-cyan)' }}>PUZZLE SOLVED!</div>
                          <div className="font-jetbrains text-[0.75rem]" style={{ color: 'var(--text-secondary)' }}>Solved in {formatTime(timerSec)} 🔥</div>
                          <button onClick={resetPuzzle} className="font-jetbrains text-[0.75rem] tracking-[0.1em] px-5 py-2.5 rounded-lg mt-2 transition-all duration-200 hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, var(--neon-purple), var(--neon-pink))', color: '#fff', boxShadow: '0 0 20px rgba(155,89,255,0.4)' }}>
                            NEXT PUZZLE
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* File labels */}
              <div className="flex mt-2 px-0.5">
                {['a','b','c','d','e','f','g','h'].map((f) => (
                  <span key={f} className="flex-1 text-center font-jetbrains text-[0.55rem]" style={{ color: 'var(--text-dim)' }}>{f}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Sidebar ── */}
          <div className="flex flex-col gap-4">
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.6 }}>
              <GlassCard className="p-5">
                <div className="font-jetbrains text-[0.62rem] tracking-[0.2em] mb-2" style={{ color: 'var(--neon-cyan)' }}>TODAY&apos;S PUZZLE</div>
                <div className="font-syne text-[1.9rem] font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{puzzle.rating}</div>
                <div className="font-grotesk text-[0.9rem] mb-3" style={{ color: 'var(--text-secondary)' }}>{puzzle.theme}</div>
                <div className="font-jetbrains text-[0.65rem] leading-relaxed" style={{ color: 'var(--text-dim)' }}>{puzzle.hint}</div>
                <div className="h-1 rounded-full mt-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full w-[65%]" style={{ background: 'linear-gradient(90deg, var(--neon-purple), var(--neon-pink))' }} />
                </div>
              </GlassCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.6 }}>
              <GlassCard className="p-5">
                <div className="grid grid-cols-2 gap-4">
                  {[['MOVES', moves.length.toString()], ['PUZZLE', `${puzzleIdx + 1}/${CHESS_PUZZLES.length}`]].map(([label, val]) => (
                    <div key={label}>
                      <div className="font-jetbrains text-[0.6rem] tracking-[0.2em] mb-1" style={{ color: 'var(--text-dim)' }}>{label}</div>
                      <div className="font-syne text-[1.4rem] font-bold" style={{ color: 'var(--neon-purple)' }}>{val}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6 }}>
              <GlassCard className="p-4">
                <div className="font-jetbrains text-[0.62rem] tracking-[0.2em] mb-3" style={{ color: 'var(--text-dim)' }}>MOVE HISTORY</div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {moves.length === 0
                    ? <span className="font-jetbrains text-[0.62rem]" style={{ color: 'var(--text-dim)' }}>No moves yet</span>
                    : moves.map((m, i) => (
                      <span key={i} className="font-jetbrains text-[0.68rem] px-2.5 py-1 rounded-md" style={{ color: 'var(--neon-cyan)', background: 'rgba(0,255,204,0.05)', border: '1px solid rgba(0,255,204,0.2)' }}>{m}</span>
                    ))}
                </div>
              </GlassCard>
            </motion.div>

            <button onClick={showSolution} className="font-jetbrains text-[0.75rem] tracking-[0.1em] py-3 rounded-xl w-full transition-all duration-200 hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, var(--neon-purple), var(--neon-pink))', color: '#fff', boxShadow: '0 0 20px rgba(155,89,255,0.3)' }}>
              SHOW SOLUTION
            </button>
            <button onClick={resetPuzzle} className="font-jetbrains text-[0.75rem] tracking-[0.1em] py-3 rounded-xl w-full transition-all duration-200" style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-glass)', background: 'transparent' }}>
              NEW PUZZLE
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Chess;
