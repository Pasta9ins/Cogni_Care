import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
        return [
            {
                source: '/api/:path*', // Match any request starting with /api/
                destination: 'http://localhost:5000/api/:path*', // Proxy it to your backend
            },
        ];
    },
};

export default nextConfig;
