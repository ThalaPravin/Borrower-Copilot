"use client";

import React from "react";
import { BorrowerInputs, IncomeType, IncomeStability } from "@/features/borrower-assessment/types";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { formatINR } from "@/lib/formatters";
import { motion } from "framer-motion";

export interface Step2Props {
  inputs: BorrowerInputs;
  onChange: (fields: Partial<BorrowerInputs>) => void;
}

const INCOME_TYPE_OPTIONS: Array<{ value: IncomeType; label: string }> = [
  { value: "salaried", label: "Salaried (Full-time employee)" },
  { value: "self_employed", label: "Self-Employed / Business Owner / Trader" },
  { value: "informal_variable", label: "Informal / Variable (Gig worker, rider, artisan)" },
  { value: "retired", label: "Retired / Pensioner" },
  { value: "other", label: "Other" },
];

export function Step2Income({ inputs, onChange }: Step2Props) {
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
          Step 2 of 5: Your Income & Work
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Lenders judge stability based on income source.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <Input
            label="4. What is your monthly net take-home income?"
            type="number"
            prefixSymbol="₹"
            placeholder="e.g. 80000"
            showSlider={true}
            minSlider={10000}
            maxSlider={500000}
            stepSlider={5000}
            value={inputs.monthlyNetIncome || ""}
            onChange={(e) => onChange({ monthlyNetIncome: Number(e.target.value) || 0 })}
            helperText="Include salary credited after tax, or average monthly net profit."
          />
          {inputs.monthlyNetIncome > 0 && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-bold pl-1"
            >
              Formatted Income: {formatINR(inputs.monthlyNetIncome)} / month
            </motion.p>
          )}
        </div>

        <Select
          label="5. What best describes your income source?"
          options={INCOME_TYPE_OPTIONS}
          value={inputs.incomeType}
          onChange={(e) => onChange({ incomeType: e.target.value as IncomeType })}
        />

        {/* Adaptive: Salaried */}
        {inputs.incomeType === "salaried" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-emerald-500/30 space-y-4"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
              Adaptive Questions: Salaried Profile
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Years with current employer"
                type="number"
                placeholder="e.g. 5"
                value={inputs.tenureWithEmployerYears ?? ""}
                onChange={(e) => onChange({ tenureWithEmployerYears: Number(e.target.value) || 0 })}
              />
              <Select
                label="Income stability"
                options={[
                  { value: "high", label: "Very Stable (MNC / Govt / Large Corporate)" },
                  { value: "moderate", label: "Moderate (Startup / Mid-size company)" },
                  { value: "unstable", label: "Unstable / Probation" },
                ]}
                value={inputs.incomeStability || "high"}
                onChange={(e) => onChange({ incomeStability: e.target.value as IncomeStability })}
              />
            </div>
          </motion.div>
        )}

        {/* Adaptive: Self-Employed */}
        {inputs.incomeType === "self_employed" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-emerald-500/30 space-y-4"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
              Adaptive Questions: Business Profile
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Business operating history (years)"
                type="number"
                placeholder="e.g. 14"
                value={inputs.businessAgeYears ?? ""}
                onChange={(e) => onChange({ businessAgeYears: Number(e.target.value) || 0 })}
              />
              <Input
                label="Documented annual income (ITR)"
                type="number"
                prefixSymbol="₹"
                placeholder="e.g. 420000"
                value={inputs.documentedAnnualIncomeITR ?? ""}
                onChange={(e) => onChange({ documentedAnnualIncomeITR: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="hasCollateral"
                className="w-4 h-4 rounded text-emerald-600 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                checked={Boolean(inputs.hasCollateralProperty)}
                onChange={(e) => onChange({ hasCollateralProperty: e.target.checked })}
              />
              <label htmlFor="hasCollateral" className="text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer">
                I own unencumbered property (shop / house / land) that could be used as collateral.
              </label>
            </div>
            {inputs.hasCollateralProperty && (
              <Input
                label="Estimated property market value"
                type="number"
                prefixSymbol="₹"
                placeholder="e.g. 4500000"
                value={inputs.collateralValueEst ?? ""}
                onChange={(e) => onChange({ collateralValueEst: Number(e.target.value) || 0 })}
              />
            )}
          </motion.div>
        )}

        {/* Adaptive: Informal / Variable */}
        {inputs.incomeType === "informal_variable" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-emerald-500/30 space-y-4"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
              Adaptive Questions: Variable Income Profile
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Months of continuous work history"
                type="number"
                placeholder="e.g. 12"
                value={inputs.incomeHistoryMonths ?? ""}
                onChange={(e) => onChange({ incomeHistoryMonths: Number(e.target.value) || 0 })}
              />
              <div className="flex flex-col justify-center space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Have you bounced an EMI in the last 6 months?</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="bounced"
                      checked={Boolean(inputs.hasMissedOrBouncedEmiRecently)}
                      onChange={() => onChange({ hasMissedOrBouncedEmiRecently: true })}
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="bounced"
                      checked={!inputs.hasMissedOrBouncedEmiRecently}
                      onChange={() => onChange({ hasMissedOrBouncedEmiRecently: false })}
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
