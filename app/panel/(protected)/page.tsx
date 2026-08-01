import { createClient } from "@/lib/supabase/server";
import { PanelProductTable, type PanelRow } from "@/components/panel/PanelProductTable";
import { Urun } from "@/lib/types";

type UrunWithKategori = Urun & { kategoriler: { ad: string } | null };

export default async function PanelPage() {
  const supabase = await createClient();

  const [{ data: urunler, error: urunlerError }, { data: kategoriler, error: kategorilerError }] =
    await Promise.all([
      supabase.from("urunler").select("*, kategoriler(ad)").order("sira"),
      supabase.from("kategoriler").select("*").order("sira"),
    ]);

  if (urunlerError) throw urunlerError;
  if (kategorilerError) throw kategorilerError;

  const rows: PanelRow[] = ((urunler ?? []) as UrunWithKategori[]).map((u) => ({
    ...u,
    kategori_ad: u.kategoriler?.ad ?? u.kategori_slug,
  }));

  return (
    <div className="px-nh-16 sm:px-nh-40 py-nh-24">
      <h1 className="text-6xl font-bold mb-nh-20">Ürünler</h1>
      <PanelProductTable rows={rows} kategoriler={kategoriler ?? []} />
    </div>
  );
}
