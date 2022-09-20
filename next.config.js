/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      {
        source: '/theme/default.svg',
        destination: '/api/svg',
      },
    ]
  },
}
