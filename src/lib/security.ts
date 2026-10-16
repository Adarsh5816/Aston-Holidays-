import crypto from "crypto";
import { NextRequest } from "next/server";
import { Store } from "./store";

// ==========================================
// 1. TIMING-SAFE COMPARISON (Anti-Timing Attack)
// ==========================================
export function timingSafeCompare(provided: string | null | undefined, expected: string): boolean {
  if (!provided || !expected) return false;
  try {
    const bufA = Buffer.from(provided, "utf8");
    const bufB = Buffer.from(expected, "utf8");
    if (bufA.length !== bufB.length) {
      // Execute dummy constant-time operation to prevent length timing leaks
      crypto.timingSafeEqual(bufA, bufA);
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

// ==========================================
// 2. SLIDING-WINDOW RATE LIMITER (DDoS & Brute-Force Protection)
// ==========================================
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodically clean up entries older than 2 minutes to prevent memory leak
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 60000);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 60000);
}

export function checkRateLimit(
  identifier: string,
  maxPerMinute: number = 120
): { limited: boolean; currentCount: number; retryAfterSeconds: number } {
  const now = Date.now();
  let record = rateLimitStore.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(identifier, record);
  }

  // Filter timestamps within the last 60 seconds
  record.timestamps = record.timestamps.filter((ts) => now - ts < 60000);

  if (record.timestamps.length >= maxPerMinute) {
    const oldest = record.timestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((60000 - (now - oldest)) / 1000));
    return { limited: true, currentCount: record.timestamps.length, retryAfterSeconds };
  }

  record.timestamps.push(now);
  return { limited: false, currentCount: record.timestamps.length, retryAfterSeconds: 0 };
}

// ==========================================
// 3. CLIENT IP RESOLVER
// ==========================================
export function getClientIp(req: NextRequest): string {
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();
  return "127.0.0.1";
}

// ==========================================
// 4. INBOUND REQUEST AUTHENTICATION VERIFIER
// ==========================================
export interface AuthVerificationResult {
  authorized: boolean;
  reason?: string;
  clientIp: string;
  isDiagnosticPing: boolean;
}

export function verifyInboundSecurity(req: NextRequest, body?: any): AuthVerificationResult {
  const clientIp = getClientIp(req);
  const config = Store.getIntegrationConfig();

  // Check diagnostic probe markers
  const userAgent = req.headers.get("user-agent") || "";
  const isDiagnosticPing =
    body?._diagnosticPing === true ||
    userAgent.includes("WhatsAppAPI-DevSync") ||
    req.nextUrl.searchParams.get("ping") === "true";

  // Check IP whitelist if configured
  if (config.allowedIps && config.allowedIps.length > 0) {
    const isWhitelisted = config.allowedIps.some(
      (allowed) => allowed === clientIp || allowed === "127.0.0.1" || allowed === "::1"
    );
    if (!isWhitelisted) {
      return {
        authorized: false,
        reason: `IP ${clientIp} is not in the allowed integration whitelist`,
        clientIp,
        isDiagnosticPing
      };
    }
  }

  // Permissive mode (useful during early dev testing if admin wishes)
  if (config.securityMode === "permissive") {
    return { authorized: true, clientIp, isDiagnosticPing };
  }

  // Strict mode: requires matching x-api-key OR Authorization: Bearer <secret>
  const apiKeyHeader = req.headers.get("x-api-key");
  const authHeader = req.headers.get("authorization");
  const apiKeyQuery = req.nextUrl.searchParams.get("apiKey");

  let bearerToken: string | null = null;
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    bearerToken = authHeader.substring(7).trim();
  }

  const providedKey = apiKeyHeader || apiKeyQuery || bearerToken;

  if (!providedKey) {
    return {
      authorized: false,
      reason: "Missing security credentials (x-api-key header or Authorization: Bearer token required)",
      clientIp,
      isDiagnosticPing
    };
  }

  const keyMatches =
    timingSafeCompare(providedKey, config.inboundApiKey) ||
    timingSafeCompare(providedKey, config.inboundSecret) ||
    (bearerToken && timingSafeCompare(bearerToken, config.inboundSecret));

  if (!keyMatches) {
    return {
      authorized: false,
      reason: "Invalid API key or authorization token provided",
      clientIp,
      isDiagnosticPing
    };
  }

  return { authorized: true, clientIp, isDiagnosticPing };
}

// ==========================================
// 5. SANITIZATION & ANTI-INJECTION SHIELD
// ==========================================
export function sanitizeString(val: any, maxLength: number = 250): string {
  if (val === null || val === undefined) return "";
  let str = String(val).trim();
  // Strip dangerous script tags, html tags, javascript protocols
  str = str.replace(/<[^>]*>?/gm, "");
  str = str.replace(/javascript:/gi, "");
  str = str.replace(/data:/gi, "");
  // Guard against proto pollution keywords in user inputs
  if (str.includes("__proto__") || str.includes("constructor") || str.includes("prototype")) {
    str = str.replace(/__proto__|constructor|prototype/gi, "");
  }
  return str.slice(0, maxLength);
}

export function sanitizePhone(val: any): string {
  if (!val) return "";
  const cleaned = String(val).replace(/[^0-9+]/g, "").slice(0, 20);
  return cleaned;
}

export function sanitizeNumber(val: any, min: number = 0, max: number = 10000000): number | undefined {
  if (val === undefined || val === null || val === "") return undefined;
  const num = Number(val);
  if (isNaN(num)) return undefined;
  return Math.max(min, Math.min(max, num));
}
