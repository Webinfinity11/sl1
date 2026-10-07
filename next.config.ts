import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  experimental: {
    serverActions: { bodySizeLimit: "8mb" },
  },
  async redirects() {
    // Old WooCommerce URLs keep their search ranking.
    return [
      { source: "/shop/:slug", destination: "/product/:slug", permanent: true },
      { source: "/shop", destination: "/catalog", permanent: true },
      { source: "/cart", destination: "/checkout", permanent: true },
      { source: "/wp-admin/:path*", destination: "/admin", permanent: false },
    ];
  },
};

export default nextConfig;
