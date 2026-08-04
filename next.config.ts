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
    // Single format instead of ['image/avif', 'image/webp'] halves the
    // transformation count per image.
    formats: ["image/webp"],
    // Fixed quality instead of Next's default range so different quality
    // requests don't each count as a separate transformation.
    qualities: [75],
    // Matches the actual rendered widths used across the site:
    // ProductCard (96px mobile / 300px desktop) and ProductGallery
    // thumbnails (120px). See components/ProductCard.tsx and
    // components/ProductGallery.tsx.
    imageSizes: [96, 120, 300],
    // Matches real breakpoints needed by ProductGallery's viewport-based
    // main image (`50vw` desktop / `100vw` mobile), instead of Next's
    // 8-value default array.
    deviceSizes: [420, 750, 1080, 1920],
    // Tool photos rarely change once uploaded; cache transformed images for
    // 31 days to avoid re-transforming the same image repeatedly.
    minimumCacheTTL: 2678400,
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
