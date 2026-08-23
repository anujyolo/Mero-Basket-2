import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  allowedDevOrigins: ["*.loca.lt"],
  poweredByHeader: false,
  typedRoutes: true,
};

export default nextConfig;
