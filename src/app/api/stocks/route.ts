import { NextResponse } from "next/server";
import holdings from "@/lib/portfolioData";
import { getAllStocksData } from "@/lib/fetchStockData";
import { StockWithData, SectorSummary, ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const errors: string[] = [];

  try {
    const marketData = await getAllStocksData(holdings);

    const totalInvestment = holdings.reduce(
      (sum, h) => sum + h.purchasePrice * h.qty, 0
    );

    const stocks: StockWithData[] = holdings.map((h) => {
      const mkt = marketData.get(h.nseCode);
      const investment = h.purchasePrice * h.qty;
      let portfolioPercent = 0;
      
      if (totalInvestment > 0) {
        portfolioPercent = investment / totalInvestment;
      }

      const cmp = mkt?.cmp ?? null;
      const peRatio = mkt?.peRatio ?? null;
      const latestEarnings = mkt?.latestEarnings ?? null;

      let presentValue = null;
      let gainLoss = null;
      let gainLossPercent = null;

      if (cmp !== null) {
        presentValue = cmp * h.qty;
        gainLoss = presentValue - investment;
        if (investment > 0) {
            gainLossPercent = gainLoss / investment;
        }
      } else {
        errors.push(`missing CMP for ${h.name}`);
      }

      return {
        ...h, investment, portfolioPercent,
        cmp, presentValue, gainLoss, gainLossPercent,
        peRatio, latestEarnings,
      };
    });

    const sectorMap = new Map<string, StockWithData[]>();
    for (const s of stocks) {
      if (!sectorMap.has(s.sector)) {
        sectorMap.set(s.sector, []);
      }
      sectorMap.get(s.sector)!.push(s);
    }

    const sectors: SectorSummary[] = [...sectorMap.entries()].map(
      ([sector, items]) => {
        const totalInv = items.reduce((s, x) => s + x.investment, 0);
        
        let totalPV: number | null = null;
        const validStocks = items.filter((x) => x.presentValue !== null);
        
        if (validStocks.length > 0) {
            totalPV = validStocks.reduce((s, x) => s + (x.presentValue ?? 0), 0);
        }

        return {
          sector,
          totalInvestment: totalInv,
          totalPresentValue: totalPV,
          totalGainLoss: totalPV !== null ? totalPV - totalInv : null,
          stocks: items,
        };
      }
    );

    let totalPV: number | null = 0;
    const allValid = stocks.filter(s => s.presentValue !== null);
    
    if (allValid.length > 0) {
        totalPV = allValid.reduce((s, x) => s + (x.presentValue ?? 0), 0);
    } else {
        totalPV = null;
    }
    
    const totalGL = totalPV !== null ? totalPV - totalInvestment : null;

    const res: ApiResponse = {
      stocks,
      sectors,
      totalInvestment,
      totalPresentValue: totalPV,
      totalGainLoss: totalGL,
      lastUpdated: new Date().toISOString(),
      errors,
    };

    return NextResponse.json(res, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch data", details: String(err) },
      { status: 500 }
    );
  }
}
