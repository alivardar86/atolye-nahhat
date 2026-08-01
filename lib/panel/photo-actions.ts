"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/panel/require-user";

async function revalidateProduct(
  supabase: Awaited<ReturnType<typeof createClient>>,
  urunId: string
) {
  const { data: product } = await supabase
    .from("urunler")
    .select("slug")
    .eq("id", urunId)
    .maybeSingle();
  revalidatePath("/");
  if (product) revalidatePath(`/urun/${product.slug}`);
}

export async function uploadFoto(urunId: string, formData: FormData) {
  await requireUser();
  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Fotoğraf seçilmedi." };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("urun_fotograflari")
    .select("sira")
    .eq("urun_id", urunId)
    .order("sira", { ascending: false })
    .limit(1);
  const nextSira = existing && existing.length > 0 ? existing[0].sira + 1 : 0;

  const path = `${urunId}/${crypto.randomUUID()}.jpg`;
  const { error: uploadError } = await supabase.storage
    .from("urun-foto")
    .upload(path, file, { contentType: "image/jpeg" });
  if (uploadError) {
    return { error: `Yüklenemedi: ${uploadError.message}` };
  }

  const { error: insertError } = await supabase
    .from("urun_fotograflari")
    .insert({ urun_id: urunId, storage_yolu: path, sira: nextSira });
  if (insertError) {
    return { error: `Kaydedilemedi: ${insertError.message}` };
  }

  await revalidateProduct(supabase, urunId);
  return { success: true };
}

export async function deleteFoto(urunId: string, fotoId: string) {
  await requireUser();
  const supabase = await createClient();

  const { data: foto } = await supabase
    .from("urun_fotograflari")
    .select("storage_yolu")
    .eq("id", fotoId)
    .maybeSingle();

  if (foto) {
    await supabase.storage.from("urun-foto").remove([foto.storage_yolu]);
  }

  const { error } = await supabase.from("urun_fotograflari").delete().eq("id", fotoId);
  if (error) throw error;

  await revalidateProduct(supabase, urunId);
}

export async function moveFoto(urunId: string, fotoId: string, direction: "up" | "down") {
  await requireUser();
  const supabase = await createClient();

  const { data: photos } = await supabase
    .from("urun_fotograflari")
    .select("id, sira")
    .eq("urun_id", urunId)
    .order("sira");
  if (!photos) return;

  const index = photos.findIndex((p) => p.id === fotoId);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= photos.length) return;

  const a = photos[index];
  const b = photos[swapWith];

  await Promise.all([
    supabase.from("urun_fotograflari").update({ sira: b.sira }).eq("id", a.id),
    supabase.from("urun_fotograflari").update({ sira: a.sira }).eq("id", b.id),
  ]);

  await revalidateProduct(supabase, urunId);
}

export async function setCover(urunId: string, fotoId: string) {
  await requireUser();
  const supabase = await createClient();

  const { data: photos } = await supabase
    .from("urun_fotograflari")
    .select("id, sira")
    .eq("urun_id", urunId)
    .order("sira");
  if (!photos || photos.length === 0) return;

  const first = photos[0];
  const target = photos.find((p) => p.id === fotoId);
  if (!target || target.id === first.id) return;

  await Promise.all([
    supabase.from("urun_fotograflari").update({ sira: first.sira }).eq("id", target.id),
    supabase.from("urun_fotograflari").update({ sira: target.sira }).eq("id", first.id),
  ]);

  await revalidateProduct(supabase, urunId);
}
