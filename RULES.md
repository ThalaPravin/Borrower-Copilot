# BORROWER COPILOT — Deterministic Rules Engine Specification

This document details all formulas, decision thresholds, rate benchmarks, FOIR caps, stress scenarios, and unknown-value handling rules used inside **BORROWER COPILOT**.

---

## 1. Summary of Rules Engine Philosophy

1. **Borrower-First Alignment**: Traditional credit underwriting systems maximize loan sanction limits to maximize lender interest income. Borrower Copilot maximizes borrower safety and financial understanding.
2. **Strict Determinism**: `calculateAssessment(inputs)` is a pure TypeScript function. Same inputs strictly produce identical outputs without any random variance or LLM non-determinism.
3. **Explicit Handling of Unknowns**: Unknown credit scores or missing savings buffers are never converted to default numbers like 300 or 750. Unknowns widen estimated rate bands and lower confidence scores transparently.

---

## 2. Core Financial Rules & Formulas

| Rule | Value / Formula | Why | Source / Assumption |
| :--- | :--- | :--- | :--- |
| **EMI Formula** | $$EMI = \frac{P \cdot r \cdot (1+r)^n}{(1+r)^n - 1}$$ where $P$ = Principal, $r$ = monthly rate, $n$ = months. | Standard actuarial compound interest monthly loan payment formula. | Standard Indian Banking Practice (RBI / IBA) |
| **Principal Capacity Formula** | $$P = \frac{EMI \cdot ((1+r)^n - 1)}{r \cdot (1+r)^n}$$ | Inverse EMI equation used to convert maximum safe EMI into maximum safe principal. | Pure Financial Mathematics |
| **Lender-Style FOIR Cap** | **50% to 60%** of Gross/Net Monthly Income. | Traditional banks evaluate FOIR = (Existing EMIs + New EMI) / Income without deducting personal expenses. | Market Observation ([HDFC Bank FOIR Guidelines](https://www.hdfcbank.com/personal/borrow/popular-loans/personal-loan/eligibility-calculator)) |
| **Borrower-Safe EMI Ceiling** | $SafeEMI = \min(AvailableCashflow \times SafetyFactor, MaxNetIncome \times 35\% - ExistingEMIs)$ | Borrower-safe model enforces that essential living expenses & uncommitted cashflow cushion are preserved. | Product Design Judgement |
| **Available Uncommitted Cashflow** | $Cashflow = NetIncome - EssentialExpenses - ExistingEMIs$ | Calculates true remaining cash after rent, food, school fees, and existing debt. | Standard Personal Finance Best Practice |
| **Safety Retention Factor** | **35% to 50%** of free uncommitted cashflow. Reduced by 15% for variable income or bounced EMIs. | Prevents committing 100% of spare cash to loan EMIs, leaving room for savings. | Financial Resilience Judgement |
| **Unknown Credit Score Handling** | Do NOT assume 300 or 750. Keep `creditScore: null`. Widen rate band by **+1.0% to +3.0%**; set confidence to `medium`/`low`. | Reflects risk premium lenders charge when credit history is unverified. | Market Observation (RBI Risk-Based Pricing Guidelines) |
| **Prime Credit Score Discount** | Score $\ge 780$: **-0.5% to -1.0%** rate discount. Score 730–779: Base rate. Score 670–729: **+1.5% to +2.5%** penalty. | Higher credit scores lower default risk probability, qualifying for prime pricing tiers. | Market Observation (CIBIL / Experian Benchmark Pricing) |
| **Informal / Variable Income Premium** | **+2.0% to +4.0%** rate risk premium. | Lenders charge higher interest for informal or un-banked cash income due to documentation risk. | Market Observation (NBFC / MFI Sector Benchmarks) |
| **Collateral Discount (LAP)** | Unencumbered property collateral reduces interest rate by **2.5% to 3.5%** (routes to Loan Against Property). | Secured debt reduces lender loss-given-default (LGD). | Market Observation (Secured vs Unsecured Lending Rates) |
| **Illustrative All-In APR** | Solves monthly IRR $r_{monthly}$ where $Disbursement = \sum_{t=1}^n \frac{EMI}{(1+r_{monthly})^t}$. $APR = r_{monthly} \times 12 \times 100$. | Incorporates upfront processing fee % into true annualized cost of borrowing. | RBI Regulatory Master Direction on Loan Transparency (APR Disclosure) |
| **Stress Scenario (Salaried)** | **20% Income Reduction**. Evaluates whether remaining cushion stays $\ge 0$. | Simulates job transition or salary haircut risk. | Illustrative Stress Testing Standard |
| **Stress Scenario (Variable Income)** | **25% Income Reduction** (Lower bound of income range). | Simulates dry business season or reduced gig delivery demand. | Illustrative Stress Testing Standard |
| **Stress Scenario (Floating Rate)** | **+2.0% Rate Hike**. | Simulates RBI Repo Rate hike cycle impact on floating-rate EMIs. | Market Risk Stress Scenario |
| **Decision: `dont_borrow`** | Triggered if commitments $\ge 82\%$ of income OR available cashflow $< 10\%$ OR recent bounced EMI with high debt. | Protects borrower from severe debt trap / insolvency. | Financial Safety Threshold |
| **Decision: `borrow_less`** | Triggered if requested loan amount $>$ Safe borrowing ceiling BUT requested EMI $\le$ available cashflow. | Advises borrower to align loan size with safe cash flow limit. | Product Design Principle |
| **Decision: `borrow`** | Triggered if requested amount $\le$ Safe borrowing ceiling AND positive cushion under stress test. | Confirms loan request is financially sustainable. | Product Design Principle |

---

## 3. Product-Specific Baseline Rate & Tenure Benchmarks

| Product | Category | Baseline Rate Band | Typical Tenure | Lender FOIR Cap | Borrower Safe FOIR | Default Processing Fee |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Personal Loan** | Unsecured | 10.5% – 14.0% | 3 Years (Max 5) | 50% | 35% | 2.0% |
| **Home Loan** | Secured | 8.4% – 9.5% | 20 Years (Max 30) | 55% | 40% | 0.5% |
| **Loan Against Property** | Secured | 9.5% – 11.5% | 10 Years (Max 15) | 55% | 40% | 1.0% |
| **Gold Loan** | Secured | 9.0% – 12.0% | 1 Year (Max 3) | 60% | 45% | 0.5% |
| **Two-Wheeler Loan** | Secured | 11.0% – 16.0% | 3 Years (Max 5) | 50% | 35% | 2.5% |
| **Business Loan** | Unsecured | 12.0% – 17.5% | 4 Years (Max 7) | 50% | 35% | 2.0% |

---

## 4. Distinctions & Limitations

1. **Self-Assessment Tool**: This tool does not issue formal lender credit approvals or pull official credit bureau records.
2. **Rounded Values**: All rupee outputs are rounded to the nearest ₹1,000 or ₹10,000 to eliminate fake precision (e.g. ₹5,40,000 rather than ₹5,47,382).
3. **Regulatory Context**: APR formulas align with RBI directives on loan cost transparency, but actual lender processing fees or insurance bundling may vary at time of application.
