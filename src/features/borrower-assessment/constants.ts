import { LoanType } from "./types";

export interface LoanProductConfig {
  id: LoanType;
  name: string;
  category: "unsecured" | "secured";
  typicalTenureYears: number;
  maxTenureYears: number;
  baseMinRate: number; // For prime borrower (750+ credit score, salaried)
  baseMaxRate: number;
  lenderMaxFoir: number; // Max FOIR lenders typically allow (e.g. 50-60%)
  borrowerSafeFoir: number; // Max safe FOIR recommended for borrowers (e.g. 35-40%)
  defaultProcessingFeePct: number;
}

export const LOAN_PRODUCTS: Record<LoanType, LoanProductConfig> = {
  personal_loan: {
    id: "personal_loan",
    name: "Personal Loan",
    category: "unsecured",
    typicalTenureYears: 3,
    maxTenureYears: 5,
    baseMinRate: 10.5,
    baseMaxRate: 14.0,
    lenderMaxFoir: 0.50,
    borrowerSafeFoir: 0.35,
    defaultProcessingFeePct: 2.0,
  },
  home_loan: {
    id: "home_loan",
    name: "Home Loan",
    category: "secured",
    typicalTenureYears: 20,
    maxTenureYears: 30,
    baseMinRate: 8.4,
    baseMaxRate: 9.5,
    lenderMaxFoir: 0.55,
    borrowerSafeFoir: 0.40,
    defaultProcessingFeePct: 0.5,
  },
  loan_against_property: {
    id: "loan_against_property",
    name: "Loan Against Property (LAP)",
    category: "secured",
    typicalTenureYears: 10,
    maxTenureYears: 15,
    baseMinRate: 9.5,
    baseMaxRate: 11.5,
    lenderMaxFoir: 0.55,
    borrowerSafeFoir: 0.40,
    defaultProcessingFeePct: 1.0,
  },
  gold_loan: {
    id: "gold_loan",
    name: "Gold Loan",
    category: "secured",
    typicalTenureYears: 1,
    maxTenureYears: 3,
    baseMinRate: 9.0,
    baseMaxRate: 12.0,
    lenderMaxFoir: 0.60,
    borrowerSafeFoir: 0.45,
    defaultProcessingFeePct: 0.5,
  },
  two_wheeler_loan: {
    id: "two_wheeler_loan",
    name: "Two-Wheeler Loan",
    category: "secured",
    typicalTenureYears: 3,
    maxTenureYears: 5,
    baseMinRate: 11.0,
    baseMaxRate: 16.0,
    lenderMaxFoir: 0.50,
    borrowerSafeFoir: 0.35,
    defaultProcessingFeePct: 2.5,
  },
  business_loan: {
    id: "business_loan",
    name: "Business Loan",
    category: "unsecured",
    typicalTenureYears: 4,
    maxTenureYears: 7,
    baseMinRate: 12.0,
    baseMaxRate: 17.5,
    lenderMaxFoir: 0.50,
    borrowerSafeFoir: 0.35,
    defaultProcessingFeePct: 2.0,
  },
  not_sure: {
    id: "not_sure",
    name: "General Loan (Unsecured)",
    category: "unsecured",
    typicalTenureYears: 3,
    maxTenureYears: 5,
    baseMinRate: 11.0,
    baseMaxRate: 15.0,
    lenderMaxFoir: 0.50,
    borrowerSafeFoir: 0.35,
    defaultProcessingFeePct: 2.0,
  },
};
