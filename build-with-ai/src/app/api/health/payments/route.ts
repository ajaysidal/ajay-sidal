import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createPublicClient, http } from 'viem';
import { polygon } from 'viem/chains';
import { prisma } from '@/lib/prisma';
import { validateTreasuryConfig } from '@/lib/monetization/treasury';

/**
 * Health Check Route for Payment Systems
 * Monitors Stripe, Alchemy RPC, Database, and Treasury configuration
 */

const ALCHEMY_RPC = process.env.ALCHEMY_POLYGON_RPC;
const FALLBACK_RPC = 'https://polygon-rpc.com';

export async function GET() {
  const healthStatus = {
    timestamp: new Date().toISOString(),
    overall: 'healthy',
    services: {
      stripe: { status: 'unknown', message: '' },
      alchemy: { status: 'unknown', message: '' },
      database: { status: 'unknown', message: '' },
      treasury: { status: 'unknown', message: '' },
    },
  };

  let hasCriticalError = false;

  // Check Stripe
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-06-20',
    });

    await stripe.balance.retrieve();

    healthStatus.services.stripe = {
      status: 'healthy',
      message: 'Stripe API connection successful',
    };
  } catch (error) {
    healthStatus.services.stripe = {
      status: 'degraded',
      message: error instanceof Error ? error.message : 'Stripe connection failed',
    };
  }

  // Check Alchemy RPC
  try {
    const client = createPublicClient({
      chain: polygon,
      transport: http(ALCHEMY_RPC, {
        retryCount: 2,
        timeout: 5000,
      }),
    });

    const blockNumber = await client.getBlockNumber();

    healthStatus.services.alchemy = {
      status: 'healthy',
      message: `Alchemy RPC connected (Block: ${blockNumber.toString()})`,
    };
  } catch (error) {
    // Try fallback RPC
    try {
      const fallbackClient = createPublicClient({
        chain: polygon,
        transport: http(FALLBACK_RPC),
      });

      const blockNumber = await fallbackClient.getBlockNumber();

      healthStatus.services.alchemy = {
        status: 'degraded',
        message: `Alchemy failed, using fallback RPC (Block: ${blockNumber.toString()})`,
      };
    } catch {
      healthStatus.services.alchemy = {
        status: 'error',
        message: 'Both Alchemy and fallback RPC failed',
      };
      hasCriticalError = true;
    }
  }

  // Check Database
  try {
    await prisma.$queryRaw`SELECT 1`;

    // Check Transaction model exists
    const transactionCount = await prisma.transaction.count();

    healthStatus.services.database = {
      status: 'healthy',
      message: `Database connected (${transactionCount} transactions)`,
    };
  } catch (error) {
    healthStatus.services.database = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Database connection failed',
    };
    hasCriticalError = true;
  }

  // Check Treasury Configuration
  try {
    const validation = validateTreasuryConfig();

    if (validation.valid) {
      healthStatus.services.treasury = {
        status: 'healthy',
        message: 'Treasury configuration valid',
      };
    } else {
      healthStatus.services.treasury = {
        status: 'degraded',
        message: validation.errors.join(', '),
      };
    }
  } catch (error) {
    healthStatus.services.treasury = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Treasury validation failed',
    };
  }

  // Determine overall status
  const serviceStatuses = Object.values(healthStatus.services);
  if (serviceStatuses.some(s => s.status === 'error')) {
    healthStatus.overall = 'critical';
  } else if (serviceStatuses.some(s => s.status === 'degraded')) {
    healthStatus.overall = 'degraded';
  }

  return NextResponse.json(healthStatus, {
    status: healthStatus.overall === 'healthy' ? 200 : healthStatus.overall === 'degraded' ? 207 : 503,
  });
}
