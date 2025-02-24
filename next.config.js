/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    removeConsole: true, // Remove all console errors in production
  },
  devIndicators: {
    buildActivity: false, // Disable build activity indicator
  },
  experimental: {
    disableOptimizedLoading: true, // Disable loading optimizations
  },
};

module.exports = nextConfig;
