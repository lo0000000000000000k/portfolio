'use client';
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───────────────────────────────────────────────────────────────────

interface NowPlaying {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumImage?: string | null;
  songUrl?: string;
  progressMs?: number;
  durationMs?: number;
  notSetup?: boolean;
}

interface RecentTrack {
  found: boolean;
  title?: string;
  artist?: string;
  albumImage?: string | null;
  songUrl?: string;
  playedAt?: string; // ISO string
  durationMs?: number;
}

type Phase = 'hidden' | 'popup' | 'widget';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtMs(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Returns "3 min ago", "1 hr ago", etc. */
function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)  return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Spotify Icon ─────────────────────────────────────────────────────────────

const SpotifyIcon = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="white">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

// ─── Equalizer bars (animated when playing) ───────────────────────────────────

const Equalizer = () => (
  <div className="flex gap-[3px] items-end h-4">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-[3px] rounded-full"
        style={{ background: 'rgba(255,255,255,0.85)' }}
        animate={{ height: ['6px', '14px', '6px'] }}
        transition={{ repeat: Infinity, duration: 0.75, delay: i * 0.18 }}
      />
    ))}
  </div>
);

// ─── Album Art ───────────────────────────────────────────────────────────────

const AlbumArt = ({
  src,
  title,
  size,
  spinning,
}: {
  src: string | null | undefined;
  title: string;
  size: number;
  spinning?: boolean;
}) => (
  <div
    className="relative flex-shrink-0 overflow-hidden"
    style={{
      width: size,
      height: size,
      borderRadius: spinning ? '50%' : 10,
      background: 'linear-gradient(135deg,#1db95430,#1db95415)',
      border: '1px solid rgba(29,185,84,0.25)',
    }}
  >
    {src ? (
      <motion.img
        src={src}
        alt={title}
        className="w-full h-full object-cover"
        style={{ borderRadius: 'inherit' }}
        animate={spinning ? { rotate: 360 } : { rotate: 0 }}
        transition={spinning ? { repeat: Infinity, duration: 6, ease: 'linear' } : {}}
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-xl">
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
        >
          ♫
        </motion.span>
      </div>
    )}
    {/* vinyl hole overlay when spinning */}
    {spinning && src && (
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.6) 14%, transparent 40%)' }}
      />
    )}
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const SpotifyPopup = memo(function SpotifyPopup() {
  const [phase, setPhase] = useState<Phase>('hidden');

  // Live now-playing
  const [nowPlaying, setNowPlaying]   = useState<NowPlaying | null>(null);
  // Last listened (fetched when nothing is playing)
  const [recent, setRecent]           = useState<RecentTrack | null>(null);
  // Local progress in ms (interpolated between polls)
  const [localProgress, setLocalProgress] = useState(0);

  const nowRef      = useRef<NowPlaying | null>(null);
  const progressRef = useRef(0);
  const pollRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef     = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Tick the progress bar every second locally ──────────────────────────
  const startTick = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      if (!nowRef.current?.isPlaying) return;
      const dur = nowRef.current.durationMs ?? 0;
      progressRef.current = Math.min(progressRef.current + 1000, dur);
      setLocalProgress(progressRef.current);
    }, 1000);
  }, []);

  // ── Fetch now-playing ────────────────────────────────────────────────────
  const fetchNow = useCallback(async () => {
    try {
      const res  = await fetch('/api/spotify');
      const json: NowPlaying = await res.json();

      // Sync local progress from server
      if (json.progressMs !== undefined) {
        progressRef.current = json.progressMs;
        setLocalProgress(json.progressMs);
      }

      nowRef.current = json;
      setNowPlaying(json);

      // If not playing, fetch last listened
      if (!json.isPlaying && !json.notSetup) {
        fetchRecent();
      }
    } catch { /* silent */ }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch recently played ────────────────────────────────────────────────
  const fetchRecent = useCallback(async () => {
    try {
      const res  = await fetch('/api/spotify/recent');
      const json: RecentTrack = await res.json();
      setRecent(json.found ? json : null);
    } catch { /* silent */ }
  }, []);

  // ── Bootstrap ────────────────────────────────────────────────────────────
  useEffect(() => {
    // Show popup after 2.8s
    const t1 = setTimeout(async () => {
      await fetchNow();
      setPhase('popup');
      // Poll every 10 seconds
      pollRef.current = setInterval(fetchNow, 10_000);
      startTick();
    }, 2800);

    // Collapse to widget after 9s
    const t2 = setTimeout(() => setPhase('widget'), 9000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (pollRef.current) clearInterval(pollRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [fetchNow, startTick]);

  // ─── Derived state ────────────────────────────────────────────────────────
  const isPlaying  = nowPlaying?.isPlaying ?? false;
  const notSetup   = nowPlaying?.notSetup  ?? false;

  // What to display: playing track OR last listened
  const displayTitle  = isPlaying
    ? (nowPlaying?.title  ?? 'Nothing Playing')
    : (recent?.title      ?? nowPlaying?.title ?? 'Nothing Playing');
  const displayArtist = isPlaying
    ? (nowPlaying?.artist  ?? 'Offline')
    : (recent?.artist      ?? nowPlaying?.artist ?? '—');
  const displayArt    = isPlaying
    ? (nowPlaying?.albumImage ?? null)
    : (recent?.albumImage     ?? nowPlaying?.albumImage ?? null);
  const displayUrl    = isPlaying
    ? (nowPlaying?.songUrl  ?? '#')
    : (recent?.songUrl      ?? nowPlaying?.songUrl ?? '#');
  const durationMs    = isPlaying
    ? (nowPlaying?.durationMs  ?? 0)
    : (recent?.durationMs      ?? 0);

  const progressPct = durationMs > 0 ? Math.min((localProgress / durationMs) * 100, 100) : 0;
  const hasData     = !notSetup && (displayTitle !== 'Nothing Playing');

  if (phase === 'hidden') return null;

  return (
    <div className="fixed top-4 left-4 z-[100] pointer-events-none select-none">
      <AnimatePresence mode="wait">

        {/* ── Full popup ─────────────────────────────────────────────────── */}
        {phase === 'popup' && (
          <motion.div
            key="popup"
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0, transition: { duration: 0.4 } }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="pointer-events-auto"
            style={{ width: 300 }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.97)',
                border: '1px solid rgba(29,185,84,0.25)',
                boxShadow: '0 8px 40px rgba(29,185,84,0.15), 0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              {/* ── Header ── */}
              <div
                className="flex items-center gap-2 px-4 py-2.5"
                style={{ background: 'linear-gradient(135deg,#1db954,#17a349)' }}
              >
                <SpotifyIcon />
                <span className="font-jetbrains text-[0.6rem] tracking-[0.2em] text-white flex-1">
                  {isPlaying ? 'NOW PLAYING' : hasData ? 'LAST PLAYED' : 'SPOTIFY'}
                </span>
                {isPlaying && <Equalizer />}
                {!isPlaying && hasData && recent?.playedAt && (
                  <span className="font-jetbrains text-[0.55rem] text-white/70 mr-1">
                    {timeAgo(recent.playedAt)}
                  </span>
                )}
                <button
                  onClick={() => setPhase('widget')}
                  className="text-white/60 hover:text-white ml-1 text-lg leading-none font-light w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              {/* ── Song info ── */}
              <div className="px-4 py-3 flex items-center gap-3">
                <AlbumArt
                  src={displayArt}
                  title={displayTitle}
                  size={52}
                  spinning={isPlaying}
                />
                <div className="min-w-0 flex-1">
                  <a
                    href={displayUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-syne font-bold text-sm truncate block hover:underline"
                    style={{ color: '#1c1108' }}
                  >
                    {displayTitle}
                  </a>
                  <div
                    className="font-grotesk text-xs truncate"
                    style={{ color: '#6b5040' }}
                  >
                    {displayArtist}
                  </div>
                  {/* Live dot pulse when playing */}
                  {isPlaying && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: '#1db954' }}
                        animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                      />
                      <span className="font-jetbrains text-[0.52rem]" style={{ color: '#1db954' }}>
                        LIVE
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Progress bar ── */}
              {(isPlaying || (hasData && durationMs > 0)) && (
                <div className="px-4 pb-3">
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: 'rgba(29,185,84,0.12)' }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #1db954, #17a349)' }}
                      animate={{ width: `${isPlaying ? progressPct : 100}%` }}
                      transition={{ duration: isPlaying ? 1 : 0 }}
                    />
                  </div>
                  {isPlaying && (
                    <div className="flex justify-between mt-1">
                      <span className="font-jetbrains text-[0.55rem]" style={{ color: '#9a7a60' }}>
                        {fmtMs(localProgress)}
                      </span>
                      <span className="font-jetbrains text-[0.55rem]" style={{ color: '#9a7a60' }}>
                        {fmtMs(durationMs)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* ── Not setup notice ── */}
              {notSetup && (
                <div className="px-4 pb-3">
                  <p className="font-jetbrains text-[0.6rem]" style={{ color: '#9a7a60' }}>
                    Connect Spotify at{' '}
                    <a href="/api/spotify/login" className="underline" style={{ color: '#1db954' }}>
                      /api/spotify/login
                    </a>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Mini widget pill ────────────────────────────────────────────── */}
        {phase === 'widget' && (
          <motion.button
            key="widget"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            onClick={() => setPhase('popup')}
            className="pointer-events-auto flex items-center gap-2 pl-2 pr-3 py-2 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.95)',
              border: '1px solid rgba(29,185,84,0.3)',
              boxShadow: '0 4px 20px rgba(29,185,84,0.15)',
              cursor: 'pointer',
            }}
          >
            {/* Album art (spinning vinyl if playing) */}
            <div
              className="relative flex-shrink-0 overflow-hidden"
              style={{
                width: 28,
                height: 28,
                borderRadius: isPlaying ? '50%' : 8,
                background: '#1db954',
              }}
            >
              {displayArt ? (
                <motion.img
                  src={displayArt}
                  alt=""
                  className="w-full h-full object-cover"
                  animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                  transition={isPlaying ? { repeat: Infinity, duration: 6, ease: 'linear' } : {}}
                  style={{ borderRadius: 'inherit' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <SpotifyIcon size={12} />
                </div>
              )}
              {isPlaying && displayArt && (
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.55) 12%, transparent 38%)' }}
                />
              )}
            </div>

            <div className="text-left">
              <div
                className="font-syne text-[0.7rem] font-bold truncate max-w-[140px]"
                style={{ color: '#1c1108' }}
              >
                {displayTitle}
              </div>
              <div
                className="font-grotesk text-[0.6rem] truncate max-w-[140px]"
                style={{ color: '#6b5040' }}
              >
                {isPlaying ? displayArtist : recent?.playedAt ? `${timeAgo(recent.playedAt)} · ${displayArtist}` : displayArtist}
              </div>
            </div>

            {/* Live pulse dot when playing */}
            {isPlaying ? (
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="ml-1"
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#1db954' }} />
              </motion.div>
            ) : (
              // Clock icon when showing last played
              <svg
                className="ml-1 flex-shrink-0"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9a7a60"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            )}
          </motion.button>
        )}

      </AnimatePresence>
    </div>
  );
});

export default SpotifyPopup;
