// types for the portfolio dashboard

export interface StockHolding {
  id: number;
  name: string;
  purchasePrice: number;
  qty: number;
  sector: string;
  nseCode: string;
}

export interface StockMarketData {
  cmp: number | null;
  peRatio: number | null;
  latestEarnings: number | null;
}

// combined type - holding + live market data
export interface StockWithData extends StockHolding {
  investment: number;
  portfolioPercent: number;
  cmp: number | null;
  presentValue: number | null;
  gainLoss: number | null;
  gainLossPercent: number | null;
  peRatio: number | null;
  latestEarnings: number | null;
}

export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number | null;
  totalGainLoss: number | null;
  stocks: StockWithData[];
}

// api response shape
export interface ApiResponse {
  stocks: StockWithData[];
  sectors: SectorSummary[];
  totalInvestment: number;
  totalPresentValue: number | null;
  totalGainLoss: number | null;
  lastUpdated: string;
  errors: string[];
}
