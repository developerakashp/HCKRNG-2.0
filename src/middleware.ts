import { NextRequest, NextResponse } from "next/server";

// ── In-memory rate limiter (works for single-instance; use Redis in production) ──
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_CONFIG: Record<string, { limit: number; windowMs: number }> = {
  "/api/campaign": { limit: 10, windowMs: 60_000 },       // 10 req/min per IP
  "/api/campaign/generate": { limit: 5, windowMs: 60_000 }, // 5 req/min per IP
};

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    rateLimitMap.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  entry.count++;
  if (entry.count > limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

// Clean up expired entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetAt) rateLimitMap.delete(key);
    }
  }, 300_000);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = getClientIP(req);

  // ── Security Headers ────────────────────────────────────────────────────────
  const res = NextResponse.next();

  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",   // Next.js requires this
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://upload.wikimedia.org",
      "connect-src 'self' https://apihub.agnes-ai.com",
      "frame-ancestors 'none'",
    ].join("; "),
  );

  // ── CORS handling for API routes ──────────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    const origin = req.headers.get("origin");
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ];

    // Preflight
    if (req.method === "OPTIONS") {
      const preflightRes = new NextResponse(null, { status: 204 });
      if (origin && allowedOrigins.includes(origin)) {
        preflightRes.headers.set("Access-Control-Allow-Origin", origin);
      }
      preflightRes.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      preflightRes.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      preflightRes.headers.set("Access-Control-Max-Age", "86400");
      return preflightRes;
    }

    // Block non-POST on API routes that only accept POST
    if (
      (pathname === "/api/campaign" || pathname === "/api/campaign/generate") &&
      req.method !== "POST"
    ) {
      return NextResponse.json(
        { error: "Method not allowed" },
        {
          status: 405,
          headers: { Allow: "POST" },
        },
      );
    }

    // ── Rate limiting ───────────────────────────────────────────────────────
    const routeConfig = Object.entries(RATE_LIMIT_CONFIG).find(([route]) =>
      pathname.startsWith(route),
    );

    if (routeConfig) {
      const [, config] = routeConfig;
      const rateLimitKey = `${ip}:${pathname}`;
      const { allowed, remaining, resetAt } = checkRateLimit(
        rateLimitKey,
        config.limit,
        config.windowMs,
      );

      if (!allowed) {
        return NextResponse.json(
          {
            error: "Too many requests. Please try again later.",
            retryAfter: Math.ceil((resetAt - Date.now()) / 1000),
          },
          {
            status: 429,
            headers: {
              "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
              "X-RateLimit-Limit": String(config.limit),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": String(resetAt),
            },
          },
        );
      }

      res.headers.set("X-RateLimit-Limit", String(config.limit));
      res.headers.set("X-RateLimit-Remaining", String(remaining));
      res.headers.set("X-RateLimit-Reset", String(resetAt));
    }

    // Set CORS for allowed origins
    if (origin && allowedOrigins.includes(origin)) {
      res.headers.set("Access-Control-Allow-Origin", origin);
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, public images
     */
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
