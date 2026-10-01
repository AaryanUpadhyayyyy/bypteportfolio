"use client";

import { formatINR, formatPct } from "@/lib/formatters";

interface Props {
  totalInvestment: number;
  totalPresentValue: number | null;
  totalGainLoss: number | null;
  stockCount: number;
  lastUpdated: string;
}

export default function SummaryCards({
  totalInvestment, totalPresentValue, totalGainLoss,
  stockCount, lastUpdated,
}: Props) {
  const glPct = totalGainLoss !== null && totalInvestment > 0
    ? totalGainLoss / totalInvestment : null;
  const isGain = totalGainLoss !== null && totalGainLoss >= 0;

  let timeStr = "—";
  try {
    timeStr = new Date(lastUpdated).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  } catch { }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      <div className="card p-4">
        <div className="stat-label">Total Investment</div>
        <div className="stat-value">{formatINR(totalInvestment)}</div>
        <div className="stat-hint">{stockCount} stocks</div>
      </div>

      <div className="card p-4">
        <div className="stat-label">Present Value</div>
        <div className="stat-value">{formatINR(totalPresentValue)}</div>
        <div className="stat-hint">Updated: {timeStr}</div>
      </div>

      <div className="card p-4">
        <div className="stat-label">Total Gain / Loss</div>
        <div className={`stat-value ${isGain ? "text-gain" : "text-loss"}`}>
          {formatINR(totalGainLoss)}
        </div>
        <div className={`stat-hint font-medium ${isGain ? "text-gain" : "text-loss"}`}>
          {formatPct(glPct)}
        </div>
      </div>

      <div className="card p-4">
        <div className="stat-label">Market Status</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="live-dot" />
          <span className="text-base font-semibold">Live</span>
        </div>
        <div className="stat-hint">Refreshes every 15s</div>
      </div>
    </div>
  );
}
