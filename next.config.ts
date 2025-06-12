import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
        return [
            {
                source: '/api/:path*', // Match any request starting with /api/
                destination: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/:path*`, // Proxy it to your backend
            },
        ];
    },
};

export default nextConfig;
