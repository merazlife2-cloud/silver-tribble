import { Camera, ClipboardList, ImagePlus, Package, ScanLine, ShoppingBag, Store } from "lucide-react";
import type { Screen } from "../types";

export function Home({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <div className="stack">
      <section className="stats">
        <div><strong>12</strong><span>Listings</span></div>
        <div><strong>4</strong><span>Drafts</span></div>
        <div><strong>2</strong><span>Orders</span></div>
        <div><strong>$186</strong><span>Profit</span></div>
      </section>

      <section className="heroGrid">
        <button className="heroCard navy" onClick={() => setScreen("scanner")}>
          <ScanLine />
          <h2>Scan Item</h2>
          <p>Check thrift, yard sale, and online resale pricing before buying.</p>
        </button>

        <button className="heroCard pink" onClick={() => setScreen("maker")}>
          <ImagePlus />
          <h2>Create Listing</h2>
          <p>Turn one product photo into a clean resale listing.</p>
        </button>
      </section>

      <section className="quickGrid">
        <button onClick={() => setScreen("dashboard")}><ClipboardList /> Dashboard</button>
        <button onClick={() => setScreen("store")}><Store /> Store</button>
        <button onClick={() => setScreen("orders")}><ShoppingBag /> Orders</button>
        <button onClick={() => setScreen("drafts")}><Package /> Drafts</button>
        <button onClick={() => setScreen("saved")}><Camera /> Saved Scans</button>
      </section>
    </div>
  );
}
