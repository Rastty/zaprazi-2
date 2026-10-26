import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../page-toaletni-zidle-vedle-postele.php", import.meta.url), "utf8");

test("bedside commode guide provides three meaningful safety states", () => {
  const start = page.indexOf('id="rozhodovaci-matice-zidle-postel"');
  const end = page.indexOf('id="list-zidle-postel"', start);
  assert.ok(start > 0 && end > start);
  const body = page.slice(start, end);
  assert.match(body, /aria-labelledby="matice-zidle-postel-nadpis"/);
  assert.equal((body.match(/<article class="zp-decision-card">/g)||[]).length, 3);
  assert.match(body, /Přesun je bezpečně ověřený/);
  assert.match(body, /Neznáme rozměry/);
  assert.match(body, /pořízení pozastavte/);
  assert.match(body, /zaučení/);
  assert.match(body, /Model A \/ B/);
  assert.match(body, /\/toaletni-zidle-pro-seniory\/#poradce-toaletni-zidle/);
  assert.doesNotMatch(body, /data-zp-merchant-link|data-zp-affiliate-target|desturl=|Koupit nyní/i);
});

test("bedside commode page keeps existing seven checks, FAQ and single H1", () => {
  assert.equal((page.match(/<h1\b/g)||[]).length,1);
  assert.equal((page.match(/<span>0[1-7]<\/span>/g)||[]).length,7);
  assert.ok((page.match(/<details><summary>/g)||[]).length>=5);
});
