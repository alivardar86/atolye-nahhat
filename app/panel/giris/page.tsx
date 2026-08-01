"use client";

import { useActionState } from "react";
import { signIn } from "@/lib/panel/auth-actions";

export default function GirisPage() {
  const [error, action, pending] = useActionState(signIn, null);

  return (
    <div className="flex-1 flex items-center justify-center px-nh-16 py-nh-40">
      <form
        action={action}
        className="w-full max-w-sm bg-paper border border-border rounded-nh p-nh-24"
      >
        <h1 className="text-4xl font-bold mb-nh-20">Panel girişi</h1>

        <label className="block mb-nh-14">
          <span className="block font-mono text-sm text-muted mb-nh-6">E-posta</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="w-full h-nh-44 px-nh-12 rounded-nh border border-border bg-white"
          />
        </label>

        <label className="block mb-nh-20">
          <span className="block font-mono text-sm text-muted mb-nh-6">Şifre</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="w-full h-nh-44 px-nh-12 rounded-nh border border-border bg-white"
          />
        </label>

        {error && (
          <p className="text-accent text-sm-plus mb-nh-14" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full h-nh-44 rounded-nh bg-ink hover:bg-ink-hover disabled:opacity-60 text-paper font-semibold text-lg"
        >
          {pending ? "Giriş yapılıyor…" : "Giriş yap"}
        </button>
      </form>
    </div>
  );
}
