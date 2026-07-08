// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//     experimental: {
//         serverActions: {
//             bodySizeLimit: '100mb',
//         }
//     },
//     typescript: {
//         ignoreBuildErrors: true,
//     },
//     images: { remotePatterns: [
//             { protocol: 'https', hostname: 'covers.openlibrary.org' },
//             { protocol: 'https', hostname: 'lspfdyhgsrgsxcju.public.blob.vercel-storage.com' },
//         ]}
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.openlibrary.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raaworcd6tavemkq.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;