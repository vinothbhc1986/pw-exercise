import { test, expect } from '@playwright/test';
import * as XLSX from 'xlsx';
import * as path from 'path';

interface TestCase {
  test_case: string;
  url: string;
  source: string;
  target: string;
  expected_source: string;
  expected_target: string;
}

const wb = XLSX.readFile(path.resolve(__dirname, 'test-data.xlsx'));
const rows: TestCase[] = XLSX.utils.sheet_to_json(wb.Sheets['Sheet1']);

for (const row of rows) {
  test(row.test_case, async ({ page }) => {
    await page.goto(row.url);
    console.log(row);

    if (row.source && row.target) {
      await page.locator(row.source).dragTo(page.locator(row.target));
    }

    if (row.expected_source) {
      await expect(page.locator(row.source)).toHaveText(row.expected_source);
    }
    if (row.expected_target) {
      await expect(page.locator(row.target)).toHaveText(row.expected_target);
    }

    await page.waitForTimeout(1000);
  });
}
