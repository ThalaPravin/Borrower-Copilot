"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Compass, Users, Sparkles, FileText, Lock, Cpu, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-100/90 dark:bg-slate-950 text-slate-500 dark:text-slate-400 pt-12 pb-8 px-4 sm:px-6 transition-colors">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-gradient-to-t from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Brand Showcase Section with 3D Orbiting Bee */}
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-4 relative group">
          
          {/* 3D Perspective Orbit Container for the Bee */}
          <div className="relative inline-block py-4 px-6 sm:px-12" style={{ perspective: "1000px" }}>
            
            {/* 3D Orbiting Bee / Drone Object */}
            <motion.div
              animate={{
                x: [-160, -80, 0, 80, 160, 80, 0, -80, -160],
                y: [-30, 25, -30, 25, -30, 25, -30, 25, -30],
                rotateZ: [15, -10, 15, -10, 15, -10, 15, -10, 15],
                rotateY: [0, 90, 180, 270, 360],
                scale: [0.8, 1.25, 1.4, 1.25, 0.8, 1.25, 1.4, 1.25, 0.8],
              }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex items-center justify-center"
            >
              {/* Glowing 3D Bee Badge */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-amber-400/40 blur-md animate-ping" />
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 border border-yellow-200/80 shadow-lg shadow-amber-500/50 flex items-center justify-center text-lg transform hover:scale-125 transition-transform cursor-pointer">
                  🐝
                </div>
                {/* Bee Wing Sparkles */}
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="absolute -top-1 -right-1 text-xs text-yellow-300"
                >
                  ✨
                </motion.span>
              </div>
            </motion.div>

            {/* Sub-Title Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-950/80 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-extrabold uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Independent Financial Self-Assessment Copilot</span>
            </div>

            {/* Main Grand Capitalized Brand Title */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight font-heading uppercase bg-gradient-to-r from-slate-900 via-emerald-600 to-teal-500 dark:from-white dark:via-emerald-400 dark:to-teal-300 bg-clip-text text-transparent drop-shadow-sm select-none">
              BORROWER COPILOT
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto mt-2 font-medium">
              Empowering Indian borrowers with deterministic eligibility insights, fair interest rate benchmarks, and safe EMI ceilings before approaching lenders.
            </p>
          </div>
        </div>

        {/* 3 Grid Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Pillar 1: Quick Navigation */}
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs uppercase font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider">
              <Compass className="w-4 h-4 text-emerald-500" />
              <span>Quick Navigation</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium flex items-center justify-between">
                  <span>Start Loan Assessment</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/examples" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium flex items-center justify-between">
                  <span>Sample Borrower Scenarios</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Pillar 2: Core Trust Engine */}
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs uppercase font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider">
              <Cpu className="w-4 h-4 text-emerald-500" />
              <span>Deterministic Architecture</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Pure TS Rules Engine (Zero LLM Hallucinations)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>RBI FOIR & Multi-factor Affordability Benchmarks</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3: Privacy & Security */}
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs uppercase font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider">
              <Lock className="w-4 h-4 text-emerald-500" />
              <span>Borrower Privacy First</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Local Client Computation</span>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-emerald-500" />
                <span>One-Page Printable Lender Negotiation Card</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>© {new Date().getFullYear()} <strong className="text-slate-800 dark:text-slate-200 font-bold">BORROWER COPILOT</strong> • Built for Lokta Engineering Challenge</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-semibold">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              100% Open Rules
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
