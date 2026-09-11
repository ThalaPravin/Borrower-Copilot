"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-100/90 dark:bg-slate-950 text-slate-500 dark:text-slate-400 pt-16 pb-12 px-4 sm:px-6 transition-colors">
      {/* Background Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-gradient-to-t from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center space-y-8 relative z-10">
        
        {/* Brand Showcase Section with Depth-Orbiting Bee */}
        <div className="relative w-full max-w-3xl flex flex-col items-center justify-center py-4">
          
          {/* Sub-Title Badge */}
          <div className="relative z-10 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-950/80 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-extrabold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Independent Financial Self-Assessment Copilot</span>
          </div>

          {/* Orbiting Bee Object Container */}
          <div className="relative w-full flex items-center justify-center py-2">
            
            {/* Smooth 3D Depth Orbiting Bee (Goes Behind & In-Front of Text without 2D flipping) */}
            <motion.div
              animate={{
                x: [-220, -110, 0, 110, 220, 110, 0, -110, -220],
                y: [24, 34, 38, 34, 24, -25, -35, -25, 24],
                scale: [1.2, 1.25, 1.3, 1.25, 1.2, 0.8, 0.75, 0.8, 1.2],
                zIndex: [30, 30, 30, 30, 30, 0, 0, 0, 30],
                opacity: [1, 1, 1, 1, 1, 0.7, 0.6, 0.7, 1],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute pointer-events-none flex items-center justify-center"
            >
              {/* Crisp 3D Bee Badge (No rotateY squishing, full size) */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-amber-400/40 blur-md animate-ping" />
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 border border-yellow-200/90 shadow-xl shadow-amber-500/50 flex items-center justify-center text-xl transform select-none">
                  🐝
                </div>
                {/* Bee Wing Sparkles */}
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.3, 0.8] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="absolute -top-1.5 -right-1 text-xs text-yellow-300 pointer-events-none"
                >
                  ✨
                </motion.span>
              </div>
            </motion.div>

            {/* Grand Capitalized Brand Title (Positioned at z-10 so the Bee passes behind (z-0) & in front (z-30)) */}
            <h2 className="relative z-10 text-4xl sm:text-6xl md:text-7xl font-black tracking-tight font-heading uppercase bg-gradient-to-r from-slate-900 via-emerald-600 to-teal-500 dark:from-white dark:via-emerald-400 dark:to-teal-300 bg-clip-text text-transparent drop-shadow-sm select-none py-1">
              BORROWER COPILOT
            </h2>
          </div>

          <p className="relative z-10 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto mt-4 font-medium leading-relaxed">
            Empowering Indian borrowers with deterministic eligibility insights, fair interest rate benchmarks, and safe EMI ceilings before approaching lenders.
          </p>
        </div>

        {/* Bottom Credits */}
        <div className="w-full border-t border-slate-200/80 dark:border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>© {new Date().getFullYear()} <strong className="text-slate-800 dark:text-slate-200 font-bold">BORROWER COPILOT</strong> • Built for Lokta Engineering Challenge</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-semibold">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              100% Client-Side Engine
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
