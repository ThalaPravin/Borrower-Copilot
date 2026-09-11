"use client";

import React, { useState } from "react";
import { BorrowerInputs, AssessmentResult } from "@/features/borrower-assessment/types";
import { AssessmentHeader } from "./assessment-header";
import { CardShouldYouBorrow } from "./card-should-you-borrow";
import { CardHowMuch } from "./card-how-much";
import { CardFairRate } from "./card-fair-rate";
import { CardSafeEmi } from "./card-safe-emi";
import { NegotiationCardView } from "../negotiation-card/negotiation-card-view";
import { Button } from "../ui/button";
import { FileText, Edit3, Sparkles } from "lucide-react";
import { motion, Variants } from "framer-motion";

export interface ResultsOverviewProps {
  inputs: BorrowerInputs;
  result: AssessmentResult;
  onEditAnswers: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function ResultsOverview({ inputs, result, onEditAnswers }: ResultsOverviewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "card">("overview");

  if (activeTab === "card") {
    return (
      <NegotiationCardView
        inputs={inputs}
        result={result}
        onBackToAssessment={() => setActiveTab("overview")}
      />
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-5xl mx-auto py-2"
    >
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
            Your Borrowing Assessment
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            Independent evaluation based on your inputs • Deterministic rules engine
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onEditAnswers}>
            <Edit3 className="w-3.5 h-3.5 mr-1.5" />
            <span>Edit Answers</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveTab("card")}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            <span>View Negotiation Card</span>
          </Button>
        </div>
      </div>

      {/* Hero Decision Banner */}
      <motion.div variants={itemVariants}>
        <AssessmentHeader result={result} />
      </motion.div>

      {/* Four Output Cards Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <CardShouldYouBorrow result={result} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <CardHowMuch result={result} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <CardFairRate result={result} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <CardSafeEmi result={result} />
        </motion.div>
      </motion.div>

      {/* Negotiation Card CTA Banner */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-slate-100 to-slate-200 dark:from-emerald-950/60 dark:via-slate-900 dark:to-slate-950 border border-emerald-500/30 dark:border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md"
      >
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs uppercase font-bold text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Ready to speak to a lender?</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
            Generate your 1-Page Lender Negotiation Card
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Includes custom questions to ask lenders, safe ceilings, fair rates, and APR breakdown.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => setActiveTab("card")}
          className="bg-emerald-600 hover:bg-emerald-700 shrink-0"
        >
          <FileText className="w-4 h-4 mr-2" />
          <span>Open Negotiation Card</span>
        </Button>
      </motion.div>
    </motion.div>
  );
}
