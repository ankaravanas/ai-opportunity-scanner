/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The Hetzner image (Dockerfile) builds with STANDALONE=1: the server and its
  // traced dependencies only. Vercel builds without it, exactly as before.
  output: process.env.STANDALONE === '1' ? 'standalone' : undefined,
}

module.exports = nextConfig
