-- Self-hosted product-interaction analytics — anonymous counts only (no IP,
-- no cookies, no user identifiers). Records how many times a product page
-- was viewed and its WhatsApp CTA was clicked. Read by the panel to surface
-- "En çok bakılanlar" (most-viewed) and view/click ratios.
--
-- Run in the Supabase SQL editor.
create table if not exists urun_etkilesim (
  id         uuid primary key default uuid_generate_v4(),
  urun_id    uuid not null references urunler(id) on delete cascade,
  tip        text not null check (tip in ('goruntuleme', 'whatsapp_tik')),
  created_at timestamptz not null default now()
);

create index if not exists etkilesim_urun_tip_zaman_idx
  on urun_etkilesim(urun_id, tip, created_at);

alter table urun_etkilesim enable row level security;

-- Public pages log views/clicks anonymously — insert-only, no read access.
drop policy if exists "herkes etkilesim ekler" on urun_etkilesim;
create policy "herkes etkilesim ekler" on urun_etkilesim
  for insert with check (true);

-- Only the panel (logged-in owner) reads aggregate counts.
drop policy if exists "panel etkilesim okur" on urun_etkilesim;
create policy "panel etkilesim okur" on urun_etkilesim
  for select using (auth.role() = 'authenticated');
