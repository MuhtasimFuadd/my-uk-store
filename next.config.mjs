/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ["@supabase/supabase-js"]
  }
};

export default nextConfig;