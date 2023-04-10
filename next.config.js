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
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'apple-music-github-profile.rayriffy.com' }],
        destination: 'https://music-profile.rayriffy.com/:path*',
        permanent: true
      }
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
