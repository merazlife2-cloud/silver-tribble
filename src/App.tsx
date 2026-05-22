import React, { FormEvent, useMemo, useState } from 'react'

type Screen =
  | 'home'
  | 'scanner'
  | 'product-maker'
  | 'store'
  | 'cart'
  | 'dashboard'
  | 'orders'
  | 'drafts'
  | 'saved-scans'

type Product = {
  id: string
  title: string
  description: string
  price: number
  zip: string
  status: 'live' | 'draft'
}

type CartItem = {
  product: Product
  quantity: number
}

type Order = {
  id: string
  date: string
  total: number
  status: string
  items: number
}

type ScanRecord = {
  id: string
  photoLabel: string
  valueEstimate: string
  date: string
}

const initialProducts: Product[] = [
  {
    id: 'p1',
    title: 'Vintage Leather Messenger Bag',
    description: 'High-quality vintage bag with durable brass hardware.',
    price: 64.99,
    zip: '90210',
    status: 'live',
  },
  {
    id: 'p2',
    title: '90s Graphic Sweatshirt',
    description: 'Cozy thrifted sweatshirt with bold retro style.',
    price: 29.5,
    zip: '10001',
    status: 'live',
  },
]

const initialDrafts: Product[] = [
  {
    id: 'd1',
    title: 'Unbranded Denim Jacket',
    description: 'Classic denim jacket waiting for a polished product description.',
    price: 0,
    zip: '60614',
    status: 'draft',
  },
]

const initialOrders: Order[] = [
  { id: 'o1001', date: 'May 18', total: 94.48, status: 'Shipped', items: 2 },
  { id: 'o1002', date: 'May 21', total: 42.00, status: 'Processing', items: 1 },
]

const initialScans: ScanRecord[] = [
  { id: 's1', photoLabel: 'Brass Lamp', valueEstimate: '$28 - $34', date: '2026-05-20' },
  { id: 's2', photoLabel: 'Ceramic Vase', valueEstimate: '$18 - $22', date: '2026-05-19' },
]

const navItems: { key: Screen; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'scanner', label: 'Scanner' },
  { key: 'product-maker', label: 'Product Maker' },
  { key: 'store', label: 'Store' },
  { key: 'cart', label: 'Cart' },
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'orders', label: 'Orders' },
  { key: 'drafts', label: 'Drafts' },
  { key: 'saved-scans', label: 'Saved Scans' },
]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [drafts, setDrafts] = useState<Product[]>(initialDrafts)
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [scans, setScans] = useState<ScanRecord[]>(initialScans)
  const [scannerInput, setScannerInput] = useState('')
  const [productForm, setProductForm] = useState({ title: '', description: '', price: '', zip: '' })
  const [checkoutEmail, setCheckoutEmail] = useState('')
  const [checkoutNotes, setCheckoutNotes] = useState('')

  const featuredProducts = useMemo(
    () => products.filter((product) => product.status === 'live'),
    [products],
  )

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart],
  )

  const handleScanSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!scannerInput.trim()) return

    const newScan: ScanRecord = {
      id: `s${scans.length + 1}`,
      photoLabel: scannerInput.trim(),
      valueEstimate: '$22 - $28',
      date: new Date().toISOString().slice(0, 10),
    }

    setScans([newScan, ...scans])
    setScannerInput('')
    setScreen('saved-scans')
  }

  const handleAddToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }
      return [...current, { product, quantity: 1 }]
    })
    setScreen('cart')
  }

  const handleRemoveFromCart = (productId: string) => {
    setCart((current) => current.filter((item) => item.product.id !== productId))
  }

  const handleProductSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!productForm.title.trim() || !productForm.description.trim()) return

    const newProduct: Product = {
      id: `p${products.length + drafts.length + 1}`,
      title: productForm.title.trim(),
      description: productForm.description.trim(),
      price: Number(productForm.price) || 0,
      zip: productForm.zip.trim() || '00000',
      status: 'live',
    }

    setProducts([newProduct, ...products])
    setProductForm({ title: '', description: '', price: '', zip: '' })
    setScreen('store')
  }

  const handleSaveDraft = () => {
    if (!productForm.title.trim() || !productForm.description.trim()) return

    const draft: Product = {
      id: `d${drafts.length + 1}`,
      title: productForm.title.trim(),
      description: productForm.description.trim(),
      price: Number(productForm.price) || 0,
      zip: productForm.zip.trim() || '00000',
      status: 'draft',
    }

    setDrafts([draft, ...drafts])
    setProductForm({ title: '', description: '', price: '', zip: '' })
    setScreen('drafts')
  }

  const handleCheckout = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!checkoutEmail.trim() || cart.length === 0) return

    const newOrder: Order = {
      id: `o${orders.length + 1001}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      total: cartTotal,
      status: 'Processing',
      items: cart.reduce((sum, item) => sum + item.quantity, 0),
    }

    setOrders([newOrder, ...orders])
    setCart([])
    setCheckoutEmail('')
    setCheckoutNotes('')
    setScreen('orders')
  }

  const renderHome = () => (
    <section>
      <div className="hero-card">
        <h2>Photo2Profit</h2>
        <p>
          AI-powered reseller tools for scanning thrift finds, pricing by ZIP code, and selling
          through your own storefront.
        </p>
      </div>

      <div className="dashboard-grid">
        <article>
          <h3>Sell smarter</h3>
          <p>Use the scanner to identify profitable inventory and list items quickly.</p>
        </article>
        <article>
          <h3>Manage inventory</h3>
          <p>Keep product drafts, live listings, and saved scans all in one place.</p>
        </article>
        <article>
          <h3>Track sales</h3>
          <p>Review orders and revenue from your mini storefront in the dashboard.</p>
        </article>
      </div>
    </section>
  )

  const renderScanner = () => (
    <section>
      <h2>Scanner</h2>
      <p>Enter an item name or photo label to save a new scan for review.</p>
      <form className="panel-form" onSubmit={handleScanSubmit}>
        <label>
          Item or photo label
          <input
            value={scannerInput}
            onChange={(event) => setScannerInput(event.target.value)}
            placeholder="e.g. Vintage camera"
          />
        </label>
        <button type="submit">Save scan</button>
      </form>
      <div className="panel-card">
        <h3>Recent scan tips</h3>
        <ul>
          <li>Search thrift items by clear labels and estimate resale value.</li>
          <li>Save scans to compare prices and choose your next listing.</li>
        </ul>
      </div>
    </section>
  )

  const renderProductMaker = () => (
    <section>
      <h2>Product Maker</h2>
      <p>Create live items or save drafts while you prepare listings.</p>
      <form className="product-form" onSubmit={handleProductSubmit}>
        <label>
          Product title
          <input
            value={productForm.title}
            onChange={(event) => setProductForm({ ...productForm, title: event.target.value })}
            placeholder="Vintage denim jacket"
          />
        </label>
        <label>
          Description
          <textarea
            value={productForm.description}
            onChange={(event) => setProductForm({ ...productForm, description: event.target.value })}
            placeholder="Describe condition, brand, and fit."
          />
        </label>
        <div className="form-row">
          <label>
            Price
            <input
              type="number"
              min="0"
              step="0.01"
              value={productForm.price}
              onChange={(event) => setProductForm({ ...productForm, price: event.target.value })}
              placeholder="0.00"
            />
          </label>
          <label>
            ZIP code
            <input
              value={productForm.zip}
              onChange={(event) => setProductForm({ ...productForm, zip: event.target.value })}
              placeholder="94105"
            />
          </label>
        </div>
        <div className="button-row">
          <button type="submit">Publish listing</button>
          <button type="button" onClick={handleSaveDraft} className="secondary">
            Save draft
          </button>
        </div>
      </form>
    </section>
  )

  const renderStore = () => (
    <section>
      <h2>Store</h2>
      <p>Browse your published items and add them to the checkout cart.</p>
      <div className="store-grid">
        {featuredProducts.map((product) => (
          <article key={product.id} className="product-card">
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p className="product-meta">ZIP {product.zip}</p>
            <div className="product-action">
              <span>{formatCurrency(product.price)}</span>
              <button onClick={() => handleAddToCart(product)}>Add to cart</button>
            </div>
          </article>
        ))}
        {featuredProducts.length === 0 && <p>No live products are available yet.</p>}
      </div>
    </section>
  )

  const renderCart = () => (
    <section>
      <h2>Cart / Checkout</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty. Add products from the Store screen.</p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div key={item.product.id} className="cart-item">
                <div>
                  <strong>{item.product.title}</strong>
                  <p>{item.quantity} × {formatCurrency(item.product.price)}</p>
                </div>
                <button onClick={() => handleRemoveFromCart(item.product.id)} className="secondary">
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="checkout-panel">
            <div className="checkout-summary">
              <p>Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
              <p>Total: {formatCurrency(cartTotal)}</p>
            </div>
            <form onSubmit={handleCheckout} className="panel-form">
              <label>
                Email
                <input
                  type="email"
                  value={checkoutEmail}
                  onChange={(event) => setCheckoutEmail(event.target.value)}
                  placeholder="seller@example.com"
                />
              </label>
              <label>
                Notes
                <textarea
                  value={checkoutNotes}
                  onChange={(event) => setCheckoutNotes(event.target.value)}
                  placeholder="Shipping instructions or local pickup details"
                />
              </label>
              <button type="submit">Place order</button>
            </form>
          </div>
        </>
      )}
    </section>
  )

  const renderDashboard = () => (
    <section>
      <h2>Dashboard</h2>
      <div className="dashboard-grid">
        <article>
          <h3>Total Revenue</h3>
          <p>{formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}</p>
        </article>
        <article>
          <h3>Active Orders</h3>
          <p>{orders.filter((order) => order.status !== 'Delivered').length}</p>
        </article>
        <article>
          <h3>Live listings</h3>
          <p>{featuredProducts.length}</p>
        </article>
        <article>
          <h3>Saved scans</h3>
          <p>{scans.length}</p>
        </article>
      </div>
    </section>
  )

  const renderOrders = () => (
    <section>
      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet. Complete checkout to create your first sale.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <h3>{order.id}</h3>
              <p>{order.date}</p>
              <p>{order.items} items · {formatCurrency(order.total)}</p>
              <span className="status-pill">{order.status}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )

  const renderDrafts = () => (
    <section>
      <h2>Drafts</h2>
      {drafts.length === 0 ? (
        <p>No draft listings yet. Use Product Maker to create one.</p>
      ) : (
        <div className="draft-list">
          {drafts.map((draft) => (
            <div key={draft.id} className="draft-card">
              <h3>{draft.title}</h3>
              <p>{draft.description}</p>
              <p className="product-meta">ZIP {draft.zip}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )

  const renderSavedScans = () => (
    <section>
      <h2>Saved Scans</h2>
      {scans.length === 0 ? (
        <p>No scans saved yet. Start in the Scanner screen.</p>
      ) : (
        <div className="scan-list">
          {scans.map((scan) => (
            <div key={scan.id} className="scan-card">
              <h3>{scan.photoLabel}</h3>
              <p>{scan.valueEstimate}</p>
              <p>{scan.date}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )

  const content = useMemo(() => {
    switch (screen) {
      case 'home':
        return renderHome()
      case 'scanner':
        return renderScanner()
      case 'product-maker':
        return renderProductMaker()
      case 'store':
        return renderStore()
      case 'cart':
        return renderCart()
      case 'dashboard':
        return renderDashboard()
      case 'orders':
        return renderOrders()
      case 'drafts':
        return renderDrafts()
      case 'saved-scans':
        return renderSavedScans()
      default:
        return renderHome()
    }
  }, [screen, featuredProducts, cart, productForm, checkoutEmail, checkoutNotes, drafts, scans, orders])

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <h1>Photo2Profit</h1>
          <p>Thrift resale manager</p>
        </div>
        <nav>
          {navItems.map((item) => (
            <button
              key={item.key}
              className={screen === item.key ? 'active' : ''}
              onClick={() => setScreen(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div>
            <h2>{navItems.find((item) => item.key === screen)?.label ?? 'Home'}</h2>
            <p>Manage your reseller workflow from scans to checkout.</p>
          </div>
          <div className="header-meta">
            <span>{featuredProducts.length} live listings</span>
            <span>{orders.length} orders</span>
          </div>
        </header>
        {content}
      </main>
    </div>
  )
}
