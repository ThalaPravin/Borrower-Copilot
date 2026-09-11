import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "borrow" | "borrow_less" | "dont_borrow" | "high" | "medium" | "low" | "neutral" | "warning" | "danger" | "info";
}

export function Badge({ className, variant = "neutral", children, ...props }: BadgeProps) {
  const variants = {
    borrow: "bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    borrow_less: "bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30",
    dont_borrow: "bg-rose-500/15 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30",
    high: "bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    medium: "bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
    low: "bg-rose-500/10 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/20",
    neutral: "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700",
    warning: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30",
    danger: "bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30",
    info: "bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/30",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors select-none",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
