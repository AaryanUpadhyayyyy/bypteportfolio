import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // yahoo-finance2 uses some node modules that need this
  serverExternalPackages: ["yahoo-finance2"],
};

export default nextConfig;
