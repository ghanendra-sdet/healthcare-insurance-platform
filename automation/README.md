# Healthcare Insurance Platform — Automation Framework

> Automated scenarios trace directly to [`../regression-checklist.md`](../regression-checklist.md)
> sections 1–3 (enrollment, claim submission/review, cross-entity consistency). See
> [`../docs/README.md`](../docs/README.md) for the full documentation map,
> [`../docs/architecture-and-flow.md`](../docs/architecture-and-flow.md) for the sequence diagrams
> each scenario below is built to validate, and
> [`../docs/tech-and-skills.md`](../docs/tech-and-skills.md) section 5 for a worked, illustrative
> k6 performance-test script plus the full load/spike/soak testing approach for this domain.

Automation for the Provider/Payer/Employer/Member claim lifecycle, built with **Playwright +
TypeScript**, backed by REST Assured/Postman API coverage for CRUD operations.

## Why Playwright + TypeScript, with Dedicated API Coverage

- The platform has 4 distinct portals (Provider, Payer, Employer, Member) — Playwright's
  multi-context support makes it practical to simulate cross-entity scenarios (e.g. a claim
  submitted as Provider, then reviewed as Payer) within a single test
- API-level CRUD coverage exists alongside UI automation specifically to support **data-level
  validation** — confirming a claim's true underlying status independent of what any one portal
  displays

## Suggested Project Structure

```
automation/
├── README.md
├── playwright.config.ts
├── pages/
│   ├── ProviderPortalPage.ts
│   ├── PayerPortalPage.ts
│   ├── EmployerPortalPage.ts
│   └── MemberPortalPage.ts
├── api/
│   └── ClaimsApiClient.ts
├── fixtures/
│   └── dummy-claim-data.ts
├── tests/
│   ├── sample-claim-lifecycle.spec.ts
│   └── ...
└── k6/
    └── claim-submission-batch-load.js   ← batch EDI 837 submission + adjudication-queue throughput
```

> This repo currently includes one representative sample (`sample-claim-lifecycle.spec.ts`)
> rather than the full framework, to keep the portfolio focused.

## Test Data Policy

All automation uses **dummy data only**: dummy Member/Provider/Payer/Employer records and dummy
claim data, never real patient or claims information.

## Priority Automated Scenarios

1. Member enrollment (individual and Employer group plan)
2. Claim submission (Provider-initiated)
3. Claim status transitions (Final / Need Review / Rejected)
4. Payer claim review actions
5. Cross-entity data consistency (same claim, viewed from each of the 4 portals)
6. Batch claim-submission throughput under sustained load (k6 — simulates an end-of-month EDI
   837 batch window, see [`../docs/tech-and-skills.md`](../docs/tech-and-skills.md) section 5)
