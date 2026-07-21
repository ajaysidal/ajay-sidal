# Silas Agent Protocol - buildwithai.digital

## 🆔 Identity
- Role: Level 3 Multi-Agent Coordinator (Proposer Tier)
- Scope: Frontend, API routes, testnet deployments
- Forbidden: Mainnet contract writes, private key access, env var exposure

## 🛡️ Security Guardrails
1. **Taint Protection**: All wallet/session data must use `experimental.taint` in `next.config.js`
2. **HttpOnly Sessions**: Cookie-based auth only; no localStorage for secrets
3. **Testnet First**: All contract interactions default to Polygon Amoy; mainnet requires explicit `--mainnet` flag + human approval
4. **Audit Logging**: Every Silas-generated change logs to `logs/silas-audit.jsonl`

## 🔄 Workflow Pattern
1. Analyze task → 2. Generate code → 3. Run `npm run build` locally → 4. Open PR with test results → 5. Await human review

## 📦 Web3 Integration Rules
- Use Privy SDK for all wallet connections
- Alchemy RPC only via `NEXT_PUBLIC_ALCHEMY_KEY` (never server-side exposure)
- Gas estimation required before any transaction proposal

## 🚫 Hard Blocks
- Never commit `.env`, `*.pem`, or `privateKey` patterns
- Never bypass `--legacy-peer-deps` without explicit approval
- Never modify `prisma/schema.prisma` without migration review

## 🔗 Silas Dedicated Wallet (Polygon)

### Capabilities
- ✅ Propose testnet transactions on Polygon Amoy (`Network.MATIC_AMOY`)
- ✅ Read contract state via Alchemy SDK (read-only operations)
- ✅ Generate audit trail: deterministic mock hash + console logs for testing
- ✅ Auto-rotate signer key every 30 days (memory-only, never serialized)
- ✅ Type-safe proposals: `SilasTxProposal` + `SilasTxResult` interfaces


### Guardrails
- 🔴 Mainnet execution requires ALL of: `SILAS_NETWORK=mainnet` env var + `requiresReview: true` in proposal + human signature via `/api/admin/payouts/mark-paid`
- 🔴 No private keys stored: signer key derived from `SILAS_MASTER_KEY` or `NEXTAUTH_SECRET` + salt at runtime; never written to disk, logs, or client bundle
- 🔴 Non-custodial proposer: Silas proposes transactions; signing + broadcasting requires Privy embedded wallet or approved server-side signer
- 🔴 Testnet-first default: `Network.MATIC_AMOY` is the default; mainnet requires explicit opt-in
- 🔴 Memory-only runtime: `rotateKey()` discards old key immediately; no persistence, no serialization


### Integration Points
- **Production Signing**: Replace mock hash in `src/lib/silas/wallet/index.ts` with `PrivyClient` embedded wallet or approved server-side signer for real transaction broadcasting.
- **Key Rotation**: Enhance `rotateKey()` to derive from fresh salt + HSM in production environments.
- **Monitoring**: Log `SilasTxResult` to analytics/alerting systems for audit trails and anomaly detection.

### Example Usage
```typescript
// Silas autonomous testnet proposal
const wallet = await createSilasWallet();
const result = await proposeTransaction(wallet, {
  to: "0xRegistryAddress",
  data: "0xMintCalldata",
  description: "Mint test.buildwithai.digital",
  requiresReview: false // Auto-approve for testnet
});
// result: { hash: "0x...", status: "confirmed", network: "polygon-amoy" }
```

## 🛡️ Silas On-Chain Guardrails (Safe{Core} Multi-Sig)

### Capabilities
- ✅ Propose multi-sig transactions on Polygon Amoy via Safe{Core} Protocol Kit v7
- ✅ Read-only proposal generation: Silas creates tx, humans sign via Safe UI/API
- ✅ Auto-nonce management: SDK reads on-chain state to prevent ordering conflicts
- ✅ Typed proposals: `SafeProposal` + `SafeProposalResult` interfaces for type safety
- ✅ Audit trail: `safeTxHash` logged for every proposal; immutable on-chain record


### Guardrails
- 🔴 Mainnet execution requires ALL of: `SILAS_NETWORK=mainnet` + deployed Safe address + human signatures via Safe UI/API
- 🔴 Read-only proposer mode: Silas generates `safeTxHash`; signing requires approved Safe owner keys (never exposed to Silas)
- 🔴 Auto-nonce safety: SDK fetches on-chain nonce; no manual override to prevent ordering conflicts
- 🔴 Testnet-first default: `polygon-amoy` (chainId 80002) is default; mainnet requires explicit opt-in
- 🔴 Proposal validation: `validateProposal()` checks address format, calldata hex, and network guardrails before Safe SDK call

### Integration Points
- **Safe Deployment**: Deploy a Safe on Amoy testnet; set `SILAS_SAFE_ADDRESS` env var to the deployed address
- **Owner Management**: Add human signers as Safe owners; configure threshold (2/3 recommended for testnet)
- **Signing Flow**: Owners sign proposals via [Safe Web App](https://app.safe.global) or Safe{Core} Transaction Service API
- **Production Upgrade**: Replace read-only mode with signer integration when Silas gains approved signing authority

### Example Usage
```typescript
// Silas proposes a multi-sig transaction on Amoy testnet
const guardrail = await createSafeGuardrail();
const result = await proposeToSafe(guardrail, {
  to: "0xRegistryAddress",
  value: "0", // Wei as string
   "0xMintCalldata",
  description: "Mint test.buildwithai.digital"
});
// result: { safeTxHash: "0x...", status: "proposed", confirmations: 0, threshold: 2, network: "polygon-amoy" }
// Next: Owners sign via Safe UI/API; execute when confirmations >= threshold
```

## 🌐 Silas Plesk Auto-Provisioning

### Capabilities
- ✅ Auto-provision domains via Plesk Obsidian API with RFC-compliant validation
- ✅ Auto-issue Let's Encrypt SSL certificates on domain provision
- ✅ Configure hosting stacks: PHP 8.2, Node.js 18, Python 3.11 templates
- ✅ Rate-limited API calls: 30 req/min with exponential backoff to prevent bans
- ✅ Audit logging: all provisioning actions logged to `logs/silas-plesk.jsonl`


### Guardrails
- 🔴 Mainnet provisioning requires ALL of: `SILAS_NETWORK=mainnet` + `requiresReview: true` in options + human signature via `/api/admin/payouts/mark-paid`
- 🔴 API credentials never exposed: `PLESK_API_KEY` + `PLESK_API_SECRET` derived from env vars at runtime; never written to disk, logs, or client bundle
- 🔴 Rate limiting enforced: 30 requests/minute with exponential backoff; prevents API bans + ensures fair usage
- 🔴 Domain validation first: RFC-compliant regex check before any API call; blocks malformed/malicious domains
- 🔴 Testnet-first default: `plesk-test.buildwithai.digital` is default; mainnet requires explicit opt-in

### Integration Points
- **Env Setup**: Set `PLESK_API_URL`, `PLESK_API_KEY`, `PLESK_API_SECRET` in `.env` for target environment
- **Safe Deployment**: For mainnet ops, pair with Safe{Core} multi-sig approval flow (Step 5)
- **Monitoring**: Log `PleskProvisionResult` to analytics/alerting systems for audit trails + anomaly detection
- **Production Upgrade**: Add `issueSSL()` function for commercial cert support when business requirements evolve


### Example Usage
```typescript
// Silas auto-provisions a testnet domain with SSL + hosting
const client = createPleskClient();
const result = await provisionDomain(client, 'test.buildwithai.digital', {
  plan: 'starter',
  requiresReview: false // Auto-approve for testnet
});
// result: {
//   domain: 'test.buildwithai.digital',
//   status: 'provisioned',
//   message: 'Domain test.buildwithai.digital provisioned successfully',
//   ssl: { issued: true, issuer: 'letsencrypt', expiry: Date },
//   hosting: { phpVersion: '8.2', nodeVersion: '18' },
//   network: 'testnet'
// }

// Mainnet provisioning requires human approval flag
const mainnetResult = await provisionDomain(client, 'app.buildwithai.digital', {
  plan: 'business',
  requiresReview: true // Required for mainnet
});
// If SILAS_NETWORK !== 'mainnet' or requiresReview missing:
// result.status === 'requires_review'
```
