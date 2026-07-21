# build-with-ai

This repository contains the BUILD WITH AI project — a Next.js app with experiments for AI-powered features, leads generation, and a MARZ avatar demo.
# build-with-ai

This repository contains the BUILD WITH AI project — a Next.js app with experiments for AI-powered features, leads generation, and a MARZ avatar demo.

## Deploy

This project uses GitHub Actions to run tests and can be deployed with your preferred hosting platform.

For full feature support (embeddings, vector DB, queue worker), set additional environment variables as needed: `OPENAI_API_KEY`, `DATABASE_URL`, `REDIS_URL`, `UPSTASH_VECTOR_URL`, `UPSTASH_VECTOR_TOKEN`, `CLEARBIT_KEY`, `HUNTER_API_KEY`.

## Fixing npm deprecation warnings

Some transitive dependencies may print deprecation warnings (e.g., `inflight`, `glob`, `lodash.get`, `sourcemap-codec`). These are usually from upstream packages. To reduce warnings and update transitive deps, try:

```bash
# Upgrade direct dependencies where possible
npm update

# Attempt automatic fixes
npm audit fix --force

# Optional: interactively upgrade all deps
npx npm-check-updates -u
npm install
```

This repo includes an `overrides` section in `package.json` to pin some transitive package versions as a best-effort mitigation.

## Spectral (lint) notes

If you run Spectral linting, use the CLI package and the included ruleset file:

```bash
npm run lint:spectral
```

The repository provides a minimal `.spectral.yaml` ruleset to avoid the "No ruleset has been found" message. Customize that file if you want to enforce API linting rules.

## Local development

Install dependencies and run the dev server:

```bash
npm ci
npm run dev
```

If you want me to add more deploy automation (e.g., Slack notifications on deploy or tagging releases), tell me which provider to use.

# Distributed Tracing Setup

This project supports distributed tracing via OpenTelemetry for Node.js and API routes.

## Quick Start

1. Install OpenTelemetry SDK:
   ```bash
   npm install @opentelemetry/api @opentelemetry/sdk-node
   ```

2. Configure OpenTelemetry in your entrypoint (e.g., server.js or next.config.js):
   ```js
   // Example setup
   const { NodeSDK } = require('@opentelemetry/sdk-node');
   const sdk = new NodeSDK({
     // Add exporters, instrumentations, etc.
   });
   sdk.start();
   ```

3. Export traces to your preferred backend (Datadog, Jaeger, etc.)

4. Traces are automatically captured for API routes and server functions using `startSpan` from src/lib/tracing.ts.

## Reference
- See src/lib/tracing.ts for integration details.
- For more info: https://opentelemetry.io/docs/instrumentation/js/
