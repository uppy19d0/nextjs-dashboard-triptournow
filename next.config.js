/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  images: {
    // Si sólo necesitas HTTPS:
    domains: ['triptournow.com'],

    // O, si tu URL es HTTP o quieres mayor control, usa remotePatterns:
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'triptournow.com',
        port: '',
        pathname: '/storage/categories/**',
      },
      {
        protocol: 'https',
        hostname: 'triptournow.com',
        port: '',
        pathname: '/storage/categories/**',
      },
    ],
  },
}

module.exports = nextConfig
