import Link from "next/link";
import Image from "next/image";
import { UrunKart } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { CONDITION_LABEL } from "@/lib/labels";
import { fotoUrl } from "@/lib/supabase";

export function ProductCard({ product: p }: { product: UrunKart }) {
  const sold = p.stok_durumu === "satildi";
  const reserved = p.stok_durumu === "ayrildi";
  const showCmp = p.gosterilecek_piyasa_fiyat != null;
  const discountPct = showCmp
    ? Math.round((1 - p.satis_fiyat / p.gosterilecek_piyasa_fiyat!) * 100)
    : null;
  const conditionLabel = p.durum ? CONDITION_LABEL[p.durum] : null;
  const stockTag = sold ? "SATILDI" : reserved ? "AYRILDI" : null;

  const dotClasses =
    p.durum === "sifir"
      ? "bg-accent border border-accent"
      : p.durum === "az_kullanilmis"
        ? "bg-transparent border border-accent"
        : "bg-transparent border border-muted";

  return (
    <Link
      href={`/urun/${p.slug}`}
      className={`flex gap-nh-12 sm:flex-col sm:gap-0 bg-paper text-ink sm:border sm:border-border ${
        sold ? "opacity-55 grayscale" : ""
      }`}
    >
      <div
        className={`relative w-24 sm:w-full shrink-0 aspect-4/5 flex items-center justify-center sm:border-b sm:border-border ${
          p.kapak_foto
            ? "bg-panel"
            : "bg-[repeating-linear-gradient(135deg,var(--color-placeholder-stripe)_0px_6px,var(--color-panel)_6px_12px)]"
        }`}
      >
        {p.kapak_foto ? (
          <Image
            src={fotoUrl(p.kapak_foto)}
            alt={p.marka ?? p.cinsi}
            fill
            sizes="(min-width: 640px) 300px, 96px"
            className="object-contain"
          />
        ) : (
          <span className="font-mono text-2xs tracking-nh-wide-lg-plus text-placeholder">
            FOTO · 4:5
          </span>
        )}
        {stockTag && (
          <span
            className={`absolute top-2 left-2 font-mono text-2xs tracking-nh-wide-lg px-nh-7 py-[3px] rounded-nh text-paper ${
              sold ? "bg-muted" : "bg-ink"
            }`}
          >
            {stockTag}
          </span>
        )}
      </div>

      <div className="flex flex-1 min-w-0 flex-col gap-nh-9 py-nh-14 sm:p-nh-16">
        <div className="font-mono text-2xs tracking-nh-wide-lg uppercase text-muted">
          {p.kategori_ad}
        </div>

        <div>
          <div className="text-xl-plus font-bold tracking-nh-snug leading-tight">
            {p.marka ?? p.cinsi}
          </div>
          {p.model && (
            <div className="text-lg text-body leading-snug mt-0.5">{p.model}</div>
          )}
        </div>

        {p.ebat && (
          <div className="font-mono text-sm text-muted leading-snug break-words">
            {p.ebat}
          </div>
        )}

        {conditionLabel && (
          <div className="flex items-center gap-nh-7 text-sm-plus text-body pt-nh-6">
            <span
              className={`w-2 h-2 rounded-full inline-block shrink-0 ${dotClasses}`}
            />
            {conditionLabel}
          </div>
        )}

        <div className="flex items-baseline gap-nh-10 flex-wrap border-t border-border pt-nh-10">
          <span className="font-mono text-2xl font-semibold tracking-nh-tight">
            {formatPrice(p.satis_fiyat)}
          </span>
          {showCmp && (
            <>
              <span className="font-mono text-md text-muted line-through">
                {formatPrice(p.gosterilecek_piyasa_fiyat!)}
              </span>
              <span className="font-mono text-md font-semibold text-accent ml-auto">
                −{discountPct}%
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
