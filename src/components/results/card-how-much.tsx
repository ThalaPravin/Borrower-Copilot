"use client";

import React, { useState } from "react";
import { AssessmentResult } from "@/features/borrower-assessment/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { formatINR, formatINRRange } from "@/lib/formatters";
import { HelpCircle, Scale, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export interface CardHowMuchProps {
  result: AssessmentResult;
}

export function CardHowMuch({ result }: CardHowMuchProps) {
  const [showModal, setShowModal] = useState(false);
  const { likelySanction, safeBorrowing } = result;

  const maxVal = Math.max(likelySanction.max, safeBorrowing.max, 100000);
  const safePct = Math.min(100, Math.round((safeBorrowing.max / maxVal) * 100));
  const sanctionPct = Math.min(100, Math.round((likelySanction.max / maxVal) * 100));

  return (
    <>
      <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
        <Card className="hover:border-slate-400 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
          <div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                  Output 2
                </span>
                <span className="text-xs text-slate-400 font-mono">O2</span>
              </div>
              <CardTitle className="text-xl">2. How much am I really eligible for?</CardTitle>
              <CardDescription>Likely Lender Sanction vs Your Borrower-Safe Ceiling.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Safe Borrowing Box */}
                <div className="p-4 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/30 dark:border-emerald-500/40 space-y-1">
                  <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                    <span>Safe Borrowing Ceiling</span>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
                    {formatINR(safeBorrowing.max)}
                  </div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                    Recommended: {formatINR(safeBorrowing.recommended)}
                  </div>
                </div>

                {/* Likely Sanction Box */}
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <span>Likely Lender Sanction</span>
                    <Scale className="w-4 h-4" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 font-heading">
                    {formatINRRange(likelySanction.min, likelySanction.max)}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Traditional Lender FOIR Estimate
                  </div>
                </div>
              </div>

              {/* Animated visual comparison bar */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span>Safe Ceiling ({safePct}%)</span>
                  <span>Lender Max Sanction ({sanctionPct}%)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sanctionPct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-slate-400 dark:bg-slate-600 rounded-full"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${safePct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="h-full bg-emerald-500 rounded-full absolute top-0 left-0"
                  />
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {safeBorrowing.reason}
              </p>
            </CardContent>
          </div>

          <div className="p-5 pt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowModal(true)}
              className="w-full text-xs"
            >
              <HelpCircle className="w-3.5 h-3.5 mr-1 text-emerald-500" />
              <span>Why this number? View Calculation Details</span>
            </Button>
          </div>
        </Card>
      </motion.div>

      <Dialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Why Lender Sanction vs Safe Amount Differ"
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Lenders calculate sanction eligibility based on loose FOIR ratios without considering essential family living costs. Borrower Copilot calculates a safer limit based on uncommitted disposable cashflow.
          </p>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Safe Amount Traceability:</span>
            {safeBorrowing.breakdown.map((line, idx) => (
              <div key={idx} className="text-slate-700 dark:text-slate-300 font-mono">• {line}</div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-400 block">Lender Sanction Traceability:</span>
            {likelySanction.breakdown.map((line, idx) => (
              <div key={idx} className="text-slate-700 dark:text-slate-300 font-mono">• {line}</div>
            ))}
          </div>
        </div>
      </Dialog>
    </>
  );
}
