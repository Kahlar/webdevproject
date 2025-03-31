import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com'], // Add any image domains you're using
  },
  // Ensure MongoDB connection works in production
  experimental: {
    serverActions: true,
  }
};

export default nextConfig;
