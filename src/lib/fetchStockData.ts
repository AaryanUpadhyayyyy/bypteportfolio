import { StockHolding, StockMarketData } from "@/types";

const cache = new Map<string, { data: StockMarketData; time: number }>();
const CACHE_MS = 15000;

function getFromCache(key: string): StockMarketData | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.time > CACHE_MS) return null;
  return entry.data;
}

let yf: any = null;

async function initYahoo() {
  if (yf) return yf;
  const YahooFinance = (await import("yahoo-finance2")).default;
  yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });
  return yf;
}

async function fetchCMP(ticker: string): Promise<number | null> {
  try {
    const yahoo = await initYahoo();
    const res = await yahoo.quote(ticker + ".NS");
    return res?.regularMarketPrice ?? null;
  } catch (e) {
    console.error(`Yahoo failed for ${ticker}:`, e);
    return null;
  }
}

async function fetchGoogleData(ticker: string) {
  let peRatio: number | null = null;
  let eps: number | null = null;

  try {
    const url = `https://www.google.com/finance/quote/${ticker}:NSE`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!res.ok) {
      console.log(`google returned ${res.status} for ${ticker}`);
      return { peRatio, eps };
    }

    const html = await res.text();

    const peMatch = html.match(/P\/E ratio[\s\S]*?<div[^>]*>([0-9,.]+)<\/div>/i);
    if (peMatch) {
      peRatio = parseFloat(peMatch[1].replace(/,/g, ""));
    }

    const epsMatch = html.match(/EPS \(TTM\)[\s\S]*?<div[^>]*>([-0-9,.]+)<\/div>/i);
    if (epsMatch) {
      eps = parseFloat(epsMatch[1].replace(/,/g, ""));
    }
  } catch (err) {
    console.error(`google scrape failed for ${ticker}:`, err);
  }

  return { peRatio, eps };
}

export async function getStockData(stock: StockHolding): Promise<StockMarketData> {
  const cached = getFromCache(stock.nseCode);
  if (cached) return cached;

  const [cmp, goog] = await Promise.all([
    fetchCMP(stock.nseCode),
    fetchGoogleData(stock.nseCode),
  ]);

  const result: StockMarketData = {
    cmp,
    peRatio: goog.peRatio,
    latestEarnings: goog.eps,
  };

  cache.set(stock.nseCode, { data: result, time: Date.now() });
  return result;
}

export async function getAllStocksData(stocks: StockHolding[]) {
  const results = new Map<string, StockMarketData>();
  const BATCH_SIZE = 5;

  for (let i = 0; i < stocks.length; i += BATCH_SIZE) {
    const batch = stocks.slice(i, i + BATCH_SIZE);

    const batchData = await Promise.all(
      batch.map(async (s) => ({
        code: s.nseCode,
        data: await getStockData(s),
      }))
    );

    batchData.forEach((res) => results.set(res.code, res.data));

    if (i + BATCH_SIZE < stocks.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return results;
}
