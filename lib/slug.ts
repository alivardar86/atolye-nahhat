const TURKISH_MAP: Record<string, string> = {
  ı: "i",
  İ: "i",
  ğ: "g",
  Ğ: "g",
  ü: "u",
  Ü: "u",
  ş: "s",
  Ş: "s",
  ö: "o",
  Ö: "o",
  ç: "c",
  Ç: "c",
};

function asciiFold(input: string): string {
  return input
    .split("")
    .map((ch) => TURKISH_MAP[ch] ?? ch)
    .join("");
}

// Slugs are generated from cinsi + marka + model + ebat, ASCII-folded.
// Existing slugs (db/seed.sql) are handwritten with this same scheme and
// must never be regenerated/changed once created.
export function generateSlug(fields: {
  cinsi: string;
  marka?: string | null;
  model?: string | null;
  ebat?: string | null;
}): string {
  const parts = [fields.cinsi, fields.marka, fields.model, fields.ebat].filter(
    (p): p is string => Boolean(p && p.trim())
  );

  return asciiFold(parts.join(" "))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
