import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.openlibrary.org', // Use wildcard to catch subdomains
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
