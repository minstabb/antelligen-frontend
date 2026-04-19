"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { timelineAtom, selectedTimelineEventAtom } from "@/features/dashboard/application/atoms/timelineAtom";
import { selectedBarTimeAtom } from "@/features/dashboard/application/atoms/selectedBarAtom";
import { economicEventAtom, selectedEventAtom } from "@/features/dashboard/application/atoms/economicEventAtom";
import { nasdaqAtom } from "@/features/dashboard/application/atoms/nasdaqAtom";
import { periodAtom } from "@/features/dashboard/application/atoms/periodAtom";
import { useTimeline } from "@/features/dashboard/application/hooks/useTimeline";
import TimelineEventCard from "@/features/dashboard/ui/components/TimelineEventCard";
import type { TimelineEvent } from "@/features/dashboard/domain/model/timelineEvent";
import { useEffect, useRef } from "react";

function HistorySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="mt-1 h-2.5 w-2.5 flex-shrink-0 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
            {i < 3 && <div className="mt-1 flex-1 w-px bg-zinc-200 dark:bg-zinc-700" />}
          </div>
          <div className="mb-4 flex-1 animate-pulse rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50">
            <div className="mb-2 flex justify-between">
              <div className="h-3 w-20 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-3 w-10 rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
            <div className="mb-1 h-3 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-3 w-48 rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HistoryPanel() {
  useTimeline();

  const timelineState = useAtomValue(timelineAtom);
  const nasdaqState = useAtomValue(nasdaqAtom);
  const economicEventState = useAtomValue(economicEventAtom);
  const [selectedTimelineEvent, setSelectedTimelineEvent] = useAtom(selectedTimelineEventAtom);
  const setSelectedBarTime = useSetAtom(selectedBarTimeAtom);
  const setSelectedEvent = useSetAtom(selectedEventAtom);
  const setPeriod = useSetAtom(periodAtom);
  const period = useAtomValue(periodAtom);

  // 1D가 아닌 period로 변경되면 선택 초기화
  useEffect(() => {
    if (period !== "1D") {
      setSelectedTimelineEvent(null);
      setSelectedBarTime(null);
    }
  }, [period, setSelectedTimelineEvent, setSelectedBarTime]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // 선택된 이벤트를 패널 상단으로 스크롤
  useEffect(() => {
    if (!selectedTimelineEvent || !scrollRef.current) return;
    const container = scrollRef.current;
    const el = container.querySelector<HTMLElement>(
      `[data-history-event-id="${selectedTimelineEvent.idx}"]`
    );
    if (!el) return;
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const relativeTop = elRect.top - containerRect.top + container.scrollTop;
    container.scrollTo({ top: relativeTop, behavior: "smooth" });
  }, [selectedTimelineEvent]);

  // bars가 재로드되면 selectedTimelineEvent 기준으로 nearest bar time 재계산
  const selectedTimelineEventRef = useRef(selectedTimelineEvent);
  useEffect(() => {
    selectedTimelineEventRef.current = selectedTimelineEvent;
  }, [selectedTimelineEvent]);

  useEffect(() => {
    if (nasdaqState.status !== "SUCCESS" || nasdaqState.bars.length === 0) return;
    const sel = selectedTimelineEventRef.current;
    if (!sel) return;

    const eventTs = new Date(sel.event.date).getTime();
    const nearestBarTime = nasdaqState.bars.reduce((nearest, bar) => {
      const diff = Math.abs(new Date(bar.time).getTime() - eventTs);
      const nearestDiff = Math.abs(new Date(nearest).getTime() - eventTs);
      return diff < nearestDiff ? bar.time : nearest;
    }, nasdaqState.bars[0].time);
    setSelectedBarTime(nearestBarTime);
  }, [nasdaqState, setSelectedBarTime]);

  const handleClick = (idx: number, event: TimelineEvent) => {
    if (selectedTimelineEvent?.idx === idx) {
      setSelectedTimelineEvent(null);
      setSelectedBarTime(null);
      return;
    }

    setSelectedTimelineEvent({ idx, event });
    setPeriod("1D");

    // 날짜가 일치하는 경제 지표 이벤트 자동 선택
    if (economicEventState.status === "SUCCESS") {
      const eventMonth = event.date.slice(0, 7); // "yyyy-MM"
      const matched = economicEventState.events.find((e) => e.date.slice(0, 7) === eventMonth) ?? null;
      setSelectedEvent(matched);
    } else {
      setSelectedEvent(null);
    }

    if (nasdaqState.status === "SUCCESS" && nasdaqState.bars.length > 0) {
      const eventTs = new Date(event.date).getTime();
      const nearestBarTime = nasdaqState.bars.reduce((nearest, bar) => {
        const diff = Math.abs(new Date(bar.time).getTime() - eventTs);
        const nearestDiff = Math.abs(new Date(nearest).getTime() - eventTs);
        return diff < nearestDiff ? bar.time : nearest;
      }, nasdaqState.bars[0].time);
      setSelectedBarTime(nearestBarTime);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">History</h3>

      {timelineState.status === "IDLE" && (
        <p className="text-sm text-zinc-400">데이터를 불러오는 중입니다.</p>
      )}

      {timelineState.status === "LOADING" && <HistorySkeleton />}

      {timelineState.status === "ERROR" && (
        <div className="flex h-24 items-center justify-center">
          <p className="text-sm text-red-500">{timelineState.message}</p>
        </div>
      )}

      {timelineState.status === "SUCCESS" && timelineState.events.length === 0 && (
        <div className="flex h-24 items-center justify-center">
          <p className="text-sm text-zinc-400">해당 기간에 이벤트가 없습니다.</p>
        </div>
      )}

      {timelineState.status === "SUCCESS" && timelineState.events.length > 0 && (
        <div ref={scrollRef} className="max-h-96 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:theme(colors.zinc.300)_transparent] dark:[scrollbar-color:theme(colors.zinc.700)_transparent]">
          {timelineState.events.map((event, idx) => (
            <TimelineEventCard
              key={`${event.date}-${idx}`}
              event={event}
              eventIdx={idx}
              isLast={idx === timelineState.events.length - 1}
              isSelected={selectedTimelineEvent?.idx === idx}
              onClick={handleClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
