import { calculateAssessment } from "../features/borrower-assessment/assessment";
import { calculateEmi } from "../features/borrower-assessment/calculations/emi";
import { calculateIllustrativeApr } from "../features/borrower-assessment/calculations/apr";
import { SAMPLE_BORROWERS } from "../data/sample-borrowers";
import { BorrowerInputs } from "../features/borrower-assessment/types";

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${testName}${detail ? `: ${detail}` : ""}`);
    failed++;
  }
}

console.log("==========================================");
console.log("BORROWER COPILOT - RULES ENGINE TEST SUITE");
console.log("==========================================");

// 1. Priya
const priyaResult = calculateAssessment(SAMPLE_BORROWERS.priya.inputs);
assert(
  ["borrow", "borrow_less"].includes(priyaResult.decision),
  "1. Priya Sample Assessment",
  `Decision received: ${priyaResult.decision}`
);
assert(priyaResult.confidence === "high", "1b. Priya High Confidence");

// 2. Ravi
const raviResult = calculateAssessment(SAMPLE_BORROWERS.ravi.inputs);
assert(
  raviResult.confidence !== "high",
  "2. Ravi Assessment Confidence (Unknown Credit Score)",
  `Confidence received: ${raviResult.confidence}`
);

// 3. Anita
const anitaResult = calculateAssessment(SAMPLE_BORROWERS.anita.inputs);
assert(
  ["dont_borrow", "borrow_less"].includes(anitaResult.decision),
  "3. Anita Assessment (Debt Stress / Bounced EMI)",
  `Decision received: ${anitaResult.decision}`
);

// 4. Unknown Credit Score
const knownInputs: BorrowerInputs = { ...SAMPLE_BORROWERS.priya.inputs, knowsCreditScore: true, creditScore: 780 };
const unknownInputs: BorrowerInputs = { ...SAMPLE_BORROWERS.priya.inputs, knowsCreditScore: false, creditScore: null };
const knownRes = calculateAssessment(knownInputs);
const unknownRes = calculateAssessment(unknownInputs);
assert(
  (unknownRes.fairRate.max - unknownRes.fairRate.min) >= (knownRes.fairRate.max - knownRes.fairRate.min),
  "4. Unknown Credit Score Widens Fair Rate Range"
);

// 5. High Existing EMI
const highEmiInputs: BorrowerInputs = { ...SAMPLE_BORROWERS.priya.inputs, existingMonthlyEmi: 45000 };
const highEmiRes = calculateAssessment(highEmiInputs);
assert(
  highEmiRes.safeBorrowing.max < priyaResult.safeBorrowing.max,
  "5. High Existing EMI Reduces Safe Borrowing Ceiling"
);

// 6. Low Income
const lowIncomeInputs: BorrowerInputs = {
  ...SAMPLE_BORROWERS.priya.inputs,
  monthlyNetIncome: 20000,
  essentialExpenses: 12000,
  existingMonthlyEmi: 4000,
  requestedAmount: 500000,
};
const lowIncomeRes = calculateAssessment(lowIncomeInputs);
assert(
  ["borrow_less", "dont_borrow"].includes(lowIncomeRes.decision),
  "6. Low Income Profile Evaluation"
);

// 7. Borrow Less Decision (Requested ₹14L > Safe ceiling ₹6.5L, EMI fits cashflow but exceeds safe ceiling)
const overRequestedInputs: BorrowerInputs = { ...SAMPLE_BORROWERS.priya.inputs, requestedAmount: 1400000 };
const overReqRes = calculateAssessment(overRequestedInputs);
assert(overReqRes.decision === "borrow_less", "7. Borrow Less Decision Trigger", `Decision: ${overReqRes.decision}`);

// 8. Don't Borrow Decision
const debtStressedInputs: BorrowerInputs = {
  ...SAMPLE_BORROWERS.priya.inputs,
  existingMonthlyEmi: 65000,
  essentialExpenses: 40000,
  monthlyNetIncome: 110000,
};
const debtStressedRes = calculateAssessment(debtStressedInputs);
assert(debtStressedRes.decision === "dont_borrow", "8. Don't Borrow Decision Trigger");

// 9. Stress Case Scenario
assert(Boolean(priyaResult.stressCase.scenarioTitle), "9. Stress Case Scenario Generated");

// 10. APR Calculation
const aprRes = calculateIllustrativeApr({ headlineRatePct: 12.0, processingFeePct: 2.0, loanAmount: 500000, tenureMonths: 36 });
assert(aprRes.effectiveAnnualizedCost > 12.0, "10. APR Calculation Includes Processing Fee");

// 11. EMI Formula
const emiVal = calculateEmi(100000, 12.0, 12);
assert(emiVal === 8885, "11. EMI Formula Verification", `EMI computed: ${emiVal}`);

// 12. Safe Amount vs Likely Sanction
assert(
  priyaResult.likelySanction.max >= priyaResult.safeBorrowing.max,
  "12. Likely Lender Sanction vs Safe Borrowing Limit Separation"
);

// 13. Missing Information
assert(
  unknownRes.missingInformation.length > 0,
  "13. Missing Information Populated For Unknowns"
);

console.log("------------------------------------------");
console.log(`Results: ${passed} PASSED, ${failed} FAILED`);
console.log("==========================================");

if (failed > 0) {
  process.exit(1);
}
