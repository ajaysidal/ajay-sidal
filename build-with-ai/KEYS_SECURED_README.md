# 🔐 Keys Secured - Action Required

**Date:** 2026-03-16  
**Status:** ⚠️ **CRITICAL - KEYS EXPOSED - ROTATION REQUIRED**

---

## 🚨 What Happened

LIVE API keys were shared in plain text during our conversation. These keys are now **COMPROMISED** and must be rotated immediately.

---

## ✅ What I Did

1. **Secured keys in `.env.local`:**
   - File is gitignored (won't be committed to GitHub)
   - Stored on server only: `/opt/build-with-ai/.env.local`
   - Pre-commit hook installed to prevent future leaks

2. **Created security documentation:**
   - `SECURITY_AUDIT_REPORT.md` - Full audit with rotation steps
   - `.env.template` - Safe template for sharing
   - Pre-commit hook to scan for secrets

3. **Verified git history:**
   - ✅ No secrets found in committed files
   - ✅ `.env.local` properly gitignored

---

## ⚠️ What YOU Must Do NOW

### Step 1: Rotate Stripe Keys (5 minutes)

1. Go to https://dashboard.stripe.com/apikeys
2. Click "Roll secret key" → Confirm
3. Copy the NEW secret key (starts with `sk_live_`)
4. Go to https://dashboard.stripe.com/webhooks
5. Click "Add endpoint" or edit existing → Generate new secret
6. Copy the NEW webhook secret (starts with `whsec_`)

### Step 2: Rotate Alchemy Key (2 minutes)

1. Go to https://dashboard.alchemy.com/settings/api-keys
2. Delete the old key: `c4YUdaSKyJjyNxSM8EOoO`
3. Click "Create API Key"
4. Select "Polygon Mainnet"
5. Copy the NEW key

### Step 3: Update Server (3 minutes)

SSH to your server and update `.env.local`:

```bash
# SSH to server
ssh ajay@buildwithai.digital

# Edit .env.local
nano /opt/build-with-ai/.env.local

# Update these lines with NEW keys:
STRIPE_SECRET_KEY=sk_live_NEW_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_NEW_WEBHOOK_SECRET_HERE
ALCHEMY_POLYGON_RPC=https://polygon-mainnet.g.alchemy.com/v2/NEW_API_KEY_HERE

# Save: Ctrl+X, then Y, then Enter
```

### Step 4: Restart Application

```bash
pm2 restart silas-app
pm2 logs silas-app --lines 20
```

### Step 5: Test Payments

```bash
cd /opt/build-with-ai
npx tsx src/utils/test-payments.ts
```

---

## 📋 Key Locations

| File | Contains | Git Tracked? |
|------|----------|--------------|
| `.env.local` | **REAL LIVE KEYS** | ❌ NO (gitignored) |
| `.env.example` | Template (no real keys) | ✅ YES |
| `.env.template` | Template with hints | ✅ YES (forced add) |
| `SECURITY_AUDIT_REPORT.md` | Rotation instructions | ✅ YES |

---

## 🔒 Security Measures Added

1. **Pre-commit hook** - Scans for secrets before each commit
2. **Gitignore updated** - `.env.*` files blocked
3. **Documentation** - Clear rotation procedures
4. **Audit trail** - All actions documented

---

## 📞 If You Need Help

**Stripe Support:**
- https://stripe.com/support
- support@stripe.com

**Alchemy Support:**
- https://dashboard.alchemy.com/support
- Discord: https://discord.gg/alchemy

---

## ✅ Checklist

- [ ] Rotated Stripe secret key
- [ ] Rotated Stripe webhook secret
- [ ] Rotated Alchemy API key
- [ ] Updated `/opt/build-with-ai/.env.local` on server
- [ ] Restarted application (`pm2 restart`)
- [ ] Tested payment flow
- [ ] Verified no unauthorized transactions

---

**Time to complete:** 10-15 minutes  
**Priority:** 🔴 **CRITICAL - Do this NOW**
