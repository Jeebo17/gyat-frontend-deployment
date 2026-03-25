import { expect, test } from '@playwright/test';

test.describe('Authentication journeys', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/profile', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Unauthorized' }),
      });
    });
  });

  test('login shows validation error for empty form submit', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    await page.getByLabel(/username or email/i).fill('   ');
    await page.getByLabel(/^password$/i).fill('   ');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/invalid credentials\. please try again\./i)).toBeVisible();
  });

  test('signup shows validation error when passwords do not match', async ({ page }) => {
    await page.goto('/signup', { waitUntil: 'domcontentloaded' });

    await page.getByLabel(/^name$/i).fill('E2E User');
    await page.getByLabel(/email/i).fill('e2e@example.com');
    await page.getByLabel(/^password$/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('different123');
    await page.getByRole('button', { name: /sign up/i }).click();

    await expect(page.getByText(/passwords do not match\./i)).toBeVisible();
  });

  test('signup success redirects to login', async ({ page }) => {
    let registerPayload: unknown;

    await page.route('**/api/auth/register', async (route) => {
      registerPayload = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 7,
          username: 'newuser',
          email: 'newuser@example.com',
          role: 'manager',
          message: 'OK',
        }),
      });
    });

    await page.goto('/signup', { waitUntil: 'domcontentloaded' });

    await page.getByLabel(/^name$/i).fill('newuser');
    await page.getByLabel(/email/i).fill('newuser@example.com');
    await page.getByLabel(/^password$/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('password123');
    await page.getByRole('button', { name: /sign up/i }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    expect(registerPayload).toEqual({
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'password123',
    });
  });

  test('login success redirects to home', async ({ page }) => {
    let loginPayload: unknown;

    await page.route('**/api/auth/login', async (route) => {
      loginPayload = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 11,
          username: 'e2e-login',
          email: 'e2e-login@example.com',
          role: 'manager',
          message: 'OK',
        }),
      });
    });

    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    await page.getByLabel(/username or email/i).fill('e2e-login@example.com');
    await page.getByLabel(/^password$/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByText(/the gym app & tracker/i)).toBeVisible();
    expect(loginPayload).toEqual({
      usernameOrEmail: 'e2e-login@example.com',
      password: 'password123',
    });
  });
});
