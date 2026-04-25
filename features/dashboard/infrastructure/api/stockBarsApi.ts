import { httpClient } from "@/infrastructure/http/httpClient";
import type { ApiResponse } from "@/infrastructure/http/apiResponse";
import type { NasdaqBar } from "@/features/dashboard/domain/model/nasdaqBar";
import type { ChartInterval } from "@/features/dashboard/domain/model/chartInterval";

interface StockBarRaw {
  bar_date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface StockBarsApiData {
  ticker: string;
  company_name: string;
  chart_interval: string;
  count: number;
  bars: StockBarRaw[];
}

export interface StockBarsResult {
  companyName: string;
  bars: NasdaqBar[];
}

export async function fetchStockBars(ticker: string, chartInterval: ChartInterval): Promise<StockBarsResult> {
  const res = await httpClient<ApiResponse<StockBarsApiData>>(
    `/api/v1/dashboard/stocks/${encodeURIComponent(ticker)}/bars?chartInterval=${chartInterval}`
  );
  return {
    companyName: res.data.company_name,
    bars: res.data.bars.map((bar) => ({
      time: bar.bar_date,
      open: bar.open,
      high: bar.high,
      low: bar.low,
      close: bar.close,
      volume: bar.volume,
    })),
  };
}
