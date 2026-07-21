-- Manual Neon schema sync (non-destructive / data-preserving)
-- Generated for March 18, 2026 drift remediation
-- Purpose: align live DB closer to prisma/schema.prisma without reset
-- IMPORTANT: Review in staging first.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- users table: migrate legacy user_id schema -> id/openfortId schema
-- ============================================================================
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS id TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "openfortId" TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "creditsFrozen" INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "walletAddress" TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- Backfill id/openfortId from legacy user_id where present
UPDATE public.users
SET
  id = COALESCE(id, user_id),
  "openfortId" = COALESCE("openfortId", user_id)
WHERE COALESCE(id, "openfortId") IS NULL
  AND user_id IS NOT NULL;

-- Safety backfill for rows that still have NULL id/openfortId
UPDATE public.users
SET
  id = COALESCE(id, 'did:legacy:' || encode(gen_random_bytes(16), 'hex')),
  "openfortId" = COALESCE("openfortId", id)
WHERE id IS NULL OR "openfortId" IS NULL;

ALTER TABLE public.users ALTER COLUMN id SET NOT NULL;
ALTER TABLE public.users ALTER COLUMN "openfortId" SET NOT NULL;
ALTER TABLE public.users ALTER COLUMN role SET NOT NULL;
ALTER TABLE public.users ALTER COLUMN credits SET NOT NULL;
ALTER TABLE public.users ALTER COLUMN "creditsFrozen" SET NOT NULL;
ALTER TABLE public.users ALTER COLUMN "emailVerified" SET NOT NULL;
ALTER TABLE public.users ALTER COLUMN "createdAt" SET NOT NULL;
ALTER TABLE public.users ALTER COLUMN "updatedAt" SET NOT NULL;

-- Switch primary key from user_id -> id (preserves data)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND constraint_name = 'users_pkey'
      AND constraint_type = 'PRIMARY KEY'
  ) THEN
    ALTER TABLE public.users DROP CONSTRAINT users_pkey;
  END IF;
END $$;

ALTER TABLE public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);

-- Keep legacy user_id as nullable compatibility column; enforce uniqueness if populated
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'users_user_id_key'
  ) THEN
    CREATE UNIQUE INDEX users_user_id_key ON public.users(user_id) WHERE user_id IS NOT NULL;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='users_openfortId_key') THEN
    CREATE UNIQUE INDEX "users_openfortId_key" ON public.users("openfortId");
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='users_email_key') THEN
    CREATE UNIQUE INDEX "users_email_key" ON public.users(email) WHERE email IS NOT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='users_stripeCustomerId_key') THEN
    CREATE UNIQUE INDEX "users_stripeCustomerId_key" ON public.users("stripeCustomerId") WHERE "stripeCustomerId" IS NOT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='users_walletAddress_key') THEN
    CREATE UNIQUE INDEX "users_walletAddress_key" ON public.users("walletAddress") WHERE "walletAddress" IS NOT NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS users_role_idx ON public.users(role);
CREATE INDEX IF NOT EXISTS users_walletAddress_idx ON public.users("walletAddress");
CREATE INDEX IF NOT EXISTS users_openfortId_idx ON public.users("openfortId");

-- ============================================================================
-- Lead + LeadJob additive alignment (keep legacy columns to preserve data)
-- ============================================================================
ALTER TABLE public."Lead" ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public."Lead" ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE public."Lead" ADD COLUMN IF NOT EXISTS employees INTEGER;
ALTER TABLE public."Lead" ADD COLUMN IF NOT EXISTS revenue TEXT;
ALTER TABLE public."Lead" ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public."Lead" ADD COLUMN IF NOT EXISTS region TEXT;

UPDATE public."Lead" SET company = COALESCE(company, 'Unknown Company') WHERE company IS NULL;
ALTER TABLE public."Lead" ALTER COLUMN company SET NOT NULL;

CREATE INDEX IF NOT EXISTS "Lead_company_idx" ON public."Lead"(company);
CREATE INDEX IF NOT EXISTS "Lead_domain_idx" ON public."Lead"(domain);
CREATE INDEX IF NOT EXISTS "LeadEnrichment_provider_idx" ON public."LeadEnrichment"(provider);

ALTER TABLE public."LeadJob" ADD COLUMN IF NOT EXISTS "enqueuedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
UPDATE public."LeadJob" SET params = COALESCE(params, '{}'::jsonb) WHERE params IS NULL;
ALTER TABLE public."LeadJob" ALTER COLUMN params SET NOT NULL;
CREATE INDEX IF NOT EXISTS "LeadJob_status_idx" ON public."LeadJob"(status);

-- ============================================================================
-- Order + OrderItem additive alignment
-- ============================================================================
ALTER TABLE public."Order" ADD COLUMN IF NOT EXISTS "trackingProvider" TEXT;
ALTER TABLE public."Order" ADD COLUMN IF NOT EXISTS "trackingNumber" TEXT;
ALTER TABLE public."Order" ADD COLUMN IF NOT EXISTS "returnStatus" TEXT;
ALTER TABLE public."Order" ADD COLUMN IF NOT EXISTS "returnReason" TEXT;
ALTER TABLE public."Order" ADD COLUMN IF NOT EXISTS "returnRequestedAt" TIMESTAMP(3);
ALTER TABLE public."Order" ADD COLUMN IF NOT EXISTS "returnLabelUrl" TEXT;

UPDATE public."Order"
SET "amountTotal" = COALESCE("amountTotal", amount)
WHERE "amountTotal" IS NULL;
ALTER TABLE public."Order" ALTER COLUMN "amountTotal" SET NOT NULL;

-- NOTE: userId NOT NULL is intentionally not forced here if legacy NULL orders exist.
-- You can enforce later after backfilling orphan rows.

CREATE INDEX IF NOT EXISTS "Order_userId_idx" ON public."Order"("userId");
CREATE INDEX IF NOT EXISTS "Order_stripeId_idx" ON public."Order"("stripeId");
CREATE INDEX IF NOT EXISTS "Order_createdAt_idx" ON public."Order"("createdAt");
CREATE INDEX IF NOT EXISTS "Order_shippingStatus_idx" ON public."Order"("shippingStatus");
CREATE INDEX IF NOT EXISTS "Order_returnStatus_idx" ON public."Order"("returnStatus");

ALTER TABLE public."OrderItem" ADD COLUMN IF NOT EXISTS price INTEGER;
UPDATE public."OrderItem" SET price = COALESCE(price, amount, 0) WHERE price IS NULL;
ALTER TABLE public."OrderItem" ALTER COLUMN price SET NOT NULL;
CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON public."OrderItem"("orderId");

-- ============================================================================
-- New tables required by current code
-- ============================================================================
CREATE TABLE IF NOT EXISTS public."VerificationToken" (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON public."VerificationToken"(token);
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON public."VerificationToken"(identifier, token);

CREATE TABLE IF NOT EXISTS public."Transaction" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  provider TEXT NOT NULL,
  status TEXT NOT NULL,
  "txHash" TEXT,
  "stripePaymentIntentId" TEXT,
  "stripeDisputeId" TEXT,
  description TEXT,
  metadata JSONB,
  "creditsGranted" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "disputedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3)
);

CREATE UNIQUE INDEX IF NOT EXISTS "Transaction_txHash_key" ON public."Transaction"("txHash") WHERE "txHash" IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "Transaction_stripePaymentIntentId_key" ON public."Transaction"("stripePaymentIntentId") WHERE "stripePaymentIntentId" IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "Transaction_stripeDisputeId_key" ON public."Transaction"("stripeDisputeId") WHERE "stripeDisputeId" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "Transaction_userId_idx" ON public."Transaction"("userId");
CREATE INDEX IF NOT EXISTS "Transaction_status_idx" ON public."Transaction"(status);
CREATE INDEX IF NOT EXISTS "Transaction_createdAt_idx" ON public."Transaction"("createdAt");
CREATE INDEX IF NOT EXISTS "Transaction_txHash_idx" ON public."Transaction"("txHash");
CREATE INDEX IF NOT EXISTS "Transaction_stripePaymentIntentId_idx" ON public."Transaction"("stripePaymentIntentId");

CREATE TABLE IF NOT EXISTS public."WebhookEvent" (
  id TEXT PRIMARY KEY,
  "webhookId" TEXT NOT NULL UNIQUE,
  provider TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB
);
CREATE INDEX IF NOT EXISTS "WebhookEvent_webhookId_idx" ON public."WebhookEvent"("webhookId");
CREATE INDEX IF NOT EXISTS "WebhookEvent_provider_idx" ON public."WebhookEvent"(provider);
CREATE INDEX IF NOT EXISTS "WebhookEvent_eventType_idx" ON public."WebhookEvent"("eventType");
CREATE INDEX IF NOT EXISTS "WebhookEvent_processedAt_idx" ON public."WebhookEvent"("processedAt");

-- ============================================================================
-- Foreign keys (added only if absent)
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'Order'
      AND constraint_name = 'Order_userId_fkey'
  ) THEN
    ALTER TABLE public."Order"
      ADD CONSTRAINT "Order_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES public.users(id)
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
EXCEPTION WHEN others THEN
  RAISE NOTICE 'Skipped Order_userId_fkey creation: %', SQLERRM;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'Transaction'
      AND constraint_name = 'Transaction_userId_fkey'
  ) THEN
    ALTER TABLE public."Transaction"
      ADD CONSTRAINT "Transaction_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES public.users(id)
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
EXCEPTION WHEN others THEN
  RAISE NOTICE 'Skipped Transaction_userId_fkey creation: %', SQLERRM;
END $$;

COMMIT;
