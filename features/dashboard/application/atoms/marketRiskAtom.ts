import { atom } from "jotai";
import type { MarketRiskState } from "@/features/dashboard/domain/state/marketRiskState";

export const marketRiskAtom = atom<MarketRiskState>({ status: "LOADING" });
