/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/page/index',
      },
      {
        source: '/:path',
        destination: '/page/:path',
      },
    ];
  },
};

module.exports = nextConfig;
