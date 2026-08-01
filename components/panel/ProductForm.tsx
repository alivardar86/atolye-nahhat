"use client";

import { useActionState } from "react";
import { Kategori, Urun } from "@/lib/types";
import { ProductFormState } from "@/lib/panel/product-actions";

type Props = {
  mode: "create" | "edit";
  product: Urun | null;
  kategoriler: Kategori[];
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
};

const initialState: ProductFormState = {};

export function ProductForm({ mode, product, kategoriler, action }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-2xl">
      {state.success && (
        <div className="mb-nh-16 p-nh-12 rounded-nh bg-success/10 border border-success text-sm-plus">
          Kaydedildi.
        </div>
      )}
      {state.error && (
        <div className="mb-nh-16 p-nh-12 rounded-nh border border-accent text-accent text-sm-plus" role="alert">
          {state.error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-nh-16">
        <Field label="Cinsi *">
          <input name="cinsi" required defaultValue={product?.cinsi ?? ""} className={inputClass} />
        </Field>

        <Field label="Kategori *">
          <select name="kategori_slug" required defaultValue={product?.kategori_slug ?? ""} className={inputClass}>
            <option value="" disabled>
              Seçin…
            </option>
            {kategoriler.map((k) => (
              <option key={k.slug} value={k.slug}>
                {k.ad}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Malzeme">
          <input name="malzeme" defaultValue={product?.malzeme ?? ""} className={inputClass} />
        </Field>

        <Field label="Marka">
          <input name="marka" defaultValue={product?.marka ?? ""} className={inputClass} />
        </Field>

        <Field label="Model">
          <input name="model" defaultValue={product?.model ?? ""} className={inputClass} />
        </Field>

        <Field label="Ebat">
          <input name="ebat" defaultValue={product?.ebat ?? ""} className={inputClass} />
        </Field>

        <Field label="Durum">
          <select name="durum" defaultValue={product?.durum ?? ""} className={inputClass}>
            <option value="">—</option>
            <option value="sifir">Sıfır</option>
            <option value="az_kullanilmis">Az kullanılmış</option>
            <option value="kullanilmis">Kullanılmış</option>
          </select>
        </Field>

        <Field label="Adet">
          <input
            name="adet"
            type="number"
            min={1}
            defaultValue={product?.adet ?? 1}
            className={inputClass}
          />
        </Field>

        <Field label="Stok durumu">
          <select name="stok_durumu" defaultValue={product?.stok_durumu ?? "satilik"} className={inputClass}>
            <option value="satilik">Satılık</option>
            <option value="ayrildi">Ayrıldı</option>
            <option value="satildi">Satıldı</option>
          </select>
        </Field>

        <Field label="Satış fiyatı (TL) *">
          <input
            name="satis_fiyat"
            type="number"
            min={0}
            step="0.01"
            required
            defaultValue={product?.satis_fiyat ?? ""}
            className={inputClass}
          />
        </Field>

        <Field label="Piyasa fiyatı (TL)">
          <input
            name="piyasa_fiyat"
            type="number"
            min={0}
            step="0.01"
            defaultValue={product?.piyasa_fiyat ?? ""}
            className={inputClass}
          />
        </Field>

        <Field label="Piyasa kaynağı">
          <input
            name="piyasa_kaynak"
            placeholder="amazon, nalburcuk…"
            defaultValue={product?.piyasa_kaynak ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-nh-10 mt-nh-16">
        <label className="flex items-center gap-nh-8 text-sm-plus">
          <input
            type="checkbox"
            name="fiyat_karsilastir"
            defaultChecked={product?.fiyat_karsilastir ?? true}
          />
          Piyasa fiyatı karşılaştırmasını sitede göster
        </label>
        <label className="flex items-center gap-nh-8 text-sm-plus">
          <input type="checkbox" name="one_cikan" defaultChecked={product?.one_cikan ?? false} />
          Öne çıkan ürün
        </label>
      </div>

      <div className="mt-nh-16">
        <Field label="Sahibinin notu">
          <textarea
            name="aciklama"
            rows={3}
            defaultValue={product?.aciklama ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="flex items-center gap-nh-12 mt-nh-20">
        <button
          type="submit"
          disabled={pending}
          className="h-nh-44 px-nh-24 rounded-nh bg-ink hover:bg-ink-hover disabled:opacity-60 text-paper font-semibold text-lg"
        >
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>

      {mode === "create" && (
        <p className="text-sm-plus text-muted mt-nh-14">
          Fotoğraf eklemek için önce ürünü kaydedin.
        </p>
      )}
    </form>
  );
}

const inputClass = "w-full h-nh-44 px-nh-12 rounded-nh border border-border bg-white";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block font-mono text-sm text-muted mb-nh-6">{label}</span>
      {children}
    </label>
  );
}
