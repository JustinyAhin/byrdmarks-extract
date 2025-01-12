import { type Page } from "@playwright/test";
import type { BookmarkData } from "./types";

const extractSingleTweetData = async (
  tweetElement: Element
): Promise<BookmarkData> => {
  const extractUrls = (element: Element) => {
    const urls = element.querySelectorAll(
      'a[rel="noopener noreferrer nofollow"][target="_blank"][role="link"]'
    );

    let links = new Set<string>();
    urls.forEach((url) => {
      if (url && url.getAttribute("href")) {
        links.add(url.getAttribute("href") as string);
      }
    });

    return Array.from(links);
  };

  const statusLink = tweetElement.querySelector('a[href*="/status/"]');
  const tweetId =
    statusLink?.getAttribute("href")?.split("/status/")?.[1]?.split("/")?.[0] ||
    "";

  const userNameElement = tweetElement.querySelector(
    '[data-testid="User-Name"]'
  );
  const authorName =
    userNameElement?.querySelector("span")?.textContent?.trim() || "";
  const authorUsername =
    statusLink?.getAttribute("href")?.split("/")?.[1] || "";

  const tweetTextElement = tweetElement.querySelector(
    '[data-testid="tweetText"]'
  );
  const text = tweetTextElement?.textContent || "";

  const timeElement = tweetElement.querySelector("time");
  const timestamp = timeElement?.getAttribute("datetime") || "";

  const metrics = {
    replies: parseInt(
      tweetElement
        .querySelector('[data-testid="reply"]')
        ?.getAttribute("aria-label")
        ?.split(" ")?.[0] || "0"
    ),
    reposts: parseInt(
      tweetElement
        .querySelector('[data-testid="retweet"]')
        ?.getAttribute("aria-label")
        ?.split(" ")?.[0] || "0"
    ),
    likes: parseInt(
      tweetElement
        .querySelector('[aria-label*="Likes"]')
        ?.getAttribute("aria-label")
        ?.split(" ")?.[0] || "0"
    ),
    views: parseInt(
      tweetElement
        .querySelector('a[href*="/status/"][href$="/analytics"]')
        ?.getAttribute("aria-label")
        ?.split(" ")?.[0] || "0"
    ),
  };

  const links = extractUrls(tweetElement);
  // const media: TweetMedia[] = [];

  // tweetElement.querySelectorAll('img[src*="pbs.twimg.com"]').forEach((img) => {
  //   const url = img.getAttribute("src");
  //   if (url && !url.includes("profile_images")) {
  //     media.push({ type: "image", url });
  //   }
  // });

  // tweetElement
  //   .querySelectorAll('video source[type="video/mp4"]')
  //   .forEach((source) => {
  //     const url = source.getAttribute("src");
  //     if (url) {
  //       media.push({ type: "video", url });
  //     }
  //   });

  return {
    tweetId,
    authorName,
    authorUsername,
    text,
    timestamp,
    metrics,
    links,
  };
};

const extractBookmarkData = async (page: Page): Promise<BookmarkData[]> => {
  const bookmarks: BookmarkData[] = [];

  // Get all tweets on the page
  const tweets = await page.$$('[data-testid="tweet"]');

  for (const tweet of tweets) {
    const tweetData = await tweet.evaluate(extractSingleTweetData);
    bookmarks.push(tweetData);
  }

  return bookmarks;
};

export { extractBookmarkData };
