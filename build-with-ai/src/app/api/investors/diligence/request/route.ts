import { NextResponse } from 'next/server'
import { getViewerContext } from '@/lib/viewerContext'
import { hasDiligenceAccess, submitDiligenceRequest } from '@/lib/investorOps'

export const runtime = 'nodejs'

export async function GET() {
  const viewer = await getViewerContext()

  if (!viewer.isAuthenticated) {
    return NextResponse.json({
      authenticated: false,
      accessGranted: false,
      email: null,
    })
  }

  if (viewer.isMasterAdmin) {
    return NextResponse.json({
      authenticated: true,
      accessGranted: true,
      email: viewer.email,
      autoGranted: true,
    })
  }

  const accessGranted = await hasDiligenceAccess(viewer.email)

  return NextResponse.json({
    authenticated: true,
    accessGranted,
    email: viewer.email,
    name: viewer.name,
  })
}

export async function POST(req: Request) {
  const viewer = await getViewerContext()

  if (!viewer.isAuthenticated || !viewer.email) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body = (await req.json().catch(() => null)) as {
    name?: string
    organization?: string
    role?: string
    website?: string
    purpose?: string
    ndaAccepted?: boolean
  } | null

  if (!body?.ndaAccepted) {
    return NextResponse.json({ error: 'NDA acknowledgement is required' }, { status: 400 })
  }

  const record = await submitDiligenceRequest({
    name: body?.name?.trim() || viewer.name || viewer.email,
    email: viewer.email,
    organization: body?.organization,
    role: body?.role,
    website: body?.website,
    purpose: body?.purpose,
  })

  return NextResponse.json({
    ok: true,
    accessGranted: true,
    request: record,
  })
}
