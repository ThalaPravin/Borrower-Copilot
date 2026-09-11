import React from "react";
import { ShieldAlert } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="bg-amber-500/10 dark:bg-slate-900/90 border-b border-amber-500/20 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs py-2 px-4 text-center flex items-center justify-center gap-2 transition-colors">
      <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
      <span>
        <strong>Self-Assessment Tool:</strong> Borrower Copilot is an independent financial self-assessment companion. Not a lender approval engine, credit bureau, or chatbot.
      </span>
    </div>
  );
}
