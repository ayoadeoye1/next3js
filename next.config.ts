import type { NextConfig } from "next";

// Check if we're in production and deploying to GitHub Pages
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/next3portfolio" : "";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  output: "export",
  trailingSlash: true,

  // Set base path for GitHub Pages
  basePath: basePath,
  assetPrefix: basePath,

  images: {
    unoptimized: true,
  },

  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
