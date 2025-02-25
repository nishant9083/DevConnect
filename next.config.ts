import type { NextConfig } from 'next'
const nextConfig: NextConfig = {  
  experimental: {
    serverActions: {      
      
    }, // Enable the server actions feature
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

export default nextConfig;