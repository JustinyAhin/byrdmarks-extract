import { test } from "@playwright/test";
import { checkAuthFileExists, loadBackup, saveBackup } from "../utils/files";
import { BookmarkData } from "../utils/types";
import { getAuthenticatedPage } from "../utils/auth";
import { extractBookmarkData } from "../utils/bookmarks";
import { BATCH_SIZE } from "../utils/consts";
import { isBottom, scrollWithRetry } from "../utils/misc";

test("collect bookmarks with continuous backup", async () => {
  test.setTimeout(5 * 60 * 1000);

  const hasAuth = await checkAuthFileExists();
  if (!hasAuth) {
    throw new Error(
      "No authentication file found. Please run authentication first."
    );
  }

  const { page, close } = await getAuthenticatedPage();
  let allBookmarks: BookmarkData[] = await loadBackup();
  console.log(`Loaded ${allBookmarks.length} bookmarks from backup`);

  try {
    await page.goto("https://x.com/i/bookmarks");
    await page.waitForSelector('[data-testid="tweet"]', { timeout: 10000 });

    let reachedBottom = false;
    let previousHeight = 0;
    let newItemsSinceLastSave = 0;

    while (!reachedBottom) {
      const newBookmarks: BookmarkData[] = await extractBookmarkData(page);
      let addedItems = 0;

      for (const bookmark of newBookmarks) {
        const isDuplicate = allBookmarks.some(
          (existing: BookmarkData): boolean =>
            existing.timestamp === bookmark.timestamp &&
            existing.text === bookmark.text
        );

        if (!isDuplicate) {
          allBookmarks.push(bookmark);
          addedItems++;
        }
      }

      newItemsSinceLastSave += addedItems;
      if (newItemsSinceLastSave >= BATCH_SIZE) {
        await saveBackup(allBookmarks);
        console.log(`Saved backup with ${allBookmarks.length} bookmarks`);
        newItemsSinceLastSave = 0;
      }

      await scrollWithRetry(page);

      const currentHeight = await page.evaluate(
        (): number => document.documentElement.scrollHeight
      );

      if (currentHeight === previousHeight) {
        reachedBottom = await isBottom(page);
        if (!reachedBottom) {
          await page.waitForTimeout(2000);
          await scrollWithRetry(page);
        }
      }
      previousHeight = currentHeight;

      console.log(
        `Collected ${allBookmarks.length} unique bookmarks so far...`
      );
    }

    await saveBackup(allBookmarks);
    console.log(`Finished collecting ${allBookmarks.length} bookmarks`);
  } catch (error) {
    console.error("Error during bookmark collection:", error);
    if (allBookmarks.length > 0) {
      await saveBackup(allBookmarks);
      console.log(`Saved ${allBookmarks.length} bookmarks before error`);
    }
    throw error;
  } finally {
    await close();
  }
});
