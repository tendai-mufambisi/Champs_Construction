/**
 * Renders scripts/og-image.html to public/og-image.jpg, the link preview.
 *
 * Uses a locally installed Edge or Chrome in headless mode, so the card is laid
 * out with the site's real fonts (Sora / Manrope, from Google Fonts). Saved as
 * JPEG and kept small: WhatsApp skips previews whose image is too heavy.
 *
 *   node scripts/build-og-image.mjs
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "scripts", "og-image.html");
const out = join(root, "public", "og-image.jpg");

const browsers = [
  process.env.BROWSER,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const browser = browsers.find((path) => existsSync(path));
if (!browser) throw new Error("No Edge or Chrome found. Set BROWSER=/path/to/browser.");

const work = mkdtempSync(join(tmpdir(), "og-"));
const png = join(work, "og.png");
try {
  execFileSync(browser, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--allow-file-access-from-files",
    // Time for the web fonts and the photo to load before the capture.
    "--virtual-time-budget=10000",
    "--window-size=1200,630",
    `--user-data-dir=${join(work, "profile")}`,
    `--screenshot=${png}`,
    pathToFileURL(source).href,
  ]);

  await sharp(png)
    .resize(1200, 630, { fit: "cover" })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(out);
} finally {
  rmSync(work, { recursive: true, force: true });
}

console.log(`wrote public/og-image.jpg (1200x630, ${Math.round(statSync(out).size / 1024)} KB)`);
