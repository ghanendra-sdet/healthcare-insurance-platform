/**
 * Sample Playwright + TypeScript test for the Healthcare Insurance
 * Platform's claim lifecycle across the Provider, Payer, Employer, and
 * Member portals. All data below is DUMMY/SAMPLE data for portfolio
 * demonstration only — no real patient, claims, or provider data.
 */

import { test, expect, Page } from '@playwright/test';

// ── Dummy test data ─────────────────────────────────────────────
const DUMMY_MEMBER = { id: 'DEMO-MEMBER-001', name: 'Demo Patient' };
const DUMMY_PROVIDER = { id: 'DEMO-PROVIDER-001', name: 'Demo Clinic' };
const DUMMY_CLAIM = { amount: '250', serviceCode: 'DEMO-SVC-01' };

// ── Page Objects ─────────────────────────────────────────────────
class ProviderPortalPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/provider/claims/new');
  }

  async submitClaim(memberId: string, amount: string, serviceCode: string) {
    await this.page.getByLabel('Member ID').fill(memberId);
    await this.page.getByLabel('Claim Amount').fill(amount);
    await this.page.getByLabel('Service Code').fill(serviceCode);
    await this.page.getByRole('button', { name: 'Submit Claim' }).click();
  }

  async getRejectionReason() {
    return this.page.getByTestId('claim-rejection-reason').innerText();
  }
}

class PayerPortalPage {
  constructor(private page: Page) {}

  async goto(claimId: string) {
    await this.page.goto(`/payer/claims/${claimId}`);
  }

  async approveClaim() {
    await this.page.getByRole('button', { name: 'Approve' }).click();
  }

  async rejectClaim(reason: string) {
    await this.page.getByLabel('Rejection Reason').fill(reason);
    await this.page.getByRole('button', { name: 'Reject' }).click();
  }

  async getClaimStatus() {
    return this.page.getByTestId('claim-status-badge').innerText();
  }
}

class MemberPortalPage {
  constructor(private page: Page) {}

  async goto(claimId: string) {
    await this.page.goto(`/member/claims/${claimId}`);
  }

  async getClaimStatus() {
    return this.page.getByTestId('claim-status-badge').innerText();
  }

  async getRejectionReason() {
    return this.page.getByTestId('claim-rejection-reason').innerText();
  }
}

// ── Tests ────────────────────────────────────────────────────────
test.describe('Healthcare Insurance Platform — Claim Lifecycle', () => {
  test('provider can submit a claim for an enrolled member', async ({ page }) => {
    const provider = new ProviderPortalPage(page);
    await provider.goto();
    await provider.submitClaim(DUMMY_MEMBER.id, DUMMY_CLAIM.amount, DUMMY_CLAIM.serviceCode);

    await expect(page.getByTestId('claim-status-badge')).toHaveText('SUBMITTED');
  });

  test('claim status is identical across Payer and Member views after approval', async ({ browser }) => {
    const payerContext = await browser.newContext();
    const memberContext = await browser.newContext();
    const payerPage = await payerContext.newPage();
    const memberPage = await memberContext.newPage();

    const payer = new PayerPortalPage(payerPage);
    const member = new MemberPortalPage(memberPage);

    const dummyClaimId = 'DEMO-CLAIM-001';
    await payer.goto(dummyClaimId);
    await payer.approveClaim();

    await member.goto(dummyClaimId);

    await expect(payer.getClaimStatus()).resolves.toBe('FINAL');
    await expect(member.getClaimStatus()).resolves.toBe('FINAL');

    await payerContext.close();
    await memberContext.close();
  });

  test('rejection reason matches exactly between Provider and Member views', async ({ browser }) => {
    const payerContext = await browser.newContext();
    const providerContext = await browser.newContext();
    const memberContext = await browser.newContext();

    const payer = new PayerPortalPage(await payerContext.newPage());
    const provider = new ProviderPortalPage(await providerContext.newPage());
    const member = new MemberPortalPage(await memberContext.newPage());

    const dummyClaimId = 'DEMO-CLAIM-002';
    const dummyReason = 'Service not covered under current plan';

    await payer.goto(dummyClaimId);
    await payer.rejectClaim(dummyReason);

    await member.goto(dummyClaimId);

    const providerReason = await provider.getRejectionReason();
    const memberReason = await member.getRejectionReason();

    expect(providerReason).toBe(dummyReason);
    expect(memberReason).toBe(dummyReason);
    expect(providerReason).toBe(memberReason);

    await payerContext.close();
    await providerContext.close();
    await memberContext.close();
  });
});
