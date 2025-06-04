import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "avatar.vercel.sh", port: "", protocol: "https" },
      { hostname: "utfs.io", port: "", protocol: "https" },
      {
        hostname: "lh3.googleusercontent.com",
        port: "",
        protocol: "https",
      },
      {
        hostname: "hy9vecw6h1.ufs.sh",
        port: "",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
