import { ScanLine } from "lucide-react";
import { sampleProducts } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { PricingPanel } from "../components/PricingPanel";

export function Scanner() {
  const product = sampleProducts[0];

  return (
    <div className="stack">
      <section className="scannerBox">
        <div className="scanFrame"><ScanLine size={42} /><span>Camera Scanner</span></div>
        <div>
          <p className="eyebrow">Separate Tool</p>
          <h2>Should I buy this?</h2>
          <p>Scanner uses the same pricing engine, then adds buy cost, fees, net profit, ROI, and Buy/Skip decision.</p>
        </div>
      </section>

      <ProductCard product={product} />
      <PricingPanel category={product.category} condition={product.condition} defaultMode="fast_online" scanner />
    </div>
  );
}
