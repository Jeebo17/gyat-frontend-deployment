import { expect, test, type Page } from '@playwright/test';

async function navigateFromHeader(page: Page, target: 'home' | 'settings') {
  const openMenuButton = page.getByRole('button', { name: /open menu/i });

  if (await openMenuButton.isVisible()) {
    await openMenuButton.click();
  }

  await page.getByRole('button', { name: new RegExp(`^${target}$`, 'i') }).click();
}

test.describe('Map and routing flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/profile', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Unauthorized' }),
      });
    });
  });

  test('404 page home link navigates back to home route', async ({ page }) => {
    await page.goto('/missing-page', { waitUntil: 'domcontentloaded' });

    await expect(page.getByText(/oops page not found/i)).toBeVisible();
    await page.getByRole('link', { name: /go to home/i }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByText(/the gym app & tracker/i)).toBeVisible();
  });

  test('header home button navigates from login to home', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    await navigateFromHeader(page, 'home');
    await expect(page).toHaveURL('/');
    await expect(page.getByText(/the gym app & tracker/i)).toBeVisible();
  });

  test('header settings button navigates from login to settings page', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    await navigateFromHeader(page, 'settings');
    await expect(page).toHaveURL('/settings');
    await expect(page.getByRole('heading', { name: /accessibility settings/i })).toBeVisible();
  });
});
