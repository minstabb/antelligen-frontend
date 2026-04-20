"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { marketRiskAtom } from "@/features/dashboard/application/atoms/marketRiskAtom";
import { fetchMarketRisk } from "@/features/dashboard/infrastructure/api/marketRiskApi";

export function useMarketRisk() {
  const setMarketRisk = useSetAtom(marketRiskAtom);

  useEffect(() => {
    setMarketRisk({ status: "LOADING" });

    fetchMarketRisk()
      .then((data) => {
        setMarketRisk({ status: "SUCCESS", data });
      })
      .catch(() => {
        setMarketRisk({
          status: "ERROR",
          message: "시장 리스크 상태를 불러오는데 실패했습니다.",
        });
      });
  }, [setMarketRisk]);
}
