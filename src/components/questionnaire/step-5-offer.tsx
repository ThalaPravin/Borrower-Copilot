"use client";

import React from "react";
import { BorrowerInputs } from "@/features/borrower-assessment/types";
import { Input } from "../ui/input";
import { Tag } from "lucide-react";
import { motion } from "framer-motion";

export interface Step5Props {
  inputs: BorrowerInputs;
  onChange: (fields: Partial<BorrowerInputs>) => void;
}

export function Step5Offer({ inputs, onChange }: Step5Props) {
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
          Step 5 of 5: Existing Lender Offer (Optional)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          If a bank or app gave you an offer quote, enter it to calculate true all-in APR.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800">
          <input
            type="checkbox"
            id="hasOffer"
            className="w-4 h-4 rounded text-emerald-600 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
            checked={Boolean(inputs.hasLenderOffer)}
            onChange={(e) => onChange({ hasLenderOffer: e.target.checked })}
          />
          <label htmlFor="hasOffer" className="text-xs text-slate-700 dark:text-slate-200 cursor-pointer font-semibold">
            I already have an offer quote from a bank or lender
          </label>
        </div>

        {inputs.hasLenderOffer ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-emerald-500/30 space-y-4"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Tag className="w-3.5 h-3.5" />
              <span>Enter Lender Quote Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Offered Interest Rate (% p.a.)"
                type="number"
                step="0.1"
                placeholder="e.g. 13.5"
                value={inputs.offeredRate ?? ""}
                onChange={(e) => onChange({ offeredRate: Number(e.target.value) || 0 })}
              />

              <Input
                label="Processing Fee (% of loan amount)"
                type="number"
                step="0.5"
                placeholder="e.g. 2.0"
                value={inputs.offeredProcessingFeePct ?? ""}
                onChange={(e) => onChange({ offeredProcessingFeePct: Number(e.target.value) || 0 })}
              />

              <Input
                label="Offered Tenure (Months)"
                type="number"
                placeholder="e.g. 36"
                value={inputs.offeredTenureMonths ?? ""}
                onChange={(e) => onChange({ offeredTenureMonths: Number(e.target.value) || 0 })}
              />

              <Input
                label="Offered Sanction Amount (₹)"
                type="number"
                prefixSymbol="₹"
                placeholder="e.g. 800000"
                value={inputs.offeredAmount ?? ""}
                onChange={(e) => onChange({ offeredAmount: Number(e.target.value) || 0 })}
              />
            </div>
          </motion.div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <p><strong>No offer quote yet?</strong> No problem!</p>
            <p>Borrower Copilot will estimate market fair rates and standard processing fees automatically based on your financial profile.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
