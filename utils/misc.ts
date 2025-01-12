import { type Page } from "@playwright/test";
import { MAX_RETRIES, SCROLL_TIMEOUT } from "./consts";

const scrollWithRetry = async (
  page: Page,
  retries = MAX_RETRIES
): Promise<void> => {
  for (let i = 0; i < retries; i++) {
    try {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await page.waitForTimeout(SCROLL_TIMEOUT);
      return;
    } catch (error) {
      if (i === retries - 1) throw error;
      await page.waitForTimeout(1000);
    }
  }
};

const isBottom = async (page: Page): Promise<boolean> => {
  return page.evaluate((): boolean => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY + window.innerHeight;
    return Math.abs(scrollHeight - scrollTop) < 100;
  });
};

export { scrollWithRetry, isBottom };
