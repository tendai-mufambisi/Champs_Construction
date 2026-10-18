/**
 * Derive every brand asset from the supplied Champs Construction artwork.
 *
 * The site shipped with a placeholder logo drawn in code (a yellow-green
 * #F2E400 hard hat) which was not the real mark. Everything here comes from the
 * two supplied PNGs instead, so the colour and the shape stay honest.
 *
 * Sources, both 1453x670 with a transparent background:
 *   champs-logo-dark.png   amber mark + wordmark, tagline in WHITE  (dark surfaces)
 *   champs-logo-light.png  amber mark + wordmark, tagline in BLACK  (light surfaces)
 *
 * Outputs:
 *   logo-wordmark.png      mark + "CHAMPS CONSTRUCTION", tagline cropped off.
 *                          The nav and footer use this -- the full lockup is far
 *                          too wide for a header, and the tagline is typed out
 *                          on the loader anyway.
 *   favicon.ico            16/32/48 of the hard-hat mark on the brand charcoal
 *   favicon.png            192, same tile
 *   apple-touch-icon.png   180, same tile
 *   icon-512.png           512, same tile
 *   og-image.png           1200x630 share card
 *
 *   node scripts/build-brand-assets.mjs
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

const pub = (name) => resolve(process.cwd(), "public", name);

const DARK = pub("champs-logo-dark.png");
const LIGHT = pub("champs-logo-light.png");

// Measured from the artwork: content sits in three bands (logo, CONSTRUCTION,
// tagline) and the mark occupies the left ~600px. Re-run the band scan in this
// script's history if the artwork is ever replaced.
const LOGO_BLOCK = { left: 0, top: 0, width: 1453, height: 470 };
const MARK = { left: 0, top: 0, width: 602, height: 470 };

const INK = { r: 30, g: 30, b: 30, alpha: 1 }; // #1E1E1E, the brand charcoal
const PAD = 0.16;

/** The lockup without its tagline, trimmed so it sits flush in a header. */
async function wordmark() {
  const cropped = await sharp(DARK).extract(LOGO_BLOCK).trim({ threshold: 1 }).png().toBuffer();
  writeFileSync(pub("logo-wordmark.png"), cropped);
  const m = await sharp(cropped).metadata();
  console.log(`wrote public/logo-wordmark.png (${m.width}x${m.height}, ${cropped.length} bytes)`);
}

/** The hard-hat mark centred on a charcoal tile, for icons. */
async function tile(size) {
  const inner = Math.round(size * (1 - PAD * 2));
  const mark = await sharp(DARK)
    .extract(MARK)
    .trim({ threshold: 1 })
    .resize({
      width: inner,
      height: inner,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  return sharp({ create: { width: size, height: size, channels: 4, background: INK } })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toBuffer();
}

/** PNG-in-ICO, which every browser since IE11 reads. */
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);

  const dir = Buffer.alloc(16 * entries.length);
  let offset = header.length + dir.length;

  entries.forEach(({ size, data }, i) => {
    const d = i * 16;
    dir[d] = size >= 256 ? 0 : size;
    dir[d + 1] = size >= 256 ? 0 : size;
    dir.writeUInt16LE(1, d + 4);
    dir.writeUInt16LE(32, d + 6);
    dir.writeUInt32LE(data.length, d + 8);
    dir.writeUInt32LE(offset, d + 12);
    offset += data.length;
  });

  return Buffer.concat([header, dir, ...entries.map((e) => e.data)]);
}

/** 1200x630 share card: the full lockup, tagline and all, on charcoal. */
async function shareCard() {
  const logo = await sharp(DARK).trim({ threshold: 1 }).resize({ width: 820, fit: "inside" }).toBuffer();
  const card = await sharp({ create: { width: 1200, height: 630, channels: 4, background: INK } })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toBuffer();
  writeFileSync(pub("og-image.png"), card);
  console.log(`wrote public/og-image.png (1200x630, ${card.length} bytes)`);
}

await wordmark();
await shareCard();

for (const [name, size] of [
  ["favicon.png", 192],
  ["apple-touch-icon.png", 180],
  ["icon-512.png", 512],
]) {
  const buf = await tile(size);
  writeFileSync(pub(name), buf);
  console.log(`wrote public/${name} (${size}x${size}, ${buf.length} bytes)`);
}

const icoSizes = [16, 32, 48];
const ico = buildIco(await Promise.all(icoSizes.map(async (size) => ({ size, data: await tile(size) }))));
writeFileSync(pub("favicon.ico"), ico);
console.log(`wrote public/favicon.ico (${icoSizes.join("/")}, ${ico.length} bytes)`);

// The placeholder SVGs are replaced by these PNGs; leaving them would let the
// old yellow-green mark creep back in through a stale import.
console.log("\nRemember: public/logo.svg and public/favicon.svg are the old placeholder art.");
