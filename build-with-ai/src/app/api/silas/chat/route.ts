import { silasChat } from "@/silas-core/silas";
import { ECONOMIC_CONFIG } from "@/lib/economy/config";
import { runCommand } from "@/silas-core/terminal";

// Intent detector: extracts tool intent from user message

// ─── SECURITY LAYER: Fortress Mode ──────────────────────────────
const sanitizeInput = (input: string): string => {
  if (!input) return "";
  return input.replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .replace(/[<>{}]/g, "");
};
undefined
const isMaliciousPattern = (input: string): boolean => {
  const patterns = [
    /eval\s*\(/i, /exec\s*\(/i, /require\s*\(/i,
    /__proto__|constructor|prototype/i,
    /\b(python|bash|curl|wget)\b.*[|;&]/i,
    /admin|root|sudo|drop\s+table/i
  ];
  return patterns.some(r => r.test(input));
};
const isEthicalViolation = (input: string): boolean => {
  const flags = [
    /hate\s+speech|discriminat|violence|harm/i,
    /illegal\s+activity|fraud|scam|phish/i,
    /dox|personal\s+info|private\s+data/i
  ];
  return flags.some(r => r.test(input));
};
const responseCache = new Map<string, { reply: string; expires: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQ = 30;
const reqCounts = new Map<string, { c: number; reset: number }>();
const checkRate = (ip: string): { ok: boolean; wait?: number } => {
  const now = Date.now();
  const r = reqCounts.get(ip);
  if (!r || now > r.reset) { reqCounts.set(ip, { c: 1, reset: now + RATE_LIMIT_WINDOW }); return { ok: true }; }
  if (r.c >= MAX_REQ) return { ok: false, wait: Math.ceil((r.reset - now) / 1000) };
  r.c++; return { ok: true };
};
function auditLog(ip: string, action: string, status: string) { console.log("[AUDIT]", new Date().toISOString(), ip, action, status); }
const SECURE_HEADERS = { "X-Content-Type-Options": "nosniff", "Strict-Transport-Security": "max-age=31536000; includeSubDomains" };
const sanitizeOutput = (text: string) => text.replace(/KEY|SECRET|TOKEN/g, "[REDACTED]");




const detectIntent = (message: string): { intent: string | null; args: any } => {
  const lower = message.toLowerCase();

  // Wallet intents
  if (lower.includes('wallet') && (lower.includes('create') || lower.includes('new') || lower.includes('generate'))) {
    return { intent: 'wallet.create', args: { network: 'polygon-amoy' } };
  }

  // Guardrails intents
  if (lower.includes('propose') && lower.includes('safe')) {
    return { intent: 'guardrails.propose', args: {} };
  }

  // Plesk intents
  if (lower.includes('provision') || lower.includes('deploy domain')) {
    const domain = message.match(/[\w.-]+\.[a-z]{2,}/i)?.[0];
    return { intent: 'plesk.provision', args: { domain, options: { plan: 'starter' } } };
  }

  // Health/self-heal intents
  if (lower.includes('health') || lower.includes('are you ok') || lower.includes('self-heal')) {
    return { intent: 'system.health', args: {} };
  }

  // No recognized intent
  return { intent: null, args: {} };
};
export async function POST(req: Request) {
  // RBAC: Block admin functions for non-admin users
  const cookies = req.headers.get("cookie") || "";
  const isAdmin = cookies.includes("role=admin") || req.headers.get("x-role") === "admin";
  const body = await req.json();
  if (body.isAdmin && !isAdmin) {
    return Response.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
  }
  const { message, messages: history } = await req.json();
  // 🔒 Fortress Mode: Security Checks
  const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const rate = checkRate(clientIP);
  if (!rate.ok) return Response.json({ reply: `⚠️ Rate limit exceeded. Wait ${rate.wait}s.` }, { headers: SECURE_HEADERS, status: 429 });
  const safeMsg = typeof message === "string" ? sanitizeInput(message) : message;
  auditLog(clientIP, "chat_request", "allowed");
  if (typeof safeMsg === "string" && isMaliciousPattern(safeMsg)) return Response.json({ reply: "🛡️ Blocked: Security threat detected." }, { headers: SECURE_HEADERS, status: 403 });
  if (typeof safeMsg === "string" && isEthicalViolation(safeMsg)) return Response.json({ reply: "⚖️ Declined: Violates ethical guidelines." }, { headers: SECURE_HEADERS, status: 403 });
  const cacheKey = safeMsg.slice(0, 32); const cached = responseCache.get(cacheKey); if (cached && Date.now() < cached.expires) return Response.json({ reply: cached.reply }, { headers: SECURE_HEADERS, status: 200 });


  // Terminal mode
  if (safeMsg && typeof safeMsg === "string" && safeMsg.startsWith("!cmd ")) {
    const command = safeMsg.replace("!cmd ", "");
    const output = await runCommand(command);
    return Response.json({ reply: output });
  }

  // Normal chat
  // Check for tool intents before calling Silas
  const { intent, args } = (safeMsg && typeof safeMsg === "string") ? detectIntent(safeMsg) : { intent: null, args: {} };
  if (intent) {
    const toolResult = await routeTool(intent, args);
    if (toolResult !== null) {
      return Response.json({ reply: toolResult });
    }
  }

  const reply = (history && history.length > 0 ? await silasChat({ messages: history }) : await silasChat((safeMsg && typeof safeMsg === "string") ? safeMsg : (history && history.length > 0 ? history[history.length - 1].content : "Hello"))) || "🤖 Silas is thinking... Please try again in a moment. If this persists, check system health with \"are you ok?\"."; const finalReply = reply === "No response from Silas." ? "🤖 Silas is thinking... Please try again in a moment. If this persists, check system health with \"are you ok?\"." : reply;
  responseCache.set(cacheKey, { reply: sanitizeOutput(finalReply), expires: Date.now() + 300000 });
  return Response.json({ reply: sanitizeOutput(finalReply), reward: { token: "MARZ", amount: String(ECONOMIC_CONFIG.maxRewardPerInteraction), type: "engagement" } });
}

// Lazy-load new modules for tool-use capabilities
let _wallet: any = null; // Lazy-loaded module
let _guardrails: any = null; // Lazy-loaded module
let _plesk: any = null; // Lazy-loaded module

const loadModules = async () => {
  if (!_wallet) _wallet = await import('@/lib/silas/wallet');
  if (!_guardrails) _guardrails = await import('@/lib/silas/guardrails');
  if (!_plesk) _plesk = await import('@/lib/silas/plesk');
  return { wallet: _wallet, guardrails: _guardrails, plesk: _plesk };
};

// Self-healing tool executor: wraps tool calls with try/catch + fallback
const executeTool = async <T>(
  toolName: string,
  fn: () => Promise<T>,
  fallback: string
): Promise<T | string> => {
  try {
    return await fn();
  } catch (error: any) {
    console.error(`[Silas-Tool:${toolName}] Error: ${error.message}`);
    // Log to audit trail for monitoring (non-blocking)
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/logs/client-error`, {
      method: 'POST',
      body: JSON.stringify({ tool: toolName, error: error.message, timestamp: new Date().toISOString() }),
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {});
    return fallback as any;
  }
};


// Tool router skeleton: maps user intents to module functions
const routeTool = async (intent: string, args: any) => {
  // Lazy-load modules on first use
  const { wallet, guardrails, plesk } = await loadModules();
  
  // Route based on intent string
  switch (intent) {
    // Cases will be added in next chunks
    case 'wallet.create':
      return executeTool('wallet.create',
        () => wallet?.createSilasWallet(args),
        '⚠️ Wallet creation temporarily unavailable. Please try again in 30 seconds.');
    
    case 'guardrails.propose':
      return executeTool('guardrails.propose',
        () => guardrails?.proposeToSafe(args),
        '⚠️ Multi-sig proposal temporarily unavailable. Safe{Core} service may be busy.');
    
    case 'plesk.provision':
      return executeTool('plesk.provision',
        () => plesk?.provisionDomain(plesk.createPleskClient(), args.domain, args.options),
        '⚠️ Domain provisioning temporarily unavailable. Plesk API may be rate-limited. Please retry in 60 seconds.');

    case 'system.health':
      return executeTool('system.health',
        async () => {
          const health = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/health`).then(r => r.json());
          if (health.status !== 'healthy') {
            await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/devops/ping`, { method: 'POST' }).catch(() => {});
            return '🔧 Auto-recovery triggered. Systems reloading. Please retry in 15 seconds.';
          }
          return '✅ All systems healthy. Ready for autonomous operations.';
        },
        '⚠️ Health check unavailable. Assuming healthy; proceeding with caution.');

    default:
      return null; // Intent not recognized; let Silas handle naturally
  }
};
