/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' as it's incompatible with middleware and server components
  experimental: {
    serverActions: true, // Enable the server actions feature
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

export default nextConfig;