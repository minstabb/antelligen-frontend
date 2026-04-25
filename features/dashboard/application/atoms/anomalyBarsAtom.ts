import { atom } from "jotai";
import type { AnomalyBar } from "@/features/dashboard/infrastructure/api/anomalyBarsApi";

export type AnomalyBarsState =
  | { status: "IDLE" }
  | { status: "LOADING" }
  | { status: "SUCCESS"; ticker: string; chart_interval: string; events: AnomalyBar[] }
  | { status: "ERROR"; message: string };

export const anomalyBarsAtom = atom<AnomalyBarsState>({ status: "IDLE" });
