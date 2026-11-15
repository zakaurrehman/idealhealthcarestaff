import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve files from /public/images exactly as they are, without Vercel's
    // Image Optimization. The Hobby plan's optimization quota is exhausted and
    // returns HTTP 402 (OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED), which made
    // images disappear for visitors. Files are NOT compressed or altered.
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
