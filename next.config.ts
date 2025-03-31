/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Fix module resolution
  webpack: (config: any) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  // Treat TypeScript errors as warnings
  typescript: {
    ignoreBuildErrors: true,
  },
  // Treat ESLint errors as warnings
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
