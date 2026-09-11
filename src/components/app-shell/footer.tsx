import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/70 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-xs py-8 px-4 sm:px-6 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="font-bold text-slate-800 dark:text-slate-200 font-heading">BORROWER COPILOT</span>
          <span>• Built for Lokta Challenge</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-600 dark:text-slate-400">
          <Link href="/examples" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
            Priya, Ravi & Anita Examples
          </Link>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>Deterministic Rules Engine</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>Zero Personal Data Stored</span>
        </div>
      </div>
    </footer>
  );
}
