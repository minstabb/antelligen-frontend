"use client";

import { useAtomValue } from "jotai";
import { marketRiskAtom } from "@/features/dashboard/application/atoms/marketRiskAtom";
import { useMarketRisk } from "@/features/dashboard/application/hooks/useMarketRisk";
import type { MarketRiskStatus } from "@/features/dashboard/domain/model/marketRisk";

const STATUS_LABEL: Record<MarketRiskStatus, string> = {
  RISK_ON: "Risk-ON",
  RISK_OFF: "Risk-OFF",
};

const STATUS_DESCRIPTION: Record<MarketRiskStatus, string> = {
  RISK_ON: "주식, 코인 등 위험자산 선호 심리가 강해 집니다.",
  RISK_OFF: "리스크를 줄이기 위해 주식, 코인 등 위험자산 회피 심리가 강해 집니다.",
};

const STATUS_ICON: Record<MarketRiskStatus, string> = {
  RISK_ON: "☀️",
  RISK_OFF: "🌧️",
};

const STATUS_CARD_BG: Record<MarketRiskStatus, string> = {
  RISK_ON: "bg-amber-50 dark:bg-amber-900/10",
  RISK_OFF: "bg-zinc-200/70 dark:bg-zinc-800/60",
};

const STATUS_TITLE_COLOR: Record<MarketRiskStatus, string> = {
  RISK_ON: "text-amber-600 dark:text-amber-400",
  RISK_OFF: "text-zinc-700 dark:text-zinc-200",
};

const STATUS_REASON_BG: Record<MarketRiskStatus, string> = {
  RISK_ON: "bg-amber-100/60 dark:bg-amber-900/20",
  RISK_OFF: "bg-white/70 dark:bg-zinc-900/40",
};

const STATUS_BULLET_COLOR: Record<MarketRiskStatus, string> = {
  RISK_ON: "text-orange-500",
  RISK_OFF: "text-rose-500",
};

export default function MarketRiskPanel() {
  useMarketRisk();

  const state = useAtomValue(marketRiskAtom);

  return (
    <div className="w-full">
      <h3 className="mb-4 text-center text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        거시 경제 현황판
      </h3>

      {state.status === "LOADING" && (
        <div className="rounded-3xl bg-zinc-200/70 p-10 shadow-sm dark:bg-zinc-800/60">
          <div className="animate-pulse space-y-5">
            <div className="mx-auto h-12 w-12 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <div className="mx-auto h-14 w-48 rounded bg-zinc-300 dark:bg-zinc-700" />
            <div className="mx-auto h-4 w-80 max-w-full rounded bg-zinc-300 dark:bg-zinc-700" />
            <div className="mt-6 h-32 w-full rounded-xl bg-white/50 dark:bg-zinc-900/40" />
          </div>
        </div>
      )}

      {state.status === "ERROR" && (
        <div className="rounded-3xl bg-rose-50 p-10 text-center shadow-sm dark:bg-rose-900/20">
          <p className="text-base font-medium text-rose-700 dark:text-rose-300">
            {state.message}
          </p>
        </div>
      )}

      {state.status === "SUCCESS" && (() => {
        const { status, reasons } = state.data;

        return (
          <div className={`rounded-3xl px-8 py-10 shadow-sm ${STATUS_CARD_BG[status]}`}>
            <div className="flex flex-col items-center text-center">
              <span className="text-5xl" aria-hidden>
                {STATUS_ICON[status]}
              </span>

              <h2
                className={`mt-2 text-6xl font-black tracking-tight sm:text-7xl ${STATUS_TITLE_COLOR[status]}`}
              >
                {STATUS_LABEL[status]}
              </h2>

              <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300 sm:text-base">
                {STATUS_DESCRIPTION[status]}
              </p>
            </div>

            {reasons.length > 0 && (
              <div className={`mt-8 rounded-2xl px-6 py-5 ${STATUS_REASON_BG[status]}`}>
                <p className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                  판단 근거
                </p>
                <ul className="space-y-2">
                  {reasons.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex gap-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300"
                    >
                      <span className={`mt-0.5 flex-shrink-0 ${STATUS_BULLET_COLOR[status]}`}>
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
