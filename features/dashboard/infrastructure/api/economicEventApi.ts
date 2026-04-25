import { httpClient } from "@/infrastructure/http/httpClient";
import type { ApiResponse } from "@/infrastructure/http/apiResponse";
import type { EconomicEvent } from "@/features/dashboard/domain/model/economicEvent";
import type { ChartInterval } from "@/features/dashboard/domain/model/chartInterval";

interface EconomicEventsApiData {
  chart_interval: string;
  count: number;
  events: EconomicEvent[];
}

export async function fetchEconomicEvents(chartInterval: ChartInterval): Promise<EconomicEvent[]> {
  const res = await httpClient<ApiResponse<EconomicEventsApiData>>(
    `/api/v1/dashboard/economic-events?chartInterval=${chartInterval}`
  );
  return res.data.events;
}
