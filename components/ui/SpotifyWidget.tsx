'use client';
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion } from 'framer-motion';

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
  playedAt?: string;
  durationMs?: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtMs(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)   return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Spotify Icon ─────────────────────────────────────────────────────────────

const SpotifyIcon = ({ size = 12 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#1db954">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

// ─── Component ───────────────────────────────────────────────────────────────

const SpotifyWidget = memo(function SpotifyWidget() {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [recent, setRecent]         = useState<RecentTrack | null>(null);
  const [localProgress, setLocalProgress] = useState(0);
  const [loading, setLoading]       = useState(true);

  const nowRef      = useRef<NowPlaying | null>(null);
  const progressRef = useRef(0);
  const pollRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef     = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchRecent = useCallback(async () => {
    try {
      const res  = await fetch('/api/spotify/recent');
      const json: RecentTrack = await res.json();
      setRecent(json.found ? json : null);
    } catch { /* silent */ }
  }, []);

  const fetchNow = useCallback(async () => {
    try {
      const res  = await fetch('/api/spotify');
      const json: NowPlaying = await res.json();

      if (json.progressMs !== undefined) {
        progressRef.current = json.progressMs;
        setLocalProgress(json.progressMs);
      }

      nowRef.current = json;
      setNowPlaying(json);
      setLoading(false);

      if (!json.isPlaying && !json.notSetup) {
        fetchRecent();
      }
    } catch { setLoading(false); }
  }, [fetchRecent]);

  useEffect(() => {
    fetchNow();
    pollRef.current = setInterval(fetchNow, 10_000);

    // Tick progress every second
    tickRef.current = setInterval(() => {
      if (!nowRef.current?.isPlaying) return;
      const dur = nowRef.current.durationMs ?? 0;
      progressRef.current = Math.min(progressRef.current + 1000, dur);
      setLocalProgress(progressRef.current);
    }, 1000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [fetchNow]);

  // ─── Derived display values ───────────────────────────────────────────────
  const isPlaying   = nowPlaying?.isPlaying ?? false;
  const notSetup    = nowPlaying?.notSetup  ?? false;

  const title      = isPlaying ? (nowPlaying?.title  ?? '—') : (recent?.title  ?? nowPlaying?.title  ?? '—');
  const artist     = isPlaying ? (nowPlaying?.artist ?? '—') : (recent?.artist ?? nowPlaying?.artist ?? '—');
  const albumArt   = isPlaying ? (nowPlaying?.albumImage ?? null) : (recent?.albumImage ?? null);
  const songUrl    = isPlaying ? (nowPlaying?.songUrl ?? '#') : (recent?.songUrl ?? '#');
  const durationMs = isPlaying ? (nowPlaying?.durationMs ?? 0) : (recent?.durationMs ?? 0);
  const progressPct = durationMs > 0 ? Math.min((localProgress / durationMs) * 100, 100) : 0;

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="w-full max-w-[280px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
      style={{
        background: 'rgba(8,12,24,0.95)',
        border: '1px solid rgba(29,185,84,0.2)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 0 30px rgba(29,185,84,0.07), 0 16px 40px rgba(0,0,0,0.5)',
      }}
      whileHover={{ boxShadow: '0 0 50px rgba(29,185,84,0.14), 0 16px 40px rgba(0,0,0,0.6)' }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        <SpotifyIcon size={12} />
        <span className="font-jetbrains text-[0.6rem] tracking-[0.15em]" style={{ color: '#1db954' }}>
          {loading ? 'SPOTIFY' : isPlaying ? '▶ NOW PLAYING' : recent ? '⏮ LAST PLAYED' : '— OFFLINE'}
        </span>

        {/* Live badge */}
        {isPlaying && (
          <div className="ml-auto flex items-center gap-1">
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#1db954' }}
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            />
            <span className="font-jetbrains text-[0.5rem]" style={{ color: '#1db954' }}>LIVE</span>
          </div>
        )}

        {/* Time-ago when last played */}
        {!isPlaying && recent?.playedAt && (
          <span className="ml-auto font-jetbrains text-[0.55rem]" style={{ color: 'var(--text-dim)' }}>
            {timeAgo(recent.playedAt)}
          </span>
        )}
      </div>

      {/* ── Album + info ── */}
      <div className="flex items-center gap-3 px-4 pb-3">
        {/* Spinning vinyl */}
        <div className="relative flex-shrink-0">
          <motion.div
            className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0"
            style={{
              background: albumArt ? `url(${albumArt}) center/cover` : 'linear-gradient(135deg,#1db95430,#1db95415)',
              border: '2px solid rgba(29,185,84,0.3)',
              boxShadow: isPlaying ? '0 0 20px rgba(29,185,84,0.25)' : '0 0 10px rgba(29,185,84,0.1)',
            }}
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={
              isPlaying
                ? { duration: 6, ease: 'linear', repeat: Infinity }
                : { duration: 0.5 }
            }
          />
          {/* Center hole overlay */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle at center, rgba(8,12,24,0.75) 18%, transparent 45%)' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{ background: '#1db954' }}
          />
        </div>

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="space-y-1.5">
              <div className="h-3 rounded-full animate-pulse" style={{ background: 'rgba(29,185,84,0.15)', width: '70%' }} />
              <div className="h-2.5 rounded-full animate-pulse" style={{ background: 'rgba(29,185,84,0.1)', width: '50%' }} />
            </div>
          ) : (
            <>
              <a
                href={songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-grotesk text-[0.85rem] font-semibold truncate block hover:underline"
                style={{ color: 'var(--text-primary)' }}
              >
                {title}
              </a>
              <div className="font-grotesk text-[0.75rem] truncate" style={{ color: 'var(--text-secondary)' }}>
                {artist}
              </div>
              {notSetup && (
                <a
                  href="/api/spotify/login"
                  className="font-jetbrains text-[0.55rem] underline"
                  style={{ color: '#1db954' }}
                >
                  connect spotify →
                </a>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Progress bar ── */}
      {!notSetup && (
        <div className="px-4 pb-4">
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #1db954, #17d860)' }}
              animate={{ width: `${isPlaying ? progressPct : (recent ? 100 : 0)}%` }}
              transition={{ duration: isPlaying ? 1 : 0.6, ease: 'linear' }}
            />
          </div>
          {isPlaying && (
            <div className="flex justify-between mt-1">
              <span className="font-jetbrains text-[0.55rem]" style={{ color: 'var(--text-dim)' }}>
                {fmtMs(localProgress)}
              </span>
              <span className="font-jetbrains text-[0.55rem]" style={{ color: 'var(--text-dim)' }}>
                {fmtMs(durationMs)}
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
});

export default SpotifyWidget;
