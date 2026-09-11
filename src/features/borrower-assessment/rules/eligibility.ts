import { BorrowerInputs, AmountRange, ConfidenceLevel } from "../types";
import { LOAN_PRODUCTS } from "../constants";
import { calculatePrincipalFromEmi } from "../calculations/emi";

export interface EligibilityResult {
  likelySanction: AmountRange;
  safeBorrowing: AmountRange;
}

/**
 * Calculates both Likely Lender Sanction range and Borrower Safe Borrowing range.
 * These are intentionally different!
 */
export function calculateEligibility(
  inputs: BorrowerInputs,
  affordability: { lenderStyleMaxEmi: number; borrowerSafeMaxEmi: number },
  fairRates: { minRate: number; maxRate: number; confidence: ConfidenceLevel }
): EligibilityResult {
  const {
    requestedAmount,
    loanType,
    incomeType,
    knowsCreditScore,
    creditScore,
    documentedAnnualIncomeITR,
    hasCollateralProperty,
    collateralValueEst,
    willLoanGenerateIncome,
    expectedAdditionalMonthlyCashflow,
  } = inputs;

  const product = LOAN_PRODUCTS[loanType] || LOAN_PRODUCTS.personal_loan;
  const tenureMonths = product.typicalTenureYears * 12;

  // Use average expected rate for principal conversion
  const avgRate = (fairRates.minRate + fairRates.maxRate) / 2;

  // 1. Lender Style Max Sanction Calculation
  // Converted from lenderStyleMaxEmi over typical product tenure
  let maxSanctionByIncome = calculatePrincipalFromEmi(affordability.lenderStyleMaxEmi, avgRate, tenureMonths);

  // If self-employed with ITR income, lenders also check Multiplier on Documented Annual Income (e.g. 2x - 4x ITR income)
  if (incomeType === "self_employed" && documentedAnnualIncomeITR && documentedAnnualIncomeITR > 0) {
    const itrSanctionLimit = documentedAnnualIncomeITR * 3.5;
    maxSanctionByIncome = Math.min(maxSanctionByIncome, itrSanctionLimit);
  }

  // If secured loan or collateral available
  let collateralSanctionCap = Infinity;
  if (hasCollateralProperty && collateralValueEst && collateralValueEst > 0) {
    // LTV (Loan To Value) usually max 60% for LAP or business loan against property
    collateralSanctionCap = Math.round(collateralValueEst * 0.60);
  }

  const rawLenderMaxSanction = Math.min(maxSanctionByIncome, collateralSanctionCap);
  const rawLenderMinSanction = Math.round(rawLenderMaxSanction * 0.75);

  // Round values to nearest ₹10,000 to prevent fake precision
  const likelySanctionMin = Math.round(Math.max(0, rawLenderMinSanction) / 10000) * 10000;
  const likelySanctionMax = Math.round(Math.max(0, rawLenderMaxSanction) / 10000) * 10000;

  let likelySanctionConfidence: ConfidenceLevel = fairRates.confidence;
  if (incomeType === "informal_variable") likelySanctionConfidence = "low";
  if (!knowsCreditScore) likelySanctionConfidence = "medium";

  const likelySanctionBreakdown: string[] = [
    `Product: ${product.name} (Typical Tenure: ${product.typicalTenureYears} years)`,
    `Lender-Style Max EMI capacity: ₹${affordability.lenderStyleMaxEmi.toLocaleString("en-IN")}/month`,
    `Assumed Interest Rate: ${avgRate.toFixed(1)}% p.a.`,
  ];

  if (collateralSanctionCap < Infinity) {
    likelySanctionBreakdown.push(`Collateral Property Value (₹${(collateralValueEst || 0).toLocaleString("en-IN")}): LTV capped at 60% = ₹${collateralSanctionCap.toLocaleString("en-IN")}`);
  }

  const likelySanctionReason = `Lenders may sanction between ₹${likelySanctionMin.toLocaleString("en-IN")} and ₹${likelySanctionMax.toLocaleString("en-IN")} based on gross income multipliers and traditional FOIR limits.`;

  // 2. Borrower Safe Borrowing Calculation
  // Based on borrowerSafeMaxEmi over safe tenure
  let safeMaxPrincipal = calculatePrincipalFromEmi(affordability.borrowerSafeMaxEmi, avgRate, tenureMonths);

  // Productive loan bonus (e.g. Kirana stock/vehicle or delivery bike generating cashflow)
  if (willLoanGenerateIncome && expectedAdditionalMonthlyCashflow && expectedAdditionalMonthlyCashflow > 0) {
    // Discount additional cashflow by 50% for safety
    const safeAddedEmi = Math.round(expectedAdditionalMonthlyCashflow * 0.50);
    const addedPrincipal = calculatePrincipalFromEmi(safeAddedEmi, avgRate, tenureMonths);
    safeMaxPrincipal += addedPrincipal;
    likelySanctionBreakdown.push(`Productive Loan Benefit: +₹${addedPrincipal.toLocaleString("en-IN")} safe capacity added from projected income.`);
  }

  // Safe range
  const safeMinPrincipal = Math.round((safeMaxPrincipal * 0.70) / 10000) * 10000;
  const safeMaxPrincipalRounded = Math.round(safeMaxPrincipal / 10000) * 10000;
  
  // Recommended safe amount is the lower of requested amount and safe max principal
  const recommendedAmount = Math.min(requestedAmount, safeMaxPrincipalRounded);

  const safeBreakdown: string[] = [
    `Borrower-Safe Max EMI ceiling: ₹${affordability.borrowerSafeMaxEmi.toLocaleString("en-IN")}/month`,
    `Safe Principal Limit at ${avgRate.toFixed(1)}% over ${product.typicalTenureYears} yrs: ₹${safeMaxPrincipalRounded.toLocaleString("en-IN")}`,
    `Requested Loan Amount: ₹${requestedAmount.toLocaleString("en-IN")}`,
  ];

  let safeConfidence: ConfidenceLevel = fairRates.confidence;
  if (incomeType === "informal_variable" || !knowsCreditScore) {
    safeConfidence = "medium";
  }

  let safeReason = "";
  if (requestedAmount <= safeMaxPrincipalRounded) {
    safeReason = `Your requested amount of ₹${requestedAmount.toLocaleString("en-IN")} falls within your safe borrowing range of ₹${safeMinPrincipal.toLocaleString("en-IN")} – ₹${safeMaxPrincipalRounded.toLocaleString("en-IN")}.`;
  } else {
    safeReason = `Your requested amount of ₹${requestedAmount.toLocaleString("en-IN")} exceeds your safe borrowing ceiling of ₹${safeMaxPrincipalRounded.toLocaleString("en-IN")} by ₹${(requestedAmount - safeMaxPrincipalRounded).toLocaleString("en-IN")}.`;
  }

  return {
    likelySanction: {
      min: likelySanctionMin,
      max: likelySanctionMax,
      confidence: likelySanctionConfidence,
      reason: likelySanctionReason,
      breakdown: likelySanctionBreakdown,
    },
    safeBorrowing: {
      min: safeMinPrincipal,
      max: safeMaxPrincipalRounded,
      recommended: recommendedAmount,
      confidence: safeConfidence,
      reason: safeReason,
      breakdown: safeBreakdown,
    },
  };
}
