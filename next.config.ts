import type { NextConfig } from "next";

// Project ref is public (it's embedded in NEXT_PUBLIC_SUPABASE_URL); the
// anon key stays server/env-only. Storage objects served from this host are
// public-bucket ("urun-foto") photos only.
const supabaseHost = "opxgwndgzbjsgnsvelov.supabase.co";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHost,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Default is 1MB; a single resized (max 1600px) photo can exceed that.
      // Photos upload one at a time, so this stays generous but bounded.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
