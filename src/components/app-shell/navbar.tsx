"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, Users, RotateCcw, Sparkles, Activity, ShieldCheck } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../theme-toggle";

export interface NavbarProps {
  onResetAssessment?: () => void;
  activeView?: "form" | "results" | "card" | "examples";
}

export function Navbar({ onResetAssessment, activeView = "form" }: NavbarProps) {
  const isExamples = activeView === "examples";

  return (
    <header className="sticky top-2 z-50 w-full px-3 sm:px-6 transition-all duration-300">
      <div className="max-w-6xl mx-auto relative group/nav">
        {/* Animated Gradient Glow Aura behind Navbar */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/30 via-teal-500/20 to-indigo-500/30 rounded-2xl blur-md opacity-70 group-hover/nav:opacity-100 transition duration-500 pointer-events-none animate-pulse" />

        {/* Floating Glass Container */}
        <div className="relative flex h-16 items-center justify-between px-4 sm:px-6 rounded-2xl bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 shadow-2xl shadow-slate-950/10 dark:shadow-emerald-950/20">
          
          {/* Logo Brand Section */}
          <Link href="/" className="flex items-center gap-3 group/logo">
            <div className="relative">
              {/* Pulsing ring halo */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-xl blur opacity-40 group-hover/logo:opacity-90 transition duration-300 animate-pulse" />
              
              <motion.div
                whileHover={{ scale: 1.1, rotate: 180 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 border border-emerald-400/30"
              >
                <Compass className="w-5.5 h-5.5 text-white" />
              </motion.div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent font-heading">
                  BORROWER COPILOT
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>DETERMINISTIC ENGINE</span>
                </span>
              </div>
              <span className="text-[10px] uppercase font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider block leading-none pt-0.5">
                Indian Loan Self-Assessment
              </span>
            </div>
          </Link>

          {/* Navigation Links with Framer Motion Animated Active Pill */}
          <nav className="flex items-center gap-1.5 sm:gap-3">
            <div className="flex items-center p-1 rounded-xl bg-slate-100/80 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80">
              {/* Tab 1: Assessment */}
              <Link href="/" className="relative px-3 py-1.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 rounded-lg transition-colors z-10">
                {!isExamples && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200/80 dark:border-slate-700/60 -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Compass className={`w-3.5 h-3.5 transition-colors ${!isExamples ? "text-emerald-500" : "text-slate-400 dark:text-slate-500"}`} />
                <span className={!isExamples ? "text-slate-900 dark:text-white font-extrabold" : "text-slate-600 dark:text-slate-400"}>
                  Assessment
                </span>
              </Link>

              {/* Tab 2: Sample Borrowers */}
              <Link href="/examples" className="relative px-3 py-1.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 rounded-lg transition-colors z-10">
                {isExamples && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200/80 dark:border-slate-700/60 -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Users className={`w-3.5 h-3.5 transition-colors ${isExamples ? "text-amber-500" : "text-slate-400 dark:text-slate-500"}`} />
                <span className={isExamples ? "text-slate-900 dark:text-white font-extrabold" : "text-slate-600 dark:text-slate-400"}>
                  Sample Borrowers
                </span>
              </Link>
            </div>

            {/* Reset Action Button */}
            {onResetAssessment && activeView !== "form" && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onResetAssessment}
                  className="text-xs font-bold bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:text-emerald-500 transition-all shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                  <span className="hidden sm:inline">Start Over</span>
                </Button>
              </motion.div>
            )}

            {/* Theme Toggle Switcher */}
            <div className="pl-1">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
