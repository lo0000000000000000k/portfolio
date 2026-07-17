import { NextResponse } from 'next/server';

export async function GET() {
  const CLIENT_ID   = process.env.SPOTIFY_CLIENT_ID!;
  const REDIRECT    = 'http://127.0.0.1:3000/api/spotify/callback';
  const SCOPES      = 'user-read-currently-playing user-read-playback-state user-read-recently-played';

  const url = new URL('https://accounts.spotify.com/authorize');
  url.searchParams.set('client_id',     CLIENT_ID);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('redirect_uri',  REDIRECT);
  url.searchParams.set('scope',         SCOPES);
  url.searchParams.set('show_dialog',   'true');

  return NextResponse.redirect(url.toString());
}
