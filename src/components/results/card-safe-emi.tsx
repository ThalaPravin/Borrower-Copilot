"use client";

import React, { useState } from "react";
import { AssessmentResult } from "@/features/borrower-assessment/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { formatINR } from "@/lib/formatters";
import { HelpCircle, Calendar, Activity } from "lucide-react";
import { motion } from "framer-motion";

export interface CardSafeEmiProps {
  result: AssessmentResult;
}

export function CardSafeEmi({ result }: CardSafeEmiProps) {
  const [showModal, setShowModal] = useState(false);
  const { emi, stressCase } = result;

  return (
    <>
      <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
        <Card className="hover:border-slate-400 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
          <div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                  Output 4
                </span>
                <span className="text-xs text-slate-400 font-mono">O4</span>
              </div>
              <CardTitle className="text-xl">4. What EMI should I agree to?</CardTitle>
              <CardDescription>Safe EMI Ceiling, Tenure Trade-off & Stress Resilience.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Safe EMI Ceiling */}
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    Safe EMI Ceiling
                  </div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-heading">
                    {formatINR(emi.maximumSafeEmi)} / mo
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Max safe monthly commitment
                  </div>
                </div>

                {/* Requested EMI */}
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    Requested Loan EMI
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-heading">
                    {formatINR(emi.recommendedEmi)} / mo
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Estimated baseline monthly outflow
                  </div>
                </div>
              </div>

              {/* Tenure Trade-offs Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Tenure Trade-off Comparison</span>
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-[11px]">Lower EMI = Higher Total Interest</span>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 overflow-hidden divide-y divide-slate-200 dark:divide-slate-800/60 text-xs">
                  {emi.tenureTradeoffs.map((t) => (
                    <div
                      key={t.tenureYears}
                      className={`p-3 flex items-center justify-between transition-colors ${
                        t.tenureMonths === emi.recommendedTenureMonths ? "bg-emerald-500/10 dark:bg-emerald-950/30" : ""
                      }`}
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{t.tenureYears} Years</span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Total: {formatINR(t.totalRepayment)}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-slate-900 dark:text-slate-100">{formatINR(t.monthlyEmi)} / mo</span>
                        <span className="text-amber-600 dark:text-amber-400 text-[11px] block font-semibold">Interest: {formatINR(t.totalInterest)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stress Case Summary Box */}
              <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                stressCase.isCushionPositive
                  ? "bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-500/30 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-200"
                  : "bg-rose-500/10 dark:bg-rose-950/20 border-rose-500/30 dark:border-rose-800/40 text-rose-800 dark:text-rose-200"
              }`}>
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
                  <Activity className="w-4 h-4" />
                  <span>Stress Case: {stressCase.scenarioTitle}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300">{stressCase.scenarioDescription}</p>
                <p className="font-semibold pt-1 border-t border-slate-200 dark:border-slate-800/60">{stressCase.impactSummary}</p>
              </div>
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
              <span>Why this EMI ceiling? View FOIR Formula</span>
            </Button>
          </div>
        </Card>
      </motion.div>

      <Dialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Why This Safe EMI Ceiling?"
      >
        <div className="space-y-3 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            The Safe EMI ceiling ensures that your total debt payments leave enough uncommitted cashflow to absorb living expenses and emergency shocks.
          </p>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 font-mono text-slate-700 dark:text-slate-200">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 block font-sans">Formula Breakdown:</span>
            {emi.breakdown.map((line, idx) => (
              <div key={idx}>• {line}</div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 text-slate-700 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-slate-200 block font-sans">Stress Mitigation Advice:</span>
            <div>{stressCase.mitigationAdvice}</div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
