import type { MarketRisk } from "@/features/dashboard/domain/model/marketRisk";

export type MarketRiskState =
  | { status: "LOADING" }
  | { status: "SUCCESS"; data: MarketRisk }
  | { status: "ERROR"; message: string };
