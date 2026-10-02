# Healthcare Insurance Platform — Regression Checklist & Test Cases

> Sample regression suite structure with dummy data. Format: ID | Scenario | Steps | Expected Result.
> See [`docs/business-overview.md`](./docs/business-overview.md) for why cross-entity consistency
> (section 5) is treated as a first-class scenario here, and
> [`docs/README.md`](./docs/README.md) for the full documentation map.

## 1. Enrollment

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-001 | Individual Member enrollment | 1. Enroll a dummy Member with individual plan details | Enrollment succeeds, Member record created |
| TC-002 | Employer group plan enrollment | 1. Enroll a dummy Member under a dummy Employer's group plan | Member correctly linked to the Employer's plan and its coverage rules |
| TC-003 | Duplicate enrollment prevented | 1. Attempt to enroll the same dummy Member twice | Second attempt rejected with a clear duplicate error |

## 2. Claim Submission & Review

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-004 | Provider submits a valid claim | 1. As a dummy Provider, submit a claim for an enrolled Member | Claim created with status `SUBMITTED`, visible to the Payer |
| TC-005 | Payer reviews and approves a claim | 1. As Payer, review the submitted claim 2. Approve it | Status transitions to `FINAL` |
| TC-006 | Payer flags a claim for review | 1. Review a claim missing required documentation | Status transitions to `NEED REVIEW`, reason recorded |
| TC-007 | Payer rejects a claim | 1. Review a claim not covered under the Employer's plan | Status transitions to `REJECTED` with a clear reason |
| TC-008 | Rejection reason visible to Provider and Member | 1. After TC-007, check both the Provider and Member portals | Both show the identical, correct rejection reason |

## 3. Cross-Entity Data Consistency (Highest Priority)

> See [`docs/architecture-and-flow.md`](./docs/architecture-and-flow.md) section 5 for this
> guarantee shown as a sequence diagram, including the exact stale-cache mechanism behind
> `BUG-HIP-6014` in [`sample-defect-report.md`](./sample-defect-report.md).

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-009 | Claim status consistent across all 4 portals | 1. Change a claim's status as Payer 2. Check Provider, Employer, and Member views | All four views show the identical, current status — no drift |
| TC-010 | Employer plan-rule change doesn't corrupt settled claims | 1. Modify a dummy Employer's plan coverage rules 2. Check previously `FINAL` claims under the old rules | Already-settled claims remain unchanged; only new claims apply the updated rules |
| TC-011 | Need Review claim doesn't silently stall | 1. Put a claim into `NEED REVIEW` 2. Simulate time passing (test env) | Claim remains actionable/visible in a review queue, never disappears without resolution |

## 4. Data-Level Validation

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-012 | Data-level check — Final claim | 1. Query the claim record directly (DB/API) for a `FINAL` claim | Underlying data matches what every portal displays |
| TC-013 | Data-level check — Need Review claim | 1. Query the claim record for a `NEED REVIEW` claim | Data reflects the correct pending-review state, with an assigned reviewer if applicable |
| TC-014 | Data-level check — Rejected claim | 1. Query the claim record for a `REJECTED` claim | Rejection reason is present and matches what's shown in the UI |

## 5. API CRUD Validation

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-015 | Create claim via API | 1. POST a dummy claim payload | Claim created, response includes a valid claim ID |
| TC-016 | Read claim via API | 1. GET the claim by ID | Response matches the submitted data exactly |
| TC-017 | Update claim via API | 1. PATCH the claim's status | Update reflected immediately in subsequent GET calls |
| TC-018 | Delete/void claim via API | 1. Attempt to void a dummy claim | Only permitted under defined business rules (e.g. not after settlement); enforced correctly |

## 6. UI Consistency

> Derived from [`docs/ui-consistency.md`](./docs/ui-consistency.md) — cross-portal consistency,
> not single-screen correctness.

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-019 | Claim status label/color consistency | 1. Compare "Final"/"Need Review"/"Rejected"/"Submitted" labels across all four portals | Identical labels and colors everywhere |
| TC-020 | Rejection reason text consistency | 1. Compare a rejected claim's reason text in the Provider and Member portals | Identical wording, no truncation differences |
| TC-021 | Currency/date formatting consistency | 1. View the same claim amount and decision date across all four portals | Formatting matches exactly |
| TC-022 | Claim status distinguishable without color | 1. View Final/Need Review/Rejected/Submitted badges with color/grayscale rendering simulated | Each remains distinguishable via icon/text label alone |

## 7. Full Regression Checklist

- [ ] Member Enrollment (individual / Employer group plan)
- [ ] Provider Claim Submission
- [ ] Payer Claim Review
- [ ] Claim Status: Final
- [ ] Claim Status: Need Review
- [ ] Claim Status: Rejected
- [ ] Cross-Entity Data Consistency
- [ ] Data-Level Claim Validation
- [ ] API CRUD Operations
- [ ] Billing & Settlement
- [ ] Provider Network Management
- [ ] Permissions / Role-Based Access (per entity type)
- [ ] UI Consistency (status labeling, formatting, terminology, accessibility)

## 8. Priority Automation Candidates

1. Member enrollment (individual and group plan)
2. Claim submission (Provider-initiated)
3. Claim status transitions (all 3 outcomes)
4. Cross-entity consistency checks
5. API CRUD coverage

See [`automation/`](./automation) for the Playwright implementation.
