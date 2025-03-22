import type { NextConfig } from 'next'
import analyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = analyzer({
  enabled: process.env.ANALYZE === 'true',
})

const config: NextConfig = withBundleAnalyzer({
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
        has: [
          { type: 'host', value: 'apple-music-github-profile.rayriffy.com' },
        ],
        destination: 'https://music-profile.rayriffy.com/:path*',
        permanent: true,
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    reactRemoveProperties: true,
    removeConsole: false,
  },
  experimental: {
    typedRoutes: true,
    fallbackNodePolyfills: false,
  },
  serverExternalPackages: [
    'svgo',
    'art-template',
    'apple-signin-auth',
  ],
  poweredByHeader: false,
  reactStrictMode: true,
  output: 'standalone',
})

export default config
