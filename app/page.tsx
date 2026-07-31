import { supabase } from "@/lib/supabase";
import { UrunKart, Kategori } from "@/lib/types";
import { Hero } from "@/components/Hero";
import { Catalog } from "@/components/Catalog";

export const revalidate = 60;

export default async function HomePage() {
  const [{ data: products, error: productsError }, { data: categories, error: categoriesError }] =
    await Promise.all([
      supabase.from("v_urun_kart").select("*").order("sira"),
      supabase.from("kategoriler").select("*").eq("aktif", true).order("sira"),
    ]);

  if (productsError) throw productsError;
  if (categoriesError) throw categoriesError;

  const items = (products ?? []) as UrunKart[];
  const cats = (categories ?? []) as Kategori[];

  const satilik = items.filter((p) => p.stok_durumu === "satilik");
  const ayrildi = items.filter((p) => p.stok_durumu === "ayrildi");
  const satildi = items.filter((p) => p.stok_durumu === "satildi");
  const belowMarket = items.filter((p) => p.gosterilecek_piyasa_fiyat != null);
  const ortalamaIndirim =
    belowMarket.length > 0
      ? Math.round(
          belowMarket.reduce(
            (sum, p) => sum + (1 - p.satis_fiyat / p.gosterilecek_piyasa_fiyat!) * 100,
            0
          ) / belowMarket.length
        )
      : null;

  return (
    <>
      <Hero
        stats={{
          toplam: items.length,
          satilik: satilik.length,
          ayrildi: ayrildi.length,
          satildi: satildi.length,
          altındaSayisi: belowMarket.length,
          ortalamaIndirim,
        }}
      />
      <Catalog products={items} categories={cats} />
    </>
  );
}
