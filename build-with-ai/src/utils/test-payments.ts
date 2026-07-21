/**
 * Payment System Test Script
 * Simulates Stripe webhooks and Polygon transactions to verify credit system
 *
 * Usage: npx tsx src/utils/test-payments.ts
 */

import { prisma } from '@/lib/prisma';
import { addCredits, deductCredits, freezeCreditsForDispute, getCreditBalance } from '../lib/monetization/credit-system';

// Test user ID (create one if doesn't exist)
const TEST_USER_EMAIL = 'test-payments@buildwithai.digital';

async function getOrCreateTestUser() {
  let user = await prisma.user.findUnique({
    where: { email: TEST_USER_EMAIL },
  });

  if (!user) {
    // Replace Openfort-style ID with a neutral synthetic ID
    const syntheticId = `test-user-${Date.now()}`;

    user = await prisma.user.create({
      data: {
        id: syntheticId,
        email: TEST_USER_EMAIL,
      },
    });

    console.log('✅ Created test user:', user.id);
  } else {
    console.log('✅ Using existing test user:', user.id);
  }

  return user;
}

async function testStripePayment() {
  console.log('\n🧪 TEST 1: Stripe Payment Simulation');
  console.log('─'.repeat(50));

  const user = await getOrCreateTestUser();
  const initialBalance = await getCreditBalance(user.id);
  console.log(`Initial balance: ${initialBalance.available} credits`);

  const amount = 5000; // $50 = 5000 credits
  const result = await addCredits(user.id, amount, {
    currency: 'USD',
    provider: 'stripe',
    stripePaymentIntentId: `pi_test_${Date.now()}`,
    description: 'Test credit purchase - $50',
    metadata: {
      test: true,
      stripeAmount: amount,
      stripeCurrency: 'usd',
    },
  });

  console.log(`✅ Payment successful: +${result.transaction.creditsGranted} credits`);
  console.log(`New balance: ${result.newBalance} credits`);

  const finalBalance = await getCreditBalance(user.id);
  console.log(`Verified balance: ${finalBalance.available} credits`);

  if (finalBalance.available !== initialBalance.available + amount) {
    throw new Error('Balance mismatch after Stripe payment');
  }

  console.log('✅ Stripe payment test PASSED');
  return user;
}

async function testPolygonPayment(user: any) {
  console.log('\n🧪 TEST 2: Polygon USDC Payment Simulation');
  console.log('─'.repeat(50));

  const initialBalance = await getCreditBalance(user.id);
  console.log(`Initial balance: ${initialBalance.available} credits`);

  const amount = 2500; // 25 USDC = 2500 credits
  const result = await addCredits(user.id, amount, {
    currency: 'USDC',
    provider: 'polygon',
    txHash: `0x_test_${Date.now()}`,
    description: 'Test USDC payment - 25 USDC',
    metadata: {
      test: true,
      txHash: `0x_test_${Date.now()}`,
      blockNumber: '12345678',
    },
  });

  console.log(`✅ Payment successful: +${result.transaction.creditsGranted} credits`);
  console.log(`New balance: ${result.newBalance} credits`);

  const finalBalance = await getCreditBalance(user.id);
  console.log(`Verified balance: ${finalBalance.available} credits`);

  if (finalBalance.available !== initialBalance.available + amount) {
    throw new Error('Balance mismatch after Polygon payment');
  }

  console.log('✅ Polygon payment test PASSED');
}

async function testDisputeFlow(user: any) {
  console.log('\n🧪 TEST 3: Dispute Handling Simulation');
  console.log('─'.repeat(50));

  const initialBalance = await getCreditBalance(user.id);
  console.log(`Initial balance: ${initialBalance.available} credits`);

  const disputeAmount = 5000;
  const freezeResult = await freezeCreditsForDispute(
    user.id,
    disputeAmount,
    `dp_test_${Date.now()}`
  );

  console.log(`✅ Dispute created: ${freezeResult.frozen} credits frozen`);
  console.log(`Remaining balance: ${freezeResult.remaining} credits`);

  const afterDisputeBalance = await getCreditBalance(user.id);
  console.log(`Verified - Available: ${afterDisputeBalance.available}, Frozen: ${afterDisputeBalance.frozen}`);

  if (afterDisputeBalance.frozen !== freezeResult.frozen) {
    throw new Error('Freeze amount mismatch');
  }

  console.log('✅ Dispute handling test PASSED');
}

async function testCreditDeduction(user: any) {
  console.log('\n🧪 TEST 4: Credit Deduction (Usage) Simulation');
  console.log('─'.repeat(50));

  await addCredits(user.id, 1000, {
    currency: 'USD',
    provider: 'system',
    description: 'Test credits for deduction',
  });

  const initialBalance = await getCreditBalance(user.id);
  console.log(`Initial balance: ${initialBalance.available} credits`);

  const deductionAmount = 500;
  const result = await deductCredits(
    user.id,
    deductionAmount,
    'AI API call - test deduction',
    { test: true }
  );

  console.log(`✅ Deducted: ${deductionAmount} credits`);
  console.log(`New balance: ${result.newBalance} credits`);

  const finalBalance = await getCreditBalance(user.id);
  console.log(`Verified balance: ${finalBalance.available} credits`);

  if (finalBalance.available !== initialBalance.available - deductionAmount) {
    throw new Error('Balance mismatch after deduction');
  }

  console.log('✅ Credit deduction test PASSED');
}

async function testTransactionHistory(user: any) {
  console.log('\n🧪 TEST 5: Transaction History Verification');
  console.log('─'.repeat(50));

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  console.log(`Found ${transactions.length} transactions`);

  for (const tx of transactions) {
    console.log(`  - ${tx.provider}: ${tx.currency} ${tx.amount} (${tx.status}) - ${tx.creditsGranted} credits`);
  }

  if (transactions.length === 0) {
    throw new Error('No transactions found');
  }

  console.log('✅ Transaction history test PASSED');
}

async function cleanup() {
  console.log('\n🧹 CLEANUP: Removing test data');
  console.log('─'.repeat(50));

  const testUser = await prisma.user.findUnique({
    where: { email: TEST_USER_EMAIL },
  });

  if (testUser) {
    await prisma.transaction.deleteMany({
      where: { userId: testUser.id },
    });

    await prisma.user.delete({
      where: { id: testUser.id },
    });

    console.log('✅ Test user and transactions deleted');
  }
}

async function runAllTests() {
  console.log('🚀 Starting Payment System Tests');
  console.log('='.repeat(50));

  try {
    const user = await testStripePayment();
    await testPolygonPayment(user);
    await testDisputeFlow(user);
    await testCreditDeduction(user);
    await testTransactionHistory(user);

    console.log('\n' + '='.repeat(50));
    console.log('✅ ALL TESTS PASSED');
    console.log('='.repeat(50));
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    await cleanup();
    await prisma.$disconnect();
  }
}

runAllTests().catch(console.error);
