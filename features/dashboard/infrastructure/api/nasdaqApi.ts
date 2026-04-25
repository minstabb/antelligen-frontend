import { httpClient } from "@/infrastructure/http/httpClient";
import type { ApiResponse } from "@/infrastructure/http/apiResponse";
import type { NasdaqBar } from "@/features/dashboard/domain/model/nasdaqBar";
import type { ChartInterval } from "@/features/dashboard/domain/model/chartInterval";

interface NasdaqBarRaw {
  bar_date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface NasdaqApiData {
  chart_interval: string;
  count: number;
  bars: NasdaqBarRaw[];
}

export async function fetchNasdaqBars(chartInterval: ChartInterval): Promise<NasdaqBar[]> {
  const res = await httpClient<ApiResponse<NasdaqApiData>>(
    `/api/v1/dashboard/nasdaq?chartInterval=${chartInterval}`
  );
  return res.data.bars.map((bar) => ({
    time: bar.bar_date,
    open: bar.open,
    high: bar.high,
    low: bar.low,
    close: bar.close,
    volume: bar.volume,
  }));
}
