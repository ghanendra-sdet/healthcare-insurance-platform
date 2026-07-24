# Healthcare Insurance Platform — UI Consistency

> Claim status, rejection reasons, and coverage data surface across four distinct portals —
> Provider, Payer, Employer, and Member (see [`business-overview.md`](./business-overview.md)).
> This document covers whether it's represented **consistently** across all four.

## Why This Matters More Here Than in Most Modules

Per [`business-overview.md`](./business-overview.md) section 5, this platform's central risk is
cross-entity data consistency — and the UI is where that inconsistency actually surfaces to a
real person. A claim shown as "Final" in one portal and "Need Review" in another isn't just a
rendering bug — it's a Member believing they're reimbursed when they're not, or a Provider unable
to see why a claim was denied (see [`sample-defect-report.md`](../sample-defect-report.md)
Defects #1–2). UI consistency here is a direct proxy for data correctness.

## 1. Claim Status Representation Consistency

| Status | Expected Label | Expected Color (convention) |
|---|---|---|
| Final | "Final" | Green |
| Need Review | "Need Review" | Amber |
| Rejected | "Rejected" | Red |
| Submitted (pre-review) | "Submitted" | Neutral/Blue |

**Test scenario:** the same claim's status label and color must be identical across all four
portals at any given moment — see [`regression-checklist.md`](../regression-checklist.md)
section 3 (Cross-Entity Data Consistency).

## 2. Rejection Reason Display Consistency

- The exact rejection reason recorded by the Payer must appear identically worded in both the
  Provider and Member portals — never present in one and blank in another (see
  [`sample-defect-report.md`](../sample-defect-report.md) Defect #2)
- Reason codes/text must not be truncated differently across portals

## 3. Terminology Consistency

Per the glossary in [`business-overview.md`](./business-overview.md), watch for drift on:

- "Claim" vs. "Request" vs. "Case" used interchangeably for the same concept
- "Coverage" vs. "Plan Benefits" vs. "Policy Terms" as different labels for the same thing
- "Provider Network" terminology must match exactly between the plan-configuration screens
  (Employer/Payer side) and the Provider-facing network-status view

## 4. Currency & Date Formatting Consistency

| Element | Convention to Verify |
|---|---|
| Claim/reimbursement amounts | Consistent currency symbol and decimal places across Provider, Payer, Employer, and Member views |
| Claim submission/decision dates | Identical date format across all four portals and any exported report |

## 5. Empty States & Error Messages

- Does each portal show a deliberate empty state for a Member/Provider with zero claims, distinct
  from a data-load error?
- Is the "claim not found" or "access denied" error worded consistently across all four portals?

## 6. Cross-Browser & Responsive Consistency

- Do claim-status badges render identically across Chrome, Firefox, and Safari/WebKit, across all
  four portals?

## 7. Accessibility Consistency

- Are Final/Need Review/Rejected/Submitted states distinguishable by more than color alone?

---

## Coverage Mapping

See [`../regression-checklist.md`](../regression-checklist.md) section 7 for the UI consistency
test cases derived from this document.
