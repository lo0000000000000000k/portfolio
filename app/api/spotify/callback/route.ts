import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) {
    return new NextResponse('<h2>Error: no code returned from Spotify</h2>', { headers: { 'Content-Type': 'text/html' } });
  }

  const CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID!;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
  const REDIRECT      = 'http://127.0.0.1:3000/api/spotify/callback';

  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ code, redirect_uri: REDIRECT, grant_type: 'authorization_code' }),
  });
  const data = await res.json();

  if (!data.refresh_token) {
    return new NextResponse(
      `<h2>Error from Spotify:</h2><pre>${JSON.stringify(data, null, 2)}</pre>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Spotify Connected!</title>
  <style>
    body { font-family: monospace; background: #0c0804; color: #f5ede0; padding: 40px; max-width: 700px; margin: 0 auto; }
    h1 { color: #1db954; }
    .token-box { background: #1a1208; border: 1px solid #e8924f; border-radius: 8px; padding: 20px; margin: 20px 0; word-break: break-all; }
    .step { background: #1a1208; border-left: 3px solid #1db954; padding: 12px 20px; margin: 12px 0; border-radius: 0 8px 8px 0; }
    button { background: #1db954; color: #0c0804; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-family: monospace; font-weight: bold; }
  </style>
</head>
<body>
  <h1>✅ Spotify Connected!</h1>
  <p>Copy the refresh token below into your <code>.env.local</code> file:</p>
  <div class="token-box" id="token">${data.refresh_token}</div>
  <button onclick="navigator.clipboard.writeText('${data.refresh_token}').then(()=>this.textContent='Copied!')">Copy Token</button>
  <h2>Next steps:</h2>
  <div class="step">1. Open <code>d:/PORTFOLIO/.env.local</code></div>
  <div class="step">2. Set <code>SPOTIFY_REFRESH_TOKEN=${data.refresh_token}</code></div>
  <div class="step">3. Restart your dev server (<code>npm run dev</code>)</div>
  <div class="step">4. The Spotify widget will now show live data!</div>
</body>
</html>`;

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
}
