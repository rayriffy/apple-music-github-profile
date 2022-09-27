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
          source: '/theme/sample.svg',
          destination: '/api/svg?username=rayriffy',
        },
        {
          source: '/theme/default.svg:path*',
          destination: '/api/svg:path*',
        },
      ]
    },
    output: 'standalone',
  })
)
