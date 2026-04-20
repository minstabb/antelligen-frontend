import StockAnalysisView from "@/features/stock-recommendation/ui/components/StockAnalysisView";

export default function StockRecommendationPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-50">종목 분석</h1>
        <StockAnalysisView />
      </div>
    </div>
  );
}
