import type { NextConfig } from "next";

// Handle different deployment environments
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const isVercel = process.env.VERCEL === "1";

const basePath = isGitHubPages ? "/next3js" : undefined;

const nextConfig: NextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  // Only use export output for GitHub Pages, Vercel handles this automatically
  ...(isGitHubPages && { output: "export" }),
  trailingSlash: true,

  // Only set basePath and assetPrefix for GitHub Pages
  ...(isGitHubPages && {
    basePath: basePath,
    assetPrefix: basePath,
  }),

  images: {
    unoptimized: true,
  },

  experimental: {
    esmExternals: true,
  },

  // Add webpack config for better Three.js handling
  webpack: (config) => {
    config.externals = config.externals || [];
    config.externals.push({
      canvas: "canvas",
    });
    return config;
  },
};

export default nextConfig;
