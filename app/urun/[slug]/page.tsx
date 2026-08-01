import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase, fotoUrl } from "@/lib/supabase";
import { UrunKart, UrunFoto } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { CONDITION_LABEL } from "@/lib/labels";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductGrid } from "@/components/ProductGrid";
import { ViewLogger } from "@/components/ViewLogger";
import { WhatsappCta } from "@/components/WhatsappCta";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { data, error } = await supabase.from("urunler").select("slug");
  if (error) throw error;
  return (data ?? []).map((row) => ({ slug: row.slug as string }));
}

async function getProduct(slug: string): Promise<UrunKart | null> {
  const { data, error } = await supabase
    .from("v_urun_kart")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as UrunKart | null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  const title = `${product.marka ?? product.cinsi}${product.model ? " " + product.model : ""} — Atölye Nahhat`;
  const description = `${formatPrice(product.satis_fiyat)} · ${product.kategori_ad}${
    product.aciklama ? " — " + product.aciklama : ""
  }`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "tr_TR",
      images: product.kapak_foto ? [fotoUrl(product.kapak_foto)] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [{ data: photosData, error: photosError }, { data: similarData, error: similarError }] =
    await Promise.all([
      supabase.from("urun_fotograflari").select("*").eq("urun_id", product.id).order("sira"),
      supabase
        .from("v_urun_kart")
        .select("*")
        .eq("kategori_slug", product.kategori_slug)
        .neq("id", product.id)
        .order("sira")
        .limit(4),
    ]);

  if (photosError) throw photosError;
  if (similarError) throw similarError;

  const photos = (photosData ?? []) as UrunFoto[];
  const similar = (similarData ?? []) as UrunKart[];

  const title = product.marka ?? product.cinsi;
  const sold = product.stok_durumu === "satildi";
  const reserved = product.stok_durumu === "ayrildi";
  const showCmp = product.gosterilecek_piyasa_fiyat != null;
  const discountPct = showCmp
    ? Math.round((1 - product.satis_fiyat / product.gosterilecek_piyasa_fiyat!) * 100)
    : null;
  const conditionLabel = product.durum ? CONDITION_LABEL[product.durum] : null;

  const specs: { label: string; value: string }[] = [
    { label: "Tür", value: product.cinsi },
    ...(product.marka ? [{ label: "Marka", value: product.marka }] : []),
    ...(product.model ? [{ label: "Model", value: product.model }] : []),
    ...(product.ebat ? [{ label: "Ebat", value: product.ebat }] : []),
    ...(product.malzeme ? [{ label: "Malzeme", value: product.malzeme }] : []),
    ...(conditionLabel ? [{ label: "Durum", value: conditionLabel }] : []),
  ];

  const waMessage = `${title}${product.model ? " " + product.model : ""} hâlâ satılık mı? (${formatPrice(
    product.satis_fiyat
  )})`;

  return (
    <>
      <ViewLogger urunId={product.id} />
      <div className="px-nh-16 sm:px-nh-40 py-nh-24 sm:py-nh-40 sm:grid sm:grid-cols-[1.05fr_1fr] sm:gap-nh-56">
        <ProductGallery photos={photos} title={title} />

        <div className="mt-nh-24 sm:mt-0 flex flex-col">
          <div className="flex justify-between font-mono text-xs tracking-nh-eyebrow uppercase text-muted">
            <span>{product.kategori_ad}</span>
            {(sold || reserved) && (
              <span className={sold ? "text-muted" : "text-accent"}>
                {sold ? "Satıldı" : "Ayrıldı"}
              </span>
            )}
          </div>

          <h1 className="mt-nh-12 text-7xl sm:text-9xl font-bold leading-[1.05] tracking-nh-tighter">
            {title}
          </h1>
          {product.model && (
            <div className="text-4xl sm:text-5xl text-body mt-nh-3">{product.model}</div>
          )}

          <div className="mt-nh-24 bg-paper border border-border rounded-nh p-nh-20 sm:p-nh-22">
            <div className="flex items-end gap-nh-16 flex-wrap">
              <span className="font-mono text-8xl sm:text-10xl font-semibold leading-none tracking-nh-tightest">
                {formatPrice(product.satis_fiyat)}
              </span>
              {showCmp && (
                <span className="flex items-center gap-nh-7 pb-nh-4">
                  <span className="font-mono text-lg-plus text-muted line-through">
                    {formatPrice(product.gosterilecek_piyasa_fiyat!)}
                  </span>
                  <span className="font-mono text-md font-semibold text-accent border border-accent rounded-nh px-nh-7 py-[2px]">
                    −{discountPct}%
                  </span>
                </span>
              )}
            </div>
            {showCmp && (
              <div className="font-mono text-sm-plus text-muted mt-nh-12 leading-relaxed">
                Aynı alet bugün internette {formatPrice(product.gosterilecek_piyasa_fiyat!)}.
              </div>
            )}

            {sold ? (
              <div className="mt-nh-18 h-nh-52 flex items-center justify-center bg-panel text-muted font-semibold text-xl rounded-nh">
                Satıldı
              </div>
            ) : (
              <WhatsappCta urunId={product.id} message={waMessage}>
                WhatsApp&apos;tan sor — {formatPrice(product.satis_fiyat)}
              </WhatsappCta>
            )}
            <div className="text-center font-mono text-sm text-muted mt-nh-10">
              Telefonu kendi açar. Genelde 1 saat içinde döner.
            </div>
          </div>

          <div className="mt-nh-28 border-t border-border">
            {specs.map((s) => (
              <div
                key={s.label}
                className="flex justify-between gap-nh-24 py-nh-11 border-b border-border"
              >
                <span className="font-mono text-sm tracking-nh-wide-lg uppercase text-muted">
                  {s.label}
                </span>
                <span className="font-mono text-md-plus text-right">{s.value}</span>
              </div>
            ))}
          </div>

          {product.aciklama && (
            <div className="mt-nh-26">
              <div className="font-mono text-sm tracking-nh-eyebrow uppercase text-muted mb-nh-8">
                Sahibinin notu
              </div>
              <p className="font-serif italic text-xl-plus sm:text-2xl-plus leading-relaxed text-body m-0">
                {product.aciklama}
              </p>
            </div>
          )}
        </div>
      </div>

      {similar.length > 0 && (
        <div className="border-t border-border px-nh-16 sm:px-nh-40 py-nh-28 sm:py-nh-40">
          <div className="font-mono text-sm tracking-nh-eyebrow uppercase text-muted mb-nh-14">
            Benzer aletler · {product.kategori_ad}
          </div>
          <ProductGrid products={similar} />
        </div>
      )}
    </>
  );
}
