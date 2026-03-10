/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      
      // Add your production domain when deployed
      // {
      //   protocol: 'https',
      //   hostname: 'your-backend-domain.com',
      //   port: '',
      //   pathname: '/uploads/**',
      // },
    ],
  },
};

module.exports = nextConfig;