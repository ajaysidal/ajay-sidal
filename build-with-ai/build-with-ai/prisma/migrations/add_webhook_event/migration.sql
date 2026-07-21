-- Create WebhookEvent table for idempotency tracking
-- Prevents duplicate webhook processing from Stripe/Alchemy retries

CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "webhookId" TEXT NOT NULL UNIQUE,
    "provider" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB
);

-- Indexes for fast lookup and filtering
CREATE INDEX "WebhookEvent_webhookId_idx" ON "WebhookEvent"("webhookId");
CREATE INDEX "WebhookEvent_provider_idx" ON "WebhookEvent"("provider");
CREATE INDEX "WebhookEvent_eventType_idx" ON "WebhookEvent"("eventType");
CREATE INDEX "WebhookEvent_processedAt_idx" ON "WebhookEvent"("processedAt");
