

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
└── tests/
    ├── sample-claim-lifecycle.spec.ts
    └── ...
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
