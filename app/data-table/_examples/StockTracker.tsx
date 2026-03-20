"use client";

import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge, BadgeProps } from "@/components/ui/badge";
import { ColumnMetadata, DataTable } from "@/components/ui/data-table";

type Row = {
  ticker: string;
  company: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  peRatio: number;
  volume: number;
  week52High: number;
  week52Low: number;
};

const sectorVariants: Record<string, BadgeProps["variant"]> = {
  Technology: "default",
  Energy: "warning",
};

const formatUsd = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

const formatLargeNumber = (value: number) => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  return `$${(value / 1e6).toFixed(0)}M`;
};

const formatVolume = (value: number) => {
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
  return value.toLocaleString();
};

const columnsMetadata = [
  {
    columnId: "ticker",
    title: "Ticker",
    type: "text",
    sortable: true,
    hideable: false,
    filters: { text: true, textColumns: ["company"] },
    formatter: (value: unknown) => (
      <span className="font-semibold tabular-nums">{value as string}</span>
    ),
  },
  {
    columnId: "company",
    title: "Company",
    type: "text",
    sortable: true,
  },
  {
    columnId: "sector",
    title: "Sector",
    type: "text",
    sortable: true,
    inferOptions: true,
    filters: { checkboxSearch: { multiple: true } },
    cell: ({ row }) => {
      const sector = row.getValue("sector") as string;
      return (
        <Badge variant={sectorVariants[sector] ?? "neutral"}>{sector}</Badge>
      );
    },
  },
  {
    columnId: "price",
    title: "Price",
    subtitle: "USD",
    type: "number",
    sortable: true,
    aligned: "right",
    filters: { number: true },
    formatter: (value: unknown) => (
      <span className="font-medium tabular-nums">
        {formatUsd(value as number)}
      </span>
    ),
    filterValueFormatter: (value: number) => formatUsd(value),
  },
  {
    columnId: "change",
    title: "Change",
    subtitle: "Today",
    type: "number",
    sortable: true,
    aligned: "right",
    cell: ({ row }) => {
      const change = row.getValue("change") as number;
      const pct = row.original.changePercent;
      const isPositive = change >= 0;
      return (
        <div
          className={`flex items-center justify-end gap-1.5 font-medium tabular-nums ${isPositive ? "text-emerald-600" : "text-rose-600"}`}
        >
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {isPositive ? "+" : ""}
          {change.toFixed(2)} ({pct.toFixed(2)}%)
        </div>
      );
    },
  },
  {
    columnId: "marketCap",
    title: "Market Cap",
    type: "number",
    sortable: true,
    aligned: "right",
    filters: { number: true },
    formatter: (value: unknown) => (
      <span className="tabular-nums">
        {formatLargeNumber(value as number)}
      </span>
    ),
    filterValueFormatter: (value: number) => formatLargeNumber(value),
  },
  {
    columnId: "peRatio",
    title: "P/E Ratio",
    type: "number",
    sortable: true,
    aligned: "right",
    formatter: (value: unknown) => (
      <span className="tabular-nums">{(value as number).toFixed(1)}</span>
    ),
  },
  {
    columnId: "volume",
    title: "Volume",
    subtitle: "Today",
    type: "number",
    sortable: true,
    aligned: "right",
    formatter: (value: unknown) => (
      <span className="tabular-nums text-muted-foreground">
        {formatVolume(value as number)}
      </span>
    ),
  },
  {
    columnId: "week52High",
    title: "52W High",
    type: "number",
    sortable: true,
    aligned: "right",
    formatter: (value: unknown) => (
      <span className="tabular-nums text-muted-foreground">
        {formatUsd(value as number)}
      </span>
    ),
  },
  {
    columnId: "week52Low",
    title: "52W Low",
    type: "number",
    sortable: true,
    aligned: "right",
    formatter: (value: unknown) => (
      <span className="tabular-nums text-muted-foreground">
        {formatUsd(value as number)}
      </span>
    ),
  },
] as const satisfies ColumnMetadata<Row>[];

const stockData: Row[] = [
  // Tech stocks
  {
    ticker: "AAPL",
    company: "Apple Inc.",
    sector: "Technology",
    price: 227.48,
    change: 3.12,
    changePercent: 1.39,
    marketCap: 3.44e12,
    peRatio: 37.2,
    volume: 48_320_000,
    week52High: 260.1,
    week52Low: 169.21,
  },
  {
    ticker: "MSFT",
    company: "Microsoft Corporation",
    sector: "Technology",
    price: 454.27,
    change: -2.85,
    changePercent: -0.62,
    marketCap: 3.38e12,
    peRatio: 38.1,
    volume: 21_540_000,
    week52High: 468.35,
    week52Low: 385.58,
  },
  {
    ticker: "NVDA",
    company: "NVIDIA Corporation",
    sector: "Technology",
    price: 118.65,
    change: 5.43,
    changePercent: 4.8,
    marketCap: 2.92e12,
    peRatio: 64.5,
    volume: 312_800_000,
    week52High: 153.13,
    week52Low: 75.61,
  },
  {
    ticker: "GOOGL",
    company: "Alphabet Inc.",
    sector: "Technology",
    price: 174.82,
    change: 1.56,
    changePercent: 0.9,
    marketCap: 2.14e12,
    peRatio: 24.8,
    volume: 25_670_000,
    week52High: 207.05,
    week52Low: 150.22,
  },
  {
    ticker: "META",
    company: "Meta Platforms Inc.",
    sector: "Technology",
    price: 612.77,
    change: -8.14,
    changePercent: -1.31,
    marketCap: 1.55e12,
    peRatio: 27.3,
    volume: 14_890_000,
    week52High: 740.91,
    week52Low: 414.5,
  },
  // Energy stocks
  {
    ticker: "XOM",
    company: "Exxon Mobil Corporation",
    sector: "Energy",
    price: 108.45,
    change: 0.87,
    changePercent: 0.81,
    marketCap: 463.2e9,
    peRatio: 14.2,
    volume: 12_340_000,
    week52High: 126.34,
    week52Low: 95.77,
  },
  {
    ticker: "CVX",
    company: "Chevron Corporation",
    sector: "Energy",
    price: 155.32,
    change: -1.24,
    changePercent: -0.79,
    marketCap: 280.7e9,
    peRatio: 15.8,
    volume: 7_560_000,
    week52High: 168.96,
    week52Low: 135.37,
  },
  {
    ticker: "COP",
    company: "ConocoPhillips",
    sector: "Energy",
    price: 101.88,
    change: 2.15,
    changePercent: 2.16,
    marketCap: 127.4e9,
    peRatio: 12.1,
    volume: 6_890_000,
    week52High: 128.28,
    week52Low: 89.84,
  },
  {
    ticker: "SLB",
    company: "Schlumberger Limited",
    sector: "Energy",
    price: 42.67,
    change: -0.38,
    changePercent: -0.88,
    marketCap: 60.2e9,
    peRatio: 13.4,
    volume: 9_120_000,
    week52High: 56.06,
    week52Low: 36.6,
  },
  {
    ticker: "EOG",
    company: "EOG Resources Inc.",
    sector: "Energy",
    price: 124.55,
    change: 1.78,
    changePercent: 1.45,
    marketCap: 71.8e9,
    peRatio: 10.6,
    volume: 3_450_000,
    week52High: 139.67,
    week52Low: 108.94,
  },
];

export function StockTracker() {
  return (
    <DataTable<Row>
      columnsMetadata={columnsMetadata}
      data={stockData}
      tableName="stock_tracker"
      enablePagination={false}
      enableTextSelection
      bordered
      enableFullscreen
      compact
    />
  );
}
