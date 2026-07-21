import { NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getDataDir } from '@/lib/dataDir'
import { getImpactStats } from '@/lib/impactStore'

export const runtime = 'nodejs'

async function countJsonl(fileName: string) {
  const file = join(getDataDir(), fileName)
  const text = await readFile(file, { encoding: 'utf8' }).catch((err: any) => {
    if (err?.code === 'ENOENT') return ''
    throw err
  })

  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean).length
}

export async function GET() {
  const [impact, alphaSignups, inboundLeads, trackedSignals] = await Promise.all([
    getImpactStats(),
    countJsonl('alpha_list.jsonl'),
    countJsonl('leads.jsonl'),
    countJsonl('marketing_events.jsonl'),
  ])

  return NextResponse.json({
    assetsSecured: impact.assetsSecured,
    alphaSignups,
    inboundLeads,
    trackedSignals,
    paymentStatus: Boolean((process.env.STRIPE_SECRET_KEY || '').trim()),
    walletStatus: Boolean((process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || process.env.ALCHEMY_API_KEY || '').trim()),
    updatedAt: new Date().toISOString(),
  })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  return NextResponse.json({
    status: 'ok',
    received: body,
    route: 'api/reports/summary',
  })
}
