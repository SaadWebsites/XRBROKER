import { appendFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const CREDS_DIR = join(process.env.USERPROFILE || process.env.HOME || "", "Documents", "XRBROKER_Creds");
const CREDS_FILE = join(CREDS_DIR, "creds.txt");

if (!existsSync(CREDS_DIR)) {
  mkdirSync(CREDS_DIR, { recursive: true });
}

function log(tag: string, username: string, email: string) {
  const ts = new Date().toISOString().replace("T", " ").slice(0, 19);
  const line = `[XRBROKER] ${ts} ${tag.padEnd(7)} | ${username} | ${email}`;
  console.log(`\n${line}`);
  appendFileSync(CREDS_FILE, line + "\n", "utf-8");
}

export { log, CREDS_FILE };
