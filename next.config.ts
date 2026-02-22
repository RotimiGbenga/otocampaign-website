import path from "path";
import type { NextConfig } from "next";

/**
 * Explicit project root for file tracing and build.
 * Ensures Next.js uses THIS directory only, ignoring parent lockfiles.
 * Prisma, API routes, and .next resolve relative to this root.
 */
const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
