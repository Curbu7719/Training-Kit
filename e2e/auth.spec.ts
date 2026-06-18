import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// auth.spec.ts — sign-up, sign-out, sign-in round-trip.
//
// Single shared curriculum: there is no track picker. After sign-up (email
// auto-confirm ON) the user lands directly on /dashboard.
//
// Each run generates a unique email so reruns never collide. Real users are
// created in the live Supabase DB; no cleanup is done.
// ---------------------------------------------------------------------------

function uniqueEmail(): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `e2e_${Date.now()}_${rand}@example.com`;
}

const TEST_PASSWORD = 'e2ePassword1!';

async function signUp(page: import('@playwright/test').Page, email: string): Promise<void> {
  await page.goto('/login');
  await page.getByTestId('switch-to-signup').click();
  await expect(page.getByTestId('auth-submit-btn')).toContainText('Create account');
  await page.getByTestId('email-input').fill(email);
  await page.getByTestId('password-input').fill(TEST_PASSWORD);
  await page.getByTestId('auth-submit-btn').click();
}

test.describe('Authentication', () => {
  test('sign up → lands on /dashboard', async ({ page }) => {
    await signUp(page, uniqueEmail());

    // Email auto-confirm ON → live session → straight to the dashboard.
    await expect(page).toHaveURL('/dashboard', { timeout: 15_000 });
    await expect(page.getByRole('heading', { name: 'Your learning path' })).toBeVisible();
  });

  test('sign out → redirects to /login', async ({ page }) => {
    await signUp(page, uniqueEmail());
    await expect(page).toHaveURL('/dashboard', { timeout: 15_000 });

    await page.getByTestId('sign-out-btn').click();
    await expect(page).toHaveURL('/login', { timeout: 10_000 });
  });

  test('sign in after sign-up → lands on /dashboard', async ({ page }) => {
    const email = uniqueEmail();

    // 1. Sign up, then sign out.
    await signUp(page, email);
    await expect(page).toHaveURL('/dashboard', { timeout: 15_000 });
    await page.getByTestId('sign-out-btn').click();
    await expect(page).toHaveURL('/login', { timeout: 10_000 });

    // 2. Sign back in with the same credentials.
    await expect(page.getByTestId('auth-submit-btn')).toContainText('Sign in');
    await page.getByTestId('email-input').fill(email);
    await page.getByTestId('password-input').fill(TEST_PASSWORD);
    await page.getByTestId('auth-submit-btn').click();

    await expect(page).toHaveURL('/dashboard', { timeout: 15_000 });
    await expect(page.getByRole('heading', { name: 'Your learning path' })).toBeVisible();
  });
});
