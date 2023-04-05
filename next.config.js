const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  async rewrites() {
    return [
      {
        source: '/theme/:theme.svg',
        destination: '/api/svg/:theme',
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    appDir: true,
    typedRoutes: true,
    serverComponentsExternalPackages: ['svgo', 'art-template', 'apple-signin-auth'],
  },
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
})
