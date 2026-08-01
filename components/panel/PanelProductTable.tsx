"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateStokDurumu, updateFiyat } from "@/lib/panel/product-actions";
import { Kategori, StokDurum, Urun } from "@/lib/types";

export type PanelRow = Urun & { kategori_ad: string };

const STOK_LABEL: Record<StokDurum, string> = {
  satilik: "Satılık",
  ayrildi: "Ayrıldı",
  satildi: "Satıldı",
};

export function PanelProductTable({
  rows,
  kategoriler,
}: {
  rows: PanelRow[];
  kategoriler: Kategori[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [kategoriSlug, setKategoriSlug] = useState("hepsi");
  const [stokDurumu, setStokDurumu] = useState("hepsi");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (kategoriSlug !== "hepsi" && r.kategori_slug !== kategoriSlug) return false;
      if (stokDurumu !== "hepsi" && r.stok_durumu !== stokDurumu) return false;
      if (q) {
        const hay = `${r.cinsi} ${r.marka ?? ""} ${r.model ?? ""} ${r.ebat ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, search, kategoriSlug, stokDurumu]);

  function onStokChange(id: string, value: string) {
    startTransition(async () => {
      await updateStokDurumu(id, value);
      router.refresh();
    });
  }

  function onFiyatChange(id: string, value: string) {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return;
    startTransition(async () => {
      await updateFiyat(id, n);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-nh-12 mb-nh-16">
        <input
          type="search"
          placeholder="Ara — cinsi, marka, model…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-nh-40 px-nh-12 rounded-nh border border-border bg-paper flex-1 min-w-[200px]"
        />
        <select
          value={kategoriSlug}
          onChange={(e) => setKategoriSlug(e.target.value)}
          className="h-nh-40 px-nh-12 rounded-nh border border-border bg-paper"
        >
          <option value="hepsi">Tüm kategoriler</option>
          {kategoriler.map((k) => (
            <option key={k.slug} value={k.slug}>
              {k.ad}
            </option>
          ))}
        </select>
        <select
          value={stokDurumu}
          onChange={(e) => setStokDurumu(e.target.value)}
          className="h-nh-40 px-nh-12 rounded-nh border border-border bg-paper"
        >
          <option value="hepsi">Tüm durumlar</option>
          <option value="satilik">Satılık</option>
          <option value="ayrildi">Ayrıldı</option>
          <option value="satildi">Satıldı</option>
        </select>
        <Link
          href="/panel/urun/yeni"
          className="h-nh-40 px-nh-16 rounded-nh bg-ink hover:bg-ink-hover text-paper font-semibold flex items-center"
        >
          + Yeni ürün
        </Link>
      </div>

      <div className="text-sm text-muted mb-nh-8">{filtered.length} ürün</div>

      <div className="border border-border rounded-nh overflow-hidden">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="flex flex-wrap items-center gap-nh-12 p-nh-12 border-b border-border last:border-b-0 bg-paper"
          >
            <div className="flex-1 min-w-[180px]">
              <Link href={`/panel/urun/${r.id}`} className="font-semibold">
                {r.cinsi}
                {r.marka ? ` — ${r.marka}` : ""}
                {r.model ? ` ${r.model}` : ""}
              </Link>
              <div className="text-sm text-muted">
                {r.kategori_ad}
                {r.ebat ? ` · ${r.ebat}` : ""}
              </div>
            </div>

            <select
              defaultValue={r.stok_durumu}
              onChange={(e) => onStokChange(r.id, e.target.value)}
              disabled={isPending}
              className="h-9 px-nh-8 rounded-nh border border-border bg-white text-sm"
              aria-label={`${r.cinsi} stok durumu`}
            >
              {Object.entries(STOK_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <input
              type="number"
              defaultValue={r.satis_fiyat}
              onBlur={(e) => onFiyatChange(r.id, e.target.value)}
              disabled={isPending}
              className="w-28 h-9 px-nh-8 rounded-nh border border-border bg-white text-sm font-mono"
              aria-label={`${r.cinsi} satış fiyatı`}
            />

            <Link href={`/panel/urun/${r.id}`} className="text-sm underline">
              Düzenle
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
