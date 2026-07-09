import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '100mb',
        }
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: { 
        // 💡 This tells Next.js to pull the image directly from Vercel Storage 
        // instead of processing it through its internal local server proxy proxy
        unoptimized: true, 
        remotePatterns: [
            { protocol: 'https', hostname: 'covers.openlibrary.org' },
            { protocol: 'https', hostname: 'lspfdyhgsrgsxcju.public.blob.vercel-storage.com' },
            { protocol: 'https', hostname: 'raaworcd6tavemkq.public.blob.vercel-storage.com' },
        ]
    }
};

export default nextConfig;