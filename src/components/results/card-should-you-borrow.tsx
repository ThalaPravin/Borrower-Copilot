"use client";

import React, { useState } from "react";
import { AssessmentResult } from "@/features/borrower-assessment/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { formatINR } from "@/lib/formatters";
import { HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export interface CardShouldYouBorrowProps {
  result: AssessmentResult;
}

export function CardShouldYouBorrow({ result }: CardShouldYouBorrowProps) {
  const [showModal, setShowModal] = useState(false);
  const { decisionLabel, decisionReason, emi } = result;

  return (
    <>
      <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
        <Card className="hover:border-slate-400 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
          <div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                  Output 1
                </span>
                <span className="text-xs text-slate-400 font-mono">O1</span>
              </div>
              <CardTitle className="text-xl">1. Should I borrow at all?</CardTitle>
              <CardDescription>Evaluating borrowing safety against current financial commitments.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-baseline justify-between gap-2">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Recommended Stance</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 font-heading">{decisionLabel}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Monthly Cashflow Left</div>
                  <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {formatINR(emi.cashflowRemaining)} / mo
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {decisionReason}
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
              <span>Why this stance? View Cashflow Breakdown</span>
            </Button>
          </div>
        </Card>
      </motion.div>

      <Dialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Why This Stance? Cashflow Breakdown"
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            This recommendation is derived from your disposable monthly income after essential household living expenses and existing EMI commitments.
          </p>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 font-mono text-xs text-slate-800 dark:text-slate-200">
            {emi.breakdown.map((line, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-slate-200 dark:border-slate-900 pb-1 last:border-none">
                <span>{line}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            Borrower Copilot prioritizes your financial stability over maximum loan sanction.
          </p>
        </div>
      </Dialog>
    </>
  );
}
