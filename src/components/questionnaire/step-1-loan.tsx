"use client";

import React from "react";
import { BorrowerInputs, LoanPurpose, LoanType } from "@/features/borrower-assessment/types";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { formatINR } from "@/lib/formatters";
import { motion } from "framer-motion";

export interface Step1Props {
  inputs: BorrowerInputs;
  onChange: (fields: Partial<BorrowerInputs>) => void;
}

const PURPOSE_OPTIONS: Array<{ value: LoanPurpose; label: string }> = [
  { value: "personal", label: "Personal Expense (Wedding, Travel, Appliance)" },
  { value: "education", label: "Education / Higher Studies" },
  { value: "home", label: "Home Purchase / Renovation" },
  { value: "business", label: "Business Expansion / Working Capital" },
  { value: "vehicle", label: "Vehicle Purchase (Car / Scooter)" },
  { value: "medical", label: "Medical Emergency" },
  { value: "debt_consolidation", label: "Debt Consolidation (Clear High-Interest Debt)" },
  { value: "other", label: "Other" },
];

const LOAN_TYPE_OPTIONS: Array<{ value: LoanType; label: string }> = [
  { value: "personal_loan", label: "Personal Loan (Unsecured)" },
  { value: "home_loan", label: "Home Loan (Secured)" },
  { value: "loan_against_property", label: "Loan Against Property (LAP)" },
  { value: "gold_loan", label: "Gold Loan (Secured)" },
  { value: "two_wheeler_loan", label: "Two-Wheeler / Auto Loan" },
  { value: "business_loan", label: "Business Loan" },
  { value: "not_sure", label: "Not Sure (Need Recommendation)" },
];

export function Step1Loan({ inputs, onChange }: Step1Props) {
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
          Step 1 of 5: Your Loan Request
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Tell us about what you want to borrow and why.
        </p>
      </div>

      <div className="space-y-5">
        <Select
          label="1. What are you borrowing for?"
          options={PURPOSE_OPTIONS}
          value={inputs.loanPurpose}
          onChange={(e) => onChange({ loanPurpose: e.target.value as LoanPurpose })}
        />

        <Select
          label="2. What type of loan are you considering?"
          options={LOAN_TYPE_OPTIONS}
          value={inputs.loanType}
          onChange={(e) => onChange({ loanType: e.target.value as LoanType })}
        />

        <div className="space-y-1.5">
          <Input
            label="3. How much do you want to borrow?"
            type="number"
            prefixSymbol="₹"
            placeholder="e.g. 500000"
            showSlider={true}
            minSlider={20000}
            maxSlider={5000000}
            stepSlider={10000}
            value={inputs.requestedAmount || ""}
            onChange={(e) => onChange({ requestedAmount: Number(e.target.value) || 0 })}
          />
          {inputs.requestedAmount > 0 && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-bold pl-1"
            >
              Formatted Amount: {formatINR(inputs.requestedAmount)}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
