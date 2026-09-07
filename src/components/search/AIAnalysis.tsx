"use client";

import { Bot, ChevronDown, ExternalLink, LoaderCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/src/components/ui/button";
import type { AIAnalysisResponse } from "@/lib/you-api";

export function AIAnalysis({ query }: { query: string }) {
  const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { setAnalysis(null); setError(""); setLoading(false); }, [query]);

  const analyze = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/ai-analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query }) });
      const payload = (await response.json()) as AIAnalysisResponse & { error?: string };
      if (!response.ok) throw new Error(payload.error || "Không thể phân tích lúc này.");
      setAnalysis(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Không thể phân tích lúc này.");
    } finally { setLoading(false); }
  };

  if (!analysis) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-accent/70 to-card p-6 shadow-soft md:p-8">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"><Bot className="size-5" /></span>
            <div><h3 className="font-bold">Nhờ AI phân tích lựa chọn</h3><p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">You.com sẽ tổng hợp nguồn hiện tại và gợi ý nơi đáng cân nhắc. Chỉ phát sinh lượt API khi bạn bấm nút.</p></div>
          </div>
          <Button onClick={analyze} disabled={loading} className="shrink-0 rounded-xl">{loading ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles className="size-4" />}{loading ? "Đang phân tích…" : "Phân tích AI"}</Button>
        </div>
        {error && <p role="alert" className="mt-4 text-sm font-medium text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-accent/60 to-card p-6 shadow-soft md:p-8" aria-live="polite">
      <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground"><Bot className="size-5" /></span><div><h3 className="font-bold">Phân tích từ You.com</h3><p className="text-xs text-muted-foreground">{analysis.cached ? "Kết quả đã lưu để tiết kiệm chi phí" : "Phân tích vừa được tạo"}</p></div></div>
      <p className="mt-5 whitespace-pre-line text-sm leading-7 text-foreground">{analysis.answer}</p>
      {analysis.citations.length > 0 && (
        <details className="mt-5 border-t border-border pt-4">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold">Nguồn tham khảo ({analysis.citations.length}) <ChevronDown className="size-4" /></summary>
          <ul className="mt-3 space-y-2">
            {analysis.citations.map((citation, index) => <li key={citation.url}><a href={citation.url} target="_blank" rel="noopener noreferrer nofollow" className="flex items-start gap-2 rounded-xl bg-card/80 p-3 text-sm hover:text-primary"><span className="font-semibold">[{index + 1}]</span><span className="min-w-0 flex-1"><span className="block truncate font-medium">{citation.title}</span>{citation.excerpt && <span className="mt-1 line-clamp-2 block text-xs leading-5 text-muted-foreground">{citation.excerpt}</span>}</span><ExternalLink className="mt-0.5 size-4 shrink-0" /></a></li>)}
          </ul>
        </details>
      )}
    </div>
  );
}
