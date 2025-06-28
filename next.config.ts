import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  output: "export",
  trailingSlash: true,

  basePath: "/next3js",
  assetPrefix: "/next3js/",

  images: {
    unoptimized: true,
  },

  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
