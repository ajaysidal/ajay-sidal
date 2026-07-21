import { NextResponse } from 'next/server'

import { getDashboardLeadsData } from '../../../../lib/dashboardLeads'
import { getViewerContext } from '../../../../lib/viewerContext'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
    const viewer = await getViewerContext()
    const host = req.headers.get('host') || ''
    const allowPreview = process.env.NODE_ENV !== 'production' || host.includes('127.0.0.1') || host.includes('localhost')

    if (!viewer.isMasterAdmin && !viewer.userId && !allowPreview) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const data = await getDashboardLeadsData({
      userId: viewer.userId,
      includeAll: viewer.isMasterAdmin || allowPreview,
    })
    return NextResponse.json({
      ...data,
      scope: viewer.isMasterAdmin ? 'global' : viewer.userId ? 'user' : 'preview',
      viewer: {
        userId: viewer.userId,
        isMasterAdmin: viewer.isMasterAdmin,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load dashboard leads'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}