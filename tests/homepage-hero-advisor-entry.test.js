import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const home = readFileSync(new URL("../front-page.php", import.meta.url), "utf8");

test("homepage hero offers a direct, consent-safe advisor entry", () => {
  const hero = home.split('<section class="zp-hero zp-illustrated-hero zp-home-hero">')[1]?.split("</section>")[0];
  assert.ok(hero, "homepage hero missing");
  const links = [...hero.matchAll(/<a\b[^>]*>/g)].map(m => m[0]);
  assert.ok(links.some(link => /href="#poradce"/.test(link) && /data-zp-journey="advisor"/.test(link)),
    "missing tracked direct home advisor anchor");
  assert.ok(links.some(link => /senior-spadl-doma/.test(link)), "emergency first-step action must remain");
  assert.equal(links.length, 3, "hero has exactly three safe decision entries");
  assert.match(home, /id="co-resite"/, "other home situations remain available below hero");
  assert.doesNotMatch(hero, /data-zp-merchant-link|rel="sponsored"|<form\b|answer=/i);
});
test("advisor anchor is unique, focusable and remains a private client-only form", () => {
  assert.equal((home.match(/id="poradce"/g)||[]).length, 1, "duplicate/missing destination");
  assert.match(home, /<section id="poradce"[^>]*tabindex="-1"/);
  assert.match(home, /id="zp-mobility-advisor"/);
  assert.doesNotMatch(home, /<form id="zp-mobility-advisor"/);
  assert.match(home, /Odpovědi z poradce se neodesílají na server/);
});
