"use client";

import { useEffect, useRef } from "react";
import { logGoruntuleme } from "@/lib/analytics-actions";

// Logs one 'goruntuleme' row per real page load. This has to run
// client-side, not in the Server Component: /urun/[slug] is statically
// rendered with ISR (revalidate = 60), so the server component body only
// re-executes on background revalidation, not per visitor. Renders nothing.
export function ViewLogger({ urunId }: { urunId: string }) {
  const logged = useRef(false);

  useEffect(() => {
    if (logged.current) return;
    logged.current = true;
    logGoruntuleme(urunId).catch(() => {});
  }, [urunId]);

  return null;
}
