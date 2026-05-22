import { ImagePlus, WandSparkles } from "lucide-react";
import { sampleProducts } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { PricingPanel } from "../components/PricingPanel";

export function ProductMaker() {
  const product = sampleProducts[0];

  return (
    <div className="stack">
      <section className="card">
        <p className="eyebrow">Separate Tool</p>
        <h2>AI Product Maker</h2>
        <p>Upload or take a product photo. The app preserves the original, removes the background, places the item on a white product stage, then generates listing copy and pricing.</p>
        <div className="buttonRow">
          <button className="primary"><ImagePlus size={18} /> Upload Photo</button>
          <button className="secondary"><WandSparkles size={18} /> Generate Listing</button>
        </div>
      </section>

      <ProductCard product={product} />
      <PricingPanel category={product.category} condition={product.condition} defaultMode="local_thrift" />
    </div>
  );
}
