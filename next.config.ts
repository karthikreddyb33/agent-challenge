import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // ✅ Ignore ESLint errors during production build
  },
};

export default nextConfig;
