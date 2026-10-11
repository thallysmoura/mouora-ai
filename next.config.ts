import type { NextConfig } from "next";

const dev = process.env.NODE_ENV !== "production";

// Equivalente ao helmet para Next.js: cabeçalhos de segurança em todas as respostas.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com${dev ? " 'unsafe-eval'" : ""}`, // os scripts inline do Next exigem 'unsafe-inline' (sem nonce)
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://*.tile.openstreetmap.org",
  "media-src 'self' blob:",
  "font-src 'self' data:",
  `connect-src 'self'${dev ? " ws: wss:" : ""}`,
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  ...(dev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
];

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  poweredByHeader: false,
  output: "standalone", // imagem Docker enxuta
  serverExternalPackages: ["geoip-lite"], // lê a base de IPs do disco em tempo de execução
  outputFileTracingIncludes: { "/**": ["./node_modules/geoip-lite/data/**", "./content/**"] },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // respostas de autenticação e áreas logadas nunca devem ficar em cache
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }] },
      { source: "/(login|register|forgot-password|dashboard)/:path*", headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }] },
    ];
  },
};

export default nextConfig;
