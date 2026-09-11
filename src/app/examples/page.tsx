"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/app-shell/navbar";
import { SAMPLE_BORROWERS } from "@/data/sample-borrowers";
import { calculateAssessment } from "@/features/borrower-assessment/assessment";
import { ResultsOverview } from "@/components/results/results-overview";
import { formatINR } from "@/lib/formatters";
import { Users, User } from "lucide-react";
import { motion } from "framer-motion";

export default function ExamplesPage() {
  const [selectedBorrowerKey, setSelectedBorrowerKey] = useState<"priya" | "ravi" | "anita">("priya");

  const sample = SAMPLE_BORROWERS[selectedBorrowerKey];
  // Calculate dynamically using deterministic rules engine (No hardcoding!)
  const assessmentResult = calculateAssessment(sample.inputs);

  return (
    <div className="min-h-screen flex flex-col transition-colors">
      <Navbar activeView="examples" />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Interactive Sample Run-Throughs</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
            See How Borrower Copilot Adapts
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
            Switch between three distinct Indian borrower profiles to see how our rules engine dynamically adapts outputs, rate bands, and negotiation advice.
          </p>
        </div>

        {/* Borrower Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["priya", "ravi", "anita"] as const).map((key) => {
            const b = SAMPLE_BORROWERS[key];
            const isSelected = key === selectedBorrowerKey;
            return (
              <motion.button
                key={key}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setSelectedBorrowerKey(key)}
                className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer shadow-sm ${
                  isSelected
                    ? "bg-white dark:bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/30 shadow-md"
                    : "bg-slate-50/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold flex items-center justify-center text-sm group-hover:scale-105 transition-transform font-heading">
                    {b.avatarInitials}
                  </div>
                  {isSelected && (
                    <span className="text-xs font-bold uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      Active Profile
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-1">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white font-heading">{b.name} ({b.age} yrs)</h3>
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{b.location} • {b.inputs.incomeType.replace("_", " ").toUpperCase()}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 font-medium">{b.tagline}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected Borrower Profile Context Card */}
        <div className="p-6 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider">
            <User className="w-4 h-4" />
            <span>Profile Summary & Questions Answered: {sample.name}</span>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">{sample.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Monthly Income</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{formatINR(sample.inputs.monthlyNetIncome)}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Existing EMIs</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{formatINR(sample.inputs.existingMonthlyEmi)}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Credit Score</span>
              <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                {sample.inputs.knowsCreditScore ? sample.inputs.creditScore : "Unknown"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Requested Loan</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{formatINR(sample.inputs.requestedAmount)}</span>
            </div>
          </div>

          <div className="pt-2 space-y-1 text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-300">Key Adaptive Context:</span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
              {sample.keyContextPoints.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Live Calculation Output using Rules Engine */}
        <ResultsOverview
          inputs={sample.inputs}
          result={assessmentResult}
          onEditAnswers={() => {}}
        />
      </div>
    </div>
  );
}
