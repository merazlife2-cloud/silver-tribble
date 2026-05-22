import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Home as HomeIcon, ImagePlus, ScanLine, Store as StoreIcon } from "lucide-react";
import "./styles.css";
import type { Screen } from "./types";
import { Home } from "./screens/Home";
import { Scanner } from "./screens/Scanner";
import { ProductMaker } from "./screens/ProductMaker";
import { Store } from "./screens/Store";
import { CartCheckout } from "./screens/CartCheckout";
import { Dashboard } from "./screens/Dashboard";
import { Orders } from "./screens/Orders";
import { Drafts } from "./screens/Drafts";
import { SavedScans } from "./screens/SavedScans";

function App() {
  const [screen, setScreen] = useState<Screen>("home");

  return (
    <div className="appShell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Photo2Profit</p>
          <h1>{title(screen)}</h1>
        </div>
        <span className="pill">SCAN. SELL. PROFIT.</span>
      </header>

      <main>
        {screen === "home" && <Home setScreen={setScreen} />}
        {screen === "scanner" && <Scanner />}
        {screen === "maker" && <ProductMaker />}
        {screen === "store" && <Store setScreen={setScreen} />}
        {screen === "cart" && <CartCheckout />}
        {screen === "dashboard" && <Dashboard />}
        {screen === "orders" && <Orders />}
        {screen === "drafts" && <Drafts />}
        {screen === "saved" && <SavedScans />}
      </main>

      <nav className="tabbar">
        <Tab label="Home" active={screen === "home"} icon={<HomeIcon />} onClick={() => setScreen("home")} />
        <Tab label="Scan" active={screen === "scanner"} icon={<ScanLine />} onClick={() => setScreen("scanner")} />
        <Tab label="Maker" active={screen === "maker"} icon={<ImagePlus />} onClick={() => setScreen("maker")} />
        <Tab label="Store" active={screen === "store"} icon={<StoreIcon />} onClick={() => setScreen("store")} />
      </nav>
    </div>
  );
}

function title(screen: Screen) {
  return {
    home: "Profit Command Center",
    scanner: "AI Scanner",
    maker: "AI Product Maker",
    store: "Mini Storefront",
    cart: "Cart & Checkout",
    dashboard: "Seller Dashboard",
    orders: "Orders",
    drafts: "Draft Queue",
    saved: "Saved Scans",
  }[screen];
}

function Tab({ label, icon, active, onClick }: { label: string; icon: React.ReactNode; active: boolean; onClick: () => void }) {
  return <button className={active ? "tab active" : "tab"} onClick={onClick}>{icon}<span>{label}</span></button>;
}

createRoot(document.getElementById("root")!).render(<App />);
