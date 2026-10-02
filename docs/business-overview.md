# Healthcare Insurance Platform — Business Overview

> **Start here if you're new to health-tech QA, in HR, or from a non-QA technical role.** This
> document explains the four-entity model and claim lifecycle before you look at any test case
> or code.

## 1. What problem does it solve?

Health insurance involves four parties who each see the same underlying event — a claim — very
differently. A SaaS Healthcare Insurance platform gives each party (Provider, Payer, Employer,
Member) their own portal and workflow, while keeping the underlying claim data consistent across
all of them.

## 2. The Four Entities & Core Modules

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

### Core Modules and Their Submodules

The four entities above are *who* uses the platform. These are the modules that actually do the
work underneath them — the level of detail a test plan or automation suite needs, not just a
product-brochure feature list. The last column names which skill category (see
[`tech-and-skills.md`](./tech-and-skills.md)) is the primary way that module gets tested.

| Module | Submodules / Key Components | Responsible For | Primarily Tested Via |
|---|---|---|---|
| **Enrollment** | Individual Enrollment · Employer Group Plan Enrollment · Duplicate-Enrollment Prevention | Bringing a Member onto a plan and establishing which coverage rules apply to them | Functional Testing + API Testing |
| **Claims Engine** | Claim Intake (EDI 837) · Clearinghouse Scrubbing · Status State Machine · Authoritative Claim Record | The single source of truth for claim status every one of the four portals reads from (section 8) | API Testing + Data-Level Testing |
| **Adjudication** | Coverage Rule Evaluation · Approve / Need-Review / Reject Decisioning · Rejection Reason Capture | The Payer's actual coverage decision on a submitted claim — see [`architecture-and-flow.md`](./architecture-and-flow.md) section 3 | Functional Testing + API Testing |
| **Billing & Settlement** | Remittance Generation (EDI 835) · EOB (Explanation of Benefits) Generation · Reimbursement Processing | Turning a `FINAL` claim into an actual payment and a statement explaining it | API Testing |
| **Provider Network Management** | Provider Onboarding · Network Status / Coverage Mapping | Determining which Providers are recognized/covered under a given plan | Functional Testing (Admin) |
| **Four Entity Portals** | Role-based UI per entity · Claim/coverage visibility scoped to that entity | Giving each entity its own correctly-scoped, *consistent* view of the same underlying claim data | UI Automation |
| **Notification Service** | Status-change alerts · Rejection-reason delivery | Keeping Provider and Member informed as a claim's status changes | Functional Testing |

**Why Claims Engine and Adjudication are listed as two separate modules, not one "claims
processing" module:** they fail in different ways and get fixed by different people. A
Clearinghouse-scrubbing defect (an invalid procedure code slipping through) is a data-validation
bug; an Adjudication defect (the wrong coverage rule applied) is a business-logic bug. Testing
them as one undifferentiated module makes it harder to tell, from a failing test alone, which
team actually owns the fix — see [`architecture-and-flow.md`](./architecture-and-flow.md)
section 1 for how this split maps onto the actual system architecture.

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
| **Adjudication** | The Payer's formal process of evaluating a submitted claim and deciding to pay it in full, pay it partially, or deny it |
| **EOB (Explanation of Benefits)** | The statement sent to a Provider/Member after adjudication, explaining what was paid, what wasn't, and why |
| **Clearinghouse** | A secure intermediary that validates and standardizes a claim (format, codes, eligibility) before it ever reaches the Payer — see [`architecture-and-flow.md`](./architecture-and-flow.md) sections 1–3 |
| **Claim Scrubbing** | The Clearinghouse's validation step — catching invalid procedure/diagnosis codes, formatting errors, and ineligible claims before adjudication |
| **EDI 837 / EDI 835** | The real, HIPAA-mandated electronic claim transaction standards this platform's flow is modeled on — 837 submits a claim, 835 carries back the adjudication/payment result (see [`architecture-and-flow.md`](./architecture-and-flow.md) section 2) |
| **CPT / ICD-10 Codes** | Standard codes identifying, respectively, the procedure performed (CPT) and the diagnosis it was performed for (ICD-10) on a claim |
| **PHI / ePHI** | Protected Health Information / its electronic form — the category of data HIPAA's Privacy and Security Rules govern; anything claim- or Member-identifying in this platform falls under this |

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
- **Clearinghouse** — validates and standardizes every claim (format, procedure/diagnosis codes,
  eligibility) before it ever reaches adjudication — see
  [`architecture-and-flow.md`](./architecture-and-flow.md) sections 1–3; a defect here looks like
  a "claim rejected for no reason" bug unless it's correctly attributed to this stage rather than
  to adjudication itself
- **Claims Engine** — the authoritative claim-status record every one of the four portals must
  read from (see section 5) — the single most load-bearing internal dependency in this platform
- **Billing & Settlement Service** — consumes finalized claim data to generate the EDI 835
  remittance and EOB, and to process reimbursement
- **Provider Network Service** — determines which Providers are recognized/covered under a given
  plan, consulted during claim review
- **Notification Service** — delivers status-change and rejection-reason notifications to
  Provider and Member portals

### External Dependencies

- **Regulatory/Compliance Reporting Systems** — periodic reporting obligations tied to claims and
  coverage data, governed by HIPAA's Privacy and Security Rules wherever PHI/ePHI (see Glossary)
  is involved — the Security Rule specifically requires administrative, physical, and technical
  safeguards (e.g., encryption of ePHI, access controls, audit logging) around exactly the kind
  of claim and Member data this platform's Claims Engine holds
- **Payment/Reimbursement Rails** — settlement processing for approved claims (outside this
  repo's scope, but a downstream consumer of Final-status claims)

**Testing implication:** because the Claims Engine is read by all four portals, a regression
there has the same "blast radius" characteristic seen in the fintech portfolio's shared-service
model — a single incorrect field or stale cache at the source can silently manifest as a
cross-entity inconsistency defect (see [`sample-defect-report.md`](../sample-defect-report.md)
Defect #1) rather than an obviously-broken feature.
