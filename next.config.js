/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Si sólo necesitas HTTPS:
    domains: ['api.triptournow.com'],

    // O, si tu URL es HTTP o quieres mayor control, usa remotePatterns:
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'api.triptournow.com',
        port: '',
        pathname: '/storage/categories/**',
      },
      {
        protocol: 'https',
        hostname: 'api.triptournow.com',
        port: '',
        pathname: '/storage/categories/**',
      },
    ],
  },
}

module.exports = nextConfig
