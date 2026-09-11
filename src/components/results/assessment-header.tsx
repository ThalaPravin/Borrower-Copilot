"use client";

import React from "react";
import { AssessmentResult } from "@/features/borrower-assessment/types";
import { Badge } from "../ui/badge";
import { Info, AlertTriangle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export interface AssessmentHeaderProps {
  result: AssessmentResult;
}

export function AssessmentHeader({ result }: AssessmentHeaderProps) {
  const { decision, decisionLabel, decisionReason, confidence, confidenceReason, flags } = result;

  const decisionTheme = {
    borrow: {
      bg: "bg-emerald-500/10 dark:bg-emerald-950/50 border-emerald-500/40 dark:border-emerald-500/50 shadow-emerald-500/10",
      text: "text-emerald-700 dark:text-emerald-400",
      glow: "bg-emerald-500/20",
      badgeVariant: "borrow" as const,
      renderAnimatedIcon: () => (
        <div className="relative flex items-center justify-center w-20 h-20">
          {/* Continuous Rotating Dashed Halo Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/40 dark:border-emerald-400/40"
          />

          {/* Continuous Breathing Glow */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="absolute w-16 h-16 rounded-full bg-emerald-500/30 blur-lg"
          />

          {/* Continuous Floating Icon */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="relative z-10 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"
          >
            <svg className="w-14 h-14 text-emerald-600 dark:text-emerald-400" viewBox="0 0 52 52">
              <motion.circle
                cx="26"
                cy="26"
                r="23"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              <motion.path
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 27l7 7 16-16"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
              />
            </svg>
          </motion.div>
        </div>
      ),
    },
    borrow_less: {
      bg: "bg-amber-500/10 dark:bg-amber-950/50 border-amber-500/40 dark:border-amber-500/50 shadow-amber-500/10",
      text: "text-amber-700 dark:text-amber-400",
      glow: "bg-amber-500/20",
      badgeVariant: "borrow_less" as const,
      renderAnimatedIcon: () => (
        <div className="relative flex items-center justify-center w-20 h-20">
          {/* Continuous Counter-Rotating Halo Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/40 dark:border-amber-400/40"
          />

          {/* Continuous Pulsing Aura */}
          <motion.div
            animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute w-16 h-16 rounded-full bg-amber-500/30 blur-lg"
          />

          {/* Continuous Floating & Tilting Warning Icon */}
          <motion.div
            animate={{ y: [-6, 6, -6], rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
            className="relative z-10 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
          >
            <svg className="w-14 h-14 text-amber-600 dark:text-amber-400" viewBox="0 0 52 52">
              <motion.path
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M26 6L4 44h44L26 6z"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              <motion.line
                x1="26"
                y1="19"
                x2="26"
                y2="31"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              />
              <motion.circle
                cx="26"
                cy="37"
                r="2.5"
                fill="currentColor"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 400 }}
              />
            </svg>
          </motion.div>
        </div>
      ),
    },
    dont_borrow: {
      bg: "bg-rose-500/10 dark:bg-rose-950/50 border-rose-500/40 dark:border-rose-500/50 shadow-rose-500/10",
      text: "text-rose-700 dark:text-rose-400",
      glow: "bg-rose-500/20",
      badgeVariant: "dont_borrow" as const,
      renderAnimatedIcon: () => (
        <div className="relative flex items-center justify-center w-20 h-20">
          {/* Continuous Expanding Shockwave Ring */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border-2 border-rose-500/50 dark:border-rose-400/50"
          />

          {/* Continuous Pulsing Red Glow */}
          <motion.div
            animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="absolute w-16 h-16 rounded-full bg-rose-500/30 blur-lg"
          />

          {/* Continuous Floating Stop Cross Icon */}
          <motion.div
            animate={{ y: [-5, 5, -5], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="relative z-10 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]"
          >
            <svg className="w-14 h-14 text-rose-600 dark:text-rose-400" viewBox="0 0 52 52">
              <motion.circle
                cx="26"
                cy="26"
                r="23"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              <motion.path
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                d="M16 16l20 20M36 16L16 36"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
              />
            </svg>
          </motion.div>
        </div>
      ),
    },
  };

  const theme = decisionTheme[decision];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, type: "spring", stiffness: 260, damping: 20 }}
      className="space-y-4"
    >
      {/* High-Impact Animated Hero Banner */}
      <div className={`relative overflow-hidden p-6 sm:p-8 rounded-3xl border-2 ${theme.bg} shadow-xl backdrop-blur-md transition-colors space-y-4`}>
        {/* Background glow orb with continuous subtle drift */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className={`absolute -right-10 -bottom-10 w-48 h-48 rounded-full ${theme.glow} blur-3xl pointer-events-none`}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            {theme.renderAnimatedIcon()}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xs uppercase font-extrabold text-slate-600 dark:text-slate-400 tracking-wider flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Recommendation Outcome</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
                className={`text-3xl sm:text-4xl font-black tracking-tight ${theme.text} font-heading`}
              >
                {decisionLabel}
              </motion.h1>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="flex items-center gap-2 self-start sm:self-center"
          >
            <Badge variant={theme.badgeVariant} className="px-3.5 py-1 text-sm font-black shadow-xs">
              {decisionLabel.toUpperCase()}
            </Badge>
            <Badge variant={confidence} className="px-3 py-1 text-xs font-bold">
              {confidence.toUpperCase()} CONFIDENCE
            </Badge>
          </motion.div>
        </div>

        {/* Reason Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-relaxed font-semibold pt-3 border-t border-slate-300/80 dark:border-slate-800/80 relative z-10"
        >
          {decisionReason}
        </motion.p>

        {/* Confidence Explanation */}
        {confidenceReason && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 pt-1 font-medium relative z-10"
          >
            <Info className="w-4 h-4 text-slate-500 shrink-0" />
            <span>{confidenceReason}</span>
          </motion.div>
        )}
      </div>

      {/* High-priority Flags / Risk Banners */}
      {flags.length > 0 && (
        <div className="space-y-2">
          {flags.map((flag, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + 0.1 * idx, type: "spring" }}
              className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-start gap-3 shadow-xs ${
                flag.type === "danger"
                  ? "bg-rose-500/10 dark:bg-rose-950/40 border-rose-500/30 dark:border-rose-800/60 text-rose-900 dark:text-rose-200"
                  : flag.type === "warning"
                  ? "bg-amber-500/10 dark:bg-amber-950/40 border-amber-500/30 dark:border-amber-800/60 text-amber-900 dark:text-amber-200"
                  : "bg-sky-500/10 dark:bg-sky-950/40 border-sky-500/30 dark:border-sky-800/60 text-sky-900 dark:text-sky-200"
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{flag.message}</span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
