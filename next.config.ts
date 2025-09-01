import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/equidobbies",
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;