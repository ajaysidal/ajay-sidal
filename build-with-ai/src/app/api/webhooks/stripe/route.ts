import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { addCredits, freezeCreditsForDispute, releaseFrozenCredits, forfeitFrozenCredits } from '@/lib/monetization/credit-system';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Stripe webhook idempotency: prevent double-processing retries
 */
async function hasProcessedWebhook(webhookId: string): Promise<boolean> {
  try {
    const existing = await prisma.webhookEvent.findUnique({
      where: { webhookId },
    });
    return !!existing;
  } catch (error) {
    console.error('Error checking webhook idempotency:', error);
    return false;
  }
}

async function markWebhookProcessed(
  webhookId: string,
  provider: string,
  eventType: string,
): Promise<void> {
  try {
    await prisma.webhookEvent.upsert({
      where: { webhookId },
      create: {
        webhookId,
        provider,
        eventType,
        processedAt: new Date(),
      },
      update: {
        processedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error recording webhook processing:', error);
  }
}

/**
 * Stripe Webhook Handler
 * Verifies signature and processes payment events
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')!;

  let event: Stripe.Event;

  // Verify webhook signature
  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Idempotency: skip if already processed
  const alreadyProcessed = await hasProcessedWebhook(event.id);
  if (alreadyProcessed) {
    console.log(`Stripe webhook ${event.id} already processed; acknowledging.`);
    return NextResponse.json({ received: true });
  }

  // Process event based on type
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.dispute.created':
        await handleDisputeCreated(event.data.object as Stripe.Dispute);
        break;

      case 'charge.dispute.closed':
        await handleDisputeClosed(event.data.object as Stripe.Dispute);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Idempotency: record this event so it is never replayed.
    await markWebhookProcessed(event.id, 'stripe', event.type);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const userId = paymentIntent.metadata?.userId;
  const amount = paymentIntent.amount; // In cents
  const description = paymentIntent.description || 'Credit purchase';

  if (!userId) {
    console.error('No userId in payment metadata:', paymentIntent.id);
    return;
  }

  // Add credits to user account
  await addCredits(userId, amount, {
    currency: 'USD',
    provider: 'stripe',
    stripePaymentIntentId: paymentIntent.id,
    description,
    metadata: {
      stripeAmount: amount,
      stripeCurrency: paymentIntent.currency,
      customerEmail: paymentIntent.receipt_email,
    },
  });

  console.log(`Payment successful: User ${userId} received ${amount} credits`);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const userId = paymentIntent.metadata?.userId;

  if (!userId) return;

  // Record failed transaction
  await prisma.transaction.create({
    data: {
      userId,
      amount: paymentIntent.amount,
      currency: 'USD',
      provider: 'stripe',
      status: 'failed',
      stripePaymentIntentId: paymentIntent.id,
      description: 'Payment failed',
      metadata: {
        failureReason: paymentIntent.last_payment_error?.message || 'Unknown error',
      },
      creditsGranted: 0,
    },
  });

  console.log(`Payment failed: User ${userId}, Reason: ${paymentIntent.last_payment_error?.message}`);
}

/**
 * Handle dispute created (chargeback)
 */
async function handleDisputeCreated(dispute: Stripe.Dispute) {
  const paymentIntentId = typeof dispute.payment_intent === 'string' 
    ? dispute.payment_intent 
    : dispute.payment_intent?.id;

  if (!paymentIntentId) {
    console.error('No payment_intent in dispute:', dispute.id);
    return;
  }

  // Find the original transaction
  const transaction = await prisma.transaction.findFirst({
    where: { stripePaymentIntentId: paymentIntentId },
    include: { user: true },
  });

  if (!transaction) {
    console.error('Original transaction not found for dispute:', dispute.id);
    return;
  }

  // Freeze user's credits
  await freezeCreditsForDispute(
    transaction.userId,
    dispute.amount,
    dispute.id
  );

  // Auto-accept small disputes (not worth fighting)
  if (dispute.amount < 10000) { // $100
    console.log(`Auto-accepting dispute ${dispute.id} (amount: $${dispute.amount / 100})`);
    // Don't submit evidence - let Stripe refund
    return;
  }

  // Alert admin to respond to dispute
  await notifyAdminOfDispute(dispute, transaction.user.email || undefined);

  console.log(`Dispute created: ${dispute.id}, User: ${transaction.userId}, Amount: $${dispute.amount / 100}`);
}

/**
 * Handle dispute closed
 */
async function handleDisputeClosed(dispute: Stripe.Dispute) {
  const paymentIntentId = typeof dispute.payment_intent === 'string'
    ? dispute.payment_intent
    : dispute.payment_intent?.id;

  if (!paymentIntentId) return;

  // Find the original transaction
  const transaction = await prisma.transaction.findFirst({
    where: { stripePaymentIntentId: paymentIntentId },
    include: { user: true },
  });

  if (!transaction) return;

  if (dispute.status === 'won') {
    // Dispute won - release frozen credits back to user
    await releaseFrozenCredits(transaction.userId, dispute.id);
    console.log(`Dispute won: ${dispute.id}, credits released to user ${transaction.userId}`);
  } else if (dispute.status === 'lost') {
    // Dispute lost - forfeit the credits
    await forfeitFrozenCredits(transaction.userId, dispute.id);
    console.log(`Dispute lost: ${dispute.id}, credits forfeited`);
  }
}

/**
 * Handle subscription changes
 */
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) return;

  const status = subscription.status;
  const amount = subscription.items.data[0]?.plan.amount || 0;

  // Record subscription event
  await prisma.transaction.create({
    data: {
      userId,
      amount: status === 'active' ? amount : 0,
      currency: 'USD',
      provider: 'stripe',
      status: status === 'active' ? 'completed' : 'refunded',
      stripePaymentIntentId: subscription.id,
      description: `Subscription ${status}`,
      metadata: {
        subscriptionId: subscription.id,
        subscriptionStatus: status,
      },
      creditsGranted: status === 'active' ? amount : 0,
    },
  });

  console.log(`Subscription ${status}: User ${userId}, Amount: $${amount / 100}`);
}

/**
 * Notify admin of new dispute
 */
async function notifyAdminOfDispute(dispute: Stripe.Dispute, customerEmail?: string) {
  // Send email notification
  const resendApiKey = process.env.RESEND_API_KEY;
  
  if (!resendApiKey) {
    console.warn('RESEND_API_KEY not configured, skipping email notification');
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: 'Silas <alerts@buildwithai.digital>',
      to: ['admin@buildwithai.digital'],
      subject: `🚨 DISPUTE ALERT: $${dispute.amount / 100} - Response Required`,
      html: `
        <h1>⚠️ Stripe Dispute Created</h1>
        <p><strong>Dispute ID:</strong> ${dispute.id}</p>
        <p><strong>Amount:</strong> $${dispute.amount / 100}</p>
        <p><strong>Customer Email:</strong> ${customerEmail || 'N/A'}</p>
        <p><strong>Reason:</strong> ${dispute.reason}</p>
        <p><strong>Status:</strong> ${dispute.status}</p>
        <p><strong>Response Deadline:</strong> ${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
        <hr/>
        <p><strong>Action Required:</strong></p>
        <ol>
          <li>Review transaction in Stripe Dashboard</li>
          <li>Gather evidence (user logs, service delivery proof, terms acceptance)</li>
          <li>Submit response before deadline</li>
        </ol>
        <a href="https://dashboard.stripe.com/disputes/${dispute.id}" 
           style="background: #635bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
          View in Stripe Dashboard
        </a>
      `,
    }),
  });

  if (!response.ok) {
    console.error('Failed to send dispute alert email:', await response.text());
  }
}
