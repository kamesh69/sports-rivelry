import type { NextConfig } from "next";

const wordpressHost = process.env.NEXT_PUBLIC_WORDPRESS_URL
  ? new URL(process.env.NEXT_PUBLIC_WORDPRESS_URL).hostname
  : "cms.thesportsrivalry.com";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: wordpressHost,
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
