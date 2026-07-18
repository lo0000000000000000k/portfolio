import { NextResponse } from 'next/server';

const CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_URL       = 'https://accounts.spotify.com/api/token';
const RECENTLY_PLAYED = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

async function getAccessToken(): Promise<string> {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN ?? '',
    }),
    cache: 'no-store',
  });
  const data = await res.json();
  return data.access_token;
}

export async function GET() {
  if (!REFRESH_TOKEN) {
    return NextResponse.json({ found: false, notSetup: true });
  }

  try {
    const token = await getAccessToken();

    const res = await fetch(RECENTLY_PLAYED, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!res.ok) return NextResponse.json({ found: false });

    const data = await res.json();
    const item = data?.items?.[0];

    if (!item) return NextResponse.json({ found: false });

    const track    = item.track;
    const playedAt = item.played_at; // ISO timestamp

    return NextResponse.json({
      found:      true,
      title:      track.name,
      artist:     track.artists.map((a: { name: string }) => a.name).join(', '),
      albumImage: track.album.images[0]?.url ?? null,
      songUrl:    track.external_urls.spotify,
      previewUrl: track.preview_url ?? null,
      playedAt,
      duration:   track.duration_ms,
    });
  } catch {
    return NextResponse.json({ found: false, error: 'fetch_failed' });
  }
}
