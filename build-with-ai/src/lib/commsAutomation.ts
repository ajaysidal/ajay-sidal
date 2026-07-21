import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import nodemailer from 'nodemailer'
import { getDataDir } from './dataDir'

export type CommunicationIdentity = {
  address: string
  label: string
  purpose: string
  status: 'live' | 'pending-provider'
}

const DEFAULT_IDENTITIES: Omit<CommunicationIdentity, 'status'>[] = [
  { address: 'ajay@buildwithai.digital', label: 'Founder', purpose: 'Founder outreach and high-trust replies' },
  { address: 'investors@buildwithai.digital', label: 'Investor Desk', purpose: 'Investor briefs, diligence, and follow-up' },
  { address: 'hello@buildwithai.digital', label: 'Inbound Sales', purpose: 'Sales and customer conversation intake' },
  { address: 'calendar@buildwithai.digital', label: 'Calendar Ops', purpose: 'Meeting coordination and scheduling' },
  { address: 'ops@buildwithai.digital', label: 'Automation Ops', purpose: 'Workflow notifications and automation summaries' },
]

async function readJson<T>(fileName: string, fallback: T): Promise<T> {
  const file = join(getDataDir(), fileName)
  const text = await readFile(file, { encoding: 'utf8' }).catch((err: any) => {
    if (err?.code === 'ENOENT') return ''
    throw err
  })

  if (!text.trim()) return fallback

  try {
    return JSON.parse(text) as T
  } catch {
    return fallback
  }
}

async function writeJson(fileName: string, value: unknown) {
  const dataDir = getDataDir()
  await mkdir(dataDir, { recursive: true })
  await writeFile(join(dataDir, fileName), JSON.stringify(value, null, 2), { encoding: 'utf8' })
}

async function appendJsonl(fileName: string, record: unknown) {
  const dataDir = getDataDir()
  await mkdir(dataDir, { recursive: true })
  await appendFile(join(dataDir, fileName), `${JSON.stringify(record)}\n`, { encoding: 'utf8' })
}

function providerReady() {
  return Boolean((process.env.OPENPROVIDER_USERNAME || '').trim() && (process.env.OPENPROVIDER_PASSWORD || '').trim())
}

function sendmailAvailable() {
  return existsSync('/usr/sbin/sendmail')
}

async function fetchOpenProviderDnsRecords(domain: string) {
  if (!providerReady()) return [] as Array<{ name?: string; type?: string; value?: string }>

  const base = (process.env.OPENPROVIDER_BASE_URL || 'https://api.openprovider.eu/v1beta/').trim().replace(/\/?$/, '/')
  const login = await fetch(base + 'auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: process.env.OPENPROVIDER_USERNAME,
      password: process.env.OPENPROVIDER_PASSWORD,
      ip: '127.0.0.1',
    }),
  })

  const loginJson = await login.json().catch(() => null) as { data?: { token?: string } } | null
  const token = loginJson?.data?.token
  if (!token) return []

  const res = await fetch(base + `dns/zones/${encodeURIComponent(domain)}/records`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const json = await res.json().catch(() => null) as { data?: { results?: Array<{ name?: string; type?: string; value?: string }> } } | null
  return json?.data?.results || []
}

async function fetchResendDomainStatus(domain: string) {
  const manualVerified = ['1', 'true', 'yes', 'verified'].includes(String(process.env.RESEND_DOMAIN_VERIFIED || '').trim().toLowerCase())
  const key = (process.env.RESEND_API_KEY || '').trim()
  if (!key) {
    return {
      configured: false,
      keyValid: false,
      keyCount: 0,
      ready: manualVerified,
      error: manualVerified ? null : 'Missing RESEND_API_KEY',
      source: manualVerified ? 'manual-override' : 'api-check',
    }
  }

  const keysRes = await fetch('https://api.resend.com/api-keys', {
    headers: { Authorization: `Bearer ${key}` },
  })

  const keysJson = await keysRes.json().catch(() => null) as { data?: Array<{ id?: string }> ; message?: string; name?: string } | null
  const restrictedSendingKey = String(keysJson?.message || '').toLowerCase().includes('restricted to only send emails') || String(keysJson?.name || '').toLowerCase() === 'restricted_api_key'
  if (!keysRes.ok) {
    return {
      configured: true,
      keyValid: restrictedSendingKey,
      keyCount: restrictedSendingKey ? 1 : 0,
      ready: manualVerified,
      error: manualVerified || restrictedSendingKey ? null : keysJson?.message || 'Invalid Resend API key',
      source: manualVerified ? 'manual-override' : restrictedSendingKey ? 'sending-key' : 'api-check',
    }
  }

  const res = await fetch('https://api.resend.com/domains', {
    headers: { Authorization: `Bearer ${key}` },
  })

  const json = await res.json().catch(() => null) as { data?: Array<{ name?: string; status?: string }> } | null
  const match = (json?.data || []).find((item) => String(item.name || '').toLowerCase() === domain.toLowerCase())

  return {
    configured: true,
    keyValid: true,
    keyCount: Array.isArray(keysJson?.data) ? keysJson.data.length : 0,
    ready: manualVerified || String(match?.status || '').toLowerCase() === 'verified',
    error: res.ok || manualVerified ? null : 'Unable to read Resend domains',
    source: manualVerified ? 'manual-override' : 'api-check',
  }
}

export async function ensureDefaultCommunicationIdentities() {
  const existing = await readJson<CommunicationIdentity[]>('communication_identities.json', [])
  const existingAddresses = new Set(existing.map((item) => item.address.toLowerCase()))

  const merged = [
    ...existing,
    ...DEFAULT_IDENTITIES
      .filter((item) => !existingAddresses.has(item.address.toLowerCase()))
      .map((item) => ({ ...item, status: providerReady() ? 'live' as const : 'pending-provider' as const })),
  ]

  await writeJson('communication_identities.json', merged)
  return merged
}

export async function getCommunicationOpsSummary() {
  const identities = await ensureDefaultCommunicationIdentities()

  let records: Array<{ name?: string; type?: string; value?: string }> = []
  let resendDomainReady = false
  let resendApiKeyValid = false
  let resendApiKeyCount = 0
  let resendError: string | null = null
  let resendSource = 'api-check'

  try {
    records = await fetchOpenProviderDnsRecords('buildwithai.digital')
  } catch {
    records = []
  }

  try {
    const resendStatus = await fetchResendDomainStatus('buildwithai.digital')
    resendDomainReady = resendStatus.ready
    resendApiKeyValid = resendStatus.keyValid
    resendApiKeyCount = resendStatus.keyCount
    resendError = resendStatus.error
    resendSource = resendStatus.source || 'api-check'
  } catch {
    resendDomainReady = false
    resendApiKeyValid = false
    resendApiKeyCount = 0
    resendError = 'Unable to validate Resend account state'
    resendSource = 'api-check'
  }

  const mxPresent = records.some((record) => record.type === 'MX')
  const dkimPresent = records.filter((record) => {
    const name = String(record.name || '')
    return (record.type === 'CNAME' && name.includes('._domainkey.')) || (record.type === 'TXT' && name.includes('resend._domainkey'))
  }).length >= 1

  const smtpConfigured = Boolean((process.env.SMTP_HOST || '').trim() && (process.env.SMTP_USER || '').trim() && (process.env.SMTP_PASS || '').trim())
  const localSendmail = sendmailAvailable()

  const resendTransportReady = resendDomainReady && resendApiKeyValid

  return {
    openProviderConfigured: providerReady(),
    resendConfigured: Boolean((process.env.RESEND_API_KEY || '').trim()),
    resendApiKeyValid,
    resendApiKeyCount,
    resendDomainReady,
    resendError,
    smtpConfigured,
    sendmailAvailable: localSendmail,
    googleCalendarConfigured: Boolean((process.env.GOOGLE_CLIENT_ID || '').trim() && (process.env.GOOGLE_CLIENT_SECRET || '').trim()),
    mxPresent,
    dkimPresent,
    providerVerified: mxPresent && dkimPresent && (resendDomainReady || smtpConfigured || localSendmail),
    activeTransport: resendTransportReady ? 'resend' : smtpConfigured ? 'smtp' : localSendmail ? 'sendmail' : 'draft-only',
    resendSource,
    assignedIdentities: identities,
  }
}

function toUtcCalendarStamp(value: string) {
  return value.replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

export function buildCalendarInvite(args: {
  title: string
  description?: string
  startIso: string
  endIso: string
  organizerEmail: string
  attendeeEmail?: string
  location?: string
}) {
  const uid = `${Date.now()}@buildwithai.digital`
  const now = toUtcCalendarStamp(new Date().toISOString())
  const start = toUtcCalendarStamp(new Date(args.startIso).toISOString())
  const end = toUtcCalendarStamp(new Date(args.endIso).toISOString())

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BuildWithAI//Investor Ops//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${args.title}`,
    `DESCRIPTION:${(args.description || '').replace(/\n/g, '\\n')}`,
    `ORGANIZER:MAILTO:${args.organizerEmail}`,
    args.attendeeEmail ? `ATTENDEE:MAILTO:${args.attendeeEmail}` : '',
    args.location ? `LOCATION:${args.location}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')
}

export function buildGoogleCalendarLink(args: {
  title: string
  description?: string
  startIso: string
  endIso: string
  location?: string
}) {
  const start = toUtcCalendarStamp(new Date(args.startIso).toISOString())
  const end = toUtcCalendarStamp(new Date(args.endIso).toISOString())
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: args.title,
    details: args.description || '',
    location: args.location || 'Virtual meeting',
    dates: `${start}/${end}`,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export async function recordCalendarInvite(args: {
  title: string
  startIso: string
  endIso: string
  organizerEmail: string
  attendeeEmail?: string
  location?: string
}) {
  await appendJsonl('calendar_invites.jsonl', {
    ...args,
    createdAt: new Date().toISOString(),
  })
}

export async function sendOrDraftEmail(args: {
  to: string
  subject: string
  text?: string
  html?: string
  from?: string
}) {
  const from = args.from || 'investors@buildwithai.digital'

  if ((process.env.RESEND_API_KEY || '').trim()) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [args.to],
        subject: args.subject,
        text: args.text,
        html: args.html || `<p>${(args.text || '').replace(/\n/g, '<br />')}</p>`,
      }),
    })

    const json = await response.json().catch(() => null)
    await appendJsonl('outbound_emails.jsonl', {
      status: response.ok ? 'sent' : 'failed',
      provider: 'resend',
      to: args.to,
      subject: args.subject,
      from,
      createdAt: new Date().toISOString(),
      response: json,
    })

    if (response.ok) {
      return { status: 'sent', provider: 'resend', response: json }
    }
  }

  if ((process.env.SMTP_HOST || '').trim() && (process.env.SMTP_USER || '').trim() && (process.env.SMTP_PASS || '').trim()) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || '').trim() === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const info = await transporter.sendMail({
      from,
      to: args.to,
      subject: args.subject,
      text: args.text,
      html: args.html || `<p>${(args.text || '').replace(/\n/g, '<br />')}</p>`,
    })

    await appendJsonl('outbound_emails.jsonl', {
      status: 'sent',
      provider: 'smtp',
      to: args.to,
      subject: args.subject,
      from,
      createdAt: new Date().toISOString(),
      response: { messageId: info.messageId },
    })

    return { status: 'sent', provider: 'smtp', response: { messageId: info.messageId } }
  }

  if (sendmailAvailable()) {
    const transporter = nodemailer.createTransport({
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail',
    })

    const info = await transporter.sendMail({
      from,
      to: args.to,
      subject: args.subject,
      text: args.text,
      html: args.html || `<p>${(args.text || '').replace(/\n/g, '<br />')}</p>`,
    })

    await appendJsonl('outbound_emails.jsonl', {
      status: 'sent',
      provider: 'sendmail',
      to: args.to,
      subject: args.subject,
      from,
      createdAt: new Date().toISOString(),
      response: { messageId: info.messageId },
    })

    return { status: 'sent', provider: 'sendmail', response: { messageId: info.messageId } }
  }

  await appendJsonl('outbound_email_drafts.jsonl', {
    status: 'drafted',
    to: args.to,
    subject: args.subject,
    from,
    text: args.text,
    html: args.html,
    createdAt: new Date().toISOString(),
  })

  return { status: 'drafted', provider: 'local-fallback' }
}
