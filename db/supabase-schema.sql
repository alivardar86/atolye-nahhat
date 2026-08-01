-- ============================================================
-- Atölye Nahhat — Supabase şeması
-- Sıra: bu dosyayı çalıştır → sonra seed.sql
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- enum'lar ----------
do $$ begin
  create type urun_durum as enum ('sifir', 'az_kullanilmis', 'kullanilmis');
exception when duplicate_object then null; end $$;

do $$ begin
  create type stok_durum as enum ('satilik', 'ayrildi', 'satildi');
exception when duplicate_object then null; end $$;

-- ---------- kategoriler ----------
create table if not exists kategoriler (
  slug        text primary key,
  ad          text not null,
  aciklama    text,
  sira        int  not null default 0,
  aktif       boolean not null default true
);

-- ---------- ürünler ----------
create table if not exists urunler (
  id             uuid primary key default uuid_generate_v4(),
  slug           text unique not null,
  kategori_slug  text not null references kategoriler(slug) on update cascade,

  -- babanın excel'indeki alanlar
  cinsi          text not null,          -- "Ahşap Rendesi", "El Testeresi"...
  malzeme        text,                   -- Metal / Ahşap / Plastik
  marka          text,
  model          text,
  ebat           text,
  durum          urun_durum,

  -- serbest metin: her ürüne babanın ağzından 1-2 cümle
  aciklama       text,

  -- fiyat
  piyasa_fiyat   numeric(10,2),          -- excel'deki "İnternet Fiyat"
  piyasa_kaynak  text,                   -- amazon / nalburcuk / leevalley...
  satis_fiyat    numeric(10,2) not null,
  -- karşılaştırmayı sitede göster/gizle. satis > piyasa olan 8 üründe false olmalı.
  fiyat_karsilastir boolean not null default true,

  adet           int not null default 1, -- aynı üründen birden fazla varsa
  stok_durumu    stok_durum not null default 'satilik',
  one_cikan      boolean not null default false,
  sira           int not null default 0,

  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists urunler_kategori_idx on urunler(kategori_slug);
create index if not exists urunler_stok_idx     on urunler(stok_durumu);
create index if not exists urunler_sira_idx     on urunler(sira);

-- arama (marka + model + cinsi üzerinden)
create index if not exists urunler_arama_idx on urunler
  using gin (to_tsvector('simple',
    coalesce(cinsi,'') || ' ' || coalesce(marka,'') || ' ' ||
    coalesce(model,'') || ' ' || coalesce(ebat,'')));

-- ---------- fotoğraflar ----------
create table if not exists urun_fotograflari (
  id           uuid primary key default uuid_generate_v4(),
  urun_id      uuid not null references urunler(id) on delete cascade,
  storage_yolu text not null,            -- 'urun-foto' bucket'ındaki path
  alt_metin    text,
  sira         int not null default 0,
  created_at   timestamptz not null default now()
);
create index if not exists fotograf_urun_idx on urun_fotograflari(urun_id, sira);

-- ---------- etkileşimler (self-hosted analytics — bkz. db/migrations/0002) ----------
create table if not exists urun_etkilesim (
  id         uuid primary key default uuid_generate_v4(),
  urun_id    uuid not null references urunler(id) on delete cascade,
  tip        text not null check (tip in ('goruntuleme', 'whatsapp_tik')),
  created_at timestamptz not null default now()
);
create index if not exists etkilesim_urun_tip_zaman_idx
  on urun_etkilesim(urun_id, tip, created_at);

-- ---------- updated_at trigger ----------
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists urunler_updated_at on urunler;
create trigger urunler_updated_at before update on urunler
  for each row execute function set_updated_at();

-- ============================================================
-- RLS — site herkese açık okur, panel sadece giriş yapmış kullanıcı yazar
-- ============================================================
alter table kategoriler       enable row level security;
alter table urunler           enable row level security;
alter table urun_fotograflari enable row level security;
alter table urun_etkilesim    enable row level security;

drop policy if exists "herkes kategorileri okur" on kategoriler;
create policy "herkes kategorileri okur" on kategoriler
  for select using (true);

drop policy if exists "herkes urunleri okur" on urunler;
create policy "herkes urunleri okur" on urunler
  for select using (true);   -- satılanlar da görünsün, sitede "Satıldı" rozetiyle

drop policy if exists "herkes fotograflari okur" on urun_fotograflari;
create policy "herkes fotograflari okur" on urun_fotograflari
  for select using (true);

drop policy if exists "panel kategori yazar" on kategoriler;
create policy "panel kategori yazar" on kategoriler
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "panel urun yazar" on urunler;
create policy "panel urun yazar" on urunler
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "panel fotograf yazar" on urun_fotograflari;
create policy "panel fotograf yazar" on urun_fotograflari
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Public pages log views/clicks anonymously — insert-only, no read access.
drop policy if exists "herkes etkilesim ekler" on urun_etkilesim;
create policy "herkes etkilesim ekler" on urun_etkilesim
  for insert with check (true);

-- Only the panel (logged-in owner) reads aggregate counts.
drop policy if exists "panel etkilesim okur" on urun_etkilesim;
create policy "panel etkilesim okur" on urun_etkilesim
  for select using (auth.role() = 'authenticated');

-- ============================================================
-- Storage — fotoğraf bucket'ı
-- ============================================================
insert into storage.buckets (id, name, public)
values ('urun-foto', 'urun-foto', true)
on conflict (id) do nothing;

drop policy if exists "foto herkese acik" on storage.objects;
create policy "foto herkese acik" on storage.objects
  for select using (bucket_id = 'urun-foto');

drop policy if exists "foto panel yukler" on storage.objects;
create policy "foto panel yukler" on storage.objects
  for insert to authenticated with check (bucket_id = 'urun-foto');

drop policy if exists "foto panel siler" on storage.objects;
create policy "foto panel siler" on storage.objects
  for delete to authenticated using (bucket_id = 'urun-foto');

-- ============================================================
-- Kullanışlı view: siteye giden liste
-- ============================================================
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
