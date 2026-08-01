import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/panel/ProductForm";
import { PhotoManager } from "@/components/panel/PhotoManager";
import { DeleteProductButton } from "@/components/panel/DeleteProductButton";
import { updateProduct, deleteProduct } from "@/lib/panel/product-actions";
import { Urun, UrunFoto } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export default async function UrunPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product, error: productError }, { data: kategoriler, error: kategorilerError }, { data: photos, error: photosError }] =
    await Promise.all([
      supabase.from("urunler").select("*").eq("id", id).maybeSingle(),
      supabase.from("kategoriler").select("*").order("sira"),
      supabase.from("urun_fotograflari").select("*").eq("urun_id", id).order("sira"),
    ]);

  if (productError) throw productError;
  if (kategorilerError) throw kategorilerError;
  if (photosError) throw photosError;
  if (!product) notFound();

  const updateWithId = updateProduct.bind(null, id);
  const deleteWithId = deleteProduct.bind(null, id);

  return (
    <div className="px-nh-16 sm:px-nh-40 py-nh-24">
      <h1 className="text-6xl font-bold mb-nh-20">{product.cinsi}</h1>

      <ProductForm
        mode="edit"
        product={product as Urun}
        kategoriler={kategoriler ?? []}
        action={updateWithId}
      />

      <div className="max-w-2xl mt-nh-40 pt-nh-24 border-t border-border">
        <h2 className="text-4xl font-bold mb-nh-16">Fotoğraflar</h2>
        <PhotoManager urunId={id} photos={(photos ?? []) as UrunFoto[]} />
      </div>

      <div className="max-w-2xl mt-nh-40 pt-nh-24 border-t border-border">
        <DeleteProductButton action={deleteWithId} />
      </div>
    </div>
  );
}
