/**
 * Standard EMI formula:
 * EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 * where:
 * P = Principal loan amount
 * r = Monthly interest rate (Annual rate / 12 / 100)
 * n = Tenure in months
 */
export function calculateEmi(principal: number, annualRatePct: number, tenureMonths: number): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualRatePct <= 0) return Math.round(principal / tenureMonths);

  const monthlyRate = annualRatePct / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return Math.round(emi);
}

/**
 * Inverse EMI formula to find max principal for a given max EMI:
 * P = EMI * ((1+r)^n - 1) / (r * (1+r)^n)
 */
export function calculatePrincipalFromEmi(maxEmi: number, annualRatePct: number, tenureMonths: number): number {
  if (maxEmi <= 0 || tenureMonths <= 0) return 0;
  if (annualRatePct <= 0) return Math.round(maxEmi * tenureMonths);

  const monthlyRate = annualRatePct / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const principal = (maxEmi * (factor - 1)) / (monthlyRate * factor);
  return Math.round(principal);
}

/**
 * Returns tenure comparison options (e.g. 3yr, 5yr, 7yr or custom)
 */
export function calculateTenureTradeoffs(principal: number, annualRatePct: number, baseTenureMonths: number) {
  const optionsInYears = [2, 3, 5, 7, 10, 15, 20].filter(y => y * 12 >= Math.min(24, baseTenureMonths / 2));
  
  // Always include the current base tenure in years if missing
  const baseYears = Math.round(baseTenureMonths / 12);
  if (baseYears > 0 && !optionsInYears.includes(baseYears)) {
    optionsInYears.push(baseYears);
    optionsInYears.sort((a, b) => a - b);
  }

  // Pick top 3-4 sensible choices around base tenure
  const selectedYears = optionsInYears.slice(0, 4);

  return selectedYears.map(years => {
    const months = years * 12;
    const monthlyEmi = calculateEmi(principal, annualRatePct, months);
    const totalRepayment = monthlyEmi * months;
    const totalInterest = Math.max(0, totalRepayment - principal);

    return {
      tenureYears: years,
      tenureMonths: months,
      monthlyEmi,
      totalInterest,
      totalRepayment,
    };
  });
}
