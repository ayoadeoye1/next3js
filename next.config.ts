import type { NextConfig } from "next";

const path = process.env.GITHUB_PAGES ? "/next3js" : undefined;

const nextConfig: NextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  output: "export",
  trailingSlash: true,

  basePath: path,
  assetPrefix: path,

  images: {
    unoptimized: true,
  },

  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
