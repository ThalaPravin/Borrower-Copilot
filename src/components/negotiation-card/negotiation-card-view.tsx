"use client";

import React from "react";
import { BorrowerInputs, AssessmentResult } from "@/features/borrower-assessment/types";
import { formatINR, formatINRRange, formatRateRange } from "@/lib/formatters";
import { Button } from "../ui/button";
import { Printer, ShieldCheck, HelpCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export interface NegotiationCardViewProps {
  inputs: BorrowerInputs;
  result: AssessmentResult;
  onBackToAssessment?: () => void;
}

export function NegotiationCardView({ inputs, result, onBackToAssessment }: NegotiationCardViewProps) {
  const handlePrint = () => {
    window.print();
  };

  const {
    decisionLabel,
    decisionReason,
    likelySanction,
    safeBorrowing,
    fairRate,
    apr,
    emi,
  } = result;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto py-2"
    >
      {/* Top Action Bar */}
      <div className="flex items-center justify-between no-print bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          {onBackToAssessment && (
            <Button variant="outline" size="sm" onClick={onBackToAssessment}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Assessment
            </Button>
          )}
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold hidden sm:inline">
            One-Page Lender Negotiation Card
          </span>
        </div>

        <Button variant="primary" size="md" onClick={handlePrint} className="bg-emerald-600 hover:bg-emerald-700">
          <Printer className="w-4 h-4 mr-2" />
          <span>Print / Save Negotiation Card</span>
        </Button>
      </div>

      {/* The Printable Negotiation Card */}
      <div
        id="negotiation-card-printable"
        className="rounded-2xl border-2 border-emerald-500/30 dark:border-emerald-950/60 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6 sm:p-8 shadow-2xl space-y-6 print:border-slate-300 print:bg-white print:text-slate-900 print:shadow-none print:p-6"
      >
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 print:border-slate-300 pb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg font-heading">
              NC
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white print:text-slate-900 font-heading">
                BORROWER NEGOTIATION CARD
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600">
                Prepared for Lender Discussion • Transparent Self-Assessment
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-600 dark:text-slate-400 print:text-slate-600">
            <div><strong>Borrower:</strong> {inputs.borrowerName || "Self-Assessment Borrower"}</div>
            <div><strong>Purpose:</strong> {inputs.loanPurpose.toUpperCase().replace("_", " ")}</div>
            <div><strong>Date:</strong> {new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</div>
          </div>
        </div>

        {/* Recommended Stance & Summary */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 print:bg-slate-100 print:border-slate-300 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-emerald-700 dark:text-emerald-400 print:text-emerald-800">
              Recommended Action Stance
            </span>
            <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 print:text-emerald-800 uppercase border px-2.5 py-0.5 rounded border-emerald-500/40">
              {decisionLabel}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 print:text-slate-900 leading-relaxed">
            {decisionReason}
          </p>
        </div>

        {/* Core Financial Targets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Box 1: Requested */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 print:border-slate-300 print:bg-slate-50 space-y-1">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600 uppercase font-semibold">Requested Loan</div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white print:text-slate-900 font-heading">{formatINR(inputs.requestedAmount)}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Stated Requirement</div>
          </div>

          {/* Box 2: Safe Amount */}
          <div className="p-3.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/30 dark:border-emerald-500/40 print:border-emerald-400 print:bg-emerald-50 space-y-1">
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 print:text-emerald-800 uppercase font-bold">Safe Loan Limit</div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white print:text-slate-900 font-heading">{formatINR(safeBorrowing.max)}</div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-300 print:text-emerald-700 font-medium">Recommended Max</div>
          </div>

          {/* Box 3: Safe EMI Ceiling */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 print:border-slate-300 print:bg-slate-50 space-y-1">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600 uppercase font-semibold">Safe EMI Ceiling</div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white print:text-slate-900 font-heading">{formatINR(emi.maximumSafeEmi)} / mo</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Max Monthly Outflow</div>
          </div>

          {/* Box 4: Fair Rate Band */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 print:border-slate-300 print:bg-slate-50 space-y-1">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600 uppercase font-semibold">Fair Rate Band</div>
            <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 print:text-emerald-800 font-heading">{formatRateRange(fairRate.min, fairRate.max)}</div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 print:text-amber-700 font-bold">APR: ~{apr.effectiveAnnualizedCost}%</div>
          </div>
        </div>

        {/* Comparison: Sanction vs Safe */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 print:border-slate-300 print:bg-slate-50 text-xs space-y-2">
          <div className="font-bold text-slate-800 dark:text-slate-200 print:text-slate-900 flex items-center justify-between">
            <span>Likely Lender Sanction vs Safe Borrowing Range:</span>
            <span className="text-slate-500 dark:text-slate-400 print:text-slate-600 font-normal">
              Likely Sanction: {formatINRRange(likelySanction.min, likelySanction.max)}
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 print:text-slate-700">
            Note: Lenders may sanction up to {formatINR(likelySanction.max)}, but your borrower-safe planning limit is {formatINR(safeBorrowing.max)} to maintain cashflow cushion.
          </p>
        </div>

        {/* Lender Questions Checklist */}
        <div className="space-y-3 pt-2">
          <div className="text-xs uppercase font-extrabold text-emerald-600 dark:text-emerald-400 print:text-emerald-800 tracking-wider flex items-center gap-1.5 font-heading">
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            <span>Key Questions to Ask the Lender During Negotiation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 print:border-slate-300 print:bg-white flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">1.</span>
              <div><strong>What is the exact All-in APR?</strong> Ask for the annualized rate including processing fees and insurance.</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 print:border-slate-300 print:bg-white flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">2.</span>
              <div><strong>What is the processing fee in Rupees?</strong> Verify fixed upfront rupee deductions.</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 print:border-slate-300 print:bg-white flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">3.</span>
              <div><strong>What is the total repayment amount?</strong> Calculate total cash paid over full tenure.</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 print:border-slate-300 print:bg-white flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">4.</span>
              <div><strong>Is the interest rate fixed or floating?</strong> Understand benchmark reset clauses.</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 print:border-slate-300 print:bg-white flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">5.</span>
              <div><strong>Are there foreclosure charges?</strong> Confirm zero penalty after 6–12 months.</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 print:border-slate-300 print:bg-white flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">6.</span>
              <div><strong>What is the impact of shorter tenure?</strong> Check 3-year vs 5-year total interest savings.</div>
            </div>
          </div>
        </div>

        {/* Disclaimer Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 print:border-slate-300 text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-500 leading-normal flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <strong>Disclaimer:</strong> This Negotiation Card is an independent self-assessment tool generated strictly based on user-provided financial inputs. It does not constitute a guaranteed lender sanction, credit bureau report, or formal credit approval.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
