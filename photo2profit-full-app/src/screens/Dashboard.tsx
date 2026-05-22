export function Dashboard() {
  return (
    <div className="stack">
      <section className="stats">
        <div><strong>$248</strong><span>Sales</span></div>
        <div><strong>12</strong><span>Active</span></div>
        <div><strong>1</strong><span>Ship</span></div>
        <div><strong>1</strong><span>Pickup</span></div>
      </section>
      <section className="card">
        <h2>Today’s Seller Tasks</h2>
        <p>Publish 4 drafts, confirm 1 pickup, ship 1 order, and review 2 saved scans.</p>
      </section>
      <section className="card">
        <h2>Money Move</h2>
        <p>Bundle lower-priced local thrift items together to raise average order value and reduce stale inventory.</p>
      </section>
    </div>
  );
}
