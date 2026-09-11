"use client";

import React from "react";
import { BorrowerInputs } from "@/features/borrower-assessment/types";
import { Input } from "../ui/input";
import { ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export interface Step4Props {
  inputs: BorrowerInputs;
  onChange: (fields: Partial<BorrowerInputs>) => void;
}

export function Step4Credit({ inputs, onChange }: Step4Props) {
  const handleScoreToggle = (knows: boolean) => {
    if (!knows) {
      onChange({ knowsCreditScore: false, creditScore: null });
    } else {
      onChange({ knowsCreditScore: true, creditScore: inputs.creditScore || 750 });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">
          Step 4 of 5: Credit & Safety Cushion
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Unknown credit scores are handled with wider pricing bands.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="block text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-200">
            9. Do you know your credit score (CIBIL / Experian)?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => handleScoreToggle(true)}
              className={`p-3.5 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${
                inputs.knowsCreditScore
                  ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500"
                  : "border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-700"
              }`}
            >
              <span>Yes, I know my score</span>
              {inputs.knowsCreditScore && <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>}
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => handleScoreToggle(false)}
              className={`p-3.5 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${
                !inputs.knowsCreditScore
                  ? "border-amber-500 bg-amber-500/10 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500"
                  : "border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-700"
              }`}
            >
              <span>No / Not Sure</span>
              {!inputs.knowsCreditScore && <span className="text-amber-600 dark:text-amber-400 font-bold">!</span>}
            </motion.button>
          </div>
        </div>

        {inputs.knowsCreditScore ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 space-y-2"
          >
            <Input
              label="Enter your 3-digit credit score (300 to 900)"
              type="number"
              placeholder="e.g. 780"
              value={inputs.creditScore ?? ""}
              onChange={(e) => {
                const val = Number(e.target.value);
                onChange({ creditScore: val > 0 ? val : null });
              }}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              750+ is considered Prime, 700-749 Good, &lt;680 Subprime.
            </p>
          </motion.div>
        ) : (
          <div className="p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>Unknown score principle:</strong> Borrower Copilot will NOT assume a score of 300 or 750. We keep it strictly unknown, widening the rate estimate range to ensure transparent expectations.
            </div>
          </div>
        )}

        <div className="space-y-1.5 pt-2">
          <Input
            label="How many months of emergency savings do you have?"
            type="number"
            placeholder="e.g. 3 (Enter 0 if none)"
            value={inputs.emergencySavingsMonths ?? ""}
            onChange={(e) => onChange({ emergencySavingsMonths: Number(e.target.value) || 0 })}
            helperText="Emergency funds protect against unexpected income drops or job loss."
          />
        </div>
      </div>
    </motion.div>
  );
}
