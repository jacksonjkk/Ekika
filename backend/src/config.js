import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadEnv(path.join(backendRoot, ".env"));

function loadEnv(filename) {
  if (!fs.existsSync(filename)) return;

  for (const line of fs.readFileSync(filename, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || match[2].startsWith("#")) continue;
    const value = match[2].replace(/^(['"])(.*)\1$/, "$2");
    if (process.env[match[1]] === undefined) process.env[match[1]] = value;
  }
}

function integer(name, fallback) {
  const parsed = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const databaseValue = process.env.DATABASE_PATH ?? "./data/ekika.db";

export const config = Object.freeze({
  backendRoot,
  nodeEnv: process.env.NODE_ENV ?? "development",
  host: process.env.HOST ?? "0.0.0.0",
  port: integer("PORT", 4000),
  databasePath: path.isAbsolute(databaseValue) ? databaseValue : path.resolve(backendRoot, databaseValue),
  frontendOrigins: (process.env.FRONTEND_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  adminEmail: (process.env.ADMIN_EMAIL ?? "admin@ekikaexperience.ug").toLowerCase(),
  adminPassword: process.env.ADMIN_PASSWORD ?? "ekika-admin",
  jwtSecret: process.env.JWT_SECRET ?? "development-only-ekika-secret-change-me",
  jwtTtlSeconds: integer("JWT_TTL_SECONDS", 28800),
  paymentProvider: process.env.PAYMENT_PROVIDER ?? "mock",
  paymentWebhookSecret: process.env.PAYMENT_WEBHOOK_SECRET ?? "development-webhook-secret",
  depositPercent: Math.min(100, Math.max(1, integer("DEPOSIT_PERCENT", 30))),
  supabaseUrl: (process.env.SUPABASE_URL ?? "").replace(/\/$/, ""),
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY ?? "",
  portalSessionTtlSeconds: integer("PORTAL_SESSION_TTL_SECONDS", 86400),
});

export function validateProductionConfig(activeConfig = config) {
  if (activeConfig.nodeEnv !== "production") return;
  const failures = [];
  if (activeConfig.jwtSecret.length < 32 || activeConfig.jwtSecret.includes("development")) failures.push("JWT_SECRET");
  if (activeConfig.adminPassword.length < 12 || activeConfig.adminPassword === "ekika-admin") failures.push("ADMIN_PASSWORD");
  if (activeConfig.paymentWebhookSecret.length < 24 || activeConfig.paymentWebhookSecret.includes("development")) failures.push("PAYMENT_WEBHOOK_SECRET");
  if (!activeConfig.supabaseUrl || !activeConfig.supabaseServiceKey) failures.push("SUPABASE_URL/SUPABASE_SERVICE_KEY");
  if (failures.length) throw new Error(`Unsafe production configuration: ${failures.join(", ")}`);
}
