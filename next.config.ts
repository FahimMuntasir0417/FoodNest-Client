// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ✅ your existing domain
      {
        protocol: "https",
        hostname: "images.foodhub.com",
        pathname: "/**",
      },
      // ✅ add Unsplash
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `https://foodnest-server.onrender.com/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
