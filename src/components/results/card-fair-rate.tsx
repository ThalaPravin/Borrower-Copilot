"use client";

import React, { useState } from "react";
import { AssessmentResult } from "@/features/borrower-assessment/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { formatRateRange, formatINR } from "@/lib/formatters";
import { HelpCircle, Percent, Receipt } from "lucide-react";
import { motion } from "framer-motion";

export interface CardFairRateProps {
  result: AssessmentResult;
}

export function CardFairRate({ result }: CardFairRateProps) {
  const [showModal, setShowModal] = useState(false);
  const { fairRate, apr } = result;

  return (
    <>
      <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
        <Card className="hover:border-slate-400 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
          <div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                  Output 3
                </span>
                <span className="text-xs text-slate-400 font-mono">O3</span>
              </div>
              <CardTitle className="text-xl">3. What rate is fair for me?</CardTitle>
              <CardDescription>Estimated Fair Interest Rate Band & All-in APR.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Fair Rate Box */}
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <span>Fair Interest Rate Band</span>
                    <Percent className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-heading">
                    {formatRateRange(fairRate.min, fairRate.max)}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Annual Headline Interest Rate
                  </div>
                </div>

                {/* All-in APR Box */}
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <span>Illustrative All-In APR</span>
                    <Receipt className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-heading">
                    {apr.effectiveAnnualizedCost.toFixed(1)}% p.a.
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Includes {apr.processingFeePct}% Processing Fee
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {fairRate.reason}
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
              <span>Why this rate band? View Fee & Rate Derivation</span>
            </Button>
          </div>
        </Card>
      </motion.div>

      <Dialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Why This Interest Rate Band & APR?"
      >
        <div className="space-y-3 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            Interest rates are benchmarked against current Indian lending markets based on loan type, income stability, credit score, and collateral status.
          </p>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 font-mono text-slate-700 dark:text-slate-200">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 block font-sans">Rate Derivation Steps:</span>
            {fairRate.breakdown.map((line, idx) => (
              <div key={idx}>• {line}</div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 text-slate-700 dark:text-slate-300">
            <span className="font-bold text-amber-600 dark:text-amber-400 block font-sans">All-In APR Impact:</span>
            <div>• Headline Rate: {apr.headlineRate}%</div>
            <div>• Processing Fee: {apr.processingFeePct}% ({formatINR(apr.processingFeeRupees)})</div>
            <div>• Total Repayment: {formatINR(apr.totalRepayment)}</div>
            <div>• Effective Annual Cost (APR): {apr.effectiveAnnualizedCost}%</div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
