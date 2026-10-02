# Healthcare Insurance Platform — Documentation Map

> New to this repo? Start here. This page answers the questions a tech-curious QA/SDET would
> actually ask, and points to exactly the doc that answers each one.

| Question | Answer |
|---|---|
| What is this, in plain terms? | [`business-overview.md`](./business-overview.md) sections 1–2 |
| Who are the four entities? | [`business-overview.md`](./business-overview.md) section 2 |
| Who's involved / stakeholders? | [`business-overview.md`](./business-overview.md) section 7 |
| What does it depend on? | [`business-overview.md`](./business-overview.md) section 8 |
| How does a claim move through the system — flow, with real sequence diagrams? | [`architecture-and-flow.md`](./architecture-and-flow.md), and the README's [How It Works](../README.md#-how-it-works--claim-lifecycle) section |
| What are the modules and submodules? | [`business-overview.md`](./business-overview.md) section 2 |
| What's the highest-risk testing theme? | [`business-overview.md`](./business-overview.md) section 5 (cross-entity consistency) |
| How does a real stale-cache defect actually happen under the hood? | [`architecture-and-flow.md`](./architecture-and-flow.md) section 5 |
| What tech was used, and what skills does this repo demonstrate? | [`tech-and-skills.md`](./tech-and-skills.md) |
| What does the UI need to get right, consistently? | [`ui-consistency.md`](./ui-consistency.md) |
| What's tested? | [`../regression-checklist.md`](../regression-checklist.md) |
| What's automated? | [`../automation/README.md`](../automation/README.md) |
| What does a real-looking defect report look like? | [`../sample-defect-report.md`](../sample-defect-report.md) |
| What does a regression execution report look like? | [`../regression-execution-summary.md`](../regression-execution-summary.md) |
| What does a Requirement Traceability Matrix (RTM) actually look like? | [`../sample-rtm.md`](../sample-rtm.md) |

## Business Flow vs. Tech Flow vs. User Flow

- **Business Flow** — why the platform is structured around four entity types rather than one
  generic user model: a claim is one event seen very differently by the Provider who delivered
  care, the Payer who decides payment, the Employer whose plan sets the rules, and the Member
  it's ultimately for. See [`business-overview.md`](./business-overview.md) sections 1–2.
- **Tech Flow** — how a claim record actually moves through submission (EDI 837), Clearinghouse
  scrubbing, adjudication, and remittance (EDI 835/EOB), and why the Claims Engine (see
  `business-overview.md` section 8) is the single authoritative source every portal must read
  from. See [`architecture-and-flow.md`](./architecture-and-flow.md) for the full sequence
  diagrams.
- **User Flow** — what each entity actually clicks through: Member enrolls → receives care →
  Provider submits a claim → Payer reviews against the Employer's plan → all four portals reflect
  the resulting status. See the README's
  [How It Works](../README.md#-how-it-works--claim-lifecycle) section.

## Reading Order

```
README.md (repo root)
      │
      ▼
docs/business-overview.md      ← four-entity model, modules/submodules, claim lifecycle, stakeholders
      │
      ▼
docs/architecture-and-flow.md  ← real Mermaid sequence/flow diagrams: claim submission, adjudication,
      │                            NEED REVIEW escalation, cross-entity consistency, the Defect #1 mechanism
      ▼
docs/tech-and-skills.md        ← full tech stack, skill → proof map, CI/CD shape, performance testing depth
      │
      ▼
docs/ui-consistency.md         ← cross-portal claim status/rejection-reason consistency
      │
      ▼
regression-checklist.md        ← test cases, including cross-entity consistency and data-level checks
      │
      ▼
sample-defect-report.md → sample-rtm.md → regression-execution-summary.md → automation/README.md
```
