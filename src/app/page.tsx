"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/app-shell/navbar";
import { QuestionnaireForm } from "@/components/questionnaire/questionnaire-form";
import { ResultsOverview } from "@/components/results/results-overview";
import { BorrowerInputs, AssessmentResult } from "@/features/borrower-assessment/types";
import { calculateAssessment } from "@/features/borrower-assessment/assessment";
import { SAMPLE_BORROWERS } from "@/data/sample-borrowers";
import { Sparkles, ArrowRight, ShieldCheck, Scale, Percent, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const [inputs, setInputs] = useState<BorrowerInputs>(SAMPLE_BORROWERS.priya.inputs);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [viewState, setViewState] = useState<"hero" | "form" | "results">("hero");

  const handleStartQuestionnaire = () => {
    setViewState("form");
  };

  const handleCalculate = (finalInputs: BorrowerInputs) => {
    setInputs(finalInputs);
    const result = calculateAssessment(finalInputs);
    setAssessmentResult(result);
    setViewState("results");
  };

  const handleReset = () => {
    setAssessmentResult(null);
    setViewState("form");
  };

  const handlePrefillSample = (key: "priya" | "ravi" | "anita") => {
    const sample = SAMPLE_BORROWERS[key];
    setInputs(sample.inputs);
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors">
      <Navbar
        onResetAssessment={handleReset}
        activeView={viewState === "results" ? "results" : "form"}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-10">
        <AnimatePresence mode="wait">
          {/* Landing Hero View */}
          {viewState === "hero" && (
            <motion.div
              key="hero-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-12 max-w-4xl mx-auto py-6"
            >
              {/* Hero Header */}
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Before You Walk Into a Lender&apos;s Office</span>
                </motion.div>

                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight font-heading">
                  Be the most informed person in the room.
                </h1>

                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
                  Borrower Copilot is an independent financial self-assessment tool. Answer four critical questions before approaching any bank or loan app officer.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleStartQuestionnaire}
                    className="bg-emerald-600 hover:bg-emerald-500 text-base font-bold px-8 shadow-lg shadow-emerald-600/20"
                  >
                    <span>Start Self-Assessment</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      handleCalculate(SAMPLE_BORROWERS.priya.inputs);
                    }}
                    className="text-base"
                  >
                    <Sparkles className="w-4 h-4 mr-2 text-emerald-500" />
                    <span>Try Sample Demo (Priya)</span>
                  </Button>
                </div>
              </div>

              {/* 4 Core Questions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <motion.div
                  whileHover={{ y: -3 }}
                  className="p-6 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2 text-xs uppercase font-extrabold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Question 1</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Should I borrow at all?</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Calculates whether borrowing fits your uncommitted cashflow or if you should borrow less / delay.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -3 }}
                  className="p-6 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2 text-xs uppercase font-extrabold text-emerald-600 dark:text-emerald-400">
                    <Scale className="w-4 h-4" />
                    <span>Question 2</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">How much am I really eligible for?</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Contrasts loose lender sanction limits with your borrower-safe borrowing ceiling.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -3 }}
                  className="p-6 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2 text-xs uppercase font-extrabold text-emerald-600 dark:text-emerald-400">
                    <Percent className="w-4 h-4" />
                    <span>Question 3</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">What is a fair interest rate for me?</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Estimates a fair benchmark interest rate band & computes true All-in APR including processing fees.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -3 }}
                  className="p-6 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2 text-xs uppercase font-extrabold text-emerald-600 dark:text-emerald-400">
                    <Calendar className="w-4 h-4" />
                    <span>Question 4</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">What EMI should I agree to?</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Establishes a safe EMI ceiling, evaluates 3yr vs 5yr tenure trade-offs, and stress tests income shocks.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Questionnaire Form View */}
          {viewState === "form" && (
            <motion.div
              key="form-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionnaireForm
                initialInputs={inputs}
                onSubmit={handleCalculate}
                onPrefillSample={handlePrefillSample}
              />
            </motion.div>
          )}

          {/* Results Overview View */}
          {viewState === "results" && assessmentResult && (
            <motion.div
              key="results-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ResultsOverview
                inputs={inputs}
                result={assessmentResult}
                onEditAnswers={() => setViewState("form")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
