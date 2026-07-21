import { NextResponse } from 'next/server'
import { sendOrDraftEmail } from '@/lib/commsAutomation'
import { queueOpportunityWorkflow } from '@/lib/investorOps'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      to?: string
      subject?: string
      text?: string
      html?: string
      from?: string
      service?: string
      name?: string
    } | null

    const to = body?.to?.trim() || ''
    const subject = body?.subject?.trim() || 'Build With AI follow-up'

    if (!to) {
      return NextResponse.json({ error: 'Missing recipient email' }, { status: 400 })
    }

    const result = await sendOrDraftEmail({
      to,
      subject,
      text: body?.text || '',
      html: body?.html,
      from: body?.from || 'investors@buildwithai.digital',
    })

    await queueOpportunityWorkflow({
      name: body?.name || to,
      email: to,
      service: body?.service || 'outreach',
      source: 'outreach_api',
    })

    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to process outreach'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
