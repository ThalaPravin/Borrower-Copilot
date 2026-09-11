import { BorrowerInputs, ConfidenceLevel } from "../types";
import { LOAN_PRODUCTS } from "../constants";

export interface RateCalculationResult {
  min: number;
  max: number;
  minRate: number;
  maxRate: number;
  confidence: ConfidenceLevel;
  reason: string;
  breakdown: string[];
}

/**
 * Calculates fair interest rate range based on loan product, credit score, income stability, collateral, and unknown handling.
 */
export function calculateFairRateBand(inputs: BorrowerInputs): RateCalculationResult {
  const {
    loanType,
    incomeType,
    knowsCreditScore,
    creditScore,
    incomeStability,
    hasCollateralProperty,
    hasMissedOrBouncedEmiRecently,
  } = inputs;

  const product = LOAN_PRODUCTS[loanType] || LOAN_PRODUCTS.personal_loan;
  let minRate = product.baseMinRate;
  let maxRate = product.baseMaxRate;

  const breakdown: string[] = [];
  let confidence: ConfidenceLevel = "high";

  breakdown.push(`Baseline range for ${product.name}: ${minRate.toFixed(1)}%–${maxRate.toFixed(1)}%`);

  // 1. Credit Score Impact
  if (!knowsCreditScore || creditScore === null) {
    // Unknown credit score -> MUST NOT assume 300 or 750! Widen rate range by +1.0% to +3.0%
    minRate += 1.0;
    maxRate += 3.0;
    confidence = "medium";
    breakdown.push("Credit Score Unknown: Range widened by +1.0% to +3.0% due to credit pricing uncertainty.");
  } else if (creditScore >= 780) {
    // Super prime
    minRate -= 0.5;
    maxRate -= 1.0;
    breakdown.push(`Prime Credit Score (${creditScore}): Discounted by -0.5% to -1.0%.`);
  } else if (creditScore >= 730) {
    // Prime
    breakdown.push(`Good Credit Score (${creditScore}): Standard benchmark rates apply.`);
  } else if (creditScore >= 670) {
    // Fair
    minRate += 1.5;
    maxRate += 2.5;
    confidence = "medium";
    breakdown.push(`Fair Credit Score (${creditScore}): Risk premium +1.5% to +2.5% applied.`);
  } else {
    // Poor (<670)
    minRate += 3.5;
    maxRate += 6.0;
    confidence = "low";
    breakdown.push(`Subprime Credit Score (${creditScore}): Substantial risk premium +3.5% to +6.0% applied.`);
  }

  // 2. Income Type Adjustments
  if (incomeType === "salaried") {
    if (incomeStability === "high") {
      minRate = Math.max(7.0, minRate - 0.25);
      maxRate = Math.max(8.0, maxRate - 0.5);
    }
  } else if (incomeType === "self_employed") {
    minRate += 0.5;
    maxRate += 1.0;
    breakdown.push("Self-employed profile: Standard +0.5% to +1.0% underwriting margin.");
  } else if (incomeType === "informal_variable") {
    minRate += 2.0;
    maxRate += 4.0;
    confidence = confidence === "high" ? "medium" : "low";
    breakdown.push("Informal/Variable income: Unsecured risk premium +2.0% to +4.0%.");
  }

  // 3. Collateral Credit Discount (e.g. LAP / Business Loan with property)
  if (hasCollateralProperty && product.category === "unsecured") {
    minRate = Math.max(9.0, minRate - 2.5);
    maxRate = Math.max(11.0, maxRate - 3.5);
    breakdown.push("Unencumbered Property Collateral: Substantial discount for secured structuring.");
  }

  // 4. Bounced EMI penalty
  if (hasMissedOrBouncedEmiRecently) {
    minRate += 2.0;
    maxRate += 4.0;
    confidence = "low";
    breakdown.push("Recent Bounced/Missed EMI: Severe risk premium +2.0% to +4.0% applied.");
  }

  // Format to 1 decimal place
  minRate = Number(minRate.toFixed(1));
  maxRate = Number(maxRate.toFixed(1));

  let reason = `Estimated fair rate band is ${minRate}%–${maxRate}% based on your ${incomeType} profile and ${knowsCreditScore ? `credit score of ${creditScore}` : 'unknown credit score'}.`;
  if (!knowsCreditScore) {
    reason += " Providing an exact credit score will narrow this range.";
  }

  return {
    min: minRate,
    max: maxRate,
    minRate,
    maxRate,
    confidence,
    reason,
    breakdown,
  };
}
