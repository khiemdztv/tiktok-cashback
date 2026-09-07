import type { ReactNode } from "react";

import { cn } from "@/src/lib/utils";

export function Section({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("container-page py-12 md:py-16", className)}>
      {(title || action) && (
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            {title && <h2 className="text-2xl font-bold md:text-[28px]">{title}</h2>}
            {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
