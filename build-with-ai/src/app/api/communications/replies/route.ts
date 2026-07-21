import { NextResponse } from 'next/server'
import { recordInboundReply } from '@/lib/investorOps'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as { from?: string; subject?: string; body?: string } | null
    const from = body?.from?.trim() || ''

    if (!from) {
      return NextResponse.json({ error: 'Missing sender address' }, { status: 400 })
    }

    const record = await recordInboundReply({
      from,
      subject: body?.subject,
      body: body?.body,
    })

    return NextResponse.json({ ok: true, record })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to capture reply'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
