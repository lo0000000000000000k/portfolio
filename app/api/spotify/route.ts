import { NextResponse } from 'next/server';

const CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_URL      = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING    = 'https://api.spotify.com/v1/me/player/currently-playing';

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
  // No refresh token yet — return not playing
  if (!REFRESH_TOKEN) {
    return NextResponse.json({ isPlaying: false, notSetup: true });
  }

  try {
    const token = await getAccessToken();

    const res = await fetch(NOW_PLAYING, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    // 204 = nothing playing
    if (res.status === 204) return NextResponse.json({ isPlaying: false });
    if (!res.ok)           return NextResponse.json({ isPlaying: false });

    const data = await res.json();

    if (!data?.item) return NextResponse.json({ isPlaying: false });

    return NextResponse.json({
      isPlaying:   data.is_playing,
      title:       data.item.name,
      artist:      data.item.artists.map((a: { name: string }) => a.name).join(', '),
      albumImage:  data.item.album.images[0]?.url ?? null,
      songUrl:     data.item.external_urls.spotify,
      previewUrl:  data.item.preview_url ?? null,
      progress:    data.progress_ms,
      duration:    data.item.duration_ms,
    });
  } catch {
    return NextResponse.json({ isPlaying: false, error: 'fetch_failed' });
  }
}
