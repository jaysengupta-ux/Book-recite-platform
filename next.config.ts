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

  // typescript: {
  //   // !! WARN !!
  //   // Dangerously allow production builds to successfully complete 
  //   // even if your project has TypeScript errors.
  //   ignoreBuildErrors: true,
  // },
};

export default nextConfig;
