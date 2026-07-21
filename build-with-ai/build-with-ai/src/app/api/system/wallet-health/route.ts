import { NextResponse } from 'next/server';
import { verifyConnection } from '@/lib/silas/wallet';

export async function GET() {
  const status = await verifyConnection();
  return NextResponse.json(status);
}
