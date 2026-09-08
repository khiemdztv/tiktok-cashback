"use client";

import { Clock3 } from "lucide-react";
import { useEffect, useState } from "react";

function remainingLabel(endDate: string | Date) {
  const remaining = new Date(endDate).getTime() - Date.now();
  if (remaining <= 0) return "Đã hết hạn";
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  if (days > 0) return `Còn ${days} ngày ${hours} giờ`;
  if (hours > 0) return `Còn ${hours} giờ ${minutes} phút`;
  return `Còn ${Math.max(1, minutes)} phút`;
}

export function CountdownTimer({ endDate, className = "" }: { endDate?: string | Date | null; className?: string }) {
  const [label, setLabel] = useState(() => (endDate ? remainingLabel(endDate) : "Không giới hạn"));

  useEffect(() => {
    if (!endDate) return;
    const update = () => setLabel(remainingLabel(endDate));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, [endDate]);

  return <span className={`inline-flex items-center gap-1.5 ${className}`}><Clock3 className="size-4" />{label}</span>;
}
