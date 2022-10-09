const withPreact = require('next-plugin-preact')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer(
  withPreact({
    async rewrites() {
      return [
        {
          source: '/theme/:theme.svg',
          destination: '/api/svg',
        },
      ]
    },
    output: 'standalone',
  })
)
