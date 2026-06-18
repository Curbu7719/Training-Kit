import { test, expect, type Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// learning-flow.spec.ts — full lesson-player journey on the ai_architecture module.
//
// Module chosen: "ai_architecture" (code: ai_architecture)
//   • Required (L2) for the Developer track → shows "Start" right after track pick.
//   • Exercise type: scenario at both L1 and L2 (two linked MCQs). The test picks
//     arbitrary decision/reason options — it only asserts the graded result UI
//     surfaces and that progress is recorded, NOT a correct answer.
//   • Quiz: we pick any first choice — graded result UI is asserted regardless of
//     correctness.
//
// Tests create real users in the live Supabase DB (email auto-confirm ON).
// Unique emails prevent rerun collisions. No cleanup is performed.
// ---------------------------------------------------------------------------

// Extend the per-test timeout to accommodate remote Supabase edge-function latency
// (quiz-submit + exercise-submit + progress each add network round trips).
test.setTimeout(120_000);

function uniqueEmail(): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `e2e_${Date.now()}_${rand}@example.com`;
}

const TEST_PASSWORD = 'e2ePassword1!';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Sign up a brand-new user. Single shared curriculum → lands on /dashboard. */
async function signUp(page: Page, email: string): Promise<void> {
  await page.goto('/login');
  await page.getByTestId('switch-to-signup').click();
  await page.getByTestId('email-input').fill(email);
  await page.getByTestId('password-input').fill(TEST_PASSWORD);
  await page.getByTestId('auth-submit-btn').click();

  // Auto-confirmed sign-up → straight to the dashboard (no track picker).
  await expect(page).toHaveURL('/dashboard', { timeout: 15_000 });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Learning flow — ai_architecture module', () => {
  test('dashboard lists track modules with status badges', async ({ page }) => {
    const email = uniqueEmail();
    await signUp(page, email);

    // The ai_architecture card is module #8 — scroll it into view before asserting.
    const moduleCard = page.getByTestId('module-card-ai_architecture');
    await moduleCard.scrollIntoViewIfNeeded();
    await expect(moduleCard).toBeVisible({ timeout: 10_000 });

    // For a fresh user the card title (heading) is visible
    await expect(moduleCard.getByRole('heading', { name: 'AI System Architecture' })).toBeVisible();

    // The status badge text must be one of the known statuses
    await expect(
      moduleCard.getByText('Locked')
        .or(moduleCard.getByText('In progress'))
        .or(moduleCard.getByText('Passed'))
    ).toBeVisible({ timeout: 5_000 });
  });

  test('open module → step through concept → example → quiz → exercise → complete → progress updated', async ({ page }) => {
    const email = uniqueEmail();
    await signUp(page, email);

    // Scroll the ai_architecture module card into view and click its Start button
    const moduleCard = page.getByTestId('module-card-ai_architecture');
    await moduleCard.scrollIntoViewIfNeeded();
    await expect(moduleCard).toBeVisible({ timeout: 10_000 });
    await moduleCard.getByRole('button', { name: 'Start' }).click();

    // Lesson player loads for ai_architecture
    await expect(page).toHaveURL(/\/learn\/ai_architecture/, { timeout: 15_000 });
    // Wait for the header progress counter to confirm lessons loaded
    await expect(page.locator('text=/Level L[12]/')).toBeVisible({ timeout: 15_000 });

    // ---------------------------------------------------------------------------
    // Drive through every lesson.
    //
    // State machine: the page shows exactly one "primary action" at a time:
    //   • lesson-next-btn     → concept/example: advance
    //   • quiz-submit-btn     → quiz: pick a choice, submit, wait for result
    //   • quiz-next-btn       → quiz: advance after seeing the result
    //   • exercise-submit-btn → exercise: select answers, submit, wait for result
    //   • exercise-continue-btn → exercise: advance after seeing result
    //   • all-lessons-done-banner visible → exit loop
    //
    // Edge function calls (quiz-submit, exercise-submit, progress) are remote
    // and may take up to 30 s — each network wait uses a 30 s timeout.
    // ---------------------------------------------------------------------------

    for (let attempt = 0; attempt < 40; attempt++) {
      // Check for the all-done banner first
      const doneBanner = page.getByTestId('all-lessons-done-banner');
      if (await doneBanner.isVisible()) break;

      // --- 1. Concept / example lesson: Next or Mark complete ---
      const nextBtn = page.getByTestId('lesson-next-btn');
      if (await nextBtn.isVisible({ timeout: 1_000 }).catch(() => false)) {
        await nextBtn.click();
        // Brief wait for the page to transition to the next lesson
        await page.waitForTimeout(300);
        continue;
      }

      // --- 2. Quiz: pick a choice and submit ---
      const quizSubmit = page.getByTestId('quiz-submit-btn');
      if (await quizSubmit.isVisible({ timeout: 1_000 }).catch(() => false)) {
        // Pick the first available (unselected) choice
        const choices = page.locator('[role="group"][aria-label="Answer choices"] button');
        await choices.first().click();
        await quizSubmit.click();

        // Edge function response — allow up to 30 s
        const quizNext = page.getByTestId('quiz-next-btn');
        await expect(quizNext).toBeVisible({ timeout: 30_000 });
        await quizNext.click();
        await page.waitForTimeout(300);
        continue;
      }

      // --- 3. Quiz next button visible (result already shown from a prior iteration) ---
      const quizNext = page.getByTestId('quiz-next-btn');
      if (await quizNext.isVisible({ timeout: 1_000 }).catch(() => false)) {
        await quizNext.click();
        await page.waitForTimeout(300);
        continue;
      }

      // --- 4. Exercise: scenario type (ai_architecture)
      //    decision_key = 1, reason_key = 0
      const exerciseSubmit = page.getByTestId('exercise-submit-btn');
      if (await exerciseSubmit.isVisible({ timeout: 1_000 }).catch(() => false)) {
        // Decision group: pick index 1 (second button)
        const decisionGroup = page.locator('[aria-label="Decision"]');
        await expect(decisionGroup).toBeVisible({ timeout: 5_000 });
        await decisionGroup.locator('button').nth(1).click();

        // Reason group appears once a decision is picked
        const reasonGroup = page.locator('[aria-label="Reason"]');
        await expect(reasonGroup).toBeVisible({ timeout: 5_000 });
        // Pick index 0 (first button)
        await reasonGroup.locator('button').nth(0).click();

        await exerciseSubmit.click();

        // Edge function response — allow up to 30 s
        await expect(page.getByTestId('exercise-result')).toBeVisible({ timeout: 30_000 });

        // Click Continue to advance
        const continueBtn = page.getByTestId('exercise-continue-btn');
        await expect(continueBtn).toBeVisible({ timeout: 5_000 });
        await continueBtn.click();
        await page.waitForTimeout(300);
        continue;
      }

      // Nothing matched yet — page may be mid-transition; wait briefly
      await page.waitForTimeout(600);
    }

    // All lessons done banner must now be visible
    const doneBanner = page.getByTestId('all-lessons-done-banner');
    await expect(doneBanner).toBeVisible({ timeout: 10_000 });
    await expect(doneBanner).toContainText('All lessons complete!');

    // Click "Complete module" — triggers the /progress edge function
    const completeBtn = page.getByTestId('complete-module-btn');
    await expect(completeBtn).toBeEnabled();
    await completeBtn.click();

    // Navigates back to the dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 30_000 });
    await expect(page.getByRole('heading', { name: 'Your learning path' })).toBeVisible();

    // ai_architecture card should now show "Continue" or "Review" (not "Start")
    // confirming that progress was recorded.
    const updatedCard = page.getByTestId('module-card-ai_architecture');
    await updatedCard.scrollIntoViewIfNeeded();
    await expect(updatedCard).toBeVisible({ timeout: 10_000 });

    await expect(
      updatedCard.getByRole('button', { name: /Continue|Review/ })
    ).toBeVisible({ timeout: 15_000 });
  });
});
