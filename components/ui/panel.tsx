import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}

export function Panel({ children, className, accent = true }: PanelProps) {
  return (
    <div
      className={cn("qb-panel p-5 lg:p-6", accent && "qb-panel-accent", className)}
    >
      {children}
    </div>
  );
}

interface PanelHeaderProps {
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
}

export function PanelHeader({ title, subtitle, action }: PanelHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="qb-label mb-1">Query studio</p>
        <h2 className="qb-title text-xl sm:text-2xl">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--fg-muted)]">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
