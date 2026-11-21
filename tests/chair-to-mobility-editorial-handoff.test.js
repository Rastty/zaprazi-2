import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const chair=readFileSync(new URL("../page-vstavani-z-kresla-pro-seniora.php",import.meta.url),"utf8");
const tracking=readFileSync(new URL("../assets/js/analytics-consent.js",import.meta.url),"utf8");

test("chair landing offers only a conditional, safety-first Mobility handoff",()=>{
  const start=chair.indexOf('<section id="jak-postupovat-kreslo"');
  const end=chair.indexOf('<section id="porovnani-kresel"');
  assert.ok(start>=0 && end>start);
  const journey=chair.slice(start,end);
  for(const text of [
    "Vstávání je bezpečné, ale při následné chůzi chybí jistota?",
    "bez fyzického přidržování bezpečně stát a chodit",
    "Poradce nevybírá pomůcku pro zvedání z křesla",
    "nejprve domluvte odborné posouzení"
  ]) assert.ok(journey.includes(text), "Missing safety step: "+text);
  const href='data-zp-journey="advisor" href="<?php echo esc_url( home_url( \'/#poradce\' ) ); ?>"';
  assert.ok(journey.includes(href), "Expected single local consent-only Home Advisor link");
  assert.equal(chair.split('data-zp-journey="advisor"').length-1,1);
  assert.ok(!journey.includes('rel="sponsored"'));
  assert.ok(!journey.includes("merchant_click"));
});

test("existing opt-in anonymous analytics handles the new advisor handoff",()=>{
  assert.ok(tracking.includes("data-zp-journey="), "Expected generic editorial-to-advisor event listener");
  assert.ok(tracking.includes('sendEvent("guide_advisor_click")'));
  assert.ok(tracking.includes('destination.search'));
  assert.ok(tracking.includes('state !== "granted"'));
  assert.ok(!chair.includes("new FormData"));
});
