import { calculateEmi } from "./emi";

export interface CalculateAprParams {
  headlineRatePct: number;
  processingFeePct: number;
  loanAmount: number;
  tenureMonths: number;
}

/**
 * Calculates effective annualized APR incorporating processing fees.
 * Net disbursement = Principal - Processing Fee
 * The Internal Rate of Return (IRR) is calculated monthly such that:
 * NetDisbursement = Sum_{t=1..n} [ EMI / (1 + irr)^t ]
 * Effective APR = irr * 12 * 100 (or compounding annualized APR).
 */
export function calculateIllustrativeApr(params: CalculateAprParams) {
  const { headlineRatePct, processingFeePct, loanAmount, tenureMonths } = params;

  if (loanAmount <= 0 || tenureMonths <= 0) {
    return {
      headlineRate: headlineRatePct,
      processingFeePct: 0,
      processingFeeRupees: 0,
      tenureMonths,
      loanAmount,
      totalRepayment: 0,
      totalInterest: 0,
      effectiveAnnualizedCost: headlineRatePct,
      isEstimated: true,
      explanation: "No loan amount specified.",
    };
  }

  const processingFeeRupees = Math.round((loanAmount * processingFeePct) / 100);
  const netDisbursement = loanAmount - processingFeeRupees;
  const emi = calculateEmi(loanAmount, headlineRatePct, tenureMonths);
  const totalRepayment = emi * tenureMonths;
  const totalInterest = Math.max(0, totalRepayment - loanAmount);

  if (netDisbursement <= 0 || emi <= 0) {
    return {
      headlineRate: headlineRatePct,
      processingFeePct,
      processingFeeRupees,
      tenureMonths,
      loanAmount,
      totalRepayment,
      totalInterest,
      effectiveAnnualizedCost: headlineRatePct,
      isEstimated: true,
      explanation: "Invalid net disbursement",
    };
  }

  // Iterative Newton-Raphson or binary search for monthly IRR
  let low = 0.0001;
  let high = 0.10; // 10% monthly = 120% per year max search
  let monthlyIrr = headlineRatePct / 12 / 100;

  for (let iter = 0; iter < 40; iter++) {
    const mid = (low + high) / 2;
    let npv = -netDisbursement;
    for (let t = 1; t <= tenureMonths; t++) {
      npv += emi / Math.pow(1 + mid, t);
    }

    if (Math.abs(npv) < 0.01) {
      monthlyIrr = mid;
      break;
    }

    if (npv > 0) {
      // Rates are too low, NPV is positive
      low = mid;
    } else {
      high = mid;
    }
  }

  // Nominal APR annualized
  const nominalApr = monthlyIrr * 12 * 100;

  return {
    headlineRate: headlineRatePct,
    processingFeePct,
    processingFeeRupees,
    tenureMonths,
    loanAmount,
    totalRepayment,
    totalInterest,
    effectiveAnnualizedCost: Number(nominalApr.toFixed(2)),
    isEstimated: false,
    explanation: `Includes headline interest rate of ${headlineRatePct.toFixed(1)}% p.a. plus an upfront processing fee of ${processingFeePct.toFixed(1)}% (${processingFeeRupees.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}).`,
  };
}
