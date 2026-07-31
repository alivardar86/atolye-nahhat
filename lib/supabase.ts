import { createClient } from "@supabase/supabase-js";

// Public pages read through the anon key + RLS (public SELECT is allowed on
// kategoriler/urunler/urun_fotograflari). Never import SUPABASE_SERVICE_ROLE_KEY
// here — this client is also used from the browser (Client Components).
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
