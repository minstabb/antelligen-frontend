import { httpClient } from "@/infrastructure/http/httpClient";
import type { ApiResponse } from "@/infrastructure/http/apiResponse";
import type { MarketRisk, MarketRiskStatus } from "@/features/dashboard/domain/model/marketRisk";

interface MarketRiskApiResponse {
  status?: string;
  sentiment?: string;
  label?: string;
  score?: number;
  reason?: string | string[];
  reasons?: string | string[];
  description?: string;
  message?: string;
  details?: string | string[];
  rationale?: string | string[];
  summary?: string | string[];
  grounds?: string | string[];
  [key: string]: unknown;
}

function normalizeStatus(raw: MarketRiskApiResponse): MarketRiskStatus {
  const text = (raw.status ?? raw.sentiment ?? raw.label ?? "").toString().toUpperCase();
  if (text.includes("ON")) return "RISK_ON";
  if (text.includes("OFF")) return "RISK_OFF";
  if (typeof raw.score === "number") {
    const threshold = raw.score > 1 ? 50 : 0;
    return raw.score >= threshold ? "RISK_ON" : "RISK_OFF";
  }
  return "RISK_OFF";
}

function splitTextToLines(text: string): string[] {
  if (!text) return [];

  let working = text.trim();
  working = working.replace(/\s*(?=\d{1,2}[.)]\s)/g, "\n");
  working = working.replace(/\s*(?=[-*•·・]\s)/g, "\n");
  working = working.replace(/\s*(?=[①-⑳])/g, "\n");

  const byNewline = working
    .split(/\r?\n+/)
    .map((line) => line.replace(/^\s*(\d{1,2}[.)]|[-*•·・①-⑳])\s*/, "").trim())
    .filter((line) => line.length > 0);

  if (byNewline.length > 1) return byNewline;

  return working
    .split(/(?<=[.!?。])\s+(?=\S)/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function extractReasons(raw: MarketRiskApiResponse): string[] {
  const candidates: unknown[] = [
    raw.reasons,
    raw.reason,
    raw.details,
    raw.rationale,
    raw.grounds,
    raw.summary,
    raw.description,
    raw.message,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      const arr = candidate
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter((item) => item.length > 0);
      if (arr.length > 0) return arr;
    } else if (typeof candidate === "string" && candidate.trim().length > 0) {
      const lines = splitTextToLines(candidate);
      if (lines.length > 0) return lines;
    }
  }

  return [];
}

export async function fetchMarketRisk(): Promise<MarketRisk> {
  const { data } = await httpClient<ApiResponse<MarketRiskApiResponse>>("/api/v1/macro/market-risk");

  return {
    status: normalizeStatus(data),
    reasons: extractReasons(data),
  };
}
