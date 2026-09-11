# BORROWER COPILOT — Financial Self-Assessment Engine

> **Lokta Take-Home Engineering Challenge**  
> A transparent, deterministic, locally runnable web application helping Indian borrowers answer critical financial questions before approaching a lender.

---

## 🌟 Product Philosophy

When walking into a bank or loan app, lenders know their maximum sanction limits, interest rates, and FOIR caps. But borrowers often don't know:
1. **Should I borrow at all?**
2. **How much am I really eligible for (Safe Limit vs Lender Sanction)?**
3. **What is a fair interest rate for me?**
4. **What EMI should I agree to?**

**Borrower Copilot** makes the borrower the best-informed person in the room by providing a transparent self-assessment and generating a 1-page **Lender Negotiation Card**.

---

## 🚀 Quick Start (Run locally in under 2 minutes)

### Prerequisites
- Node.js (v18.x or v20.x)
- npm (v9.x or later)

### Steps

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Run local development server
npm run dev

# 3. Open browser
# Navigate to http://localhost:3000
```

### Running Tests

```bash
# Run the 14-scenario deterministic rules engine test suite
npm test
```

---

## 🏗️ Technical Architecture

Built with a clean separation of concerns: calculations and financial rules are decoupled from UI components.

```
src/
  app/
    page.tsx                 # Main application view (Hero -> Form -> Results)
    examples/page.tsx        # Interactive Priya, Ravi, & Anita run-throughs
    layout.tsx               # Root layout & theme wrapper
    globals.css              # Tailwind CSS styles & print media rules
  
  components/
    app-shell/               # Navbar, Footer, Disclaimer Banner
    questionnaire/           # 5-step adaptive form wizard
    results/                 # Output Cards 1 to 4 & Why-this-number dialogs
    negotiation-card/        # One-Page printable Lender Negotiation Card
    ui/                      # Custom accessible Tailwind components (Button, Input, Card, Badge, etc.)

  features/
    borrower-assessment/     # DETERMINISTIC FINANCIAL RULES ENGINE
      types.ts               # Core TypeScript domain models
      constants.ts           # Product benchmarks & FOIR caps
      assessment.ts          # Main calculateAssessment(inputs) orchestrator
      calculations/          # EMI math, IRR APR solver, Principal capacity
      rules/                 # Affordability, Fair Rates, Eligibility, Stress testing

  data/
    sample-borrowers.ts      # Stored test profiles for Priya, Ravi, and Anita

  lib/
    formatters.ts            # Indian Rupee (INR) and rate range formatters

  tests/
    run-tests.ts             # Rule engine test suite runner
    rules.test.ts            # Vitest spec suite
```

---

## 📊 Core Outputs (O1 – O5)

1. **O1: Should I Borrow?**: Evaluates disposable cashflow after essential expenses and recommends `Borrow`, `Borrow less`, or `Don't borrow`.
2. **O2: How Much?**: Contrasts **Likely Lender Sanction** (permissive FOIR) with **Borrower-Safe Borrowing Ceiling** (cushion-protected).
3. **O3: Fair Rate & All-in APR**: Computes fair rate band and calculates true effective APR including processing fees.
4. **O4: Safe EMI & Stress Test**: Shows safe EMI ceiling, 3yr vs 5yr vs 7yr tenure trade-offs, and evaluates a 20% income shock or +2% rate hike.
5. **O5: Negotiation Card**: Printable 1-page summary with specific questions to ask lenders.

---

## 👤 Three Sample Borrower Profiles

Accessible interactively in the app or under `/examples`:

1. **Priya Sharma (Salaried SWE, Bengaluru)**: ₹1.1L/mo net income, 780 CIBIL score, ₹14k car loan EMI, requesting ₹8L wedding loan.
2. **Ravi Kumar (Self-Employed Kirana Store, Mysuru)**: ₹60k/mo cashflow, unknown credit score, owns ₹45L shop collateral, requesting ₹15L for business expansion. Routed toward Loan Against Property (LAP).
3. **Anita Devi (Gig Delivery Rider, Hubballi)**: ₹28k/mo variable income, recent bounced EMI, 3 existing app loans @ 30%+ interest, requesting ₹1.5L for EV scooter. Triggers `Don't borrow` / `Borrow less` protection.

---

## 📋 Comprehensive Documentation

For full mathematical rules, rate tables, FOIR limits, and unknown-value handling, read [`RULES.md`](./RULES.md).

---

## 🔮 What Was Intentionally Cut / Future Roadmap

### Intentionally Excluded (Per Constraints):
- No LLMs used for financial calculations (guarantees determinism)
- No user login, backend API, or database storage
- No credit bureau soft/hard pulls
- No fake precision (all outputs use rounded ranges)

### Next Potential Upgrades:
- PDF Export download button for Negotiation Card
- Multi-language support (Hindi, Kannada, Tamil, Marathi)
- Regional benchmark cost-of-living calculators
