export type LoanPurpose =
  | "personal"
  | "education"
  | "home"
  | "business"
  | "vehicle"
  | "medical"
  | "debt_consolidation"
  | "other";

export type LoanType =
  | "personal_loan"
  | "home_loan"
  | "loan_against_property"
  | "gold_loan"
  | "two_wheeler_loan"
  | "business_loan"
  | "not_sure";

export type IncomeType =
  | "salaried"
  | "self_employed"
  | "informal_variable"
  | "retired"
  | "other";

export type IncomeStability = "high" | "moderate" | "unstable";
export type ConfidenceLevel = "high" | "medium" | "low";
export type DecisionType = "borrow" | "borrow_less" | "dont_borrow";

export interface BorrowerInputs {
  borrowerName?: string;
  location?: string;
  age: number;
  
  // Must-have Q1 - Q9
  loanPurpose: LoanPurpose;
  loanType: LoanType;
  requestedAmount: number;
  monthlyNetIncome: number;
  incomeType: IncomeType;
  existingMonthlyEmi: number;
  essentialExpenses: number;
  knowsCreditScore: boolean;
  creditScore: number | null; // null if unknown

  // Adaptive: Salaried
  tenureWithEmployerYears?: number | null;
  incomeStability?: IncomeStability | null;
  receivesVariablePay?: boolean | null;

  // Adaptive: Self-Employed
  businessAgeYears?: number | null;
  documentedAnnualIncomeITR?: number | null;
  averageMonthlyBusinessCashflow?: number | null;
  hasCollateralProperty?: boolean | null;
  collateralValueEst?: number | null;
  hasExistingBusinessLoan?: boolean | null;

  // Adaptive: Informal / Variable
  incomeHistoryMonths?: number | null;
  hasMissedOrBouncedEmiRecently?: boolean | null;
  emergencySavingsMonths?: number | null;
  emergencySavingsAmount?: number | null;

  // Adaptive: Business Loan
  willLoanGenerateIncome?: boolean | null;
  expectedAdditionalMonthlyCashflow?: number | null;
  businessLoanPurposeType?: "working_capital" | "equipment" | "expansion" | null;

  // Adaptive: Debt Consolidation
  existingLoanAvgRate?: number | null;
  existingTotalOutstanding?: number | null;

  // Adaptive: Lender Offer (Optional)
  hasLenderOffer?: boolean;
  offeredRate?: number | null;
  offeredProcessingFeePct?: number | null;
  offeredTenureMonths?: number | null;
  offeredAmount?: number | null;
}

export interface AmountRange {
  min: number;
  max: number;
  recommended?: number;
  confidence: ConfidenceLevel;
  reason: string;
  breakdown: string[];
}

export interface RateRange {
  min: number;
  max: number;
  minRate?: number;
  maxRate?: number;
  confidence: ConfidenceLevel;
  reason: string;
  breakdown: string[];
}

export interface AprBreakdown {
  headlineRate: number;
  processingFeePct: number;
  processingFeeRupees: number;
  tenureMonths: number;
  loanAmount: number;
  totalRepayment: number;
  totalInterest: number;
  effectiveAnnualizedCost: number;
  isEstimated: boolean;
  explanation: string;
}

export interface TenureOption {
  tenureYears: number;
  tenureMonths: number;
  monthlyEmi: number;
  totalInterest: number;
  totalRepayment: number;
}

export interface EmiBreakdown {
  recommendedTenureMonths: number;
  recommendedEmi: number;
  maximumSafeEmi: number;
  lenderStyleMaxEmi: number;
  foirPct: number;
  cashflowRemaining: number;
  tenureTradeoffs: TenureOption[];
  reason: string;
  breakdown: string[];
}

export interface StressCaseResult {
  scenarioTitle: string;
  scenarioDescription: string;
  currentSafeEmi: number;
  stressMonthlyOutflow: number;
  remainingCushion: number;
  isCushionPositive: boolean;
  impactSummary: string;
  mitigationAdvice: string;
}

export interface FlagItem {
  type: "warning" | "danger" | "info";
  message: string;
}

export interface AssessmentResult {
  decision: DecisionType;
  decisionLabel: string;
  decisionReason: string;

  confidence: ConfidenceLevel;
  confidenceReason: string;

  likelySanction: AmountRange;
  safeBorrowing: AmountRange;

  fairRate: RateRange;
  apr: AprBreakdown;

  emi: EmiBreakdown;
  stressCase: StressCaseResult;

  flags: FlagItem[];
  assumptions: string[];
  missingInformation: string[];
  negotiationPoints: string[];
}
