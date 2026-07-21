import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'auth',
    message: 'Auth endpoint online',
    authenticated: false,
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { action = 'login' } = body as { action?: string };

  if (action === 'logout') {
    return NextResponse.json({ ok: true, message: 'Signed out' });
  }

  return NextResponse.json({
    ok: true,
    action,
    message: 'Auth flow placeholder ready',
    authenticated: false,
  });
}
