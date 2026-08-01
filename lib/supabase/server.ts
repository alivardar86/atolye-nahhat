import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Server-side Supabase client bound to the request's cookies. Used in Server
// Components, Server Actions and proxy.ts under /panel. Requests run as the
// logged-in user (via their session JWT) — RLS policies already grant
// authenticated users full read/write on kategoriler/urunler/urun_fotograflari
// and the urun-foto bucket, so no service-role key is needed here.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called from a Server Component (not a Server Action or
            // Route Handler) — cookies can't be written here. Session refresh
            // still happens in proxy.ts, so this is safe to ignore.
          }
        },
      },
    }
  );
}
