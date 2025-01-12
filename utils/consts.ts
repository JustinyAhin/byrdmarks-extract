import path from "path";

const AUTH_TEST_TIMEOUT = 60 * 3 * 1000; // 3 minutes
const BOOKMARKS_TEST_TIMEOUT = 60 * 10 * 1000; // 10 minutes
const AUTH_FILE = path.join(process.cwd(), ".data/auth/twitter.json");
const BACKUP_FILE = path.join(process.cwd(), ".data/bookmarks_backup.json");
const BATCH_SIZE = 20;
const SCROLL_TIMEOUT = 1000;
const MAX_RETRIES = 3;

export {
  AUTH_TEST_TIMEOUT,
  BOOKMARKS_TEST_TIMEOUT,
  AUTH_FILE,
  BACKUP_FILE,
  BATCH_SIZE,
  SCROLL_TIMEOUT,
  MAX_RETRIES,
};
