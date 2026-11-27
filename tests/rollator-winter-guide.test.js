import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const page=readFileSync(new URL("../page-rollator-pro-seniory.php",import.meta.url),"utf8");
const guide=page.match(/<section id="rollator-v-zime"[\s\S]*?<\/section>/)?.[0];
test("winter decision guide is unique, discoverable and prioritizes avoiding icy journeys",()=>{
  assert.equal((page.match(/id="rollator-v-zime"/g)||[]).length,1);
  assert.match(page,/href="#rollator-v-zime"/);
  assert.match(guide,/aria-labelledby="rollator-v-zime-nadpis"/);
  assert.match(guide,/Na náledí nebo zasněžené neudržované cestě raději cestu odložte/);
  assert.match(guide,/nezaručují bezpečnost na ledu/);
  assert.equal((guide.match(/class="zp-decision-card"/g)||[]).length,3);
  assert.match(guide,/Neplánujte zkoušku rollátoru na kluzké cestě/);
  assert.match(guide,/jejíž návod daný povrch dovoluje/);
  assert.match(guide,/Nepředpokládejte, že každý široký model na suchý zip je vhodný do sněhu nebo na led/);
});
test("winter guide routes to existing transport, footwear and gated advisor without direct offer or form",()=>{
  assert.match(guide,/home_url\( '\/prevoz-seniora-k-lekari\/' \)/);
  assert.match(guide,/home_url\( '\/obuv-pro-seniory\/' \)/);
  assert.match(guide,/href="#bezpecne-pouziti-rollatoru"/);
  assert.match(guide,/href="#poradce-rollator"/);
  assert.match(guide,/Výsledek není potvrzením bezpečné chůze na náledí/);
  assert.doesNotMatch(guide,/<(?:form|input|button)\b|data-zp-journey="merchant"|(?:cj\.com|anrdoezrs|affiliate_redirect)/i);
  const external=[...guide.matchAll(/href="(https:\/\/[^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(external,[
    "https://www.uhd.nhs.uk/services/elderly-care/falls-prevention",
    "https://oxfordhealth.nhs.uk/falls/guidance/weather-safety/",
    "https://www.uhmb.nhs.uk/news-and-events/latest-news/stay-steady-winter-simple-steps-prevent-falls"
  ]);
});
