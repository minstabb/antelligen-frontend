export type MarketRiskStatus = "RISK_ON" | "RISK_OFF";

export interface MarketRisk {
  status: MarketRiskStatus;
  reasons: string[];
}
