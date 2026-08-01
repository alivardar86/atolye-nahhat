"use client";

import { useMemo, useState } from "react";
import { UrunKart, Kategori } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { CategoryChips } from "./CategoryChips";
import { SearchInput } from "./SearchInput";
import { SortToggle } from "./SortToggle";
import { SoldToggle } from "./SoldToggle";
import { ProductGrid } from "./ProductGrid";

export function Catalog({
  products,
  categories,
}: {
  products: UrunKart[];
  categories: Kategori[];
}) {
  const [activeCategory, setActiveCategory] = useState("tumu");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [showSold, setShowSold] = useState(true);

  // Chip counts are static — "kaç tanesi satılık" per category — independent
  // of the sold-toggle and any active filter/search/sort state.
  const chips = useMemo(() => {
    const satilik = products.filter((p) => p.stok_durumu === "satilik");
    return [
      { slug: "tumu", label: "Tümü", count: satilik.length },
      ...categories.map((k) => ({
        slug: k.slug,
        label: k.ad,
        count: satilik.filter((p) => p.kategori_slug === k.slug).length,
      })),
    ];
  }, [products, categories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    const list = products.filter((p) => {
      if (activeCategory !== "tumu" && p.kategori_slug !== activeCategory) return false;
      if (!showSold && p.stok_durumu === "satildi") return false;
      if (!q) return true;
      const haystack = `${p.marka ?? ""} ${p.model ?? ""} ${p.cinsi}`.toLocaleLowerCase(
        "tr"
      );
      return haystack.includes(q);
    });
    return list.sort((a, b) =>
      sort === "asc" ? a.satis_fiyat - b.satis_fiyat : b.satis_fiyat - a.satis_fiyat
    );
  }, [products, activeCategory, showSold, query, sort]);

  const total = filtered
    .filter((p) => p.stok_durumu !== "satildi")
    .reduce((sum, p) => sum + p.satis_fiyat, 0);

  const activeLabel = chips.find((c) => c.slug === activeCategory)?.label;

  return (
    <section>
      <div className="sticky top-nh-52 sm:top-16 z-10 bg-panel border-b border-border px-nh-16 sm:px-nh-40 py-nh-14 flex flex-wrap items-center gap-nh-14">
        <CategoryChips chips={chips} active={activeCategory} onSelect={setActiveCategory} />
        <div className="flex-1 min-w-45" />
        <SearchInput value={query} onChange={setQuery} />
        <SortToggle sort={sort} onChange={setSort} />
        <SoldToggle checked={showSold} onChange={setShowSold} />
      </div>

      <div className="px-nh-16 sm:px-nh-40 pt-nh-12 pb-nh-8 flex justify-between items-baseline font-mono text-xs text-muted flex-wrap gap-nh-4">
        <span>
          {filtered.length} alet
          {activeCategory !== "tumu" && activeLabel ? ` · ${activeLabel}` : ""}
        </span>
        <span>Listelenen satılık toplamı {formatPrice(total)}</span>
      </div>

      <div className="px-nh-16 sm:px-nh-40 pb-nh-56">
        <ProductGrid products={filtered} />
      </div>
    </section>
  );
}
