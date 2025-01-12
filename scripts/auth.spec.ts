import test from "@playwright/test";
import { AUTH_FILE, AUTH_TEST_TIMEOUT } from "../utils/consts";
import { getUnauthenticatedPage } from "../utils/auth";

test("store auth state", async () => {
  test.setTimeout(AUTH_TEST_TIMEOUT);

  const { page, context, close } = await getUnauthenticatedPage();

  try {
    await page.goto("https://x.com/i/flow/login");

    // Wait for user to complete login manually
    await page.waitForURL("https://x.com/home", { timeout: 120000 });

    // Store authentication state
    await context.storageState({ path: AUTH_FILE });

    console.log("Authentication state saved successfully");
  } finally {
    await close();
  }
});
