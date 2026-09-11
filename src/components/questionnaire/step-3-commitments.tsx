"use client";

import React from "react";
import { BorrowerInputs } from "@/features/borrower-assessment/types";
import { Input } from "../ui/input";
import { formatINR } from "@/lib/formatters";
import { motion } from "framer-motion";

export interface Step3Props {
  inputs: BorrowerInputs;
  onChange: (fields: Partial<BorrowerInputs>) => void;
}

export function Step3Commitments({ inputs, onChange }: Step3Props) {
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
          Step 3 of 5: Monthly Obligations
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          What you currently spend before any new loan is added.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <Input
            label="6. How much do you currently pay in EMIs each month?"
            type="number"
            prefixSymbol="₹"
            placeholder="e.g. 14000 (Enter 0 if none)"
            showSlider={true}
            minSlider={0}
            maxSlider={200000}
            stepSlider={2000}
            value={inputs.existingMonthlyEmi || ""}
            onChange={(e) => onChange({ existingMonthlyEmi: Number(e.target.value) || 0 })}
            helperText="Include total existing car loans, personal loans, credit card EMIs, or buy-now-pay-later (BNPL)."
          />
          {inputs.existingMonthlyEmi > 0 && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-slate-700 dark:text-slate-300 font-bold pl-1"
            >
              Existing EMIs: {formatINR(inputs.existingMonthlyEmi)} / month
            </motion.p>
          )}
        </div>

        <div className="space-y-1.5">
          <Input
            label="7. What are your essential monthly household expenses?"
            type="number"
            prefixSymbol="₹"
            placeholder="e.g. 35000"
            showSlider={true}
            minSlider={5000}
            maxSlider={200000}
            stepSlider={2000}
            value={inputs.essentialExpenses || ""}
            onChange={(e) => onChange({ essentialExpenses: Number(e.target.value) || 0 })}
            helperText="Include house rent, groceries, school fees, utilities, and medicine."
          />
          {inputs.essentialExpenses > 0 && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-slate-700 dark:text-slate-300 font-bold pl-1"
            >
              Essential Outflow: {formatINR(inputs.essentialExpenses)} / month
            </motion.p>
          )}
        </div>

        <Input
          label="8. What is your age?"
          type="number"
          placeholder="e.g. 29"
          value={inputs.age || ""}
          onChange={(e) => onChange({ age: Number(e.target.value) || 0 })}
        />
      </div>
    </motion.div>
  );
}
