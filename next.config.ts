import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  output: "export",
  trailingSlash: true,

  images: {
    unoptimized: true,
  },

  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
