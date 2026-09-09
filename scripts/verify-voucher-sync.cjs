// Explicit deployment check. Credentials stay in this process, never in output.
require("@next/env").loadEnvConfig(process.cwd());

(async () => {
  const origin = new URL(process.argv[2] || "http://localhost:3100");
  if (!["localhost", "127.0.0.1", "cashback.id.vn"].includes(origin.hostname)) {
    throw new Error("Unsupported verification host");
  }
  const secret = process.env.CRON_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("Missing local cron/admin credential");
  const response = await fetch(new URL("/api/cron/shopee-vouchers", origin), {
    headers: { authorization: `Bearer ${secret}` },
    signal: AbortSignal.timeout(150_000),
  });
  console.log("HTTP", response.status);
  console.log(await response.text());
  if (!response.ok) process.exitCode = 1;
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
