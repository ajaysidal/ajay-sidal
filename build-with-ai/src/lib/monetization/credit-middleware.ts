import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCreditBalance, hasSufficientCredits, deductCredits } from '@/lib/monetization/credit-system';

/**
 * Credit Check Middleware
 * Verifies user has sufficient credits before allowing API calls
 * 
 * Usage: Wrap protected API routes with this middleware
 */

export interface CreditCheckConfig {
  requiredCredits: number;
  description: string;
  autoDeduct?: boolean;
}

/**
 * Check if user has sufficient credits
 * Optionally deduct credits automatically
 */
export async function checkCredits(
  request: NextRequest,
  config: CreditCheckConfig
): Promise<NextResponse | null> {
  const userId = request.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  const { requiredCredits, description, autoDeduct = false } = config;

  // Check balance
  const hasCredits = await hasSufficientCredits(userId, requiredCredits);

  if (!hasCredits) {
    const balance = await getCreditBalance(userId);
    return NextResponse.json(
      {
        error: 'Insufficient credits',
        code: 'INSUFFICIENT_CREDITS',
        required: requiredCredits,
        available: balance.available,
        message: `You need ${requiredCredits} credits but only have ${balance.available} credits.`,
      },
      { status: 402 } // 402 Payment Required
    );
  }

  // Auto-deduct if enabled
  if (autoDeduct) {
    try {
      await deductCredits(userId, requiredCredits, description, {
        autoDeduct: true,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Credit deduction failed:', error);
      return NextResponse.json(
        { error: 'Failed to process payment', code: 'PAYMENT_FAILED' },
        { status: 500 }
      );
    }
  }

  // Continue to next handler
  return null;
}

/**
 * Higher-order function for API routes with credit check
 * 
 * @example
 * export const POST = withCreditCheck({ requiredCredits: 100, description: 'AI Generation' }, async (request) => {
 *   // Your API logic here
 * });
 */
export function withCreditCheck<T extends NextRequest>(
  config: CreditCheckConfig,
  handler: (request: T) => Promise<NextResponse>
) {
  return async function (request: T) {
    const creditCheckResponse = await checkCredits(request, config);
    
    if (creditCheckResponse) {
      return creditCheckResponse;
    }

    return handler(request);
  };
}

/**
 * Get user credit balance endpoint
 */
export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const balance = await getCreditBalance(userId);
  const history = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      amount: true,
      currency: true,
      provider: true,
      status: true,
      description: true,
      creditsGranted: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    balance,
    recentTransactions: history,
  });
}
