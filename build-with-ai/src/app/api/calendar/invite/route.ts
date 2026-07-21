import { NextResponse } from 'next/server'
import { buildCalendarInvite, recordCalendarInvite } from '@/lib/commsAutomation'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      title?: string
      description?: string
      startIso?: string
      endIso?: string
      organizerEmail?: string
      attendeeEmail?: string
      location?: string
    } | null

    const start = body?.startIso || new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
    const end = body?.endIso || new Date(new Date(start).getTime() + 1000 * 60 * 30).toISOString()

    const ics = buildCalendarInvite({
      title: body?.title || 'Build With AI founder walkthrough',
      description: body?.description || 'Founder walkthrough for Build With AI investor or strategic partner discussion.',
      startIso: start,
      endIso: end,
      organizerEmail: body?.organizerEmail || 'calendar@buildwithai.digital',
      attendeeEmail: body?.attendeeEmail,
      location: body?.location || 'Virtual meeting',
    })

    await recordCalendarInvite({
      title: body?.title || 'Build With AI founder walkthrough',
      startIso: start,
      endIso: end,
      organizerEmail: body?.organizerEmail || 'calendar@buildwithai.digital',
      attendeeEmail: body?.attendeeEmail,
      location: body?.location || 'Virtual meeting',
    })

    return new NextResponse(ics, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="buildwithai-invite.ics"',
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate invite'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
