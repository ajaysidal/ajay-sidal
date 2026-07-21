import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LAUNCH_DATE = new Date('2026-06-14T00:00:00Z').getTime();
const ALLOWED = ['/_next', '/favicon.ico', '/logo.png', '/logo.svg', '/robots.txt', '/sitemap.xml', '/launching-soon', '/contact', '/privacy', '/terms'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get('host') || '';
  const adminSubdomain = 'command.opsvantagedigital.online';

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (host !== adminSubdomain) {
      const url = request.nextUrl.clone();
      url.pathname = '/404';
      return NextResponse.rewrite(url);
    }

    const token = request.cookies.get('openfort_session')?.value || request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    try {
      // Openfort cryptographic verification placeholder
    } catch (err) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (ALLOWED.some(p => pathname.startsWith(p))) return NextResponse.next();
  if (Date.now() >= LAUNCH_DATE) return NextResponse.next();
  
  return NextResponse.redirect(new URL('/launching-soon', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png|logo.svg|robots.txt|sitemap.xml).*)']
};
