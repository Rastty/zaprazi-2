import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../page-choditka-pro-seniory.php", import.meta.url), "utf8");
const css = readFileSync(new URL("../style.css", import.meta.url), "utf8");
const hero = page.split('<section class="zp-hero zp-illustrated-hero zp-walker-hub-hero">')[1]?.split('</section>')[0];

test("walker hub places its safety warning directly before an actionable advisor route", () => {
  assert.ok(hero, "Scoped illustrated walker hero required");
  assert.match(hero, /class="zp-wrap zp-hero-layout zp-walker-hub-layout"/);
  assert.match(hero, /class="zp-walker-hub-safety" role="note"/);
  const h1 = hero.indexOf("<h1>");
  const lead = hero.indexOf('class="zp-lead"');
  const safety = hero.indexOf('class="zp-walker-hub-safety"');
  const actions = hero.indexOf('class="zp-hero-actions"');
  const firstAdvisor = hero.indexOf('data-zp-journey="advisor" href="<?php echo esc_url( home_url( \'/#poradce\' ) ); ?>"');
  const reluctance = hero.indexOf("Člověk nechce chodítko používat?");
  assert.ok(h1 > 0 && lead > h1 && safety > lead && actions > safety && firstAdvisor > actions && reluctance > firstAdvisor,
    "First-screen explanation, warning and primary action must precede secondary education");
  assert.match(hero, /fyzické přidržování, opakovaně padá nebo nedokáže bezpečně stát/);
  assert.match(hero, /bezpečné ovládání a rozměry se teprve ověřují/);
  assert.equal((hero.match(/data-zp-journey="advisor"/g) || []).length, 3,
    "Keep three consent-gated existing advisor paths, without extra telemetry");
  assert.doesNotMatch(hero, /data-zp-offer|data-zp-merchant-link|affiliateMap/);
});

test("walker-only responsive CSS avoids the globally oversized 10ch headline", () => {
  assert.match(css, /\.zp-walker-hub-hero h1\{font-size:clamp\(2\.25rem,3\.65vw,3\.45rem\);[^}]*max-width:none/);
  assert.match(css, /\.zp-walker-hub-safety\{[^}]*border-left:4px solid var\(--zp-accent\)/);
  assert.match(css, /\.zp-walker-hub-hero \.zp-hero-actions \.zp-btn\{margin:0\}/);
  assert.match(css, /@media\(max-width:820px\)\{[\s\S]*?\.zp-walker-hub-hero h1\{[^}]*max-width:none/);
  assert.match(css, /\.zp-walker-hub-hero \.zp-hero-actions \.zp-text-link\{[^}]*min-height:44px/);
  assert.equal((page.match(/id="vyber-typu"/g) || []).length, 1, "Keep the one original decision module");
  assert.match(page, /id="hul-nebo-choditko"/);
  assert.match(page, /id="jak-ziskat-choditko"/);
});
