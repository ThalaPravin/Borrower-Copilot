import { describe, it, expect } from "vitest";
import { calculateAssessment } from "../features/borrower-assessment/assessment";
import { calculateEmi } from "../features/borrower-assessment/calculations/emi";
import { calculateIllustrativeApr } from "../features/borrower-assessment/calculations/apr";
import { SAMPLE_BORROWERS } from "../data/sample-borrowers";
import { BorrowerInputs } from "../features/borrower-assessment/types";

describe("Borrower Copilot Rules Engine", () => {
  it("1. should correctly evaluate Priya (Salaried SWE, strong credit, wedding loan)", () => {
    const result = calculateAssessment(SAMPLE_BORROWERS.priya.inputs);
    expect(result.decision).toBeDefined();
    expect(["borrow", "borrow_less"]).toContain(result.decision);
    expect(result.fairRate.minRate).toBeLessThan(12.0);
    expect(result.likelySanction.max).toBeGreaterThan(0);
    expect(result.safeBorrowing.max).toBeGreaterThan(0);
    expect(result.emi.recommendedEmi).toBeGreaterThan(0);
    expect(result.confidence).toBe("high");
  });

  it("2. should correctly evaluate Ravi (Self-employed Kirana store owner, LAP / Business loan)", () => {
    const result = calculateAssessment(SAMPLE_BORROWERS.ravi.inputs);
    expect(result.decision).toBeDefined();
    expect(result.confidence).not.toBe("high");
    expect(result.fairRate.breakdown.some(b => b.includes("Unknown"))).toBe(true);
    expect(result.negotiationPoints.some(n => n.includes("Property"))).toBe(true);
  });

  it("3. should correctly evaluate Anita (Informal delivery rider under debt stress)", () => {
    const result = calculateAssessment(SAMPLE_BORROWERS.anita.inputs);
    expect(["dont_borrow", "borrow_less"]).toContain(result.decision);
    expect(result.flags.some(f => f.type === "danger")).toBe(true);
    expect(result.confidence).toBe("low");
  });

  it("4. should widen rate band and lower confidence when credit score is unknown", () => {
    const knownInputs: BorrowerInputs = {
      ...SAMPLE_BORROWERS.priya.inputs,
      knowsCreditScore: true,
      creditScore: 780,
    };
    const unknownInputs: BorrowerInputs = {
      ...SAMPLE_BORROWERS.priya.inputs,
      knowsCreditScore: false,
      creditScore: null,
    };

    const knownResult = calculateAssessment(knownInputs);
    const unknownResult = calculateAssessment(unknownInputs);

    const knownSpread = knownResult.fairRate.max - knownResult.fairRate.min;
    const unknownSpread = unknownResult.fairRate.max - unknownResult.fairRate.min;
    expect(unknownSpread).toBeGreaterThanOrEqual(knownSpread);
    expect(unknownResult.confidence).not.toBe("high");
    expect(unknownResult.missingInformation.some(m => m.includes("Credit Score"))).toBe(true);
  });

  it("5. should reduce safe borrowing capacity when existing EMI is high", () => {
    const lowEmiInputs: BorrowerInputs = {
      ...SAMPLE_BORROWERS.priya.inputs,
      existingMonthlyEmi: 5000,
    };
    const highEmiInputs: BorrowerInputs = {
      ...SAMPLE_BORROWERS.priya.inputs,
      existingMonthlyEmi: 45000,
    };

    const lowEmiResult = calculateAssessment(lowEmiInputs);
    const highEmiResult = calculateAssessment(highEmiInputs);

    expect(highEmiResult.safeBorrowing.max).toBeLessThan(lowEmiResult.safeBorrowing.max);
    expect(highEmiResult.emi.cashflowRemaining).toBeLessThan(lowEmiResult.emi.cashflowRemaining);
  });

  it("6. should produce conservative recommendations for low income profiles", () => {
    const lowIncomeInputs: BorrowerInputs = {
      ...SAMPLE_BORROWERS.priya.inputs,
      monthlyNetIncome: 20000,
      essentialExpenses: 12000,
      existingMonthlyEmi: 4000,
      requestedAmount: 500000,
    };

    const result = calculateAssessment(lowIncomeInputs);
    expect(["borrow_less", "dont_borrow"]).toContain(result.decision);
  });

  it("7. should recommend 'borrow_less' when requested amount exceeds safe borrowing capacity", () => {
    const inputs: BorrowerInputs = {
      ...SAMPLE_BORROWERS.priya.inputs,
      requestedAmount: 1400000,
    };

    const result = calculateAssessment(inputs);
    expect(result.decision).toBe("borrow_less");
    expect(result.decisionReason).toContain("exceeds your safe borrowing ceiling");
  });

  it("8. should recommend 'dont_borrow' when current cash flow is overcommitted", () => {
    const inputs: BorrowerInputs = {
      ...SAMPLE_BORROWERS.priya.inputs,
      existingMonthlyEmi: 65000,
      essentialExpenses: 40000,
      monthlyNetIncome: 110000,
    };

    const result = calculateAssessment(inputs);
    expect(result.decision).toBe("dont_borrow");
  });

  it("9. should calculate stress scenario and assess cushion resilience", () => {
    const result = calculateAssessment(SAMPLE_BORROWERS.priya.inputs);
    expect(result.stressCase.scenarioTitle).toBeDefined();
    expect(result.stressCase.stressMonthlyOutflow).toBeGreaterThan(0);
  });

  it("10. should correctly calculate effective APR including processing fees", () => {
    const aprResult = calculateIllustrativeApr({
      headlineRatePct: 12.0,
      processingFeePct: 2.0,
      loanAmount: 500000,
      tenureMonths: 36,
    });

    expect(aprResult.effectiveAnnualizedCost).toBeGreaterThan(12.0);
    expect(aprResult.processingFeeRupees).toBe(10000);
  });

  it("11. should accurately compute EMI matching standard financial formula", () => {
    const emi = calculateEmi(100000, 12.0, 12);
    expect(emi).toBe(8885);
  });

  it("12. should maintain distinction between likely lender sanction and safe borrowing limit", () => {
    const result = calculateAssessment(SAMPLE_BORROWERS.priya.inputs);
    expect(result.likelySanction.max).toBeGreaterThanOrEqual(result.safeBorrowing.max);
    expect(result.likelySanction.reason).not.toEqual(result.safeBorrowing.reason);
  });

  it("13. should include missing information items when key inputs are unknown", () => {
    const inputs: BorrowerInputs = {
      ...SAMPLE_BORROWERS.priya.inputs,
      knowsCreditScore: false,
      creditScore: null,
      emergencySavingsMonths: null,
    };

    const result = calculateAssessment(inputs);
    expect(result.missingInformation.length).toBeGreaterThan(0);
    expect(result.assumptions.length).toBeGreaterThan(0);
  });
});
