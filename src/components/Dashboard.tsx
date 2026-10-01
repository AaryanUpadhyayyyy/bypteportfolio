"use client";

import { useState, useEffect, useCallback } from "react";
import { ApiResponse } from "@/types";
import SummaryCards from "./SummaryCards";
import PortfolioTable from "./PortfolioTable";

const REFRESH_MS = 15000; 

export default function Dashboard() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [dark, setDark] = useState(false);

  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      }
      const res = await fetch("/api/stocks");
      
      if (!res.ok) {
          throw new Error("Server error: " + res.status);
      }
      
      const json: ApiResponse = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      console.error("fetch failed..", err);
      setError(err.message || "Unknown error occurred");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { 
      loadData(); 
  }, [loadData]);

  useEffect(() => {
    const id = setInterval(() => {
        loadData(true);
    }, REFRESH_MS);
    return () => {
        clearInterval(id);
    }
  }, [loadData]);

  useEffect(() => {
    let saved = localStorage.getItem("theme");
    let prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    let nextState = !dark;
    setDark(nextState);
    document.documentElement.classList.toggle("dark", nextState);
    localStorage.setItem("theme", nextState ? "dark" : "light");
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between mb-5">
            <div className="skel h-7 w-48" />
            <div className="flex gap-2">
              <div className="skel h-8 w-8 rounded-md" />
              <div className="skel h-8 w-8 rounded-md" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="card p-4 space-y-2">
                <div className="skel h-3 w-16" />
                <div className="skel h-5 w-28" />
                <div className="skel h-2 w-12" />
              </div>
            ))}
          </div>

          <div className="card overflow-hidden">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="skel h-10 w-full" style={{ opacity: 1 - i * 0.07 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card p-8 text-center" style={{ maxWidth: 360 }}>
          <p style={{ fontSize: 40, marginBottom: "12px" }}>⚠️</p>
          <h2 className="text-lg font-semibold mb-2">Failed to Load</h2>
          <p className="text-sm mb-4" style={{ color: "var(--text-dim)" }}>{error}</p>
          <button
            onClick={() => { setLoading(true); loadData(); }}
            style={{ 
                background: "var(--blue)", 
                color: "#fff", 
                padding: "8px 20px", 
                borderRadius: "6px", 
                border: "none", 
                cursor: "pointer", 
                fontWeight: 500 
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null; 

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">Portfolio Dashboard</h1>
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>
              Real-time stock portfolio tracker
            </p>
          </div>
          <div className="flex items-center gap-2">
            {refreshing && (
              <span className="text-xs" style={{ color: "var(--text-faint)" }}>Updating...</span>
            )}
            <button onClick={() => loadData(true)} disabled={refreshing} className="icon-btn" title="Refresh">
              🔄
            </button>
            <button onClick={toggleTheme} className="icon-btn" title="Toggle theme">
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {data.errors && data.errors.length > 0 && (
          <div className="info-box">
            ℹ️ Could not fetch live data for {data.errors.length} stock(s). Those fields show &quot;—&quot;.
          </div>
        )}

        {error && (
          <div className="info-box" style={{ borderColor: "var(--red)", color: "var(--red)" }}>
            ⚠️ Refresh failed: {error}. Showing last known data.
          </div>
        )}

        <SummaryCards
          totalInvestment={data.totalInvestment}
          totalPresentValue={data.totalPresentValue}
          totalGainLoss={data.totalGainLoss}
          stockCount={data.stocks.length}
          lastUpdated={data.lastUpdated}
        />

        <PortfolioTable sectors={data.sectors} />

        <p className="text-center text-xs mt-6 pb-4" style={{ color: "var(--text-faint)" }}>
          Data from Yahoo Finance (CMP) &amp; Google Finance (P/E, EPS). Prices may be delayed.
          Not financial advice.
        </p>
      </div>
    </div>
  );
}
