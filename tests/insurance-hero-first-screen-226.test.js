import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const page=readFileSync(new URL("../page-choditko-na-pojistovnu.php",import.meta.url),"utf8");
const css=readFileSync(new URL("../style.css",import.meta.url),"utf8");

test("insurance search entry shows the safe next action before its long answer",()=>{
  assert.match(page,/<main id="main-content" class="zp-insurance-page" tabindex="-1">/);
  const hero=page.match(/<section class="zp-hero">([\s\S]*?)<\/section>/)?.[1];
  assert.ok(hero,"existing insurance hero must stay discoverable");
  assert.match(hero,/class="zp-wrap zp-insurance-hero-layout"/);
  assert.match(hero,/class="zp-insurance-hero-card" aria-labelledby="zp-insurance-hero-steps-title"/);
  assert.match(hero,/id="zp-insurance-hero-steps-title"/);
  assert.match(hero,/Chodítko na pojišťovnu v roce 2026/);
  const action=hero.indexOf('<a class="zp-btn" data-zp-journey="advisor"');
  const steps=hero.indexOf('<ol class="zp-insurance-hero-steps">');
  const answer=hero.indexOf('<strong>Rychlá odpověď:</strong>');
  assert.ok(action>=0&&steps>action&&answer>steps,
    "a practical next step and short ordered list must precede detailed answer");
  assert.equal((hero.match(/<li>/g)||[]).length,3,"only three above-fold steps");
  assert.match(hero,/data-zp-journey="advisor" href="<\?php echo esc_url\( home_url\( '\/#poradce' \) \); \?>"/);
  assert.match(hero,/class="zp-text-link" href="#rychla-cesta-na-epoukaz">Projít postup před nákupem/);
  assert.match(hero,/Nestačí koupit chodítko v e-shopu a poslat účtenku pojišťovně/);
  assert.match(hero,/href="#zp-overit-mesicni-seznam"/);
  assert.doesNotMatch(hero,/data-zp-offer|data-zp-merchant-link|affiliateMap/,
    "search-first guidance must never shortcut the product-fit gate");
});

test("insurance-only responsive hero replaces the globally oversized heading",()=>{
  assert.match(css,/\.zp-insurance-hero-layout\{display:grid;grid-template-columns:minmax\(0,\.92fr\) minmax\(0,1\.08fr\)/);
  assert.match(css,/\.zp-insurance-hero-layout h1\{font-size:clamp\(2\.45rem,4vw,3\.6rem\);[^}]*max-width:none/);
  assert.match(css,/\.zp-insurance-page \.zp-hero\{padding:38px 0 42px\}/);
  assert.match(css,/@media\(max-width:860px\)\{[\s\S]*?\.zp-insurance-hero-layout\{grid-template-columns:1fr/);
  assert.match(css,/\.zp-insurance-hero-more \.zp-text-link\{[^}]*min-height:44px/);
});
