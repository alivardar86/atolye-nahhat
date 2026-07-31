# Atölye Nahhat

Catalogue site + admin panel for a closing woodworking workshop. The owner sells his
hand-tool collection; the site shows the tools and their prices, and buyers contact him
on WhatsApp. **There is no cart, no checkout, no payment.**

All user-facing copy is in **Turkish**. Code, comments and commit messages in English.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Supabase — Postgres, Auth (single admin user), Storage (`urun-foto` bucket)
- Deployed on Vercel, domain `atolyenahhat.com`

Env vars (`.env.local` and Vercel):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_WHATSAPP=90XXXXXXXXXX   # no +, no spaces
```

Never reference `SUPABASE_SERVICE_ROLE_KEY` in client code. Public pages read through the
anon key and RLS; the panel reads/writes as an authenticated user.

## Database

Schema already exists in Supabase — see `supabase-schema.sql` and `seed.sql` in the repo.
**Do not redesign it.** If a column is genuinely missing, add a migration file and say so;
don't silently invent fields.

Tables: `kategoriler`, `urunler`, `urun_fotograflari`. View: `v_urun_kart`.

Key columns on `urunler`:

| Column | Notes |
|---|---|
| `stok_durumu` | `satilik` \| `ayrildi` \| `satildi` |
| `durum` | `sifir` \| `az_kullanilmis` \| `kullanilmis` |
| `satis_fiyat` | the asking price, always shown |
| `piyasa_fiyat` / `piyasa_kaynak` | current online price for the same tool |
| `fiyat_karsilastir` | if false, hide the market-price comparison for this item |
| `adet` | quantity, when several identical tools exist |
| `sira` | manual sort order |

The `v_urun_kart` view already nulls out `gosterilecek_piyasa_fiyat` when
`fiyat_karsilastir` is false or the asking price is higher. Read from the view on public
pages; write to the tables from the panel.

Current data: 108 rows — 54 `satilik`, 7 `ayrildi`, 47 `satildi`.

## Routes

Public:
- `/` — hero, category chips with counts, search, price sort, "Satılanları da göster"
  toggle (default off), product grid
- `/urun/[slug]` — gallery, spec table, price block, owner's note, WhatsApp CTA,
  similar tools. Needs proper `generateMetadata` with Open Graph — these links get
  pasted into Facebook groups and WhatsApp.
- `/hakkinda` — the workshop's story

Panel (all under `/panel`, auth-gated by middleware):
- `/panel/giris` — email + password
- `/panel` — product list: search, filter by category and stock state, inline stock-state
  change, quick price edit
- `/panel/urun/yeni` and `/panel/urun/[id]` — full form + photo upload (drag to reorder,
  delete, set cover)

## Rules

- Turkish number formatting: `12.500 TL`, dot as thousands separator. One helper,
  used everywhere.
- Slugs are generated from cinsi + marka + model + ebat, ASCII-folded (ı→i, ğ→g, ü→u,
  ş→s, ö→o, ç→c). Existing slugs in `seed.sql` must not change — they may already be
  shared as links.
- WhatsApp CTA opens `wa.me/<number>?text=<encoded>` with the tool name and price
  pre-filled.
- Public pages are statically rendered with ISR (`revalidate = 60`); the panel is fully
  dynamic. After a panel write, call `revalidatePath` for the affected pages.
- Photos: upload to the `urun-foto` bucket, resize client-side before upload (max 1600px),
  serve through `next/image` with the Supabase domain allowed in `next.config`.
- Mobile first. Most traffic is a phone. Test at 360px.
- Accessibility floor: visible keyboard focus, alt text on every photo, respects
  `prefers-reduced-motion`.

## Design

The visual language comes from the Claude Design handoff bundle in `/design`. Follow its
tokens (colors, type scale, spacing) exactly — extract them into a `@theme` block in
`app/globals.css` rather than hardcoding values in components. This project uses Tailwind
v4, which reads design tokens straight from CSS custom properties instead of a
`tailwind.config.ts` file; `@theme` *is* the config file now. Where the handoff is a static
prototype, keep the visual result and rebuild the markup as proper React components wired
to Supabase.

## Working style

- Small commits, one concern each.
- Build one route fully before starting the next: `/` → `/urun/[slug]` → panel auth →
  panel CRUD → photo upload.
- Run `npm run build` before saying a step is done.
- Don't add dependencies without saying why. No UI kit, no state library, no ORM —
  the Supabase JS client is enough.
