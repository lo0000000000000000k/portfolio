/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  images: {
    domains: ['i.scdn.co'],
  },
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.glb$/,
      type: 'asset/resource',
    });
    return config;
  },
};

module.exports = nextConfig;
