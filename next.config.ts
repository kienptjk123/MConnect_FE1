import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // Commented out temporarily for API routes to work
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
