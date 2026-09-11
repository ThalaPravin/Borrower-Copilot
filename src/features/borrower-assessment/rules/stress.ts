import { BorrowerInputs, StressCaseResult } from "../types";
import { calculateEmi } from "../calculations/emi";
import { LOAN_PRODUCTS } from "../constants";

/**
 * Calculates a borrower-specific stress scenario (income drop, interest rate shock, etc.)
 */
export function calculateStressCase(
  inputs: BorrowerInputs,
  currentSafeEmi: number,
  fairMinRate: number
): StressCaseResult {
  const {
    monthlyNetIncome,
    essentialExpenses,
    existingMonthlyEmi,
    incomeType,
    loanType,
    requestedAmount,
  } = inputs;

  const product = LOAN_PRODUCTS[loanType] || LOAN_PRODUCTS.personal_loan;
  const tenureMonths = product.typicalTenureYears * 12;

  // New loan EMI under current baseline assumptions
  const baselineNewEmi = calculateEmi(requestedAmount, fairMinRate, tenureMonths);

  let scenarioTitle = "";
  let scenarioDescription = "";
  let stressMonthlyOutflow = 0;
  let stressedIncome = monthlyNetIncome;

  if (incomeType === "salaried") {
    // 20% income reduction shock
    scenarioTitle = "Income Drops by 20%";
    scenarioDescription = "Simulates a job transition, salary haircut, or unexpected drop in monthly household take-home income.";
    stressedIncome = monthlyNetIncome * 0.80;
    stressMonthlyOutflow = essentialExpenses + existingMonthlyEmi + baselineNewEmi;
  } else if (incomeType === "informal_variable" || incomeType === "self_employed") {
    // Variable income drops to lower bound or -25%
    scenarioTitle = "Income Drops to Lower Bound (-25%)";
    scenarioDescription = "Simulates a dry season or lower business sales volume where monthly cash flow falls to the lower end of your range.";
    stressedIncome = monthlyNetIncome * 0.75;
    stressMonthlyOutflow = essentialExpenses + existingMonthlyEmi + baselineNewEmi;
  } else {
    // Floating Rate Hike by +2.0%
    const stressRate = fairMinRate + 2.0;
    const stressedNewEmi = calculateEmi(requestedAmount, stressRate, tenureMonths);
    scenarioTitle = "Interest Rate Increases by +2.0%";
    scenarioDescription = "Simulates a benchmark rate hike increasing your loan interest rate and monthly EMI.";
    stressMonthlyOutflow = essentialExpenses + existingMonthlyEmi + stressedNewEmi;
  }

  const remainingCushion = Math.round(stressedIncome - stressMonthlyOutflow);
  const isCushionPositive = remainingCushion >= 0;

  let impactSummary = "";
  let mitigationAdvice = "";

  if (isCushionPositive) {
    impactSummary = `Under stress, your monthly cashflow remains positive with ₹${remainingCushion.toLocaleString("en-IN")} buffer left.`;
    mitigationAdvice = "Your financial cushion is resilient enough to absorb this scenario without defaulting on payments.";
  } else {
    impactSummary = `Under stress, your monthly obligations would exceed stressed income by ₹${Math.abs(remainingCushion).toLocaleString("en-IN")}/month.`;
    mitigationAdvice = "Borrowing less or extending emergency savings is strongly recommended before committing to this loan amount.";
  }

  return {
    scenarioTitle,
    scenarioDescription,
    currentSafeEmi: baselineNewEmi,
    stressMonthlyOutflow: Math.round(stressMonthlyOutflow),
    remainingCushion,
    isCushionPositive,
    impactSummary,
    mitigationAdvice,
  };
}
