-- Adds u.malzeme to v_urun_kart so /urun/[slug] can show it in the spec
-- table. malzeme already exists on urunler — this only widens the view's
-- projection, no table columns added.
--
-- Appended at the end of the column list, not inserted between cinsi and
-- marka: CREATE OR REPLACE VIEW can only add trailing columns, not reorder
-- or rename existing ones (Postgres error 42P16). Views carry no RLS
-- policies of their own in this schema (only kategoriler/urunler/
-- urun_fotograflari do), so replacing it here is safe.
--
-- Run in the Supabase SQL editor.
create or replace view v_urun_kart as
select
  u.id, u.slug, u.kategori_slug, k.ad as kategori_ad,
  u.cinsi, u.marka, u.model, u.ebat, u.durum, u.aciklama,
  u.satis_fiyat,
  case when u.fiyat_karsilastir and u.piyasa_fiyat > u.satis_fiyat
       then u.piyasa_fiyat end as gosterilecek_piyasa_fiyat,
  u.adet, u.stok_durumu, u.one_cikan, u.sira,
  (select f.storage_yolu from urun_fotograflari f
    where f.urun_id = u.id order by f.sira limit 1) as kapak_foto,
  u.malzeme
from urunler u
join kategoriler k on k.slug = u.kategori_slug
order by u.sira;
