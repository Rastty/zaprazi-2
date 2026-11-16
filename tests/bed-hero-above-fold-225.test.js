import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const page=readFileSync(new URL("../page-senior-nemuze-vstat-z-postele.php",import.meta.url),"utf8");
const css=readFileSync(new URL("../style.css",import.meta.url),"utf8");

test("bed-entry hero shows urgent advice and action before verbose answer",()=>{
  const hero=page.match(/<section class="zp-hero">([\s\S]*?)<\/section>/)?.[1];
  assert.ok(hero,"hero markup must remain discoverable for existing SEO checks");
  assert.match(hero,/class="zp-wrap zp-bed-hero-layout"/);
  assert.match(hero,/class="zp-bed-hero-intro"/);
  assert.match(hero,/class="zp-bed-hero-action"/);
  const warning=hero.indexOf('class="zp-disclaimer" role="note"');
  const action=hero.indexOf('<a class="zp-btn" href="#rozhodnuti-vstavani-postel">');
  const answer=hero.indexOf('<strong>Rychlá odpověď:</strong>');
  assert.ok(warning>=0&&action>warning&&answer>action,"safety and next action must precede long explanation");
  assert.match(hero,/při akutním ohrožení volejte v ČR 155/);
  assert.equal((hero.match(/class="zp-btn"/g)||[]).length,1);
});

test("bed-only two-column hero overrides the global 10ch oversized headline",()=>{
  assert.match(css,/\.zp-bed-hero-layout\{display:grid;grid-template-columns:minmax\(0,\.94fr\) minmax\(0,1\.06fr\)/);
  assert.match(css,/\.zp-bed-hero-layout h1\{font-size:clamp\(2\.45rem,4vw,3\.5rem\);[^}]*max-width:none/);
  assert.match(css,/@media\(max-width:860px\)\{[\s\S]*?\.zp-bed-hero-layout\{grid-template-columns:1fr/);
  assert.match(css,/\.zp-bed-hero-action \.zp-disclaimer\{margin:0 0 16px\}/);
  assert.match(css,/\.page-template-page-senior-nemuze-vstat-z-postele \.zp-hero\{padding:42px 0 38px\}/);
});
