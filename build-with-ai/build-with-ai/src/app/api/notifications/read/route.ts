import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'OK',
    route: 'api/notifications/read',
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    status: 'ok',
    received: body,
    route: 'api/notifications/read',
  });
}
