import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/panel/ProductForm";
import { createProduct } from "@/lib/panel/product-actions";

export default async function YeniUrunPage() {
  const supabase = await createClient();
  const { data: kategoriler, error } = await supabase
    .from("kategoriler")
    .select("*")
    .order("sira");
  if (error) throw error;

  return (
    <div className="px-nh-16 sm:px-nh-40 py-nh-24">
      <h1 className="text-6xl font-bold mb-nh-20">Yeni ürün</h1>
      <ProductForm mode="create" product={null} kategoriler={kategoriler ?? []} action={createProduct} />
    </div>
  );
}
