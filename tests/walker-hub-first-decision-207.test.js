import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../page-choditka-pro-seniory.php", import.meta.url), "utf8");
const decision = source.indexOf('<section id="vyber-typu"');
const background = source.indexOf('<section id="hul-nebo-choditko"');
const types = source.indexOf('Tři běžné typy chodítek.');
const acquisition = source.indexOf('id="jak-ziskat-choditko"');

test("0.8.207 walker hub places the existing decision right after the hero", () => {
  assert.ok(decision > source.indexOf("</section>"), "The hero must remain first");
  assert.ok(decision < background && background < types && types < acquisition);
  assert.equal(source.split('id="vyber-typu"').length - 1, 1);
  assert.match(source, /ZP_RELEASE_0_8_207/);
});
test("Three safe visitor pathways are present and do not bypass model fit", () => {
  const section = source.slice(decision, background);
  for (const phrase of ["Hlavně doma", "Venku nebo doma i venku", "Při chůzi běžně pomáhá druhá osoba", "Poradce pro chodítko do bytu", "Poradce pro rollátor", "nejdřív požádejte o praktické posouzení"]) {
    assert.ok(section.includes(phrase), "Missing existing scenario: "+phrase);
  }
  for (const path of ["/choditko-do-bytu-pro-seniory/#poradce-choditko-byt", "/rollator-pro-seniory/#poradce-rollator", "/#poradce"]) {
    assert.ok(section.includes(path), "Missing internal journey: "+path);
  }
  assert.equal((section.match(/<article class="zp-decision-card">/g)||[]).length,3);
  assert.doesNotMatch(section, /data-zp-offer|data-zp-merchant-link|affiliateMap|<form\\b/i);
});