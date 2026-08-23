import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  allowedDevOrigins: ["*.loca.lt"],
  devIndicators: false,
  poweredByHeader: false,
  typedRoutes: true,
};

export default nextConfig;
