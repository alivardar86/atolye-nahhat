import { UrunKart } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: UrunKart[] }) {
  if (products.length === 0) {
    return (
      <p className="font-mono text-sm text-muted py-nh-40 text-center">
        Bu aramaya uyan alet yok.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-px bg-border border-y border-border sm:bg-transparent sm:border-0 sm:grid sm:grid-cols-[repeat(auto-fill,minmax(272px,1fr))] sm:gap-nh-16">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
