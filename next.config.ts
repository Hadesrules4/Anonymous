import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow local network IPs and tunnels in dev mode
  // @ts-ignore - allowedDevOrigins is recognized in Next.js 15/16
  allowedDevOrigins: [
    "192.168.29.22",
    "192.168.29.22:3000",
    "localhost:3000",
    "*.trycloudflare.com",
    "*.loca.lt",
  ],
};

export default nextConfig;
