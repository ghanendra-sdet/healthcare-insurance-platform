# Sample Defect Report — Healthcare Insurance Platform

> Template + worked examples using dummy data. Reflects defect themes specific to a 4-entity
> claims platform, where cross-portal consistency is the primary risk area — see
> [`docs/business-overview.md`](./docs/business-overview.md) section 5 for why, and
> [`docs/README.md`](./docs/README.md) for the full documentation map.

## Defect Theme Taxonomy

- Cross-entity data inconsistency (claim status/details differ by portal)
- Claim status stuck in "Need Review" indefinitely
- Missing or incorrect rejection reason
- Plan coverage-rule changes corrupting settled claims
- API/CRUD validation defects
- Data-level vs. UI-level mismatch
- Enrollment validation issues

**Severity categories used:** Minor, Major, Critical, Blocker.

---

## Defect #1

| Field | Value |
|---|---|
| **ID** | BUG-HIP-6014 (sample) |
| **Title** | Member portal shows claim as "Final" while Payer portal still shows "Need Review" |
| **Severity** | Critical |
| **Module** | Cross-Entity Consistency → Claim Status |
| **Environment** | UAT (dummy data) |

**Steps to Reproduce**
1. As Payer, move a dummy claim into `NEED REVIEW`
2. Before completing the review, check the same claim in the Member portal

**Expected Result**
The Member portal should show `NEED REVIEW`, matching the Payer's actual state — the Member's
view must never be ahead of the true underlying claim status.

**Actual Result**
The Member portal shows `FINAL`, apparently because it was caching the claim's status from an
earlier polling cycle and never refreshed after the Payer's status change.

**Impact**
A Member believes their claim is settled when it is not — this can lead to a Member proceeding
as if reimbursement is confirmed, only to later discover it wasn't, which is a serious trust and
potentially financial-planning issue for the Member.

**Suggested Fix**
The Member portal's claim status should be sourced live (or with a short, bounded cache TTL)
from the same authoritative claim-status source the Payer portal reads from, not an independently
cached copy.

---

## Defect #2

| Field | Value |
|---|---|
| **ID** | BUG-HIP-6032 (sample) |
| **Title** | Rejected claim shows no reason in the Provider portal, though one was recorded |
| **Severity** | Major |
| **Module** | Claim Review → Rejection |
| **Environment** | UAT (dummy data) |

**Steps to Reproduce**
1. As Payer, reject a dummy claim with a specific reason
2. Check the claim in the Provider portal

**Expected Result**
The Provider portal should display the exact rejection reason recorded by the Payer.

**Actual Result**
The Provider portal shows a blank rejection-reason field, even though the Member portal
correctly displays it — the Provider-side claim detail view was not updated to read this field
when it was added to the schema.

**Impact**
Providers cannot see why a claim was denied, generating unnecessary support inquiries and
delaying any resubmission or appeal the Provider might otherwise make immediately.

**Suggested Fix**
Ensure the rejection-reason field is included in every entity-facing claim detail view that
displays claim status, not added to only some of the four portals.

---

## Defect Reporting Template (blank)

| Field | Value |
|---|---|
| **ID** | |
| **Title** | |
| **Severity** | Minor / Major / Critical / Blocker |
| **Module** | |
| **Environment** | |

**Steps to Reproduce**
1.
2.
3.

**Expected Result**


**Actual Result**


**Impact**


**Suggested Fix**

