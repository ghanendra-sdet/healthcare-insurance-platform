# Healthcare Insurance Platform — Business Overview

> **Start here if you're new to health-tech QA, in HR, or from a non-QA technical role.** This
> document explains the four-entity model and claim lifecycle before you look at any test case
> or code.

## 1. What problem does it solve?

Health insurance involves four parties who each see the same underlying event — a claim — very
differently. A SaaS Healthcare Insurance platform gives each party (Provider, Payer, Employer,
Member) their own portal and workflow, while keeping the underlying claim data consistent across
all of them.

## 2. The Four Entities

### Providers
Healthcare professionals, dental practitioners, and medical facilities that deliver care and
submit claims — often on behalf of the Member they treated.

### Payers
Insurance companies that offer health plans and are responsible for reviewing and processing
claims and reimbursements.

### Employers
Organizations that purchase group insurance plans and extend healthcare coverage to their
employees. An Employer's plan defines the coverage rules a Payer applies when reviewing a claim.

### Members / Patients
Individuals enrolled in an insurance plan — either through an Employer's group plan or
individually — who access healthcare services and benefits.

## 3. The Claim Lifecycle, in Plain Terms

1. A **Member** is enrolled under a plan (via an Employer, or individually)
2. The Member receives care from a **Provider**
3. The **Provider** submits a claim
4. The **Payer** reviews the claim against the **Employer**'s plan coverage rules
5. The claim resolves to one of three statuses: **Final**, **Need Review**, or **Rejected**

## 4. Glossary

| Term | Meaning |
|---|---|
| **Claim** | A request for payment/reimbursement submitted after a Member receives care |
| **Final** | A claim that has completed review and reached a settled outcome |
| **Need Review** | A claim requiring manual/additional review before a final outcome can be reached |
| **Rejected** | A claim denied, with a reason that must be communicated back to the Provider/Member |
| **RTM** | Requirement Traceability Matrix — maps requirements to their test coverage |
| **Enrollment** | The process of a Member joining a plan, individually or via an Employer |
| **Provider Network** | The set of Providers a given plan recognizes/covers |

## 5. Why Cross-Entity Consistency Is the Central Testing Theme

The same claim is visible, in different forms, to all four entities. The highest-value defects
in this platform are **consistency gaps between these views** — not isolated single-portal bugs:

- Does the Payer's claim status match what the Member sees?
- Does the Provider see the correct rejection reason when a claim is denied?
- Does an Employer's plan-level coverage change correctly propagate to claims reviewed
  afterward, without corrupting already-settled claims?

## 6. Why "Need Review" and "Rejected" Need Dedicated Focus

It's easy to thoroughly test the happy path (submitted → Final) and under-test the other two
outcomes:

- A **Need Review** claim that never resolves is effectively a silently lost claim
- A **Rejected** claim without a clear, correct reason generates disproportionate support burden
  and erodes trust in the platform

This is why data-level validation of claim status (querying the actual claim record, not just
asserting on UI text) is treated as a first-class testing practice here, alongside RTM-driven
requirement traceability to ensure none of these paths go untested release over release.

## 7. Stakeholders / Involved Parties

| Stakeholder | Role in this module |
|---|---|
| **Member / Patient** | Enrolls in a plan, receives care, views their own claims and coverage |
| **Provider** | Delivers care, submits claims on the Member's behalf, views claim/rejection status |
| **Payer** | Reviews and processes claims against plan coverage rules, determines claim outcome |
| **Employer** | Purchases group plans, defines coverage rules that shape Payer review decisions |
| **Platform Admin/Ops** | Manages platform configuration, monitors claim-processing SLAs and system health |
| **Compliance Team** | Ensures claims handling and data practices meet healthcare regulatory requirements |
| **QA/Product Team** | Maintains RTM, defines acceptance criteria, and owns cross-entity consistency as the core quality bar |

## 8. Dependencies

### Internal Platform Dependencies

- **Enrollment Service** — the source of truth for which Member belongs to which Employer plan,
  consumed by claim review to apply the correct coverage rules
- **Claims Engine** — the authoritative claim-status record every one of the four portals must
  read from (see section 5) — the single most load-bearing internal dependency in this platform
- **Billing & Settlement Service** — consumes finalized claim data to process reimbursement
- **Provider Network Service** — determines which Providers are recognized/covered under a given
  plan, consulted during claim review
- **Notification Service** — delivers status-change and rejection-reason notifications to
  Provider and Member portals

### External Dependencies

- **Regulatory/Compliance Reporting Systems** — periodic reporting obligations tied to claims and
  coverage data
- **Payment/Reimbursement Rails** — settlement processing for approved claims (outside this
  repo's scope, but a downstream consumer of Final-status claims)

**Testing implication:** because the Claims Engine is read by all four portals, a regression
there has the same "blast radius" characteristic seen in the fintech portfolio's shared-service
model — a single incorrect field or stale cache at the source can silently manifest as a
cross-entity inconsistency defect (see [`sample-defect-report.md`](../sample-defect-report.md)
Defect #1) rather than an obviously-broken feature.
