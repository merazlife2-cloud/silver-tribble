import { sampleProducts } from "../data/products";
import { ProductCard } from "../components/ProductCard";

export function Drafts() {
  const drafts = sampleProducts.filter(p => p.status === "draft");
  return (
    <div className="stack">
      {drafts.map(product => <ProductCard key={product.id} product={product} />)}
      <section className="card">
        <h2>Draft Actions</h2>
        <button className="primary full">Publish Selected Drafts</button>
      </section>
    </div>
  );
}
