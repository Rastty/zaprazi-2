import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../page-sprchova-zidle-maly-kout-80x80.php", import.meta.url), "utf8");

test("compact shower guide provides accessible decisions for confirmed, unknown and unsafe fit", () => {
  const start = page.indexOf('id="rozhodovaci-tabulka-sprcha"');
  const end = page.indexOf('id="list-maly-kout"', start);
  assert.ok(start > 0 && end > start, "Decision matrix must precede worksheet");
  const block = page.slice(start, end);
  assert.match(block, /aria-labelledby="rozhodovaci-tabulka-nadpis"/);
  assert.equal((block.match(/<article class="zp-decision-card">/g) || []).length, 3);
  assert.match(block, /zatím neznáme/);
  assert.match(block, /nákup pozastavte/);
  assert.match(block, /přesun je bezpečně ověřen/);
  assert.match(block, /Model A \/ B/);
  assert.match(block, /Prázdné nebo nedoložené údaje/);
  assert.match(block, /ergoterapeutem nebo fyzioterapeutem/);
  assert.match(block, /\/sprchovaci-zidle-pro-seniory\/#poradce-sprchovaci-zidle/);
  assert.doesNotMatch(block, /data-zp-merchant-link|data-zp-affiliate-target|desturl=|Koupit nyní/i);
});

test("guide preserves seven measurements and safety-first follow-up", () => {
  assert.equal((page.match(/<h1\b/g) || []).length, 1);
  assert.equal((page.match(/<span>0[1-7]<\/span>/g) || []).length, 7);
  assert.match(page, /všechny nohy židle/);
  assert.match(page, /id="list-maly-kout"/);
});
