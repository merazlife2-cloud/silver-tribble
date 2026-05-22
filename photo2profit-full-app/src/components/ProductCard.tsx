import type { Product } from "../data/products";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  return (
    <article className={compact ? "product compact" : "product"}>
      <img src={product.image} alt={product.title} />
      <div>
        <p className="eyebrow">{product.status === "draft" ? "Draft Listing" : "Store Listing"}</p>
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        <strong>${product.price.toFixed(2)}</strong>
      </div>
    </article>
  );
}
