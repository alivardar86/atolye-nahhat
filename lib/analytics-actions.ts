"use server";

import { supabase } from "@/lib/supabase";
import { EtkilesimTip } from "@/lib/types";

// Fire-and-forget analytics — anon RLS grants insert-only on urun_etkilesim
// (no select), so failures here must never surface to the caller or the
// page. No IP addresses, cookies, or user identifiers are recorded; this is
// an anonymous count against urun_id only.
async function logEtkilesim(urunId: string, tip: EtkilesimTip) {
  try {
    await supabase.from("urun_etkilesim").insert({ urun_id: urunId, tip });
  } catch {
    // best-effort only
  }
}

export async function logGoruntuleme(urunId: string) {
  await logEtkilesim(urunId, "goruntuleme");
}

export async function logWhatsappTik(urunId: string) {
  await logEtkilesim(urunId, "whatsapp_tik");
}
