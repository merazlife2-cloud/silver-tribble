import { MapPin, ShoppingCart, Truck } from "lucide-react";
import { sampleProducts } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import type { Screen } from "../types";

export function Store({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const active = sampleProducts.filter(p => p.status === "active");

  return (
    <div className="stack">
      <section className="storeHero">
        <div>
          <p className="eyebrow">Public Storefront</p>
          <h2>Michelle’s Finds</h2>
          <p>Affordable thrift finds with shipping and local pickup.</p>
        </div>
        <button className="cartButton" onClick={() => setScreen("cart")}><ShoppingCart /> Cart</button>
      </section>

      <div className="storeGrid">
        {active.map(product => <ProductCard key={product.id} product={product} compact />)}
      </div>

      <section className="card">
        <h2>Checkout Methods</h2>
        <div className="checkoutGrid">
          <div><Truck /> Shipping</div>
          <div><MapPin /> Local pickup</div>
        </div>
      </section>
    </div>
  );
}
