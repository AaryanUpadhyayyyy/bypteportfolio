export function formatINR(val: number | null): string {
  if (val === null || val === undefined || isNaN(val)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

export function formatNum(val: number | null, decimals = 2): string {
  if (val === null || val === undefined || isNaN(val)) return "—";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

export function formatPct(val: number | null): string {
  if (val === null || val === undefined || isNaN(val)) return "—";
  const sign = val > 0 ? "+" : "";
  return sign + (val * 100).toFixed(2) + "%";
}

export function formatWeight(val: number | null): string {
  if (val === null || val === undefined || isNaN(val)) return "—";
  return (val * 100).toFixed(2) + "%";
}
