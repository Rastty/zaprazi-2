import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../page-choditka-pro-seniory.php", import.meta.url), "utf8");
const heroSafety = source.indexOf("Nejdřív ověřte bezpečný způsob chůze.");
const firstActions = source.indexOf('class="zp-hero-actions"');
const comparison = source.indexOf('<section id="hul-nebo-choditko"');
const decision = source.indexOf('<section id="vyber-typu"');
const types = source.indexOf("Tři běžné typy chodítek.");
const acquisition = source.indexOf('id="jak-ziskat-choditko"');

test("0.8.207 first-screen safety guidance precedes choice and original safety-first comparison", () => {
  assert.ok(heroSafety > 0 && firstActions > heroSafety, "Safety stop must be visible before first CTA");
  assert.ok(comparison > heroSafety && decision > comparison && types > decision && acquisition > types,
    "Established full support comparison must precede product-type choice");
  assert.equal(source.split('id="vyber-typu"').length - 1, 1, "Do not clone decision modules");
  assert.match(source, /ZP_RELEASE_0_8_207/);
});
test("First screen warns against unsupervised aid choice and preserves existing safe next steps", () => {
  const first = source.slice(0, comparison);
  for (const phrase of ["fyzické přidržování", "opakovaně padá", "nedokáže bezpečně stát", "odborné posouzení", "bezpečné ovládání a rozměry se teprve ověřují"]) {
    assert.ok(first.includes(phrase), "Missing important safety limit: " + phrase);
  }
  for (const path of ["/choditko-do-bytu-pro-seniory/#poradce-choditko-byt", "/rollator-pro-seniory/#poradce-rollator", "/#poradce"]) {
    assert.ok(first.includes(path), "Missing existing gated advisor route: " + path);
  }
  assert.doesNotMatch(first, /data-zp-offer|data-zp-merchant-link|affiliateMap/);
});
