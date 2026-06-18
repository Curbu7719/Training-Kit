import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// auth.spec.ts — sign-up, sign-out, sign-in round-trip.
//
// Each run generates a unique email so reruns never collide with existing
// accounts. Real users are created in the live Supabase DB; no cleanup is
// done (the DB is a test/staging instance).
// ---------------------------------------------------------------------------

function uniqueEmail(): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `e2e_${Date.now()}_${rand}@example.com`;
}

const TEST_PASSWORD = 'e2ePassword1!';

test.describe('Authentication', () => {
  test('sign up → lands on /track (no track yet)', async ({ page }) => {
    const email = uniqueEmail();

    await page.goto('/login');

    // Switch to sign-up mode
    await page.getByTestId('switch-to-signup').click();
    await expect(page.getByTestId('auth-submit-btn')).toContainText('Create account');

    // Fill in credentials
    await page.getByTestId('email-input').fill(email);
    await page.getByTestId('password-input').fill(TEST_PASSWORD);

    await page.getByTestId('auth-submit-btn').click();

    // After sign-up with email auto-confirm ON the user has a live session
    // and is redirected to /track (no active_track yet).
    await expect(page).toHaveURL('/track', { timeout: 15_000 });
    await expect(page.getByRole('heading', { name: 'Choose your track' })).toBeVisible();
  });

  test('sign out → redirects to /login', async ({ page }) => {
    const email = uniqueEmail();

    // Sign up first
    await page.goto('/login');
    await page.getByTestId('switch-to-signup').click();
    await page.getByTestId('email-input').fill(email);
    await page.getByTestId('password-input').fill(TEST_PASSWORD);
    await page.getByTestId('auth-submit-btn').click();
    await expect(page).toHaveURL('/track', { timeout: 15_000 });

    // Pick a track so we land on /dashboard where Sign out button lives
    await page.getByTestId('track-card-developer').click();
    await page.getByTestId('start-learning-btn').click();
    await expect(page).toHaveURL('/dashboard', { timeout: 15_000 });

    // Sign out
    await page.getByTestId('sign-out-btn').click();
    await expect(page).toHaveURL('/login', { timeout: 10_000 });
  });

  test('sign in after sign-up → lands on /dashboard (track already chosen)', async ({ page }) => {
    const email = uniqueEmail();

    // 1. Sign up
    await page.goto('/login');
    await page.getByTestId('switch-to-signup').click();
    await page.getByTestId('email-input').fill(email);
    await page.getByTestId('password-input').fill(TEST_PASSWORD);
    await page.getByTestId('auth-submit-btn').click();
    await expect(page).toHaveURL('/track', { timeout: 15_000 });

    // 2. Pick a track
    await page.getByTestId('track-card-developer').click();
    await page.getByTestId('start-learning-btn').click();
    await expect(page).toHaveURL('/dashboard', { timeout: 15_000 });

    // 3. Sign out
    await page.getByTestId('sign-out-btn').click();
    await expect(page).toHaveURL('/login', { timeout: 10_000 });

    // 4. Sign back in with the same credentials
    await expect(page.getByTestId('auth-submit-btn')).toContainText('Sign in');
    await page.getByTestId('email-input').fill(email);
    await page.getByTestId('password-input').fill(TEST_PASSWORD);
    await page.getByTestId('auth-submit-btn').click();

    // Should land on /dashboard because active_track is set
    await expect(page).toHaveURL('/dashboard', { timeout: 15_000 });
    await expect(page.getByRole('heading', { name: 'Your learning path' })).toBeVisible();
  });
});
