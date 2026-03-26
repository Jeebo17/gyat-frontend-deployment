import { expect, test } from '@playwright/test';

test.describe('Route smoke tests', () => {
  test('home route renders key content', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL('/');
    await expect(page.getByText(/the gym app & tracker/i)).toBeVisible();
  });

  test('login route renders sign in form', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByLabel(/username or email/i)).toBeVisible();
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign(?:ing)? in/i })).toBeVisible();
  });

  test('signup route renders registration form', async ({ page }) => {
    await page.goto('/signup', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible();
    await expect(page.getByLabel(/^name$/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
    await expect(page.getByLabel(/confirm password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();
  });

  test('unknown route returns 404 page', async ({ page }) => {
    await page.goto('/route-that-should-not-exist', { waitUntil: 'domcontentloaded' });

    await expect(page.getByText(/oops page not found/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /go to home/i })).toBeVisible();
  });
});
