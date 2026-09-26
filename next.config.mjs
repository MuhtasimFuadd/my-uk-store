/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }
    ]
  },
  // Keeps @supabase/supabase-js's own networking code untouched by Next's
  // server bundler, instead of being bundled/transformed for the server
  // runtime. Bundling can break libraries that make raw fetch() calls with
  // a request body (like inserts/updates) in subtle ways, while plain
  // reads (selects) keep working — which matches the pattern where the
  // public site loads fine but the admin panel's writes fail.
  experimental: {
    serverComponentsExternalPackages: ["@supabase/supabase-js"]
  }
};

export default nextConfig;
