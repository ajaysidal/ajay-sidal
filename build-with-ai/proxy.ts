import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export const runtime = 'edge'
const LAUNCH_DATE = new Date('2026-05-19T00:00:00Z')

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  // Auto-unlock on launch date
  if (new Date() >= LAUNCH_DATE) return NextResponse.next()

  const isAllowed = [
    '/launching-soon', '/api/launching-soon',
    '/privacy', '/terms', '/leads', '/calendar',
    '/_next', '/favicon.ico', '/logo.svg', '/robots.txt', '/sitemap.xml'
  ].some(a => path.startsWith(a))

  if (isAllowed) return NextResponse.next()
  return NextResponse.redirect(new URL('/launching-soon', request.url))
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.svg|robots.txt|sitemap.xml).*)'] }
