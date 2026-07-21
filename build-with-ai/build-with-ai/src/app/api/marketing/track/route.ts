import { NextResponse } from 'next/server'
import { appendFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { getDataDir } from '@/lib/dataDir'

export const runtime = 'nodejs'

type TrackingBody = {
  event?: string
  source?: string
  page?: string
  timestamp?: string
  metadata?: Record<string, unknown>
}

export async function POST(req: Request) {
  const requestId = randomUUID()

  try {
    const body = (await req.json().catch(() => null)) as TrackingBody | null
    const event = body?.event?.toString().trim() || ''

    if (!event) {
      return NextResponse.json({ error: 'Missing event name' }, { status: 400, headers: { 'x-request-id': requestId } })
    }

    const record = {
      id: requestId,
      event,
      source: body?.source?.toString().trim() || 'unknown',
      page: body?.page?.toString().trim() || 'unknown',
      timestamp: body?.timestamp || new Date().toISOString(),
      metadata: body?.metadata || {},
      userAgent: req.headers.get('user-agent') || undefined,
      referer: req.headers.get('referer') || undefined,
      ip: (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() || 'unknown',
    }

    const dataDir = getDataDir()
    await mkdir(dataDir, { recursive: true })
    await appendFile(join(dataDir, 'marketing_events.jsonl'), `${JSON.stringify(record)}\n`, { encoding: 'utf8' })

    return NextResponse.json({ ok: true }, { headers: { 'x-request-id': requestId } })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Tracking failed'
    return NextResponse.json({ error: message }, { status: 500, headers: { 'x-request-id': requestId } })
  }
}
