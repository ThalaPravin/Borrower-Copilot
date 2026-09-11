import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  colorClass?: string;
}

export function Progress({ value, colorClass = "bg-emerald-500", className, ...props }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-800", className)}
      {...props}
    >
      <div
        className={cn("h-full transition-all duration-300 ease-in-out rounded-full", colorClass)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
