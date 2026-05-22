import { useMemo, useState } from "react";
import { getPhoto2ProfitPrice, PricingMode, Category, Condition } from "../lib/pricing";

type Props = {
  category: Category;
  condition: Condition;
  defaultMode?: PricingMode;
  scanner?: boolean;
};

export function PricingPanel({ category, condition, defaultMode = "local_thrift", scanner = false }: Props) {
  const [zipCode, setZipCode] = useState("95901");
  const [mode, setMode] = useState<PricingMode>(defaultMode);
  const [buyCost, setBuyCost] = useState(scanner ? 5 : 0);

  const pricing = useMemo(() => getPhoto2ProfitPrice({
    zipCode,
    category,
    condition,
    brandKnown: false,
    hasFlaws: false,
    styledPhoto: true,
    mode,
    acquisitionCost: buyCost,
  }), [zipCode, category, condition, mode, buyCost]);

  return (
    <section className="card pricing">
      <div className="priceTop">
        <div>
          <p className="eyebrow">Photo2Profit Pricing</p>
          <h2>${pricing.displayPrice.toFixed(2)}</h2>
          <p>{pricing.reason}</p>
        </div>
        {scanner && <div className={`actionBadge ${pricing.math.recommendation.toLowerCase()}`}>{pricing.math.recommendation}</div>}
      </div>

      <div className="fieldGrid">
        <label>ZIP code<input value={zipCode} onChange={(e) => setZipCode(e.target.value)} /></label>
        {scanner && <label>Buy cost<input type="number" value={buyCost} onChange={(e) => setBuyCost(Number(e.target.value || 0))} /></label>}
      </div>

      <div className="modeGrid">
        {Object.entries(pricing.options).map(([key, option]) => (
          <button key={key} className={mode === key ? "mode active" : "mode"} onClick={() => setMode(key as PricingMode)}>
            <span>{option.label}</span>
            <strong>${option.recommended.toFixed(2)}</strong>
            <small>${option.low.toFixed(2)}–${option.high.toFixed(2)}</small>
          </button>
        ))}
      </div>

      {scanner && (
        <div className="mathGrid">
          <div><span>Fees</span><strong>${pricing.math.estimatedFees.toFixed(2)}</strong></div>
          <div><span>Net payout</span><strong>${pricing.math.netPayout.toFixed(2)}</strong></div>
          <div><span>Profit</span><strong>${pricing.math.netProfit.toFixed(2)}</strong></div>
          <div><span>ROI</span><strong>{pricing.math.roiPercent}%</strong></div>
        </div>
      )}

      <p className="note">{pricing.options[mode].note}</p>
    </section>
  );
}
