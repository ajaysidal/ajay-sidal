import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

/**
 * Alchemy Webhook Handler for Treasury Monitoring
 * FAIL-CLOSED: all requests are rejected until ALCHEMY_WEBHOOK_SECRET is set.
 *
 * Setup:
 * 1. Go to https://dashboard.alchemy.com/notify → Create Webhook
 * 2. Select event type; set address: REDACTED_SECRET
 * 3. Set URL: https://buildwithai.digital/api/webhooks/alchemy
 * 4. Copy the webhook signing key from the Alchemy dashboard
 * 5. Add to environment: ALCHEMY_WEBHOOK_SECRET=<signing_key>
 */

// ---------------------------------------------------------------------------
// Typed payload interfaces — Alchemy Notify schema
// ---------------------------------------------------------------------------

interface AlchemyActivity {
  hash?: string;
  fromAddress?: string;
  toAddress?: string;
  value?: string;
  blockNumber?: number;
}

interface AlchemyWebhookEvent {
  id?: string;
  type?: string;
  data?: {
    activity?: AlchemyActivity;
    reason?: string;
    gasPrice?: string;
  };
}

interface AlchemyWebhookPayload {
  event?: AlchemyWebhookEvent;
  timestamp?: string;
  webhookId?: string;
}

// ---------------------------------------------------------------------------
// Signature helpers
// ---------------------------------------------------------------------------

/** Constant-time hex string comparison — prevents timing side-channel attacks. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Run a dummy loop so the branch timing does not reveal the length difference.
    let dummy = 0;
    for (let i = 0; i < a.length; i++) dummy |= i;
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
    const computed = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return timingSafeEqual(computed, signature);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  // FAIL-CLOSED: reject every request when the signing secret is not configured.
  const webhookSecret = process.env.ALCHEMY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error(
      '[ALCHEMY WEBHOOK] ALCHEMY_WEBHOOK_SECRET is not set. ' +
        'All requests are being rejected. Add this env var to unblock.',
    );
    return NextResponse.json({ error: 'Webhook endpoint not configured' }, { status: 503 });
  }

  const headersList = await headers();
  const signature = headersList.get('x-alchemy-signature');
  const webhookId = headersList.get('x-alchemy-webhook-id');

  // FAIL-CLOSED: reject if the signature header is absent.
  if (!signature) {
    console.error('[ALCHEMY WEBHOOK] Missing x-alchemy-signature header');
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
  }

  // Read raw body before any parsing — the signature covers the raw bytes.
  const rawBody = await request.text();

  // Verify HMAC-SHA256 with constant-time comparison.
  const isValid = await verifyWebhookSignature(rawBody, signature, webhookSecret);
  if (!isValid) {
    console.error('[ALCHEMY WEBHOOK] Signature verification failed for webhook', webhookId);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // Parse JSON only after the signature is confirmed valid.
  let payload: AlchemyWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as AlchemyWebhookPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const eventId = payload.event?.id;

  // Idempotency: skip events that have already been processed.
  // Use webhookId as the unique key (more stable than eventId)
  const idempotencyKey = webhookId || eventId;
  if (idempotencyKey) {
    const existing = await prisma.webhookEvent.findUnique({ 
      where: { webhookId: idempotencyKey } 
    });
    if (existing) {
      console.log('[ALCHEMY WEBHOOK] Already processed:', idempotencyKey);
      return NextResponse.json({ success: true, message: 'Already processed' });
    }
  }

  console.log('[ALCHEMY WEBHOOK] Received:', {
    type: payload.event?.type,
    webhookId,
    timestamp: payload.timestamp,
  });

  try {
    switch (payload.event?.type) {
      case 'MINED_TRANSACTION':
        await handleMinedTransaction(payload);
        break;

      case 'DROPPED_TRANSACTION':
        await handleDroppedTransaction(payload);
        break;

      case 'GAS_PRICE_DECREASE':
      case 'GAS_PRICE_INCREASE':
        await handleGasPriceChange(payload);
        break;

      default:
        console.log('[ALCHEMY WEBHOOK] Unhandled event type:', payload.event?.type);
    }

    // Idempotency: record successful processing so the event is never replayed.
    const idempotencyKey = webhookId || eventId;
    if (idempotencyKey) {
      try {
        await prisma.webhookEvent.upsert({
          where: { webhookId: idempotencyKey },
          create: {
            webhookId: idempotencyKey,
            provider: 'alchemy',
            eventType: payload.event?.type ?? 'unknown',
            processedAt: new Date(),
          },
          update: {
            processedAt: new Date(),
          },
        });
      } catch (err) {
        console.error('[ALCHEMY WEBHOOK] Failed to record webhook processing:', err);
        // Don't fail the request if recording fails — the handler succeeded
      }
    }

    return NextResponse.json({ success: true, eventId });
  } catch (error) {
    console.error('[ALCHEMY WEBHOOK] Handler error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Handle mined transaction (payment received)
 */
async function handleMinedTransaction(payload: AlchemyWebhookPayload): Promise<void> {
  const activity = payload.event?.data?.activity;
  console.log('[ALCHEMY WEBHOOK] Mined transaction:', {
    hash: activity?.hash,
    from: activity?.fromAddress,
    to: activity?.toAddress,
    value: activity?.value,
    blockNumber: activity?.blockNumber,
  });

  const treasuryAddress = process.env.TREASURY_SAFE_ADDRESS?.toLowerCase();
  if (treasuryAddress && activity?.toAddress?.toLowerCase() === treasuryAddress) {
    console.log('[ALCHEMY WEBHOOK] Treasury payment received — update user credits here');
    // TODO: look up user by tx hash / memo and call addCredits()
  }
}

/**
 * Handle dropped transaction (failed payment)
 */
async function handleDroppedTransaction(payload: AlchemyWebhookPayload): Promise<void> {
  const activity = payload.event?.data?.activity;
  const reason = payload.event?.data?.reason;
  console.log('[ALCHEMY WEBHOOK] Dropped transaction:', {
    hash: activity?.hash,
    reason,
    from: activity?.fromAddress,
  });
  // TODO: notify user of failed transaction
}

/**
 * Handle gas price changes
 */
async function handleGasPriceChange(payload: AlchemyWebhookPayload): Promise<void> {
  const gasPrice = payload.event?.data?.gasPrice;
  console.log('[ALCHEMY WEBHOOK] Gas price change:', { gasPrice, type: payload.event?.type });
  // Optional: update gas price cache for sponsorship estimates
}

// GET /api/webhooks/alchemy — minimal status, no config disclosure
export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
