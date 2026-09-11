import { BorrowerInputs } from "../types";
import { LOAN_PRODUCTS } from "../constants";

export interface AffordabilityResult {
  lenderStyleMaxEmi: number;
  borrowerSafeMaxEmi: number;
  availableNetCashflow: number;
  currentFoirPct: number;
  essentialExpenses: number;
  reasons: string[];
  breakdownLines: string[];
}

/**
 * Calculates Lender-style affordability (pure FOIR based) vs Borrower-safe affordability (cashflow after essentials + safety buffers).
 */
export function calculateAffordability(inputs: BorrowerInputs): AffordabilityResult {
  const {
    monthlyNetIncome,
    existingMonthlyEmi,
    essentialExpenses: rawEssentials,
    incomeType,
    incomeStability,
    loanType,
    knowsCreditScore,
    creditScore,
    emergencySavingsMonths,
    hasMissedOrBouncedEmiRecently,
  } = inputs;

  const product = LOAN_PRODUCTS[loanType] || LOAN_PRODUCTS.personal_loan;

  // 1. Lender Style Max EMI
  // Lenders typically cap (Existing EMI + New EMI) at 50% - 60% of Gross/Net Income regardless of personal expenses.
  let lenderFoirCap = product.lenderMaxFoir; // e.g. 0.50 for PL

  // Salaried with prime score might get up to 55-60% lender FOIR
  if (incomeType === "salaried" && knowsCreditScore && creditScore && creditScore >= 750) {
    lenderFoirCap = Math.min(0.60, lenderFoirCap + 0.05);
  }

  // Informal/variable or low income gets lower lender FOIR cap
  if (incomeType === "informal_variable" || incomeType === "other") {
    lenderFoirCap = Math.max(0.40, lenderFoirCap - 0.10);
  }

  const lenderStyleTotalEmiCap = Math.round(monthlyNetIncome * lenderFoirCap);
  const lenderStyleMaxEmi = Math.max(0, lenderStyleTotalEmiCap - existingMonthlyEmi);

  // 2. Essential Household Expenses
  // If essential expenses not provided or 0, estimate conservatively as 35% of income
  const essentialExpenses = rawEssentials > 0 ? rawEssentials : Math.round(monthlyNetIncome * 0.35);

  // 3. Available Net Cashflow after Essentials and Existing Obligations
  const availableNetCashflow = Math.max(0, monthlyNetIncome - essentialExpenses - existingMonthlyEmi);

  // 4. Borrower Safe Max EMI Calculation
  // Borrower safe model DOES NOT use lender's loose FOIR. It starts with available disposable cashflow and applies a safety retention factor (e.g. 40%-60% of free cash flow) to ensure savings/cushion remain intact.
  let safetyRetentionFactor = 0.50; // Default: borrower uses at most 50% of uncommitted cashflow for new EMI

  const breakdownLines: string[] = [
    `Monthly Net Income: ₹${monthlyNetIncome.toLocaleString("en-IN")}`,
    `Essential Household Expenses: ₹${essentialExpenses.toLocaleString("en-IN")}`,
    `Existing Monthly EMIs: ₹${existingMonthlyEmi.toLocaleString("en-IN")}`,
    `Uncommitted Cashflow = Income - Essentials - Existing EMIs = ₹${availableNetCashflow.toLocaleString("en-IN")}`,
  ];

  const reasons: string[] = [];

  // Adjustments based on stability & credit uncertainty
  if (incomeType === "informal_variable" || incomeStability === "unstable") {
    safetyRetentionFactor -= 0.15; // Reduce to 35% due to variable income risk
    reasons.push("Income is variable/unstable, reducing safe EMI ceiling factor to preserve buffer.");
    breakdownLines.push("Adjustment: -15% factor for income variability.");
  } else if (incomeType === "self_employed") {
    safetyRetentionFactor -= 0.05; // Slightly tighter for business income
    reasons.push("Self-employed income requires a buffer for business seasonality.");
  }

  if (hasMissedOrBouncedEmiRecently) {
    safetyRetentionFactor -= 0.15;
    reasons.push("Recent bounced/missed EMI indicates cash flow tightness.");
    breakdownLines.push("Adjustment: -15% factor due to recent bounced EMI.");
  }

  if (!knowsCreditScore || creditScore === null) {
    safetyRetentionFactor -= 0.05;
    reasons.push("Unknown credit score adds rate uncertainty; keeping EMI ceiling conservative.");
  }

  if (emergencySavingsMonths === 0 || emergencySavingsMonths === null) {
    safetyRetentionFactor -= 0.05;
    reasons.push("Lack of documented emergency savings buffer requires lower EMI commitment.");
  }

  // Cap factor between 0.20 and 0.65
  safetyRetentionFactor = Math.max(0.20, Math.min(0.65, safetyRetentionFactor));

  const rawBorrowerSafeMaxEmi = Math.round(availableNetCashflow * safetyRetentionFactor);

  // Also enforce that Total FOIR (Existing + New EMI) / Income does not exceed safe FOIR benchmark (e.g., 35-40%)
  const maxSafeTotalEmiByFoir = Math.round(monthlyNetIncome * product.borrowerSafeFoir);
  const maxNewEmiByFoir = Math.max(0, maxSafeTotalEmiByFoir - existingMonthlyEmi);

  const borrowerSafeMaxEmi = Math.min(rawBorrowerSafeMaxEmi, maxNewEmiByFoir);

  const currentFoirPct = Number(((existingMonthlyEmi / (monthlyNetIncome || 1)) * 100).toFixed(1));

  breakdownLines.push(
    `Lender-Style Max New EMI (at ${(lenderFoirCap * 100).toFixed(0)}% FOIR cap): ₹${lenderStyleMaxEmi.toLocaleString("en-IN")}`,
    `Borrower-Safe Max New EMI (accounting for essential expenses & cushion): ₹${borrowerSafeMaxEmi.toLocaleString("en-IN")}`
  );

  return {
    lenderStyleMaxEmi,
    borrowerSafeMaxEmi,
    availableNetCashflow,
    currentFoirPct,
    essentialExpenses,
    reasons,
    breakdownLines,
  };
}
