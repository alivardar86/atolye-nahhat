"use client";

import { useState, useTransition } from "react";

export function DeleteProductButton({ action }: { action: () => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="h-nh-40 px-nh-16 rounded-nh border border-accent text-accent font-semibold text-sm-plus"
      >
        Ürünü sil
      </button>
    );
  }

  return (
    <div className="flex items-center gap-nh-10">
      <span className="text-sm-plus text-accent">Emin misiniz?</span>
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(action)}
        className="h-nh-40 px-nh-16 rounded-nh bg-accent text-paper font-semibold text-sm-plus disabled:opacity-60"
      >
        {isPending ? "Siliniyor…" : "Evet, sil"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="h-nh-40 px-nh-16 rounded-nh border border-border text-sm-plus"
      >
        Vazgeç
      </button>
    </div>
  );
}
