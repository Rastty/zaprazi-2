// Regression: the approved house-and-path identity must reach WordPress favicon.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = path => readFileSync(new URL("../" + path, import.meta.url));
const svg = read("assets/brand/zaprazi-icon.svg").toString("utf8");
const header = read("header.php").toString("utf8");
const logo = read("assets/brand/zaprazi-logo.svg").toString("utf8");
const png = read("assets/brand/zaprazi-site-icon-512.png");

test("official Zápraží icon exports a valid 512px WordPress site icon", () => {
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", "PNG signature");
  assert.equal(png.subarray(12, 16).toString("ascii"), "IHDR", "PNG IHDR");
  assert.equal(png.readUInt32BE(16), 512, "WordPress site icons need at least 512px");
  assert.equal(png.readUInt32BE(20), 512, "Site icon must be square");
  assert.ok(png.byteLength < 20000, "Keep favicon payload small");
  assert.match(svg, /Zápraží – dům a cesta/, "Approved house/path pictogram");
  assert.match(logo, /Cesta k lepšímu životu/, "Approved brand tagline");
  assert.match(header, /Cesta k lepšímu životu/, "Header displays approved tagline");
  assert.match(header, /if \( ! has_site_icon\(\) \)/, "SVG fallback for sites without WP icon");
  assert.match(header, /assets\/brand\/zaprazi-icon\.svg/, "Header icon uses approved SVG");
  assert.doesNotMatch(header, /cropped-fl1|2016\/04/, "Never hard-code the old site favicon");
});
