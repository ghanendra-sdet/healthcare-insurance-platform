# Sample Requirement Traceability Matrix — Healthcare Insurance Platform

> Worked example using dummy data. An RTM is referenced throughout this repo as a core
> responsibility (see the [README](./README.md#-my-role) and
> [`docs/tech-and-skills.md`](./docs/tech-and-skills.md)) — this is what that artifact actually
> looks like, not just a claim that it exists. See
> [`docs/README.md`](./docs/README.md) for the full documentation map.

## What an RTM Is Actually For

A regression checklist (see [`regression-checklist.md`](./regression-checklist.md)) answers
"what do we test." An RTM answers a different, equally important question: **"does every
business requirement have test coverage, and is that coverage actually sufficient?"** The two
documents look similar but serve different purposes — a checklist is organized by test area; an
RTM is organized by *requirement*, which is what makes it the tool that actually catches a
requirement with **no** test coverage at all, not just a weakly-tested one.

## The Matrix

| Req ID | Requirement (from a sample sprint story) | Linked Test Case(s) | Automation Status | Coverage Status |
|---|---|---|---|---|
| REQ-101 | Member can enroll individually with valid plan details | TC-001 | Automated | ✅ Covered |
| REQ-102 | Member can enroll under an Employer's group plan | TC-002 | Automated | ✅ Covered |
| REQ-103 | Duplicate enrollment for the same Member is rejected | TC-003 | Automated | ✅ Covered |
| REQ-104 | Provider can submit a claim for an enrolled Member | TC-004 | Automated | ✅ Covered |
| REQ-105 | Payer can approve a claim, transitioning it to Final | TC-005 | Automated | ✅ Covered |
| REQ-106 | Payer can flag a claim as Need Review with a reason | TC-006 | Manual | ✅ Covered |
| REQ-107 | Payer can reject a claim with a documented reason | TC-007, TC-008 | Automated | ✅ Covered |
| REQ-108 | Claim status is identical across all four portals at any given moment | TC-009 | Automated | ✅ Covered |
| REQ-109 | An Employer's plan-rule change never retroactively alters an already-Final claim | TC-010 | Manual | ⚠️ Partial — only tested for one rule-change type (coverage %); tax/fee rule changes not yet covered |
| REQ-110 | A Need Review claim is escalated if it exceeds its SLA, never left unresolved indefinitely | TC-011 | Manual | ✅ Covered |
| REQ-111 | Claim record returned by the API matches what every portal displays, for all 3 terminal statuses | TC-012, TC-013, TC-014 | Automated | ✅ Covered |
| REQ-112 | Full CRUD operations on a claim are available via API, with business rules enforced on delete/void | TC-015–TC-018 | Automated | ✅ Covered |
| REQ-113 | Claim status/color labeling is identical across all four portals | TC-019 | Automated | ✅ Covered |
| REQ-114 | A Clearinghouse-scrubbing rejection is distinguishable from a Payer-adjudication rejection, in both UI and API response | — | — | ❌ **Gap — no test case exists yet** |
| REQ-115 | ePHI fields (Member identifiers, claim detail) are encrypted at rest and access-logged per HIPAA's Security Rule | — | — | ❌ **Gap — flagged to Security/Compliance, outside this suite's current scope** |

## What the Gaps Actually Caught

This is the part a checklist alone wouldn't surface, because a checklist only tells you about the
tests that already exist:

- **REQ-114** came directly out of writing [`architecture-and-flow.md`](./docs/architecture-and-flow.md)
  section 3's distinction between a Clearinghouse-scrubbing failure and a Payer-adjudication
  rejection — once that distinction was drawn explicitly in the architecture doc, it became clear
  the regression suite had never actually tested that the *two failure modes are distinguishable*
  to the Provider, only that a claim can end up `REJECTED` at all. This gap was raised as a new
  story (illustrative ID `HIP-2241`) rather than silently left out of the next release.
- **REQ-115** is an example of an RTM correctly surfacing a requirement that belongs to a
  different team's test scope (Security/Compliance) rather than this QA suite's — the value here
  isn't that this suite covers it, it's that the RTM makes the gap *visible* instead of silently
  assumed to be someone else's problem with no record of the handoff.

**The general pattern:** an RTM's value isn't the rows that say "Covered" — those just confirm
existing test design. Its value is specifically the rows that say "Gap," because those are the
requirements a test-case-first workflow (write tests, forget to check them against the original
requirement list) would never have surfaced on its own.
