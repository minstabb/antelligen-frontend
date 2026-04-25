export type TimelineCategory = "PRICE" | "CORPORATE" | "ANNOUNCEMENT" | "NEWS" | "MACRO";

export interface HypothesisResult {
  hypothesis: string;
  supporting_tools_called: string[];
}

export interface TimelineEvent {
  title: string;
  date: string;
  category: TimelineCategory;
  type: string;
  detail: string;
  source: string | null;
  url: string | null;
  causality: HypothesisResult[] | null;
  // ETF holdings 분해 시 constituent 이벤트에 채워짐. ETF 자체 이벤트는 null.
  constituent_ticker?: string | null;
  weight_pct?: number | null;
  // MACRO 이벤트의 LLM 랭커 점수(0~1). curated seed는 1.0. UI 강조에 사용.
  importance_score?: number | null;
}

export interface TimelineResponse {
  ticker: string;
  // ADR-0001: /timeline 은 chart_interval(봉 단위), /macro-timeline 은 lookback_range(조회 기간).
  chart_interval?: string | null;
  lookback_range?: string | null;
  count: number;
  events: TimelineEvent[];
  is_etf: boolean;
  asset_type?: string;
}
