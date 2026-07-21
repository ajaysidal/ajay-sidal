'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const NAV_ITEMS = [
  { label: 'Mission Control', href: '/dashboard' },
  { label: 'MARZ Identity', href: '/dashboard/marz' },
  { label: 'Sovereign CRM', href: '/dashboard/leads', active: true },
  { label: 'Infrastructure', href: '/dashboard/infrastructure' },
  { label: 'Billing', href: '/dashboard/billing' },
  { label: 'API Console', href: '/dashboard/api' },
];

type DashboardLead = {
  id: string;
  name: string;
  service: string;
  budgetUsd: number;
  status: 'Discovery' | 'Proposal Sent' | 'Active Mission';
  email: string;
  createdAt: string;
};

type InvestorRequest = {
  id: string;
  name: string;
  email: string;
  status: 'approved' | 'pending';
  createdAt: string;
};

type AutomationTask = {
  id: string;
  title: string;
  owner: string;
  status: 'pending' | 'queued' | 'completed';
  dueAt: string;
};

type ReplyRecord = {
  id: string;
  from: string;
  intent: 'interested' | 'schedule' | 'pause' | 'decline' | 'unknown';
  createdAt: string;
};

type ApprovalPolicy = {
  service: string;
  label: string;
  approvalRequired: boolean;
  reminderHours: number;
};

type InvestorOpsSummary = {
  pendingDiligenceRequests: number;
  approvedDiligenceAccess: number;
  automationPending: number;
  reminderCandidates: number;
  calendarUpcoming: number;
  approvalPolicies: ApprovalPolicy[];
  recentReplies: ReplyRecord[];
  latestRequests: InvestorRequest[];
  latestTasks: AutomationTask[];
};

type CommunicationIdentity = {
  address: string;
  label: string;
  purpose: string;
  status: 'live' | 'pending-provider';
};

type CommunicationOpsSummary = {
  openProviderConfigured: boolean;
  resendConfigured: boolean;
  resendApiKeyValid?: boolean;
  resendApiKeyCount?: number;
  resendDomainReady: boolean;
  resendError?: string | null;
  resendSource?: string;
  smtpConfigured: boolean;
  sendmailAvailable: boolean;
  googleCalendarConfigured: boolean;
  mxPresent: boolean;
  dkimPresent: boolean;
  providerVerified?: boolean;
  activeTransport?: string;
  assignedIdentities: CommunicationIdentity[];
};

function StatusPill({ status }: { status: string }) {
  if (status === 'Active Mission') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-400 border border-teal-500/30 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
        Active Mission
      </span>
    );
  }

  if (status === 'Proposal Sent') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        Proposal Sent
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
      Discovery
    </span>
  );
}

function TaskPill({ status }: { status: string }) {
  const styles = status === 'completed'
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    : status === 'queued'
      ? 'bg-teal-500/10 text-teal-400 border-teal-500/30'
      : 'bg-amber-500/10 text-amber-300 border-amber-500/30';

  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${styles}`}>{status}</span>;
}

function formatUsd(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

export default function DashboardLeadsPage() {
  const [leads, setLeads] = useState<DashboardLead[]>([]);
  const [potentialValueUsd, setPotentialValueUsd] = useState(0);
  const [activeMissions, setActiveMissions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [investorOps, setInvestorOps] = useState<InvestorOpsSummary | null>(null);
  const [commsOps, setCommsOps] = useState<CommunicationOpsSummary | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [crmRes, investorRes, commsRes] = await Promise.all([
          fetch('/api/dashboard/leads', { cache: 'no-store' }),
          fetch('/api/dashboard/investor-ops', { cache: 'no-store' }).catch(() => null),
          fetch('/api/dashboard/comms-ops', { cache: 'no-store' }).catch(() => null),
        ]);

        const crmData = (await crmRes.json().catch(() => null)) as
          | { leads?: DashboardLead[]; potentialContractValueUsd?: number; activeMissions?: number; error?: string }
          | null;

        if (!crmRes.ok) {
          throw new Error(crmData?.error || 'Failed to load CRM pipeline');
        }

        const investorData = investorRes
          ? ((await investorRes.json().catch(() => null)) as InvestorOpsSummary | { error?: string } | null)
          : null;
        const commsData = commsRes
          ? ((await commsRes.json().catch(() => null)) as CommunicationOpsSummary | { error?: string } | null)
          : null;

        if (!cancelled) {
          setLeads(Array.isArray(crmData?.leads) ? crmData.leads : []);
          setPotentialValueUsd(Number(crmData?.potentialContractValueUsd || 0));
          setActiveMissions(Number(crmData?.activeMissions || 0));
          setInvestorOps(investorRes && investorRes.ok ? (investorData as InvestorOpsSummary) : null);
          setCommsOps(commsRes && commsRes.ok ? (commsData as CommunicationOpsSummary) : null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load CRM pipeline');
          setLeads([]);
          setPotentialValueUsd(0);
          setActiveMissions(0);
          setInvestorOps(null);
          setCommsOps(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const liveIntakeLabel = useMemo(() => (loading ? 'Syncing database…' : 'Live Intake: database / leads.jsonl'), [loading]);

  async function approveNextTask() {
    setActionMessage('Processing next queued MARZ task…');

    const taskId = investorOps?.latestTasks?.find((task) => task.status !== 'completed')?.id;
    const res = await fetch('/api/dashboard/investor-ops/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId }),
    });

    const json = await res.json().catch(() => null) as { ok?: boolean; error?: string; result?: { provider?: string; status?: string } } | null;
    if (!res.ok) {
      setActionMessage(json?.error || 'Approval request failed. Sign in as founder/admin to continue.');
      return;
    }

    setActionMessage(`Approved and processed. Provider: ${json?.result?.provider || json?.result?.status || 'workflow'}. Refresh the queue to review the update.`);
  }

  async function createBookingActivation() {
    setActionMessage('Generating founder walkthrough booking link…');

    const attendeeEmail = investorOps?.latestTasks?.[0]?.owner || 'investors@buildwithai.digital';
    const res = await fetch('/api/calendar/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attendeeEmail, attendeeName: 'Build With AI contact' }),
    });

    const json = await res.json().catch(() => null) as { ok?: boolean; googleCalendarLink?: string; error?: string } | null;
    if (!res.ok || !json?.ok) {
      setActionMessage(json?.error || 'Booking activation failed.');
      return;
    }

    setActionMessage('Founder walkthrough booking is ready. The calendar link has been generated and logged.');
    if (json.googleCalendarLink) {
      window.open(json.googleCalendarLink, '_blank', 'noopener,noreferrer');
    }
  }

  async function triggerReminderCadence() {
    setActionMessage('Running reminder cadence…');

    const res = await fetch('/api/dashboard/investor-ops/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const json = await res.json().catch(() => null) as { processed?: number; error?: string } | null;
    if (!res.ok) {
      setActionMessage(json?.error || 'Reminder cadence failed. Sign in as founder/admin to continue.');
      return;
    }

    setActionMessage(`Reminder cadence completed. Processed ${json?.processed || 0} reminder actions.`);
  }

  return (
    <div className="min-h-screen bg-[#070709] text-white flex">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[520px] h-[320px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-[380px] h-[380px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <aside className="relative z-10 hidden lg:flex flex-col w-64 min-h-screen bg-[#0a0a0c]/80 border-r border-neutral-800/60 backdrop-blur-xl">
        <div className="px-6 py-6 border-b border-neutral-800/60">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-teal-400">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-base tracking-tight">Sovereign CRM</p>
              <p className="text-teal-500 text-[10px] font-bold tracking-widest uppercase">Growth Command</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                item.active
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="relative z-10 flex-1 px-4 md:px-8 py-10 max-w-6xl mx-auto w-full space-y-8">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-2">Ajay Command Center</p>
            <h1 className="text-sovereign-header normal-case text-3xl md:text-5xl text-white mb-3">Sovereign CRM Mission Console</h1>
            <p className="text-neutral-400 text-sm md:text-base max-w-3xl">Manage inbound growth, investor diligence access, and MARZ-ready follow-up automation from one founder command center.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/leads" className="border border-teal-500/40 text-teal-400 hover:bg-teal-500/10 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider w-fit">
              Open Public Leads Form
            </Link>
            <Link href="/investors/diligence" className="border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider w-fit">
              Diligence Room
            </Link>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="card-glass p-6">
            <h2 className="text-sovereign-title text-lg text-white mb-3">Potential Contract Value</h2>
            <p className="text-4xl font-black text-gradient mb-2">{formatUsd(potentialValueUsd)}</p>
            <p className="text-neutral-500 text-xs uppercase tracking-wider">Across current pipeline</p>
          </div>
          <div className="card-glass p-6">
            <h2 className="text-sovereign-title text-lg text-white mb-3">Active Missions</h2>
            <p className="text-4xl font-black text-teal-400 mb-2">{activeMissions}</p>
            <p className="text-neutral-500 text-xs uppercase tracking-wider">In progress this cycle</p>
          </div>
          <div className="card-glass p-6">
            <h2 className="text-sovereign-title text-lg text-white mb-3">Diligence Access</h2>
            <p className="text-4xl font-black text-purple-300 mb-2">{investorOps?.approvedDiligenceAccess || 0}</p>
            <p className="text-neutral-500 text-xs uppercase tracking-wider">Approved investor unlocks</p>
          </div>
          <div className="card-glass p-6">
            <h2 className="text-sovereign-title text-lg text-white mb-3">Automation Queue</h2>
            <p className="text-4xl font-black text-amber-300 mb-2">{investorOps?.automationPending || 0}</p>
            <p className="text-neutral-500 text-xs uppercase tracking-wider">Pending MARZ-ready tasks</p>
          </div>
        </section>

        <section className="card-glass p-6 md:p-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sovereign-title text-lg text-white">Immediate Operating Workflow</h2>
            <span className="text-xs text-neutral-500 uppercase tracking-wider">Everything in one place</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-neutral-800 bg-black/20 p-4">
              <div className="text-[10px] font-black tracking-widest uppercase text-teal-400 mb-2">01</div>
              <h3 className="text-white font-bold mb-2">Start with the shortlist</h3>
              <p className="text-sm text-neutral-400">Use the investor brief and aligned target list to focus on the best-fit names first.</p>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-black/20 p-4">
              <div className="text-[10px] font-black tracking-widest uppercase text-teal-400 mb-2">02</div>
              <h3 className="text-white font-bold mb-2">Launch the first outreach wave</h3>
              <p className="text-sm text-neutral-400">Book founder walkthroughs and request diligence access from the same system.</p>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-black/20 p-4">
              <div className="text-[10px] font-black tracking-widest uppercase text-teal-400 mb-2">03</div>
              <h3 className="text-white font-bold mb-2">Track every response</h3>
              <p className="text-sm text-neutral-400">New investor and lead actions are surfaced below and queued for follow-up.</p>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-black/20 p-4">
              <div className="text-[10px] font-black tracking-widest uppercase text-teal-400 mb-2">04</div>
              <h3 className="text-white font-bold mb-2">Use the meeting checklist</h3>
              <p className="text-sm text-neutral-400">Run the founder narrative, demo flow, and next-step close before each call.</p>
            </div>
          </div>
        </section>

        <section className="card-glass p-6 md:p-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sovereign-title text-lg text-white">Founder Oversight Controls</h2>
            <span className="text-xs text-neutral-500 uppercase tracking-wider">Approval-based MARZ ops</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={approveNextTask} className="rounded-lg bg-teal-500 px-4 py-2 font-black text-zinc-950">Approve next queued follow-up</button>
            <button onClick={createBookingActivation} className="rounded-lg border border-purple-500/40 px-4 py-2 font-bold text-purple-300">Create walkthrough booking link</button>
            <button onClick={triggerReminderCadence} className="rounded-lg border border-amber-500/40 px-4 py-2 font-bold text-amber-300">Run reminder cadence</button>
            <Link href="/investors/diligence" className="rounded-lg border border-zinc-700 px-4 py-2 font-bold text-white">Open diligence room</Link>
          </div>
          {actionMessage ? <div className="mt-4 rounded-xl border border-neutral-800 bg-black/20 p-4 text-sm text-zinc-300">{actionMessage}</div> : null}
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          <div className="card-glass p-6 md:p-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sovereign-title text-lg text-white">Reply Signals</h2>
              <span className="text-xs text-neutral-500 uppercase tracking-wider">Inbound handling</span>
            </div>
            <div className="space-y-3">
              {investorOps?.recentReplies?.length ? investorOps.recentReplies.map((reply) => (
                <div key={reply.id} className="rounded-xl border border-neutral-800 bg-black/20 p-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">{reply.from}</div>
                    <div className="text-xs text-neutral-500">{formatDate(reply.createdAt)}</div>
                  </div>
                  <TaskPill status={reply.intent === 'schedule' || reply.intent === 'interested' ? 'queued' : reply.intent === 'decline' ? 'completed' : 'pending'} />
                </div>
              )) : (
                <div className="rounded-xl border border-neutral-800 bg-black/20 p-4 text-sm text-neutral-400">No inbound replies have been captured yet.</div>
              )}
            </div>
          </div>

          <div className="card-glass p-6 md:p-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sovereign-title text-lg text-white">Cadence and Calendar</h2>
              <span className="text-xs text-neutral-500 uppercase tracking-wider">Reconciliation</span>
            </div>
            <div className="grid gap-3">
              <div className="rounded-xl border border-neutral-800 bg-black/20 p-4">
                <div className="text-[10px] font-black tracking-widest uppercase text-neutral-500 mb-2">Reminder candidates</div>
                <div className="text-2xl font-semibold text-white">{investorOps?.reminderCandidates || 0}</div>
              </div>
              <div className="rounded-xl border border-neutral-800 bg-black/20 p-4">
                <div className="text-[10px] font-black tracking-widest uppercase text-neutral-500 mb-2">Upcoming calendar items</div>
                <div className="text-2xl font-semibold text-white">{investorOps?.calendarUpcoming || 0}</div>
              </div>
            </div>
          </div>

          <div className="card-glass p-6 md:p-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sovereign-title text-lg text-white">Approval Policies</h2>
              <span className="text-xs text-neutral-500 uppercase tracking-wider">By lead type</span>
            </div>
            <div className="space-y-3">
              {investorOps?.approvalPolicies?.length ? investorOps.approvalPolicies.map((policy) => (
                <div key={policy.service} className="rounded-xl border border-neutral-800 bg-black/20 p-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">{policy.label}</div>
                    <div className="text-xs text-neutral-500">Reminder after {policy.reminderHours}h</div>
                  </div>
                  <TaskPill status={policy.approvalRequired ? 'queued' : 'completed'} />
                </div>
              )) : (
                <div className="rounded-xl border border-neutral-800 bg-black/20 p-4 text-sm text-neutral-400">Approval policies are not available yet.</div>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <div className="card-glass p-6 md:p-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sovereign-title text-lg text-white">Domain Communications Stack</h2>
              <span className="text-xs text-neutral-500 uppercase tracking-wider">Email and calendar readiness</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2 mb-5">
              <div className="rounded-xl border border-neutral-800 bg-black/20 p-4">
                <div className="text-[10px] font-black tracking-widest uppercase text-neutral-500 mb-2">OpenProvider</div>
                <TaskPill status={commsOps?.openProviderConfigured ? 'completed' : 'pending'} />
              </div>
              <div className="rounded-xl border border-neutral-800 bg-black/20 p-4">
                <div className="text-[10px] font-black tracking-widest uppercase text-neutral-500 mb-2">Outbound Mail</div>
                <TaskPill status={commsOps?.resendDomainReady || commsOps?.smtpConfigured || commsOps?.sendmailAvailable ? 'completed' : 'pending'} />
                <div className="mt-1 text-[11px] text-neutral-500">Resend key: {commsOps?.resendApiKeyValid ? `valid (${commsOps?.resendApiKeyCount || 0} keys visible)` : commsOps?.resendConfigured ? 'invalid' : 'missing'}</div>
                <div className="mt-1 text-[11px] text-neutral-500">Domain status source: {commsOps?.resendSource || 'api-check'}</div>
              </div>
              <div className="rounded-xl border border-neutral-800 bg-black/20 p-4">
                <div className="text-[10px] font-black tracking-widest uppercase text-neutral-500 mb-2">DNS Mail Auth</div>
                <TaskPill status={commsOps?.mxPresent && commsOps?.dkimPresent ? 'completed' : 'pending'} />
              </div>
              <div className="rounded-xl border border-neutral-800 bg-black/20 p-4">
                <div className="text-[10px] font-black tracking-widest uppercase text-neutral-500 mb-2">Assigned inboxes</div>
                <div className="text-sm font-semibold text-white">{commsOps?.assignedIdentities?.length || 0}</div>
                <div className="mt-1 text-[11px] text-neutral-500">Transport: {commsOps?.activeTransport || 'draft-only'}</div>
              </div>
            </div>
            <div className="space-y-3">
              {commsOps?.resendError ? (
                <div className="rounded-xl border border-amber-800/40 bg-amber-950/20 p-4 text-sm text-amber-200">
                  Resend status: {commsOps.resendError}. Live sending continues through {commsOps.activeTransport || 'draft-only'}.
                </div>
              ) : null}
              {commsOps?.assignedIdentities?.length ? commsOps.assignedIdentities.map((identity) => (
                <div key={identity.address} className="rounded-xl border border-neutral-800 bg-black/20 p-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">{identity.address}</div>
                    <div className="text-xs text-neutral-500">{identity.label} • {identity.purpose}</div>
                  </div>
                  <TaskPill status={identity.status === 'live' ? 'completed' : 'pending'} />
                </div>
              )) : (
                <div className="rounded-xl border border-neutral-800 bg-black/20 p-4 text-sm text-neutral-400">No communication identities assigned yet.</div>
              )}
            </div>
          </div>

          <div className="card-glass p-6 md:p-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sovereign-title text-lg text-white">Investor Access Queue</h2>
              <span className="text-xs text-neutral-500 uppercase tracking-wider">Diligence requests</span>
            </div>
            <div className="space-y-3">
              {investorOps?.latestRequests?.length ? investorOps.latestRequests.map((request) => (
                <div key={request.id} className="rounded-xl border border-neutral-800 bg-black/20 p-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">{request.name}</div>
                    <div className="text-xs text-neutral-500">{request.email} • {formatDate(request.createdAt)}</div>
                  </div>
                  <TaskPill status={request.status} />
                </div>
              )) : (
                <div className="rounded-xl border border-neutral-800 bg-black/20 p-4 text-sm text-neutral-400">No diligence requests have been captured yet.</div>
              )}
            </div>
          </div>

          <div className="card-glass p-6 md:p-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sovereign-title text-lg text-white">MARZ Automation Queue</h2>
              <span className="text-xs text-neutral-500 uppercase tracking-wider">Automation-ready</span>
            </div>
            <div className="space-y-3">
              {investorOps?.latestTasks?.length ? investorOps.latestTasks.map((task) => (
                <div key={task.id} className="rounded-xl border border-neutral-800 bg-black/20 p-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">{task.title}</div>
                    <div className="text-xs text-neutral-500">Owner: {task.owner} • Due: {formatDate(task.dueAt)}</div>
                  </div>
                  <TaskPill status={task.status} />
                </div>
              )) : (
                <div className="rounded-xl border border-neutral-800 bg-black/20 p-4 text-sm text-neutral-400">No queued automation tasks yet.</div>
              )}
            </div>
          </div>
        </section>

        <section className="card-glass p-6 md:p-8 overflow-x-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sovereign-title text-lg text-white">Lead Pipeline</h2>
            <span className="text-xs text-neutral-500 uppercase tracking-wider">{liveIntakeLabel}</span>
          </div>

          {error ? <div className="mb-4 rounded-xl border border-red-800/40 bg-red-950/20 p-4 text-sm text-red-200">{error}</div> : null}

          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-neutral-800/80 text-left">
                <th className="py-3 px-2 text-[10px] font-black tracking-widest uppercase text-neutral-500">Name</th>
                <th className="py-3 px-2 text-[10px] font-black tracking-widest uppercase text-neutral-500">Service</th>
                <th className="py-3 px-2 text-[10px] font-black tracking-widest uppercase text-neutral-500">Budget</th>
                <th className="py-3 px-2 text-[10px] font-black tracking-widest uppercase text-neutral-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-8 text-neutral-500" colSpan={4}>Syncing live leads…</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td className="py-8 text-neutral-500" colSpan={4}>No leads found in the live intake store.</td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-neutral-800/40 hover:bg-white/[0.02]">
                    <td className="py-3 px-2 text-sm font-semibold text-white">{lead.name}</td>
                    <td className="py-3 px-2 text-sm text-neutral-300">{lead.service}</td>
                    <td className="py-3 px-2 text-sm font-bold text-teal-400">{formatUsd(lead.budgetUsd)}</td>
                    <td className="py-3 px-2">
                      <StatusPill status={lead.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
