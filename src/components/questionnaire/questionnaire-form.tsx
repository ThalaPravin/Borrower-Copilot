"use client";

import React, { useState } from "react";
import { BorrowerInputs } from "@/features/borrower-assessment/types";
import { SAMPLE_BORROWERS } from "@/data/sample-borrowers";
import { Step1Loan } from "./step-1-loan";
import { Step2Income } from "./step-2-income";
import { Step3Commitments } from "./step-3-commitments";
import { Step4Credit } from "./step-4-credit";
import { Step5Offer } from "./step-5-offer";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface QuestionnaireFormProps {
  initialInputs: BorrowerInputs;
  onSubmit: (inputs: BorrowerInputs) => void;
  onPrefillSample?: (borrowerKey: "priya" | "ravi" | "anita") => void;
}

export function QuestionnaireForm({ initialInputs, onSubmit, onPrefillSample }: QuestionnaireFormProps) {
  const [step, setStep] = useState<number>(1);
  const [inputs, setInputs] = useState<BorrowerInputs>(initialInputs);

  const totalSteps = 5;

  const handleUpdate = (fields: Partial<BorrowerInputs>) => {
    setInputs((prev) => ({ ...prev, ...fields }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      onSubmit(inputs);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handlePrefill = (key: "priya" | "ravi" | "anita") => {
    const sample = SAMPLE_BORROWERS[key];
    setInputs(sample.inputs);
    if (onPrefillSample) onPrefillSample(key);
  };

  const isCurrentStepValid = () => {
    if (step === 1) return inputs.requestedAmount > 0;
    if (step === 2) return inputs.monthlyNetIncome > 0;
    if (step === 3) return inputs.age > 0;
    return true;
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Sample Borrowers Quick Selector Bar */}
      <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try Sample Borrower Scenarios</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">One-click prefill</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => handlePrefill("priya")}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/70 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-emerald-500/50 text-left transition-all group cursor-pointer"
          >
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
              Priya (Salaried SWE)
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">₹1.1L Income • 780 Score • ₹8L Loan</div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => handlePrefill("ravi")}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/70 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-amber-500/50 text-left transition-all group cursor-pointer"
          >
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400">
              Ravi (Kirana Store)
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">₹60k Income • Unknown Score • ₹15L LAP</div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => handlePrefill("anita")}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/70 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-rose-500/50 text-left transition-all group cursor-pointer"
          >
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-rose-400">
              Anita (Gig Rider)
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">₹28k Income • Bounced EMI • ₹1.5L EV</div>
          </motion.button>
        </div>
      </div>

      {/* Main Questionnaire Card */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-6 md:p-8 shadow-xl backdrop-blur-sm space-y-6 transition-colors">
        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress value={(step / totalSteps) * 100} />
        </div>

        {/* Step Content with AnimatePresence */}
        <div className="py-2 min-h-[300px]">
          <AnimatePresence mode="wait">
            {step === 1 && <Step1Loan key="step1" inputs={inputs} onChange={handleUpdate} />}
            {step === 2 && <Step2Income key="step2" inputs={inputs} onChange={handleUpdate} />}
            {step === 3 && <Step3Commitments key="step3" inputs={inputs} onChange={handleUpdate} />}
            {step === 4 && <Step4Credit key="step4" inputs={inputs} onChange={handleUpdate} />}
            {step === 5 && <Step5Offer key="step5" inputs={inputs} onChange={handleUpdate} />}
          </AnimatePresence>
        </div>

        {/* Form Controls */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back
          </Button>

          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleNext}
            disabled={!isCurrentStepValid()}
          >
            {step === totalSteps ? (
              <>
                <span>Calculate Assessment</span>
                <Sparkles className="w-4 h-4 ml-1.5" />
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
