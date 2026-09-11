import { BorrowerInputs } from "../features/borrower-assessment/types";

export interface SampleBorrowerProfile {
  id: "priya" | "ravi" | "anita";
  name: string;
  age: number;
  location: string;
  tagline: string;
  avatarInitials: string;
  description: string;
  keyContextPoints: string[];
  inputs: BorrowerInputs;
}

export const SAMPLE_BORROWERS: Record<"priya" | "ravi" | "anita", SampleBorrowerProfile> = {
  priya: {
    id: "priya",
    name: "Priya Sharma",
    age: 29,
    location: "Bengaluru",
    tagline: "Salaried SWE with strong credit profile planning a wedding",
    avatarInitials: "PS",
    description: "29-year-old Senior Software Engineer at a large MNC earning ₹1.1L/month net. Has a 780 CIBIL score, ₹14k existing car EMI, and wants an ₹8L personal loan for her wedding.",
    keyContextPoints: [
      "Stable salaried income with 5 years experience.",
      "Prime CIBIL score of 780.",
      "Existing car loan EMI of ₹14,000/month (2 years remaining).",
      "Wedding expense is a personal loan requirement.",
      "Requested ₹8L loan is sanctionable, but safe borrowing checks if EMI fits uncommitted cash flow.",
    ],
    inputs: {
      borrowerName: "Priya Sharma",
      location: "Bengaluru",
      age: 29,
      loanPurpose: "personal",
      loanType: "personal_loan",
      requestedAmount: 800000,
      monthlyNetIncome: 110000,
      incomeType: "salaried",
      existingMonthlyEmi: 14000,
      essentialExpenses: 40000, // ₹28,000 rent + ₹12,000 household
      knowsCreditScore: true,
      creditScore: 780,
      tenureWithEmployerYears: 5,
      incomeStability: "high",
      receivesVariablePay: false,
      emergencySavingsMonths: 6,
      emergencySavingsAmount: 300000,
      hasMissedOrBouncedEmiRecently: false,
    },
  },
  ravi: {
    id: "ravi",
    name: "Ravi Kumar",
    age: 42,
    location: "Mysuru",
    tagline: "Self-employed Kirana store owner with unencumbered property & unknown credit score",
    avatarInitials: "RK",
    description: "42-year-old business owner running a Kirana store for 14 years. Stated cash income ₹40k–80k/month, ITR ₹4.2L/yr, owns ₹45L unencumbered shop property. Wants ₹15L for business expansion.",
    keyContextPoints: [
      "14-year established business with mixed cash & ITR documented income.",
      "Owns commercial shop premises valued at ~₹45L (unencumbered collateral).",
      "Credit score is unknown (never checked or no formal history).",
      "Requested ₹15L loan for Kirana stock expansion & delivery vehicle.",
      "Reroutes from unsecured personal/business loan toward Loan Against Property (LAP) for rate discount.",
    ],
    inputs: {
      borrowerName: "Ravi Kumar",
      location: "Mysuru",
      age: 42,
      loanPurpose: "business",
      loanType: "business_loan",
      requestedAmount: 1500000,
      monthlyNetIncome: 60000, // Average of 40k-80k + wife's contribution
      incomeType: "self_employed",
      existingMonthlyEmi: 0,
      essentialExpenses: 30000,
      knowsCreditScore: false,
      creditScore: null, // Unknown! Must remain unknown!
      businessAgeYears: 14,
      documentedAnnualIncomeITR: 420000,
      averageMonthlyBusinessCashflow: 60000,
      hasCollateralProperty: true,
      collateralValueEst: 4500000,
      hasExistingBusinessLoan: false,
      willLoanGenerateIncome: true,
      expectedAdditionalMonthlyCashflow: 15000,
      businessLoanPurposeType: "working_capital",
      emergencySavingsMonths: 3,
      hasMissedOrBouncedEmiRecently: false,
    },
  },
  anita: {
    id: "anita",
    name: "Anita Devi",
    age: 35,
    location: "Hubballi",
    tagline: "Gig economy rider under debt stress with recent bounced EMI",
    avatarInitials: "AD",
    description: "35-year-old delivery rider & tailor earning ₹26k–30k/month. Supporting 2 children and unemployed spouse. Has 3 high-cost app loans (30%+ interest), recent bounced EMI, and wants ₹1.5L for EV scooter.",
    keyContextPoints: [
      "Informal/variable income (₹26k–30k/month) supporting 4 family members.",
      "High debt stress: 3 existing instant app loans (₹35k outstanding @ 30%+ interest rates, ₹8.5k EMIs).",
      "Recent bounced EMI last month due to cash flow crunch.",
      "Wants ₹1.5L for an electric scooter for delivery work.",
      "Rules engine should trigger 'Don't borrow' or 'Borrow less' decision to protect borrower from debt spiral.",
    ],
    inputs: {
      borrowerName: "Anita Devi",
      location: "Hubballi",
      age: 35,
      loanPurpose: "vehicle",
      loanType: "two_wheeler_loan",
      requestedAmount: 150000,
      monthlyNetIncome: 28000,
      incomeType: "informal_variable",
      existingMonthlyEmi: 8500,
      essentialExpenses: 16000,
      knowsCreditScore: false,
      creditScore: null,
      incomeHistoryMonths: 12,
      hasMissedOrBouncedEmiRecently: true,
      emergencySavingsMonths: 0,
      emergencySavingsAmount: 0,
      existingLoanAvgRate: 32,
      existingTotalOutstanding: 35000,
      willLoanGenerateIncome: true,
      expectedAdditionalMonthlyCashflow: 3000,
    },
  },
};
