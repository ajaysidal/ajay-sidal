import { NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getDataDir } from '@/lib/dataDir'

export const runtime = 'nodejs'

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

export async function GET() {
  const invites = await readJsonl<{ title: string; attendeeEmail?: string; startIso: string; endIso: string; createdAt: string }>('calendar_invites.jsonl')
  const now = Date.now()
  const upcoming = invites.filter((invite) => new Date(invite.startIso).getTime() > now)
  const past = invites.filter((invite) => new Date(invite.endIso).getTime() <= now)

  return NextResponse.json({
    ok: true,
    upcomingCount: upcoming.length,
    pastCount: past.length,
    nextInvite: upcoming.sort((a, b) => (a.startIso > b.startIso ? 1 : -1))[0] || null,
  })
}
