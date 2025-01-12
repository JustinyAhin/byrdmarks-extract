import path from "path";

const AUTH_FILE = path.join(process.cwd(), ".data/auth/twitter.json");
const BACKUP_FILE = path.join(process.cwd(), ".data/bookmarks_backup.json");
const BATCH_SIZE = 20;
const SCROLL_TIMEOUT = 1000;
const MAX_RETRIES = 3;

export { AUTH_FILE, BACKUP_FILE, BATCH_SIZE, SCROLL_TIMEOUT, MAX_RETRIES };
