import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { getDataDir } from './dataDir'
import { buildGoogleCalendarLink, recordCalendarInvite, sendOrDraftEmail } from './commsAutomation'

export type DiligenceRequestRecord = {
  id: string
  name: string
  email: string
  organization?: string
  role?: string
  website?: string
  purpose?: string
  ndaAccepted: boolean
  status: 'approved' | 'pending'
  createdAt: string
}

export type InvestorAutomationTask = {
  id: string
  kind: 'send_pitch' | 'schedule_follow_up' | 'record_response' | 'calendar_sync'
  title: string
  owner: string
  status: 'pending' | 'queued' | 'completed'
  dueAt: string
  createdAt: string
  source?: string
  service?: string
  approvalRequired?: boolean
}

export type LeadApprovalPolicy = {
  service: string
  label: string
  approvalRequired: boolean
  reminderHours: number
}

export type ReplyHandlingRecord = {
  id: string
  from: string
  subject?: string
  body?: string
  intent: 'interested' | 'schedule' | 'pause' | 'decline' | 'unknown'
  createdAt: string
}

async function readJsonl<T>(fileName: string): Promise<T[]> {
  const file = join(getDataDir(), fileName)
  const text = await readFile(file, { encoding: 'utf8' }).catch((err: any) => {
    if (err?.code === 'ENOENT') return ''
    throw err
  })

  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line) as T
      } catch {
        return null
      }
    })
    .filter(Boolean) as T[]
}

async function appendJsonl(fileName: string, record: unknown) {
  const dataDir = getDataDir()
  await mkdir(dataDir, { recursive: true })
  await appendFile(join(dataDir, fileName), `${JSON.stringify(record)}\n`, { encoding: 'utf8' })
}

async function writeJsonl(fileName: string, records: unknown[]) {
  const dataDir = getDataDir()
  await mkdir(dataDir, { recursive: true })
  const text = records.map((record) => JSON.stringify(record)).join('\n')
  await writeFile(join(dataDir, fileName), text ? `${text}\n` : '', { encoding: 'utf8' })
}

const LEAD_APPROVAL_POLICIES: LeadApprovalPolicy[] = [
  { service: 'investor-demo', label: 'Investor / Founder Demo', approvalRequired: true, reminderHours: 24 },
  { service: 'partnership', label: 'Strategic Partnership', approvalRequired: true, reminderHours: 24 },
  { service: 'ai-design', label: 'AI Design / DFY', approvalRequired: false, reminderHours: 12 },
  { service: 'domains', label: 'Domain Registration', approvalRequired: false, reminderHours: 12 },
  { service: 'other', label: 'General Inquiry', approvalRequired: true, reminderHours: 24 },
]

function getLeadApprovalPolicy(service?: string) {
  const normalized = (service || '').trim().toLowerCase()
  return LEAD_APPROVAL_POLICIES.find((item) => item.service === normalized) || LEAD_APPROVAL_POLICIES.find((item) => item.service === 'other')!
}

function inferReplyIntent(body?: string, subject?: string): ReplyHandlingRecord['intent'] {
  const text = `${subject || ''} ${body || ''}`.toLowerCase()
  if (/(interested|looks good|sounds good|keen|yes)/.test(text)) return 'interested'
  if (/(schedule|calendar|meet|time|call)/.test(text)) return 'schedule'
  if (/(later|next month|follow up later|pause)/.test(text)) return 'pause'
  if (/(not interested|no thanks|decline|pass)/.test(text)) return 'decline'
  return 'unknown'
}

export async function getInboundReplies() {
  return readJsonl<ReplyHandlingRecord>('inbound_replies.jsonl')
}

export async function recordInboundReply(args: { from: string; subject?: string; body?: string }) {
  const record: ReplyHandlingRecord = {
    id: randomUUID(),
    from: args.from.trim().toLowerCase(),
    subject: args.subject?.trim() || undefined,
    body: args.body?.trim() || undefined,
    intent: inferReplyIntent(args.body, args.subject),
    createdAt: new Date().toISOString(),
  }

  await appendJsonl('inbound_replies.jsonl', record)

  if (record.intent === 'schedule') {
    await appendJsonl('marz_automation_queue.jsonl', {
      id: randomUUID(),
      kind: 'calendar_sync',
      title: `Reconcile meeting request from ${record.from}`,
      owner: record.from,
      status: 'queued',
      dueAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
      createdAt: new Date().toISOString(),
      source: 'reply_handling',
      service: 'investor-demo',
      approvalRequired: true,
    })
  }

  return record
}

async function getCalendarInviteRecords() {
  return readJsonl<{ title: string; attendeeEmail?: string; startIso: string; endIso: string; createdAt: string }>('calendar_invites.jsonl')
}

export async function getDiligenceRequests() {
  const rows = await readJsonl<DiligenceRequestRecord>('diligence_requests.jsonl')
  return rows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export async function getAutomationTasks() {
  const rows = await readJsonl<InvestorAutomationTask>('marz_automation_queue.jsonl')
  return rows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export async function hasDiligenceAccess(email: string | null | undefined) {
  const normalized = (email || '').trim().toLowerCase()
  if (!normalized) return false
  const requests = await getDiligenceRequests()
  return requests.some((request) => request.email === normalized && request.status === 'approved' && request.ndaAccepted)
}

export async function submitDiligenceRequest(args: {
  name: string
  email: string
  organization?: string
  role?: string
  website?: string
  purpose?: string
}) {
  const normalizedEmail = args.email.trim().toLowerCase()
  const existing = await getDiligenceRequests()
  const matched = existing.find((request) => request.email === normalizedEmail && request.ndaAccepted)

  if (matched) {
    return matched
  }

  const createdAt = new Date().toISOString()
  const record: DiligenceRequestRecord = {
    id: randomUUID(),
    name: args.name.trim(),
    email: normalizedEmail,
    organization: args.organization?.trim() || undefined,
    role: args.role?.trim() || undefined,
    website: args.website?.trim() || undefined,
    purpose: args.purpose?.trim() || undefined,
    ndaAccepted: true,
    status: 'approved',
    createdAt,
  }

  await appendJsonl('diligence_requests.jsonl', record)

  const dueSoon = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
  const dueLater = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString()

  const tasks: InvestorAutomationTask[] = [
    {
      id: randomUUID(),
      kind: 'send_pitch',
      title: `Send investor packet to ${record.name}`,
      owner: normalizedEmail,
      status: 'queued',
      dueAt: dueSoon,
      createdAt,
    },
    {
      id: randomUUID(),
      kind: 'schedule_follow_up',
      title: `Schedule follow-up for ${record.name}`,
      owner: normalizedEmail,
      status: 'queued',
      dueAt: dueLater,
      createdAt,
    },
    {
      id: randomUUID(),
      kind: 'calendar_sync',
      title: `Prepare calendar coordination for ${record.name}`,
      owner: normalizedEmail,
      status: 'pending',
      dueAt: dueSoon,
      createdAt,
    },
  ]

  for (const task of tasks) {
    await appendJsonl('marz_automation_queue.jsonl', task)
  }

  return record
}

export async function queueOpportunityWorkflow(args: {
  name: string
  email: string
  service?: string
  source?: string
}) {
  const createdAt = new Date().toISOString()
  const dueSoon = new Date(Date.now() + 1000 * 60 * 60 * getLeadApprovalPolicy(args.service).reminderHours).toISOString()
  const dueLater = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString()
  const policy = getLeadApprovalPolicy(args.service)

  const tasks: InvestorAutomationTask[] = [
    {
      id: randomUUID(),
      kind: 'send_pitch',
      title: `Prepare outbound message for ${args.name}`,
      owner: args.email.trim().toLowerCase(),
      status: 'queued',
      dueAt: dueSoon,
      createdAt,
      approvalRequired: policy.approvalRequired,
    },
    {
      id: randomUUID(),
      kind: 'record_response',
      title: `Record and track response for ${args.name}`,
      owner: args.email.trim().toLowerCase(),
      status: 'pending',
      dueAt: dueSoon,
      createdAt,
      approvalRequired: policy.approvalRequired,
    },
    {
      id: randomUUID(),
      kind: 'schedule_follow_up',
      title: `Schedule follow-up cadence for ${args.name}`,
      owner: args.email.trim().toLowerCase(),
      status: 'pending',
      dueAt: dueLater,
      createdAt,
      approvalRequired: policy.approvalRequired,
    },
  ]

  for (const task of tasks) {
    await appendJsonl('marz_automation_queue.jsonl', {
      ...task,
      source: args.source || 'crm',
      service: args.service || 'general',
    })
  }
}

export async function runReminderCadence() {
  const tasks = await getAutomationTasks()
  const dueSoon = tasks.filter((task) => task.status !== 'completed' && new Date(task.dueAt).getTime() <= Date.now() + 1000 * 60 * 60 * 24)

  const results = [] as Array<{ owner: string; kind: string; status: string; provider?: string }>

  for (const task of dueSoon.slice(0, 10)) {
    const result = await sendOrDraftEmail({
      to: task.owner,
      subject: 'Build With AI follow-up reminder',
      text: `This is a reminder from the Ajay Command Center regarding: ${task.title}`,
      from: 'ops@buildwithai.digital',
    }) as { status?: string; provider?: string }

    await appendJsonl('reminder_runs.jsonl', {
      taskId: task.id,
      owner: task.owner,
      kind: task.kind,
      createdAt: new Date().toISOString(),
      result,
    })

    results.push({ owner: task.owner, kind: task.kind, status: result.status || 'processed', provider: result.provider })
  }

  return { ok: true, processed: results.length, results }
}

export async function approveAutomationTask(taskId?: string) {
  const tasks = await getAutomationTasks()
  const target = taskId
    ? tasks.find((task) => task.id === taskId)
    : tasks.find((task) => task.status !== 'completed')

  if (!target) {
    return { ok: false, message: 'No queued automation task found' }
  }

  let result: Record<string, unknown> = { status: 'completed' }

  if (target.kind === 'send_pitch' || target.kind === 'schedule_follow_up') {
    result = await sendOrDraftEmail({
      to: target.owner,
      subject: target.kind === 'send_pitch' ? 'Build With AI founder walkthrough' : 'Build With AI follow-up',
      text:
        target.kind === 'send_pitch'
          ? 'Thank you for your interest in Build With AI. This is a founder-led outreach note with the investor brief and next-step demo path.'
          : 'Following up from the Build With AI command center. If helpful, we can schedule a short founder walkthrough and provide diligence access.',
      from: 'investors@buildwithai.digital',
    }) as Record<string, unknown>
  }

  if (target.kind === 'calendar_sync') {
    const startIso = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
    const endIso = new Date(Date.now() + 1000 * 60 * 60 * 24 + 1000 * 60 * 30).toISOString()
    await recordCalendarInvite({
      title: 'Build With AI founder walkthrough',
      startIso,
      endIso,
      organizerEmail: 'calendar@buildwithai.digital',
      attendeeEmail: target.owner,
      location: 'Virtual meeting',
    })

    result = {
      status: 'prepared',
      provider: 'calendar',
      googleCalendarLink: buildGoogleCalendarLink({
        title: 'Build With AI founder walkthrough',
        description: 'Founder walkthrough for investor or strategic partner diligence.',
        startIso,
        endIso,
        location: 'Virtual meeting',
      }),
    }
  }

  const updatedTasks = tasks.map((task) => (task.id === target.id ? { ...task, status: 'completed' as const } : task))
  await writeJsonl('marz_automation_queue.jsonl', updatedTasks)
  await appendJsonl('automation_approvals.jsonl', {
    taskId: target.id,
    owner: target.owner,
    kind: target.kind,
    approvedAt: new Date().toISOString(),
    result,
  })

  return { ok: true, task: target, result }
}

export async function getInvestorOpsSummary() {
  const [requests, tasks, replies, invites] = await Promise.all([getDiligenceRequests(), getAutomationTasks(), getInboundReplies(), getCalendarInviteRecords()])

  return {
    pendingDiligenceRequests: requests.filter((item) => item.status === 'pending').length,
    approvedDiligenceAccess: requests.filter((item) => item.status === 'approved').length,
    automationPending: tasks.filter((item) => item.status !== 'completed').length,
    reminderCandidates: tasks.filter((task) => task.status !== 'completed' && new Date(task.dueAt).getTime() <= Date.now() + 1000 * 60 * 60 * 24).length,
    calendarUpcoming: invites.filter((invite) => new Date(invite.startIso).getTime() > Date.now()).length,
    approvalPolicies: LEAD_APPROVAL_POLICIES,
    recentReplies: replies.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 5),
    latestRequests: requests.slice(0, 5),
    latestTasks: (tasks.length > 0
      ? tasks
      : [
          {
            id: 'seed-1',
            kind: 'send_pitch',
            title: 'Launch first investor outreach wave',
            owner: 'Ajay Command Center',
            status: 'queued',
            dueAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
          {
            id: 'seed-2',
            kind: 'schedule_follow_up',
            title: 'Prepare next follow-up sequence',
            owner: 'Ajay Command Center',
            status: 'pending',
            dueAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
        ]).slice(0, 5),
  }
}
