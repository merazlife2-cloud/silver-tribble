import React, { ChangeEvent, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Camera, CreditCard, Home, ImagePlus, MapPin, ScanLine, ShoppingCart, Store, Truck, WandSparkles, ClipboardList } from "lucide-react";
import "./styles.css";

type Screen = "home" | "scanner" | "maker" | "store" | "cart" | "dashboard";
type Mode = "yard_sale" | "local_thrift" | "fast_online" | "stretch_online";
type Category = "women_sweater" | "hoodie" | "shoes" | "jeans" | "bags" | "home" | "generic";

const ranges: Record<Category, Record<Mode, {low:number; high:number}>> = {
  women_sweater: { yard_sale:{low:2,high:4}, local_thrift:{low:5,high:8}, fast_online:{low:9,high:12}, stretch_online:{low:12,high:14} },
  hoodie: { yard_sale:{low:2,high:5}, local_thrift:{low:5,high:9}, fast_online:{low:10,high:14}, stretch_online:{low:14,high:18} },
  shoes: { yard_sale:{low:3,high:8}, local_thrift:{low:8,high:16}, fast_online:{low:18,high:35}, stretch_online:{low:35,high:55} },
  jeans: { yard_sale:{low:2,high:6}, local_thrift:{low:6,high:12}, fast_online:{low:14,high:24}, stretch_online:{low:25,high:35} },
  bags: { yard_sale:{low:3,high:8}, local_thrift:{low:8,high:18}, fast_online:{low:18,high:35}, stretch_online:{low:35,high:60} },
  home: { yard_sale:{low:1,high:5}, local_thrift:{low:4,high:12}, fast_online:{low:12,high:25}, stretch_online:{low:25,high:40} },
  generic: { yard_sale:{low:2,high:5}, local_thrift:{low:5,high:10}, fast_online:{low:10,high:18}, stretch_online:{low:18,high:30} }
};

function zipMult(zip:string) {
  if (["95901","95991","95993","95961"].some(z => zip.startsWith(z))) return .9;
  if (zip.startsWith("958") || zip.startsWith("956") || zip.startsWith("957")) return 1.05;
  if (zip.startsWith("94") || zip.startsWith("95")) return 1.15;
  if (zip.startsWith("90") || zip.startsWith("91")) return 1.1;
  return 1;
}
function money(n:number) { return n < 10 ? Math.round(n) : Math.round(n) - .01; }
function categoryFromName(name:string): Category {
  const v = name.toLowerCase();
  if (v.includes("hoodie") || v.includes("sweater") || v.includes("knit")) return "women_sweater";
  if (v.includes("shoe") || v.includes("sneaker") || v.includes("boot")) return "shoes";
  if (v.includes("jean") || v.includes("denim")) return "jeans";
  if (v.includes("bag") || v.includes("purse")) return "bags";
  if (v.includes("home") || v.includes("decor")) return "home";
  return "generic";
}
function label(mode:Mode) {
  return {yard_sale:"Yard Sale",local_thrift:"Local Thrift",fast_online:"Fast Online",stretch_online:"Stretch Online"}[mode];
}
function priceEngine(category:Category, mode:Mode, zip:string, buyCost:number) {
  const mult = zipMult(zip) * .95 * 1.08;
  const opts = Object.entries(ranges[category]).reduce((acc,[k,r]) => {
    const low = money(r.low * mult);
    const high = Math.max(low, money(r.high * mult));
    const rec = Math.min(Math.max(money(low + (high-low)*.55), low), high);
    acc[k as Mode] = { low, high, rec, label: label(k as Mode) };
    return acc;
  }, {} as Record<Mode,{low:number;high:number;rec:number;label:string}>);
  const sale = opts[mode].rec;
  const online = mode === "fast_online" || mode === "stretch_online";
  const fees = online ? sale * .13 + .4 : 0;
  const net = Math.max(0, sale - fees);
  const profit = net - buyCost;
  const roi = buyCost > 0 ? Math.round((profit / buyCost) * 100) : 0;
  const decision = profit >= 6 && roi >= 80 ? "BUY" : profit < 3 || roi < 35 ? "SKIP" : "MAYBE";
  return { opts, sale, fees, net, profit, roi, decision };
}

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand"><div className="mark">P2P</div><div><p className="eyebrow">Photo2Profit</p><h1>{title(screen)}</h1></div></div>
        <span className="pill">SCAN. SELL. PROFIT.</span>
      </header>
      <main>
        {screen === "home" && <HomeScreen setScreen={setScreen} />}
        {screen === "scanner" && <ScannerScreen />}
        {screen === "maker" && <MakerScreen />}
        {screen === "store" && <StoreScreen setScreen={setScreen} />}
        {screen === "cart" && <CartScreen />}
        {screen === "dashboard" && <DashboardScreen />}
      </main>
      <nav className="tabs">
        <Tab active={screen==="home"} label="Home" icon={<Home/>} onClick={()=>setScreen("home")} />
        <Tab active={screen==="scanner"} label="Scan" icon={<ScanLine/>} onClick={()=>setScreen("scanner")} />
        <Tab active={screen==="maker"} label="Maker" icon={<ImagePlus/>} onClick={()=>setScreen("maker")} />
        <Tab active={screen==="store"} label="Store" icon={<Store/>} onClick={()=>setScreen("store")} />
        <Tab active={screen==="dashboard"} label="Dash" icon={<ClipboardList/>} onClick={()=>setScreen("dashboard")} />
      </nav>
    </div>
  );
}
function title(s:Screen) { return {home:"Profit Command Center", scanner:"AI Scanner", maker:"AI Product Maker", store:"Mini Storefront", cart:"Cart & Checkout", dashboard:"Seller Dashboard"}[s]; }
function Tab({active,label,icon,onClick}:{active:boolean;label:string;icon:React.ReactNode;onClick:()=>void}) {
  return <button className={active ? "tab active":"tab"} onClick={onClick}>{icon}<span>{label}</span></button>
}

function HomeScreen({setScreen}:{setScreen:(s:Screen)=>void}) {
  return <div className="stack">
    <section className="hero"><div className="bigMark">P2P</div><p className="eyebrow gold">Photo2Profit</p><h2>Turn any thrift find into profit in seconds.</h2><p>Scan before you buy. Upload product photos. Price by ZIP code. Sell through your mini storefront.</p><button className="goldBtn" onClick={()=>setScreen("maker")}>Create My First Listing</button></section>
    <section className="stats"><div><b>12</b><span>Listings</span></div><div><b>4</b><span>Drafts</span></div><div><b>2</b><span>Orders</span></div><div><b>$186</b><span>Profit</span></div></section>
    <section className="toolGrid"><button className="tool navy" onClick={()=>setScreen("scanner")}><ScanLine/><h3>AI Scanner</h3><p>Take/upload a photo and get BUY / SKIP profit math.</p></button><button className="tool pink" onClick={()=>setScreen("maker")}><ImagePlus/><h3>Product Maker</h3><p>Upload a photo and create a resale listing.</p></button></section>
  </div>
}

function UploadBox({image,setImage,camera}:{image:string;setImage:(s:string)=>void;camera?:boolean}) {
  function upload(e:ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  }
  return <section className="upload"><div className="preview">{image ? <img src={image}/> : <div><ImagePlus/><span>{camera ? "Take or upload item photo" : "Upload product photo"}</span></div>}</div><label className="uploadBtn">{camera ? <Camera/> : <ImagePlus/>}{camera ? "Take / Upload Photo" : "Upload Product Photo"}<input type="file" accept="image/*" capture={camera ? "environment" : undefined} onChange={upload}/></label></section>
}

function PricingPanel({category,scanner=false}:{category:Category;scanner?:boolean}) {
  const [zip,setZip] = useState("95901");
  const [mode,setMode] = useState<Mode>(scanner ? "fast_online" : "local_thrift");
  const [cost,setCost] = useState(scanner ? 5 : 0);
  const p = useMemo(()=>priceEngine(category,mode,zip,cost),[category,mode,zip,cost]);
  return <section className="card">
    <div className="priceTop"><div><p className="eyebrow">Photo2Profit Pricing</p><h2 className="price">${p.sale.toFixed(2)}</h2><p>{mode === "local_thrift" ? "Default thrift price: low enough to move, high enough to profit." : `${label(mode)} pricing based on ZIP and resale speed.`}</p></div>{scanner && <strong className={`decision ${p.decision.toLowerCase()}`}>{p.decision}</strong>}</div>
    <div className="fields"><label>ZIP Code<input value={zip} onChange={e=>setZip(e.target.value)}/></label>{scanner && <label>Buy Cost<input type="number" value={cost} onChange={e=>setCost(Number(e.target.value || 0))}/></label>}</div>
    <div className="modes">{Object.entries(p.opts).map(([k,o])=><button key={k} onClick={()=>setMode(k as Mode)} className={mode===k ? "mode active":"mode"}><span>{o.label}</span><b>${o.rec.toFixed(2)}</b><small>${o.low.toFixed(2)}–${o.high.toFixed(2)}</small></button>)}</div>
    {scanner && <div className="profit"><div><span>Fees</span><b>${p.fees.toFixed(2)}</b></div><div><span>Net</span><b>${p.net.toFixed(2)}</b></div><div><span>Profit</span><b>${p.profit.toFixed(2)}</b></div><div><span>ROI</span><b>{p.roi}%</b></div></div>}
  </section>
}

function MakerScreen() {
  const [image,setImage] = useState("");
  const [name,setName] = useState("Vogue Graphic Cropped Knit Hoodie");
  const category = categoryFromName(name);
  return <div className="stack">
    <section className="section"><p className="eyebrow">AI Product Maker</p><h2>Upload a photo. Create a listing.</h2><p>Original image is preserved. Product is shown on a clean white selling stage.</p></section>
    <UploadBox image={image} setImage={setImage}/>
    {image && <section className="stage"><p className="eyebrow">Clean White Product Stage</p><div><img src={image}/></div></section>}
    <section className="card"><label>Title<input value={name} onChange={e=>setName(e.target.value)}/></label><label>Description<textarea value={`${name}. Clean resale-ready item photographed for online selling. Confirm size, brand, measurements, and condition before purchase.`}/></label><button className="primary"><WandSparkles/> Generate / Save Listing</button></section>
    <section className="listing"><div>{image ? <img src={image}/> : "No photo yet"}</div><article><p className="eyebrow">Mini Product Page</p><h2>{name}</h2><p>Clean resale-ready item for thrift, local pickup, and online selling.</p></article></section>
    <PricingPanel category={category}/>
  </div>
}

function ScannerScreen() {
  const [image,setImage] = useState("");
  const [name,setName] = useState("Vogue Graphic Cropped Knit Hoodie");
  const [scanned,setScanned] = useState(false);
  const category = categoryFromName(name);
  return <div className="stack">
    <section className="section"><p className="eyebrow">AI Scanner</p><h2>Should I buy this?</h2><p>Take/upload a thrift photo, enter what it is, then run profit math.</p></section>
    <UploadBox image={image} setImage={setImage} camera/>
    <section className="card"><label>What is it?<input value={name} onChange={e=>setName(e.target.value)}/></label><button className="primary" onClick={()=>setScanned(true)}><ScanLine/> Run Profit Scan</button></section>
    {scanned && <><section className="listing"><div>{image ? <img src={image}/> : <ScanLine/>}</div><article><p className="eyebrow">Scan Result</p><h2>{name}</h2><p>Category: {category.replace("_"," ")}. Use the profit math below before buying.</p></article></section><PricingPanel category={category} scanner/></>}
  </div>
}

function StoreScreen({setScreen}:{setScreen:(s:Screen)=>void}) {
  const items = ["Vogue Graphic Cropped Knit Hoodie","Classic Blue Straight Leg Jeans","Neutral Everyday Shoulder Bag"];
  return <div className="stack">
    <section className="storeHero"><div><div className="bigMark small">P2P</div><p className="eyebrow gold">Mini Storefront</p><h2>Michelle’s Finds</h2><p>Affordable thrift finds with shipping and local pickup.</p></div><button className="cartBtn" onClick={()=>setScreen("cart")}><ShoppingCart/> Cart</button></section>
    <section className="storeGrid">{items.map((x,i)=><article className="item" key={x}><div>P2P</div><h3>{x}</h3><p>Clean resale-ready thrift find.</p><b>${[10,14,18][i]}.00</b><button className="primary">Add to Cart</button></article>)}</section>
    <section className="card"><h2>Buyer Options</h2><div className="options"><div><Truck/> Shipping</div><div><MapPin/> Local Pickup</div></div></section>
  </div>
}

function CartScreen() {
  return <div className="stack"><section className="card"><p className="eyebrow">Cart</p><h2>Your Order</h2><div className="line"><span>Vogue Graphic Cropped Knit Hoodie</span><b>$10.00</b></div><div className="total"><span>Total</span><b>$10.00</b></div></section><section className="card"><h2>Checkout</h2><div className="options"><button><Truck/> Ship</button><button><MapPin/> Local Pickup</button></div><button className="goldBtn"><CreditCard/> Continue to Payment</button></section></div>
}
function DashboardScreen() {
  return <div className="stack"><section className="stats"><div><b>$248</b><span>Sales</span></div><div><b>12</b><span>Active</span></div><div><b>4</b><span>Drafts</span></div><div><b>2</b><span>Orders</span></div></section><section className="card"><p className="eyebrow">Seller Dashboard</p><h2>Today’s Money Moves</h2><p>Publish drafts, confirm pickup, ship orders, and scan new thrift finds.</p></section></div>
}

createRoot(document.getElementById("root")!).render(<App />);
