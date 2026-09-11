import {
  BorrowerInputs,
  AssessmentResult,
  DecisionType,
  ConfidenceLevel,
  FlagItem,
} from "./types";
import { calculateAffordability } from "./rules/affordability";
import { calculateFairRateBand } from "./rules/rates";
import { calculateEligibility } from "./rules/eligibility";
import { calculateStressCase } from "./rules/stress";
import { calculateIllustrativeApr } from "./calculations/apr";
import { calculateEmi, calculateTenureTradeoffs } from "./calculations/emi";
import { LOAN_PRODUCTS } from "./constants";

export function calculateAssessment(inputs: BorrowerInputs): AssessmentResult {
  const {
    requestedAmount,
    monthlyNetIncome,
    existingMonthlyEmi,
    essentialExpenses,
    knowsCreditScore,
    creditScore,
    incomeType,
    loanType,
    hasMissedOrBouncedEmiRecently,
    hasLenderOffer,
    offeredRate,
    offeredProcessingFeePct,
    offeredTenureMonths,
  } = inputs;

  const product = LOAN_PRODUCTS[loanType] || LOAN_PRODUCTS.personal_loan;
  const tenureMonths = offeredTenureMonths || product.typicalTenureYears * 12;

  // 1. Calculate Affordability
  const affordability = calculateAffordability(inputs);

  // 2. Calculate Fair Rate Band
  const fairRate = calculateFairRateBand(inputs);

  // 3. Calculate Eligibility (Likely Sanction vs Safe Amount)
  const eligibility = calculateEligibility(inputs, affordability, fairRate);

  // 4. Calculate Baseline Requested EMI
  const baseRate = (fairRate.min + fairRate.max) / 2;
  const requestedEmi = calculateEmi(requestedAmount, baseRate, tenureMonths);

  // 5. Calculate Illustrative APR
  const processingFeePct = offeredProcessingFeePct ?? product.defaultProcessingFeePct;
  const headlineRate = offeredRate ?? baseRate;
  const apr = calculateIllustrativeApr({
    headlineRatePct: headlineRate,
    processingFeePct,
    loanAmount: requestedAmount,
    tenureMonths,
  });

  // 6. Calculate Stress Case
  const stressCase = calculateStressCase(inputs, requestedEmi, fairRate.min);

  // 7. Tenure Trade-offs
  const tenureTradeoffs = calculateTenureTradeoffs(requestedAmount, baseRate, tenureMonths);

  // 8. Decision Logic (borrow | borrow_less | dont_borrow)
  let decision: DecisionType = "borrow";
  let decisionLabel = "Borrow";
  let decisionReason = "";

  const isOvercommittedCurrently =
    existingMonthlyEmi + affordability.essentialExpenses >= monthlyNetIncome * 0.82 ||
    affordability.availableNetCashflow < monthlyNetIncome * 0.10;

  const isBouncedEmiHighDebt = Boolean(hasMissedOrBouncedEmiRecently && isOvercommittedCurrently);

  if (isOvercommittedCurrently || isBouncedEmiHighDebt || requestedEmi > affordability.availableNetCashflow) {
    decision = "dont_borrow";
    decisionLabel = "Don't borrow";
    decisionReason = `Your current monthly commitments (₹${existingMonthlyEmi.toLocaleString("en-IN")} EMIs + ₹${affordability.essentialExpenses.toLocaleString("en-IN")} essential expenses) leave insufficient cashflow for a new loan without risking financial distress.`;
  } else if (requestedAmount > eligibility.safeBorrowing.max || requestedEmi > affordability.borrowerSafeMaxEmi) {
    decision = "borrow_less";
    decisionLabel = "Borrow less";
    decisionReason = `Your requested loan of ₹${requestedAmount.toLocaleString("en-IN")} exceeds your safe borrowing ceiling of ₹${eligibility.safeBorrowing.max.toLocaleString("en-IN")}. Lenders might sanction a higher amount, but taking more than your safe limit increases financial vulnerability.`;
  } else {
    decision = "borrow";
    decisionLabel = "Borrow";
    decisionReason = `Your requested loan of ₹${requestedAmount.toLocaleString("en-IN")} is within your estimated safe borrowing range (₹${eligibility.safeBorrowing.min.toLocaleString("en-IN")} – ₹${eligibility.safeBorrowing.max.toLocaleString("en-IN")}), and your monthly cashflow safely supports the EMI.`;
  }

  // 9. Confidence Calculation
  let confidence: ConfidenceLevel = "high";
  let confidenceReason = "Your inputs provide high clarity on income, expenses, and credit history.";

  const missingInformation: string[] = [];
  const assumptions: string[] = [];

  if (!knowsCreditScore || creditScore === null) {
    confidence = "medium";
    missingInformation.push("Credit Score: Unknown credit score requires a wider rate band (+1.0% to +3.0%).");
    assumptions.push("Assumed standard prime/near-prime risk band; actual rate depends on credit bureau fetch.");
  }

  if (incomeType === "informal_variable" || incomeType === "self_employed") {
    if (confidence === "high") confidence = "medium";
    assumptions.push("Income stability assumed based on stated cashflow history; formal income proof like ITR/GST improves precision.");
  }

  if (hasMissedOrBouncedEmiRecently) {
    confidence = "low";
    missingInformation.push("Bounced EMI Details: Recent missed payments reduce credit score and lender approval probability.");
  }

  if (!inputs.emergencySavingsMonths && !inputs.emergencySavingsAmount) {
    missingInformation.push("Emergency Savings: Savings buffer not specified; using conservative 1-month cashflow cushion.");
    assumptions.push("Assumed limited liquid savings reserve.");
  }

  if (confidence === "medium") {
    confidenceReason = "Assessment confidence is medium due to unknown credit score or variable income. Ranges have been widened to protect you.";
  } else if (confidence === "low") {
    confidenceReason = "Assessment confidence is low due to income variability or recent payment bounce. Conservative estimates are applied.";
  }

  // 10. Flags / Warnings
  const flags: FlagItem[] = [];

  if (requestedAmount > eligibility.likelySanction.max) {
    flags.push({
      type: "warning",
      message: `Requested loan of ₹${requestedAmount.toLocaleString("en-IN")} exceeds likely lender sanction max of ₹${eligibility.likelySanction.max.toLocaleString("en-IN")}.`,
    });
  }

  if (affordability.currentFoirPct > 40) {
    flags.push({
      type: "warning",
      message: `Your current EMI-to-income ratio is ${affordability.currentFoirPct}%. High debt obligations reduce loan flexibility.`,
    });
  }

  if (!knowsCreditScore) {
    flags.push({
      type: "info",
      message: "Credit score is unknown. Checking your official score before approaching lenders will give you exact rate leverage.",
    });
  }

  if (hasMissedOrBouncedEmiRecently) {
    flags.push({
      type: "danger",
      message: "A recent bounced EMI will trigger high risk flags at lenders and increase interest rates significantly.",
    });
  }

  // 11. Negotiation Points for Borrower Negotiation Card
  const negotiationPoints: string[] = [
    `Ask the lender for the All-in Annual Percentage Rate (APR), including processing fees and insurance charges.`,
    `Do not accept headline rates above ${fairRate.max}%. Your fair estimated band is ${fairRate.min}%–${fairRate.max}%.`,
    `Compare 3-year vs 5-year tenure EMI. Opt for shorter tenure if monthly budget permits to save total interest.`,
    `Ask if there are foreclosure or part-prepayment charges after 6–12 months.`,
  ];

  if (inputs.hasCollateralProperty && product.category === "unsecured") {
    negotiationPoints.push("Mention your unencumbered property collateral to request routing via Loan Against Property (LAP) for a 2-4% lower interest rate.");
  }

  if (knowsCreditScore && creditScore && creditScore >= 750) {
    negotiationPoints.push(`Highlight your strong credit score of ${creditScore} to request a processing fee waiver or lowest rate slab.`);
  }

  // Assemble EMI breakdown
  const emiBreakdown = {
    recommendedTenureMonths: tenureMonths,
    recommendedEmi: requestedEmi,
    maximumSafeEmi: affordability.borrowerSafeMaxEmi,
    lenderStyleMaxEmi: affordability.lenderStyleMaxEmi,
    foirPct: affordability.currentFoirPct,
    cashflowRemaining: affordability.availableNetCashflow,
    tenureTradeoffs,
    reason: `Your safe EMI ceiling is ₹${affordability.borrowerSafeMaxEmi.toLocaleString("en-IN")}/month. The requested loan has an EMI of ₹${requestedEmi.toLocaleString("en-IN")}.`,
    breakdown: affordability.breakdownLines,
  };

  return {
    decision,
    decisionLabel,
    decisionReason,
    confidence,
    confidenceReason,
    likelySanction: eligibility.likelySanction,
    safeBorrowing: eligibility.safeBorrowing,
    fairRate: {
      min: fairRate.min,
      max: fairRate.max,
      confidence: fairRate.confidence,
      reason: fairRate.reason,
      breakdown: fairRate.breakdown,
    },
    apr,
    emi: emiBreakdown,
    stressCase,
    flags,
    assumptions,
    missingInformation,
    negotiationPoints,
  };
}
