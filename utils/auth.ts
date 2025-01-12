import { chromium, devices } from "@playwright/test";
import { AUTH_FILE } from "./consts";

const getUnauthenticatedPage = async () => {
  const browser = await chromium.launch({
    timeout: 60000,
    headless: false,
    slowMo: 1000,
  });
  const context = await browser.newContext({
    ...devices["Desktop Chrome"],
  });
  const page = await context.newPage();

  return {
    page,
    context,
    close: async () => {
      await page.close();
      await context.close();
      await browser.close();
    },
  };
};

const getAuthenticatedPage = async () => {
  const browser = await chromium.launch({
    timeout: 60000,
    slowMo: 500,
  });
  const context = await browser.newContext({
    ...devices["Desktop Chrome"],
    storageState: AUTH_FILE,
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  await context.route("**/*", (route) => {
    const request = route.request();
    if (["image", "font", "media"].includes(request.resourceType())) {
      return route.abort();
    }
    return route.continue();
  });

  return {
    page,
    context,
    close: async () => {
      await page.close();
      await context.close();
      await browser.close();
    },
  };
};

export { getAuthenticatedPage, getUnauthenticatedPage };
