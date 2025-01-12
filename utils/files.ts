import fs from "fs/promises";
import { AUTH_FILE, BACKUP_FILE } from "./consts";
import path from "path";
import { BookmarkData } from "./types";

const checkAuthFileExists = async (): Promise<boolean> => {
  try {
    await fs.access(AUTH_FILE);
    return true;
  } catch {
    return false;
  }
};

const ensureDirectory = async (filePath: string): Promise<void> => {
  const dir = path.dirname(filePath);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
};

const loadBackup = async (): Promise<BookmarkData[]> => {
  try {
    const data = await fs.readFile(BACKUP_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveBackup = async (bookmarks: BookmarkData[]): Promise<void> => {
  await ensureDirectory(BACKUP_FILE);
  await fs.writeFile(BACKUP_FILE, JSON.stringify(bookmarks, null, 2));
};

export { checkAuthFileExists, ensureDirectory, loadBackup, saveBackup };
