"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/panel/require-user";
import { generateSlug } from "@/lib/slug";

export type ProductFormState = { error?: string; success?: boolean };

function readProductFields(formData: FormData) {
  const num = (name: string) => {
    const v = formData.get(name);
    if (v === null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const str = (name: string) => (formData.get(name) as string)?.trim() || null;

  return {
    cinsi: (formData.get("cinsi") as string)?.trim() ?? "",
    malzeme: str("malzeme"),
    marka: str("marka"),
    model: str("model"),
    ebat: str("ebat"),
    durum: str("durum"),
    aciklama: str("aciklama"),
    piyasa_fiyat: num("piyasa_fiyat"),
    piyasa_kaynak: str("piyasa_kaynak"),
    satis_fiyat: num("satis_fiyat") ?? 0,
    fiyat_karsilastir: formData.get("fiyat_karsilastir") === "on",
    adet: num("adet") ?? 1,
    stok_durumu: (formData.get("stok_durumu") as string) || "satilik",
    one_cikan: formData.get("one_cikan") === "on",
    kategori_slug: (formData.get("kategori_slug") as string) ?? "",
  };
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireUser();
  const fields = readProductFields(formData);

  if (!fields.cinsi || !fields.kategori_slug || !fields.satis_fiyat) {
    return { error: "Cinsi, kategori ve satış fiyatı zorunlu." };
  }

  const supabase = await createClient();

  const baseSlug = generateSlug(fields);
  if (!baseSlug) {
    return { error: "Slug üretilemedi — cinsi alanını kontrol edin." };
  }

  let slug = baseSlug;
  let n = 2;
  for (;;) {
    const { data: existing } = await supabase
      .from("urunler")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = `${baseSlug}-${n++}`;
  }

  const { data, error } = await supabase
    .from("urunler")
    .insert({ ...fields, slug })
    .select("id")
    .single();

  if (error || !data) {
    return { error: `Ürün oluşturulamadı: ${error?.message ?? "bilinmeyen hata"}` };
  }

  revalidatePath("/");
  redirect(`/panel/urun/${data.id}`);
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireUser();
  const fields = readProductFields(formData);

  if (!fields.cinsi || !fields.kategori_slug || !fields.satis_fiyat) {
    return { error: "Cinsi, kategori ve satış fiyatı zorunlu." };
  }

  const supabase = await createClient();
  const { data: current } = await supabase
    .from("urunler")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  if (!current) {
    return { error: "Ürün bulunamadı." };
  }

  const { error } = await supabase.from("urunler").update(fields).eq("id", id);
  if (error) {
    return { error: `Kaydedilemedi: ${error.message}` };
  }

  revalidatePath("/");
  revalidatePath(`/urun/${current.slug}`);
  return { success: true };
}

export async function deleteProduct(id: string) {
  await requireUser();
  const supabase = await createClient();

  const [{ data: product }, { data: photos }] = await Promise.all([
    supabase.from("urunler").select("slug").eq("id", id).maybeSingle(),
    supabase.from("urun_fotograflari").select("storage_yolu").eq("urun_id", id),
  ]);

  if (photos && photos.length > 0) {
    await supabase.storage.from("urun-foto").remove(photos.map((p) => p.storage_yolu));
  }

  const { error } = await supabase.from("urunler").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/");
  if (product) revalidatePath(`/urun/${product.slug}`);
  redirect("/panel");
}

export async function updateStokDurumu(id: string, value: string) {
  await requireUser();
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("urunler")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("urunler").update({ stok_durumu: value }).eq("id", id);
  if (error) throw error;

  revalidatePath("/");
  if (product) revalidatePath(`/urun/${product.slug}`);
}

export async function updateFiyat(id: string, value: number) {
  await requireUser();
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("urunler")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("urunler").update({ satis_fiyat: value }).eq("id", id);
  if (error) throw error;

  revalidatePath("/");
  if (product) revalidatePath(`/urun/${product.slug}`);
}
