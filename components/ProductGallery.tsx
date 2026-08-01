"use client";

import { useState } from "react";
import Image from "next/image";
import { UrunFoto } from "@/lib/types";
import { fotoUrl } from "@/lib/supabase";

const PLACEHOLDER_BG =
  "bg-[repeating-linear-gradient(135deg,var(--color-placeholder-stripe)_0px_7px,var(--color-panel)_7px_14px)]";

export function ProductGallery({
  photos,
  title,
}: {
  photos: UrunFoto[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  if (photos.length === 0) {
    return (
      <div
        className={`relative aspect-4/5 border border-border flex items-center justify-center ${PLACEHOLDER_BG}`}
      >
        <span className="font-mono text-xs tracking-nh-eyebrow text-placeholder">
          FOTO · 4:5
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-nh-12">
      <div className="relative aspect-4/5 border border-border overflow-hidden">
        <Image
          src={fotoUrl(photos[active].storage_yolu)}
          alt={photos[active].alt_metin ?? title}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>
      {photos.length > 1 && (
        <div className="grid grid-cols-4 gap-nh-12">
          {photos.map((foto, i) => (
            <button
              key={foto.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Fotoğraf ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-square border overflow-hidden ${
                i === active ? "border-ink" : "border-border"
              }`}
            >
              <Image
                src={fotoUrl(foto.storage_yolu)}
                alt={foto.alt_metin ?? `${title} ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
