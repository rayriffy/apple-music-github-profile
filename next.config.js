/** @type {import('next').NextConfig} */
module.exports = {
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
}
