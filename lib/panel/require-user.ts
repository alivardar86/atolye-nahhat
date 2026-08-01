import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Defense-in-depth check for panel pages/actions — proxy.ts already gates
// /panel, but per Next.js's auth guide this should also be checked close to
// the data itself, not relied on from proxy alone.
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/panel/giris");
  }

  return user;
}
