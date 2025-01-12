import { test } from "@playwright/test";
import { checkAuthFileExists, loadBackup, saveBackup } from "../utils/files";
import { BookmarkData } from "../utils/types";
import { getAuthenticatedPage } from "../utils/auth";
import { extractBookmarkData } from "../utils/bookmarks";
import { BATCH_SIZE, BOOKMARKS_TEST_TIMEOUT } from "../utils/consts";
import { isBottom, scrollWithRetry } from "../utils/misc";

test("collect bookmarks with continuous backup", async () => {
  test.setTimeout(BOOKMARKS_TEST_TIMEOUT);

  const hasAuth = await checkAuthFileExists();
  if (!hasAuth) {
    throw new Error(
      "No authentication file found. Please run authentication first."
    );
  }

  const { page, close } = await getAuthenticatedPage();
  let allBookmarks: BookmarkData[] = await loadBackup();
  const initialBookmarkCount: number = allBookmarks.length;
  let newBookmarksFound: number = 0;

  console.log(`Loaded ${initialBookmarkCount} bookmarks from backup`);

  const existingBookmarkIds = new Set(
    allBookmarks.map((bookmark) => bookmark.tweetId)
  );

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
        if (!existingBookmarkIds.has(bookmark.tweetId)) {
          allBookmarks.push(bookmark);
          existingBookmarkIds.add(bookmark.tweetId);
          addedItems++;
          newBookmarksFound++;
        }
      }

      newItemsSinceLastSave += addedItems;
      if (newItemsSinceLastSave >= BATCH_SIZE) {
        await saveBackup(allBookmarks);
        console.log(
          `Saved backup with ${allBookmarks.length} bookmarks (${newBookmarksFound} new)`
        );
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

      if (addedItems > 0) {
        console.log(
          `Found ${newBookmarksFound} new bookmarks (total: ${allBookmarks.length})`
        );
      }
    }

    await saveBackup(allBookmarks);
    console.log(
      `Finished collecting bookmarks:\n` +
        `- Initial count: ${initialBookmarkCount}\n` +
        `- New bookmarks: ${newBookmarksFound}\n` +
        `- Total count: ${allBookmarks.length}`
    );
  } catch (error) {
    console.error("Error during bookmark collection:", error);
    if (allBookmarks.length > 0) {
      await saveBackup(allBookmarks);
      console.log(
        `Saved ${allBookmarks.length} bookmarks before error ` +
          `(${newBookmarksFound} new)`
      );
    }
    throw error;
  } finally {
    await close();
  }
});
