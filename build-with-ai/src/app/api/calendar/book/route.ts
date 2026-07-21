import { NextResponse } from 'next/server'
import { buildCalendarInvite, buildGoogleCalendarLink, recordCalendarInvite, sendOrDraftEmail } from '@/lib/commsAutomation'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      attendeeEmail?: string
      attendeeName?: string
      title?: string
      description?: string
      startIso?: string
      endIso?: string
      location?: string
    } | null

    const startIso = body?.startIso || new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
    const endIso = body?.endIso || new Date(new Date(startIso).getTime() + 1000 * 60 * 30).toISOString()
    const attendeeEmail = body?.attendeeEmail?.trim() || 'investors@buildwithai.digital'
    const title = body?.title || 'Build With AI founder walkthrough'
    const description = body?.description || 'Founder walkthrough for investor or strategic partner diligence.'
    const location = body?.location || 'Virtual meeting'

    await recordCalendarInvite({
      title,
      startIso,
      endIso,
      organizerEmail: 'calendar@buildwithai.digital',
      attendeeEmail,
      location,
    })

    const googleCalendarLink = buildGoogleCalendarLink({
      title,
      description,
      startIso,
      endIso,
      location,
    })

    const inviteText = [
      `Hello ${body?.attendeeName || 'there'},`,
      '',
      'Your Build With AI founder walkthrough is ready to be scheduled.',
      `Google Calendar link: ${googleCalendarLink}`,
      '',
      'If the time needs adjusting, reply to this note and the Ajay Command Center workflow will be updated.',
    ].join('\n')

    const outreachResult = await sendOrDraftEmail({
      to: attendeeEmail,
      from: 'calendar@buildwithai.digital',
      subject: title,
      text: inviteText,
      html: `<p>Hello ${body?.attendeeName || 'there'},</p><p>Your Build With AI founder walkthrough is ready to be scheduled.</p><p><a href="${googleCalendarLink}">Add to Google Calendar</a></p>`,
    })

    return NextResponse.json({
      ok: true,
      outreachResult,
      googleCalendarLink,
      icsPreview: buildCalendarInvite({
        title,
        description,
        startIso,
        endIso,
        organizerEmail: 'calendar@buildwithai.digital',
        attendeeEmail,
        location,
      }),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to book calendar event'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
