"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fotoUrl } from "@/lib/supabase";
import { UrunFoto } from "@/lib/types";
import { uploadFoto, deleteFoto, moveFoto, setCover } from "@/lib/panel/photo-actions";
import { resizeImage } from "@/lib/resize-image";

export function PhotoManager({
  urunId,
  photos,
}: {
  urunId: string;
  photos: UrunFoto[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const busy = uploading || isPending;

  async function handleFiles(files: FileList) {
    setUploading(true);
    setError(null);
    for (const file of Array.from(files)) {
      try {
        const blob = await resizeImage(file);
        const formData = new FormData();
        formData.set("photo", blob, "photo.jpg");
        const result = await uploadFoto(urunId, formData);
        if (result?.error) setError(result.error);
      } catch {
        setError("Fotoğraf işlenemedi.");
      }
    }
    setUploading(false);
    router.refresh();
    if (inputRef.current) inputRef.current.value = "";
  }

  function onDelete(fotoId: string) {
    startTransition(async () => {
      await deleteFoto(urunId, fotoId);
      router.refresh();
    });
  }

  function onMove(fotoId: string, direction: "up" | "down") {
    startTransition(async () => {
      await moveFoto(urunId, fotoId, direction);
      router.refresh();
    });
  }

  function onSetCover(fotoId: string) {
    startTransition(async () => {
      await setCover(urunId, fotoId);
      router.refresh();
    });
  }

  return (
    <div>
      <label className="inline-flex items-center h-nh-40 px-nh-16 rounded-nh border border-border bg-paper cursor-pointer font-semibold text-sm-plus">
        {uploading ? "Yükleniyor…" : "+ Fotoğraf ekle"}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={busy}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
      </label>

      {error && (
        <p className="text-accent text-sm-plus mt-nh-10" role="alert">
          {error}
        </p>
      )}

      {photos.length === 0 ? (
        <p className="text-muted text-sm-plus mt-nh-14">Henüz fotoğraf eklenmedi.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-nh-14 mt-nh-16">
          {photos.map((foto, i) => (
            <div key={foto.id} className="border border-border rounded-nh overflow-hidden bg-paper">
              <div className="relative aspect-square">
                <Image
                  src={fotoUrl(foto.storage_yolu)}
                  alt={foto.alt_metin ?? ""}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
                {i === 0 && (
                  <span className="absolute top-nh-6 left-nh-6 bg-ink text-paper text-2xs font-mono uppercase tracking-nh-wide px-nh-6 py-nh-2 rounded-nh">
                    Kapak
                  </span>
                )}
              </div>
              <div className="p-nh-8 flex flex-col gap-nh-6">
                <div className="flex gap-nh-6">
                  <button
                    type="button"
                    disabled={busy || i === 0}
                    onClick={() => onMove(foto.id, "up")}
                    className="flex-1 h-8 rounded-nh border border-border text-xs disabled:opacity-40"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={busy || i === photos.length - 1}
                    onClick={() => onMove(foto.id, "down")}
                    className="flex-1 h-8 rounded-nh border border-border text-xs disabled:opacity-40"
                  >
                    ↓
                  </button>
                </div>
                {i !== 0 && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onSetCover(foto.id)}
                    className="h-8 rounded-nh border border-border text-xs"
                  >
                    Kapak yap
                  </button>
                )}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onDelete(foto.id)}
                  className="h-8 rounded-nh border border-border text-xs text-accent"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
