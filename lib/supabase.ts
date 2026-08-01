import { createClient } from "@supabase/supabase-js";

// Public pages read through the anon key + RLS (public SELECT is allowed on
// kategoriler/urunler/urun_fotograflari). Never import SUPABASE_SERVICE_ROLE_KEY
// here — this client is also used from the browser (Client Components).
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Public URL for a file in the 'urun-foto' storage bucket.
export function fotoUrl(storagePath: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/urun-foto/${storagePath}`;
}
