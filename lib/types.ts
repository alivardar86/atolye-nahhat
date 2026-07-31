export type UrunDurum = "sifir" | "az_kullanilmis" | "kullanilmis";
export type StokDurum = "satilik" | "ayrildi" | "satildi";

// Mirrors the public.v_urun_kart view (db/supabase-schema.sql) — read model
// for all public catalog pages.
export interface UrunKart {
  id: string;
  slug: string;
  kategori_slug: string;
  kategori_ad: string;
  cinsi: string;
  marka: string | null;
  model: string | null;
  ebat: string | null;
  durum: UrunDurum | null;
  aciklama: string | null;
  satis_fiyat: number;
  // Non-null only when fiyat_karsilastir is true AND piyasa_fiyat > satis_fiyat.
  gosterilecek_piyasa_fiyat: number | null;
  adet: number;
  stok_durumu: StokDurum;
  one_cikan: boolean;
  sira: number;
  kapak_foto: string | null;
}

export interface Kategori {
  slug: string;
  ad: string;
  aciklama: string | null;
  sira: number;
  aktif: boolean;
}
