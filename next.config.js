/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/api/cron/shopee-vouchers": ["./node_modules/@sparticuz/chromium/bin/**/*"],
      "/api/generate-link": ["./node_modules/@sparticuz/chromium/bin/**/*"],
    },
  },
}
module.exports = nextConfig
