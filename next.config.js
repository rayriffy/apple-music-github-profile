const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  async rewrites() {
    return [
      {
        source: '/theme/:theme.svg',
        destination: '/api/svg',
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
})
