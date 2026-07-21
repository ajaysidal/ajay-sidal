# 🤖 SILAS Chat Wizard — Deployment Runbook

**Version:** 1.0.0  
**Last Updated:** $(date +%Y-%m-%d)  
**Owner:** Ajay @ Opsvantage Digital  
**Environment:** Production (`buildwithai.digital`)  

---

## 🎯 Purpose
This runbook documents the end-to-end deployment workflow for the SILAS Chat Wizard — an autonomous, self-healing AI co-pilot with tool routing capabilities.

## ✅ Pre-Deployment Checklist
- [ ] `.env` and `.env.local` configured with all required vars
- [ ] Prisma schema validated: `npx prisma validate`
- [ ] TypeScript compiles cleanly: `npm run build`
- [ ] pm2 process `build-with-ai-web` is stopped or ready for reload
- [ ] Backup created: `cp src/app/api/silas/chat/route.ts route.ts.backup.$(date +%Y%m%d%H%M)`

---

## 🚀 Core Deployment Steps

### Step 1: Build the Application
```bash
cd /opt/build-with-ai
npm run build
```

## 🚀 Core Deployment Steps

### Step 1: Build the Application
```bash
cd /opt/build-with-ai && npm run build
```
✅ **Success Criteria:** `✓ Compiled successfully` + `✓ Finished TypeScript`

### Step 2: Reload Production
```bash
pm2 reload build-with-ai-web --update-env
```
✅ **Success Criteria:** `[PM2] [build-with-ai-web](0) ✓`

### Step 3: Smoke Test Chat
```bash
curl -s -X POST https://buildwithai.digital/api/silas/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Silas, are you ok?"}' | jq -r '.reply'
```
✅ **Expected:** `✅ All systems healthy. Ready for autonomous operations.`

---

## 🧪 Intent Testing Suite

### Test All 4 Tool Intents + Natural Fallback

| Intent | Test Command | Expected Response |
|--------|-------------|------------------|
| 🔹 wallet.create | `curl -s -X POST https://buildwithai.digital/api/silas/chat -H "Content-Type: application/json" -d '{"message":"create a new wallet"}'` | `⚠️ Wallet creation temporarily unavailable...` OR Alchemy config |
| 🔹 guardrails.propose | `curl -s -X POST https://buildwithai.digital/api/silas/chat -H "Content-Type: application/json" -d '{"message":"propose to safe"}'` | `⚠️ Multi-sig proposal temporarily unavailable...` |
| 🔹 plesk.provision | `curl -s -X POST https://buildwithai.digital/api/silas/chat -H "Content-Type: application/json" -d '{"message":"provision domain test.buildwithai.digital"}'` | `{"domain":"test.buildwithai.digital","status":"error",...}` |
| 🔹 system.health | `curl -s -X POST https://buildwithai.digital/api/silas/chat -H "Content-Type: application/json" -d '{"message":"are you ok"}'` | `✅ All systems healthy. Ready for autonomous operations.` |
| 🔹 natural fallback | `curl -s -X POST https://buildwithai.digital/api/silas/chat -H "Content-Type: application/json" -d '{"message":"Hello Silas"}'` | Helpful message OR natural Silas response (NOT `No response from Silas.`) |

### Quick Test Script (Copy-Paste)
```bash
#!/bin/bash
BASE="https://buildwithai.digital/api/silas/chat"
HDR="-H Content-Type: application/json"

echo "🔹 Testing wallet.create..."
curl -s -X POST $BASE $HDR -d '{"message":"create a new wallet"}' | jq -r '.reply' | head -c 200
echo ""

echo "🔹 Testing guardrails.propose..."
curl -s -X POST $BASE $HDR -d '{"message":"propose to safe"}' | jq -r '.reply'
echo ""
echo "🔹 Testing plesk.provision..."
curl -s -X POST $BASE $HDR -d '{"message":"provision domain test.buildwithai.digital"}' | jq -r '.reply.domain'
echo ""

echo "🔹 Testing system.health..."
curl -s -X POST $BASE $HDR -d '{"message":"are you ok"}' | jq -r '.reply'
echo ""
echo "🔹 Testing natural fallback..."
curl -s -X POST $BASE $HDR -d '{"message":"Hello Silas"}' | jq -r '.reply' | head -c 200
echo ""

echo "✅ All tests complete!"
```

## 🔄 Rollback & Troubleshooting

### Emergency Rollback Steps
1. **Identify last good backup**: `ls -lt src/app/api/silas/chat/route.ts.*`
2. **Restore file**: `cp src/app/api/silas/chat/route.ts.backup.YYYYMMDDHHMM src/app/api/silas/chat/route.ts`
3. **Rebuild & Reload**: `npm run build && pm2 reload build-with-ai-web`

### Common Issues & Fixes
| Symptom | Likely Cause | Quick Fix |
|---------|-------------|-----------|
| 🔴 `Cannot find name 'detectIntent'` | Function missing/typo | Check `route.ts` line ~4-20; restore from backup |
| 🔴 `Module not found: @openfort/server-auth` | Optional dependency missing | Safe to ignore; wrapped in try/catch |
| 🔴 `pm2 reload fails` | Port in use / bad build | Run `npm run build` first; check `pm2 logs` |
| 🔴 Chat returns `No response from Silas.` | AI provider down | Intercept logic should catch it; verify fallback code |

---
*📅 Runbook maintained by Ajay. Update after every major Silas capability release.*
