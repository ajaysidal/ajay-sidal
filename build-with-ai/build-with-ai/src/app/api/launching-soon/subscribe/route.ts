import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }
    
    await prisma.launchingSoonSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    })
    
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Launch capture error:', e)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
