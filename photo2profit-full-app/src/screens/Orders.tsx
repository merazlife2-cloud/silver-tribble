export function Orders() {
  return (
    <div className="stack">
      <section className="card">
        <p className="eyebrow">Shipping Queue</p>
        <h2>1 order ready</h2>
        <p>Pack item, confirm address, and mark shipped.</p>
      </section>
      <section className="card">
        <p className="eyebrow">Local Pickup Queue</p>
        <h2>1 pickup pending</h2>
        <p>Confirm pickup time and location before releasing item.</p>
      </section>
    </div>
  );
}
