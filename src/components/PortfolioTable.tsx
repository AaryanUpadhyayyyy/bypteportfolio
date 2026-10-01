"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { SectorSummary, StockWithData } from "@/types";
import { formatINR, formatNum, formatWeight } from "@/lib/formatters";

const colHelper = createColumnHelper<StockWithData>();

interface Props {
  sectors: SectorSummary[];
}

export default function PortfolioTable({ sectors }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(sectors.map((s) => s.sector))
  );

  const toggle = (sector: string) => {
    setExpanded((prev) => {
      const copy = new Set(prev);
      if (copy.has(sector)) {
        copy.delete(sector);
      } else {
        copy.add(sector);
      }
      return copy;
    });
  };

  const cols = useMemo<any[]>(() => [
    colHelper.accessor("name", {
      header: "Particulars",
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    colHelper.accessor("purchasePrice", {
      header: "Purchase Price",
      cell: (info) => formatINR(info.getValue()),
    }),
    colHelper.accessor("qty", {
      header: "Qty",
      cell: (info) => formatNum(info.getValue(), 0),
    }),
    colHelper.accessor("investment", {
      header: "Investment",
      cell: (info) => formatINR(info.getValue()),
    }),
    colHelper.accessor("portfolioPercent", {
      header: "Portfolio %",
      cell: (info) => formatWeight(info.getValue()),
    }),
    colHelper.accessor("nseCode", {
      header: "NSE/BSE",
      cell: (info) => <span className="nse-chip">{info.getValue()}</span>,
    }),
    colHelper.accessor("cmp", {
      header: "CMP",
      cell: (info) => {
        const v = info.getValue();
        if (v === null) return <span style={{ color: "var(--text-faint)" }}>—</span>;
        return formatINR(v);
      },
    }),
    colHelper.accessor("presentValue", {
      header: "Present Value",
      cell: (info) => formatINR(info.getValue()),
    }),
    colHelper.accessor("gainLoss", {
      header: "Gain/Loss",
      cell: (info) => {
        const v = info.getValue();
        if (v == null) return "—";
        return <span className={v >= 0 ? "badge-gain" : "badge-loss"}>{formatINR(v)}</span>;
      },
    }),
    colHelper.accessor("peRatio", {
      header: "P/E Ratio",
      cell: (info) => formatNum(info.getValue()),
    }),
    colHelper.accessor("latestEarnings", {
      header: "EPS",
      cell: (info) => {
        const v = info.getValue();
        return v !== null ? formatINR(v) : "—";
      },
    }),
  ], []);

  const numCols = new Set([1, 2, 3, 4, 6, 7, 9, 10]);

  return (
    <div className="card overflow-hidden">
      <div className="table-scroll">
        <table className="stock-table">
          <thead>
            <tr>
              {cols.map((c, i) => (
                <th key={String(c.header)} className={numCols.has(i) ? "num" : ""}>
                  {String(c.header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sectors.map((sec) => (
              <SectorRows
                key={sec.sector}
                sector={sec}
                columns={cols}
                isOpen={expanded.has(sec.sector)}
                onToggle={() => toggle(sec.sector)}
                numCols={numCols}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SectorRows({
  sector, columns, isOpen, onToggle, numCols,
}: {
  sector: SectorSummary;
  columns: any[];
  isOpen: boolean;
  onToggle: () => void;
  numCols: Set<number>;
}) {
  const table = useReactTable({
    data: sector.stocks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const gl = sector.totalGainLoss;
  const isGain = gl !== null && gl >= 0;

  return (
    <>
      <tr className="sector-header" onClick={onToggle}>
        <td colSpan={3}>
          <span style={{
            display: "inline-block",
            transform: isOpen ? "rotate(90deg)" : "rotate(0)",
            transition: "transform 0.15s",
            marginRight: "8px",
            fontSize: "10px",
          }}>
            ▶
          </span>
          {sector.sector}
          <span style={{ color: "var(--text-faint)", fontWeight: 400, marginLeft: "6px", fontSize: "12px" }}>
            ({sector.stocks.length})
          </span>
        </td>
        <td className="num">{formatINR(sector.totalInvestment)}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td className="num">
          {gl !== null
            ? <span className={isGain ? "badge-gain" : "badge-loss"}>{formatINR(gl)}</span>
            : "—"
          }
        </td>
        <td></td>
        <td></td>
      </tr>

      {isOpen && table.getRowModel().rows.map((row) => (
        <tr key={row.id}>
          {row.getVisibleCells().map((cell, i) => (
            <td key={cell.id} className={numCols.has(i) ? "num" : ""}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
