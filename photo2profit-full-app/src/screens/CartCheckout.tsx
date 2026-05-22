import { MapPin, Truck } from "lucide-react";
import { sampleProducts } from "../data/products";

export function CartCheckout() {
  const cart = sampleProducts.slice(0, 2);
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="stack">
      <section className="card">
        <p className="eyebrow">Cart</p>
        <h2>Ready to Checkout</h2>
        {cart.map(item => (
          <div className="cartLine" key={item.id}>
            <span>{item.title}</span>
            <strong>${item.price.toFixed(2)}</strong>
          </div>
        ))}
        <div className="total"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
      </section>

      <section className="card">
        <h2>Delivery Method</h2>
        <div className="checkoutGrid">
          <button><Truck /> Ship to buyer</button>
          <button><MapPin /> Local pickup</button>
        </div>
        <button className="primary full">Place Order</button>
      </section>
    </div>
  );
}
