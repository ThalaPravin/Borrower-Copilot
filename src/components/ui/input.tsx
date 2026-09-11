import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixSymbol?: string;
  label?: string;
  helperText?: string;
  error?: string;
  showSlider?: boolean;
  minSlider?: number;
  maxSlider?: number;
  stepSlider?: number;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      prefixSymbol,
      label,
      helperText,
      error,
      showSlider,
      minSlider = 0,
      maxSlider = 2000000,
      stepSlider = 10000,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const numVal = typeof value === "number" ? value : Number(value) || 0;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-200">
            {label}
          </label>
        )}
        <div className="relative flex items-center rounded-xl shadow-xs">
          {prefixSymbol && (
            <span className="absolute left-3.5 text-slate-400 dark:text-slate-500 font-semibold text-sm select-none">
              {prefixSymbol}
            </span>
          )}
          <input
            type={type}
            value={value}
            onChange={onChange}
            className={cn(
              "flex h-11 w-full rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-2xs",
              prefixSymbol && "pl-8",
              error && "border-rose-500 focus-visible:ring-rose-500",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>

        {showSlider && type === "number" && (
          <div className="pt-1.5 px-0.5">
            <input
              type="range"
              min={minSlider}
              max={maxSlider}
              step={stepSlider}
              value={numVal}
              onChange={(e) => {
                if (onChange) {
                  const event = {
                    ...e,
                    target: { ...e.target, value: e.target.value },
                  } as unknown as React.ChangeEvent<HTMLInputElement>;
                  onChange(event);
                }
              }}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        )}

        {helperText && !error && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
        {error && <p className="text-xs font-semibold text-rose-500 dark:text-rose-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
