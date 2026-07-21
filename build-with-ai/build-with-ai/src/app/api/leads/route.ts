import { NextResponse } from 'next/server'
import { appendFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { queueOpportunityWorkflow } from '../../../lib/investorOps'
import { getDataDir } from '../../../lib/dataDir'

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Public lead intake is active.' })
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const email = (body?.email || '').toString().trim().toLowerCase()
    const emailDomain = email.includes('@') ? email.split('@')[1] : ''
    const createdAt = new Date().toISOString()

    const normalizedBody = {
      ...body,
      name: (body?.name || 'New opportunity').toString(),
      email,
      company: body?.company || emailDomain || body?.name || 'unknown',
      domain: body?.domain || emailDomain || undefined,
      service: (body?.service || 'general').toString(),
      message: (body?.message || '').toString(),
      tier: (body?.tier || 'starter').toString(),
      createdAt,
      timestamp: createdAt,
    }

    const dataDir = getDataDir()
    await mkdir(dataDir, { recursive: true })
    await appendFile(join(dataDir, 'leads.jsonl'), `${JSON.stringify(normalizedBody)}\n`, { encoding: 'utf8' })

    if (email) {
      await queueOpportunityWorkflow({
        name: normalizedBody.name,
        email,
        service: normalizedBody.service,
        source: 'public_leads_api',
      })
    }

    return NextResponse.json({ status: 'captured', queuedForFollowUp: true })
  } catch (e) {
    console.error('[LEADS] error', e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
