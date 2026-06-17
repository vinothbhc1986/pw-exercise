import { test } from '@playwright/test';

test('highlight element', async ({ page }) => {
  await page.goto('file:///D:practice/dg/drag-drop.html');
  const locator = page.locator('#dropBox');

  await locator.evaluate((element) => {
    element.style.border = '2px solid red';
    element.style.background = 'yellow';

  });

  await page.waitForTimeout(5000);
});

