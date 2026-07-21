import { NextResponse } from 'next/server'
import { getViewerContext } from '@/lib/viewerContext'
import { runReminderCadence } from '@/lib/investorOps'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const viewer = await getViewerContext()
  const host = req.headers.get('host') || ''
  const allowPreview = process.env.NODE_ENV !== 'production' || host.includes('127.0.0.1') || host.includes('localhost')

  if (!viewer.isMasterAdmin && !allowPreview) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await runReminderCadence()
  return NextResponse.json(result)
}
