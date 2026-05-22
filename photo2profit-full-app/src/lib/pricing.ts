export type PricingMode = "yard_sale" | "local_thrift" | "fast_online" | "stretch_online";
export type Condition = "poor" | "fair" | "good" | "great" | "excellent";
export type Category = "women_sweater" | "hoodie" | "shoes" | "jeans" | "bags" | "home" | "generic";

export type PricingInput = {
  zipCode?: string;
  category: Category;
  condition: Condition;
  brandKnown?: boolean;
  hasFlaws?: boolean;
  styledPhoto?: boolean;
  mode?: PricingMode;
  acquisitionCost?: number;
};

export type PricingResult = {
  selectedMode: PricingMode;
  displayPrice: number;
  range: { low: number; high: number };
  options: Record<PricingMode, {
    label: string;
    low: number;
    high: number;
    recommended: number;
    note: string;
  }>;
  math: {
    acquisitionCost: number;
    estimatedFees: number;
    estimatedShipping: number;
    netPayout: number;
    netProfit: number;
    roiPercent: number;
    recommendation: "BUY" | "MAYBE" | "SKIP";
  };
  confidence: "low" | "medium" | "high";
  reason: string;
};

const ranges: Record<Category, Record<PricingMode, { low: number; high: number }>> = {
  women_sweater: {
    yard_sale: { low: 2, high: 4 },
    local_thrift: { low: 5, high: 8 },
    fast_online: { low: 9, high: 12 },
    stretch_online: { low: 12, high: 14 },
  },
  hoodie: {
    yard_sale: { low: 2, high: 5 },
    local_thrift: { low: 5, high: 9 },
    fast_online: { low: 10, high: 14 },
    stretch_online: { low: 14, high: 18 },
  },
  shoes: {
    yard_sale: { low: 3, high: 8 },
    local_thrift: { low: 8, high: 16 },
    fast_online: { low: 18, high: 35 },
    stretch_online: { low: 35, high: 55 },
  },
  jeans: {
    yard_sale: { low: 2, high: 6 },
    local_thrift: { low: 6, high: 12 },
    fast_online: { low: 14, high: 24 },
    stretch_online: { low: 25, high: 35 },
  },
  bags: {
    yard_sale: { low: 3, high: 8 },
    local_thrift: { low: 8, high: 18 },
    fast_online: { low: 18, high: 35 },
    stretch_online: { low: 35, high: 60 },
  },
  home: {
    yard_sale: { low: 1, high: 5 },
    local_thrift: { low: 4, high: 12 },
    fast_online: { low: 12, high: 25 },
    stretch_online: { low: 25, high: 40 },
  },
  generic: {
    yard_sale: { low: 2, high: 5 },
    local_thrift: { low: 5, high: 10 },
    fast_online: { low: 10, high: 18 },
    stretch_online: { low: 18, high: 30 },
  },
};

function zipMultiplier(zipCode?: string) {
  const zip = (zipCode || "").trim();
  if (["95901", "95991", "95993", "95961"].some(z => zip.startsWith(z))) return 0.9;
  if (zip.startsWith("958") || zip.startsWith("956") || zip.startsWith("957")) return 1.05;
  if (zip.startsWith("94") || zip.startsWith("95")) return 1.15;
  if (zip.startsWith("90") || zip.startsWith("91")) return 1.1;
  return 1;
}

function conditionMultiplier(condition: Condition) {
  return { poor: 0.5, fair: 0.7, good: 1, great: 1.12, excellent: 1.25 }[condition];
}

function label(mode: PricingMode) {
  return {
    yard_sale: "Yard Sale",
    local_thrift: "Local Thrift",
    fast_online: "Fast Online",
    stretch_online: "Stretch Online",
  }[mode];
}

function note(mode: PricingMode) {
  return {
    yard_sale: "Fastest cash. Good for bundles and low buyer resistance.",
    local_thrift: "Default Photo2Profit price. Best balance of quick sale and profit.",
    fast_online: "Good for Facebook Marketplace, Poshmark, Mercari, Depop, and local online buyers.",
    stretch_online: "Only use with clean photos, strong styling, and patient selling.",
  }[mode];
}

function roundSmart(n: number) {
  if (n < 10) return Math.max(1, Math.round(n));
  return Math.max(1, Math.round(n) - 0.01);
}

function clamp(n: number, low: number, high: number) {
  return Math.min(Math.max(n, low), high);
}

export function getPhoto2ProfitPrice(input: PricingInput): PricingResult {
  const mode = input.mode || "local_thrift";
  const categoryRanges = ranges[input.category] || ranges.generic;

  const multiplier =
    zipMultiplier(input.zipCode) *
    conditionMultiplier(input.condition) *
    (input.hasFlaws ? 0.85 : 1) *
    (input.brandKnown ? 1.1 : 0.95) *
    (input.styledPhoto ? 1.08 : 1);

  const options = Object.entries(categoryRanges).reduce((acc, [key, value]) => {
    const typed = key as PricingMode;
    const low = roundSmart(value.low * multiplier);
    const high = Math.max(low, roundSmart(value.high * multiplier));
    const recommended = clamp(roundSmart(low + (high - low) * 0.55), low, high);
    acc[typed] = { label: label(typed), low, high, recommended, note: note(typed) };
    return acc;
  }, {} as PricingResult["options"]);

  const selected = options[mode];
  const salePrice = selected.recommended;
  const acquisitionCost = Number(input.acquisitionCost || 0);
  const online = mode === "fast_online" || mode === "stretch_online";
  const estimatedFees = online ? salePrice * 0.13 + 0.4 : 0;
  const estimatedShipping = online ? 0 : 0;
  const netPayout = Math.max(0, salePrice - estimatedFees - estimatedShipping);
  const netProfit = netPayout - acquisitionCost;
  const roiPercent = acquisitionCost > 0 ? Math.round((netProfit / acquisitionCost) * 100) : 0;

  let recommendation: "BUY" | "MAYBE" | "SKIP" = "MAYBE";
  if (netProfit >= 6 && roiPercent >= 80) recommendation = "BUY";
  if (netProfit < 3 || roiPercent < 35) recommendation = "SKIP";

  return {
    selectedMode: mode,
    displayPrice: salePrice,
    range: { low: selected.low, high: selected.high },
    options,
    math: { acquisitionCost, estimatedFees, estimatedShipping, netPayout, netProfit, roiPercent, recommendation },
    confidence: input.condition === "good" || input.condition === "great" ? "high" : "medium",
    reason: mode === "local_thrift"
      ? `Default smart price: $${salePrice.toFixed(2)}. Priced low enough to move, high enough to profit.`
      : `${selected.label} price: $${salePrice.toFixed(2)} based on ZIP, condition, resale speed, and photo quality.`,
  };
}
