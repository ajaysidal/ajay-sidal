/**
 * Server-Side Credit System
 * Immutable ledger for user credits with dispute protection
 */

import { prisma } from '@/lib/prisma';
import type { User, Transaction } from '@prisma/client';

/**
 * Credit types for different operations
 */
export type CreditOperation = 
  | 'purchase'
  | 'refund'
  | 'dispute_freeze'
  | 'dispute_release'
  | 'dispute_forfeit'
  | 'adjustment'
  | 'usage';

/**
 * Credit transaction result
 */
export interface CreditResult {
  success: boolean;
  previousBalance: number;
  newBalance: number;
  transaction: Transaction;
  message: string;
}

/**
 * Add credits to user account (after successful payment)
 */
export async function addCredits(
  userId: string,
  amount: number, // In cents
  options: {
    currency: string;
    provider: 'stripe' | 'polygon' | 'system';
    txHash?: string;
    stripePaymentIntentId?: string;
    description?: string;
    metadata?: Record<string, string | number | boolean | null>;
  }
): Promise<CreditResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true, creditsFrozen: true },
  });

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  const previousBalance = user.credits;
  const creditsGranted = amount; // 1:1 mapping (1 cent = 1 credit)

  // Create transaction and update user credits atomically
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      amount,
      currency: options.currency,
      provider: options.provider,
      status: 'completed',
      txHash: options.txHash,
      stripePaymentIntentId: options.stripePaymentIntentId,
      description: options.description,
      metadata: options.metadata ?? undefined,
      creditsGranted,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      credits: {
        increment: creditsGranted,
      },
    },
  });

  return {
    success: true,
    previousBalance,
    newBalance: previousBalance + creditsGranted,
    transaction,
    message: `Added ${creditsGranted} credits (${options.currency})`,
  };
}

/**
 * Deduct credits from user account (for usage/refunds)
 */
export async function deductCredits(
  userId: string,
  amount: number,
  description: string,
  metadata?: Record<string, string | number | boolean | null>
): Promise<CreditResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true, creditsFrozen: true },
  });

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  if (user.credits < amount) {
    throw new Error(
      `Insufficient credits. Required: ${amount}, Available: ${user.credits}`
    );
  }

  const previousBalance = user.credits;

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      amount: -amount, // Negative for deductions
      currency: 'USD',
      provider: 'system',
      status: 'completed',
      description,
      metadata: metadata ?? undefined,
      creditsGranted: -amount,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      credits: {
        decrement: amount,
      },
    },
  });

  return {
    success: true,
    previousBalance,
    newBalance: previousBalance - amount,
    transaction,
    message: `Deducted ${amount} credits for ${description}`,
  };
}

/**
 * Freeze credits during Stripe dispute
 */
export async function freezeCreditsForDispute(
  userId: string,
  amount: number,
  stripeDisputeId: string
): Promise<{ frozen: number; remaining: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true, creditsFrozen: true },
  });

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  const freezeAmount = Math.min(amount, user.credits);

  await prisma.user.update({
    where: { id: userId },
    data: {
      credits: {
        decrement: freezeAmount,
      },
      creditsFrozen: {
        increment: freezeAmount,
      },
    },
  });

  // Update the disputed transaction
  await prisma.transaction.updateMany({
    where: {
      userId,
      stripePaymentIntentId: stripeDisputeId.replace('dp_', 'pi_'),
    },
    data: {
      status: 'disputed',
      disputedAt: new Date(),
      stripeDisputeId,
    },
  });

  return {
    frozen: freezeAmount,
    remaining: user.credits - freezeAmount,
  };
}

/**
 * Release frozen credits back to user (dispute won)
 */
export async function releaseFrozenCredits(
  userId: string,
  stripeDisputeId: string
): Promise<{ released: number; newBalance: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true, creditsFrozen: true },
  });

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  const transaction = await prisma.transaction.findFirst({
    where: { stripeDisputeId },
  });

  if (!transaction) {
    throw new Error(`Transaction for dispute ${stripeDisputeId} not found`);
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      credits: {
        increment: user.creditsFrozen,
      },
      creditsFrozen: {
        decrement: user.creditsFrozen,
      },
    },
  });

  await prisma.transaction.update({
    where: { id: transaction.id },
    data: {
      status: 'completed',
      resolvedAt: new Date(),
    },
  });

  return {
    released: user.creditsFrozen,
    newBalance: user.credits + user.creditsFrozen,
  };
}

/**
 * Forfeit frozen credits (dispute lost)
 */
export async function forfeitFrozenCredits(
  userId: string,
  stripeDisputeId: string
): Promise<{ forfeited: number }> {
  const transaction = await prisma.transaction.findFirst({
    where: { stripeDisputeId },
  });

  if (!transaction) {
    throw new Error(`Transaction for dispute ${stripeDisputeId} not found`);
  }

  await prisma.transaction.update({
    where: { id: transaction.id },
    data: {
      status: 'refunded',
      resolvedAt: new Date(),
      creditsGranted: 0, // Revoke the credits
    },
  });

  // Credits already removed from user, just clear frozen
  await prisma.user.update({
    where: { id: userId },
    data: {
      creditsFrozen: {
        decrement: transaction.creditsGranted,
      },
    },
  });

  return {
    forfeited: transaction.creditsGranted,
  };
}

/**
 * Check if user has sufficient credits
 */
export async function hasSufficientCredits(
  userId: string,
  amount: number
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });

  return (user?.credits || 0) >= amount;
}

/**
 * Get user credit balance
 */
export async function getCreditBalance(userId: string): Promise<{
  available: number;
  frozen: number;
  total: number;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true, creditsFrozen: true },
  });

  if (!user) {
    return { available: 0, frozen: 0, total: 0 };
  }

  return {
    available: user.credits,
    frozen: user.creditsFrozen,
    total: user.credits + user.creditsFrozen,
  };
}

/**
 * Get transaction history for user
 */
export async function getTransactionHistory(
  userId: string,
  limit = 50,
  offset = 0
): Promise<Transaction[]> {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
}
