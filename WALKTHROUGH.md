# BORROWER COPILOT — In-Depth System Walkthrough & Architectural Guide

> **An independent, deterministic, self-assessment tool designed to empower Indian borrowers before approaching a lender.**

---

## 📌 Executive Summary

When an Indian borrower walks into a lender's office, an information asymmetry exists. The lender knows their maximum risk tolerance and profit margins, while the borrower often relies solely on the lender's loan officer to tell them how much they can borrow, at what rate, and for what tenure.

**BORROWER COPILOT** reverses this dynamic. It acts as a transparent, client-side self-assessment copilot that enables borrowers to calculate their financial standing **before** meeting a lender.

### What Borrower Copilot IS:
- **100% Deterministic & Rule-Based**: Built strictly with transparent TypeScript algorithms—zero LLM hallucinations, zero black-box AI scores.
- **Client-Side & Private**: All calculations run locally in the browser with zero backend data persistence.
- **Borrower-Centric**: Explicitly separates *what a lender might sanction* from *what is safe for the borrower to borrow*.

### What Borrower Copilot IS NOT:
- Not a credit bureau (does not pull CIBIL reports).
- Not a loan marketplace or lead generator.
- Not a financial advice chatbot.

---

## 🎯 The 4 Core Financial Questions Addressed

Borrower Copilot guides the user through a 5-step questionnaire and evaluates their inputs against 4 core questions:

### 1. Should I borrow at all?
- **Decision Outcomes**: `borrow` (Green Light), `borrow_less` (Yellow Warning), `dont_borrow` (Red Light).
- **Evaluation Logic**: Evaluates uncommitted monthly cashflow after essential expenses and existing EMIs. Uses RBI FOIR (Fixed Obligation to Income Ratio) benchmarks (50% for standard profiles, reduced to 40% for low-income or variable-income profiles).

### 2. How much am I really eligible for?
- **Likely Lender Sanction Range**: What a bank/NBFC might offer based on standard gross FOIR multipliers.
- **Safe Borrowing Ceiling**: The maximum loan amount recommended to protect the borrower from financial distress during emergency income shocks.

### 3. What is a fair interest rate for me?
- **Fair Interest Rate Band**: A realistic rate range (e.g., 9.5% – 12.5%) based on credit score, employment stability, loan purpose, and income type.
- **All-in APR (Annual Percentage Rate)**: Computes the true annualized cost including upfront processing fees, preventing hidden fee surprises.

### 4. What EMI should I agree to?
- **Safe EMI Ceiling**: Establishes the maximum monthly outflow the borrower can sustain.
- **Tenure Trade-Off Analysis**: Compares 3-year vs 5-year loan tenures, highlighting interest savings vs monthly cashflow flexibility.
- **Income Stress Testing**: Simulates a 15–20% income reduction or unexpected medical expense to evaluate repayment resilience.

### Output 5: 1-Page Printable Lender Negotiation Card
A single-page summary card that the borrower can print or save as PDF to bring directly to lender discussions. Includes targeted negotiation questions (e.g., APR inquiry, foreclosure fee verification, processing fee breakdown).

---

## 🏗️ System Architecture & Code Structure

The project is built on Next.js 14 App Router, React 18, TypeScript 5, and Tailwind CSS.

```
borrower-copilot/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout with ThemeProvider & WaterRippleBackground
│   │   ├── page.tsx                  # Main single-page app (Hero -> Questionnaire -> Results)
│   │   ├── globals.css               # Theme variables, custom scrollbars & SVG hover animations
│   │   └── examples/page.tsx         # Sample borrower profiles gallery (Priya, Ravi, Anita)
│   ├── components/
│   │   ├── app-shell/
│   │   │   ├── navbar.tsx            # Floating glassmorphic navbar with active pill animations
│   │   │   ├── footer.tsx            # Footer with capitalized title & 3D orbiting bee badge
│   │   │   └── disclaimer-banner.tsx # Educational self-assessment disclosure banner
│   │   ├── questionnaire/
│   │   │   ├── questionnaire-form.tsx # 5-step form container wrapped in SpotlightCard
│   │   │   ├── step-1-loan.tsx       # Loan purpose & requested amount
│   │   │   ├── step-2-income.tsx     # Monthly net income & occupation type
│   │   │   ├── step-3-commitments.tsx# Existing EMIs, essential expenses & dependents
│   │   │   ├── step-4-credit.tsx     # Credit score, bounced EMIs & emergency savings
│   │   │   └── step-5-offer.tsx      # Optional lender offer comparison
│   │   ├── results/
│   │   │   ├── results-overview.tsx  # Grid overview of the 4 core output cards
│   │   │   ├── assessment-header.tsx # Animated decision banner with path-drawing checkmarks
│   │   │   ├── card-should-you-borrow.tsx
│   │   │   ├── card-how-much.tsx
│   │   │   ├── card-fair-rate.tsx
│   │   │   └── card-safe-emi.tsx
│   │   ├── negotiation-card/
│   │   │   └── negotiation-card-view.tsx # Printable 1-page Lender Negotiation Card (@media print)
│   │   └── ui/
│   │       ├── water-ripple-background.tsx # Interactive HTML5 Canvas water repel effect
│   │       ├── spotlight-card.tsx    # Cursor-tracking radial spotlight container
│   │       ├── button.tsx            # Shimmer sweep, click ripple & 360° SVG rotation
│   │       ├── card.tsx, input.tsx, select.tsx, progress.tsx, badge.tsx
│   ├── features/
│   │   └── borrower-assessment/      # Pure TypeScript Deterministic Rules Engine
│   │       ├── assessment.ts         # Main orchestrator (calculateAssessment)
│   │       ├── constants.ts          # FOIR benchmarks & risk adjustments
│   │       ├── types.ts              # Input & output TypeScript interface definitions
│   │       ├── rules/
│   │       │   ├── affordability.ts  # Cashflow & FOIR rules
│   │       │   ├── eligibility.ts    # Lender sanction vs safe limit rules
│   │       │   ├── rates.ts          # Fair interest rate & APR calculations
│   │       │   └── stress.ts         # Stress test scenario generation
│   │       └── calculations/
│   │           ├── emi.ts            # Standard reducing-balance EMI formula
│   │           └── apr.ts            # IRR-based effective APR computation
│   ├── data/
│   │   └── sample-borrowers.ts       # Benchmark profiles (Priya, Ravi, Anita)
│   └── tests/
│       └── run-tests.ts              # 14-scenario automated test runner
```

---

## 🎨 UI & Interactive Animation Engine

To deliver a premium user experience, Borrower Copilot incorporates high-end visual design patterns:

1. **Interactive Water Repel Background (`WaterRippleBackground`)**:
   - Renders a grid of nodes on an HTML5 canvas (`z-[-1]`, `pointer-events: none`).
   - When the user moves the cursor over the background, nodes within a 140px radius get repelled away using spring physics (`SPRING_K = 0.04`, `DAMPING = 0.88`).
   - Moving the mouse generates expanding liquid ripple rings that dissipate gracefully.

2. **Cursor-Tracking Spotlight Cards (`SpotlightCard`)**:
   - Wraps form boxes and card containers with a smooth radial spotlight (`rgba(16, 185, 129, 0.15)`) following mouse coordinates.
   - Features a radial border glow mask that illuminates the container edge near the cursor.

3. **3D Depth-Orbiting Bee Badge (`Footer`)**:
   - A golden 3D bee badge (`🐝 ✨`) orbits in a 3D loop around the capitalized `BORROWER COPILOT` title.
   - Passes **behind** the text (`zIndex: 0`, `scale: 0.75`, `opacity: 0.6`) and curves forward **in front of** the text (`zIndex: 30`, `scale: 1.3`, `opacity: 1`), creating depth without 2D squishing.

4. **Micro-Interactions on Buttons**:
   - **360° SVG Hover Rotation**: Hovering over any button smoothly rotates nested icons 360° using a custom spring curve (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
   - **Shimmer Sheen Sweep**: Light sweeps across primary buttons on hover.
   - **Click Ripples**: Dynamic expanding ripples spawn at the exact click coordinates.

---

## 🧪 Verification & Test Suite

The rules engine is verified against 14 automated test scenarios in `src/tests/run-tests.ts`:

```bash
npm test
```

### Key Test Scenarios:
1. **Priya (Salaried SWE)**: Verifies `borrow` recommendation with high assessment confidence.
2. **Ravi (Kirana Store)**: Tests unknown credit score handling (widens rate band and adjusts confidence).
3. **Anita (Gig Rider)**: Verifies `dont_borrow` trigger under existing debt stress / bounced EMI history.
4. **Unknown Credit Score**: Ensures credit score stays `null` (not assumed 300 or 750) and widens rate range.
5. **High EMI Impact**: Confirms existing monthly commitments lower the safe borrowing ceiling.
6. **APR Formula**: Verifies processing fees increase the effective annualized cost over headline rates.
7. **EMI Calculation**: Validates reducing-balance EMI formula against financial benchmarks.

---

## 🚀 Running Locally

### Prerequisites
- Node.js v18+ or v20+
- npm v9+

### Commands

```bash
# 1. Install dependencies
npm install

# 2. Run automated test suite (14 scenarios)
npm test

# 3. Launch local development server
npm run dev

# 4. Open in browser
# Navigate to http://localhost:3000
```

---

## 📄 License & Assessment Context

Built as a take-home product engineering challenge for **Lokta**. Designed with 100% open deterministic rules and full dark/light theme support.
