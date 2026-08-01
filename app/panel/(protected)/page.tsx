import { createClient } from "@/lib/supabase/server";
import { PanelProductTable, type PanelRow } from "@/components/panel/PanelProductTable";
import { TopViewedTable, type TopViewedRow } from "@/components/panel/TopViewedTable";
import { Urun } from "@/lib/types";

type UrunWithKategori = Urun & { kategoriler: { ad: string } | null };

const OTUZ_GUN_MS = 30 * 24 * 60 * 60 * 1000;

export default async function PanelPage() {
  const supabase = await createClient();
  const otuzGunOnce = new Date(Date.now() - OTUZ_GUN_MS).toISOString();

  const [
    { data: urunler, error: urunlerError },
    { data: kategoriler, error: kategorilerError },
    { data: etkilesimler, error: etkilesimError },
  ] = await Promise.all([
    supabase.from("urunler").select("*, kategoriler(ad)").order("sira"),
    supabase.from("kategoriler").select("*").order("sira"),
    supabase.from("urun_etkilesim").select("urun_id, tip").gte("created_at", otuzGunOnce),
  ]);

  if (urunlerError) throw urunlerError;
  if (kategorilerError) throw kategorilerError;
  // Don't fail the whole panel if urun_etkilesim isn't there yet — its
  // migration (db/migrations/0002) has to be run in the Supabase SQL editor
  // separately. Missing analytics degrade to an empty "most-viewed" section.
  if (etkilesimError) console.error(etkilesimError);

  const rows: PanelRow[] = ((urunler ?? []) as UrunWithKategori[]).map((u) => ({
    ...u,
    kategori_ad: u.kategoriler?.ad ?? u.kategori_slug,
  }));

  const statsByProduct = new Map<string, { views: number; clicks: number }>();
  for (const e of etkilesimler ?? []) {
    const s = statsByProduct.get(e.urun_id) ?? { views: 0, clicks: 0 };
    if (e.tip === "goruntuleme") s.views++;
    else if (e.tip === "whatsapp_tik") s.clicks++;
    statsByProduct.set(e.urun_id, s);
  }

  const topViewed: TopViewedRow[] = rows
    .map((r) => {
      const stats = statsByProduct.get(r.id);
      if (!stats || stats.views === 0) return null;
      return {
        id: r.id,
        kategori_ad: r.kategori_ad,
        title: `${r.cinsi}${r.marka ? " — " + r.marka : ""}${r.model ? " " + r.model : ""}`,
        views: stats.views,
        clicks: stats.clicks,
      };
    })
    .filter((r): r is TopViewedRow => r !== null)
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  return (
    <div className="px-nh-16 sm:px-nh-40 py-nh-24">
      <h1 className="text-6xl font-bold mb-nh-20">Ürünler</h1>
      <TopViewedTable rows={topViewed} />
      <PanelProductTable rows={rows} kategoriler={kategoriler ?? []} />
    </div>
  );
}
