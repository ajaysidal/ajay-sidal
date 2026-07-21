import { NextResponse } from 'next/server'
import { trackServerEvent } from '@/lib/analytics'

export async function GET() {
  // Emit server-side analytics event (privacy-first, non-blocking)
  await trackServerEvent('silas_autonomous_test', {
    feature: 'tier2_workflow',
    status: 'active',
  }).catch(() => {})

  return NextResponse.json({
    success: true,
    message: 'Silas Tier 2 Autonomous Workflow Active',
    analytics: 'server_emitted',
    env: process.env.SHADOW_ENV === 'true' ? 'shadow' : 'production'
  })
}
