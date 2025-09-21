/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removido output: 'export' para permitir API Routes
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET
  }
}

module.exports = nextConfig
