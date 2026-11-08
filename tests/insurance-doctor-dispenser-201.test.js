import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const page=read("page-choditko-na-pojistovnu.php");
const fn=read("functions.php");
const css=read("style.css");
const expected="0.8.201";

test("one existing insurance URL now gives actionable, noncommercial doctor and dispenser preparation",()=>{
  assert.equal((page.match(/id="priprava-pro-lekare"/g)||[]).length,1);
  assert.equal((page.match(/href="#priprava-pro-lekare"/g)||[]).length,1);
  assert.equal((page.match(/<h1\b/g)||[]).length,1);
  assert.match(page,/<h1>Chodítko na pojišťovnu v roce 2026\.<\/h1>/);
  assert.match(page,/Na co se zeptat lékaře a výdejny, abyste nekupovali naslepo/);
  const start=page.indexOf('<section id="priprava-pro-lekare"');
  const end=page.indexOf('<section class="zp-wrap">',start);
  assert.ok(start>=0 && end>start);
  const section=page.slice(start,end);
  assert.match(section,/1\. Nejdřív lékař: potřeba a případný předpis/);
  assert.match(section,/2\. Potom výdejna: přesný model, cena a poukaz/);
  assert.match(section,/Připadá pro tento konkrétní typ pomůcky/);
  assert.match(section,/Jaké je přesné označení a rozměry modelu/);
  assert.match(section,/nemusí prokázat shodu varianty/);
  assert.match(section,/odborníkem/);
  assert.match(section,/8\. 11\. 2026/);
  assert.doesNotMatch(section,/(?:data-zp-(?:[a-z-]+-)?merchant-link|rel="sponsored"|<form\b|<input\b)/);
  assert.doesNotMatch(section,/(?:3 408 Kč|bez doplatku|nárok máte|garantovaná úhrada)/i);
});
test("source links stay official, actionable and do not turn into premature retail",()=>{
  const section=page.slice(page.indexOf('<section id="priprava-pro-lekare"'),page.indexOf('<section class="zp-wrap">',page.indexOf('<section id="priprava-pro-lekare"')));
  assert.match(section,/https:\/\/sukl\.gov\.cz\/faq\/jaka-jsou-pravidla-pro-predepisovani-a-vydej-zdravotnickych-prostredku-od-1-1-2026\//);
  assert.match(section,/https:\/\/www\.vzp\.cz\/o-nas\/tiskove-centrum\/otazky-tydne\/proplaceni-choditka/);
  assert.match(section,/home_url\( '\/co-zmerit-pred-vyberem-choditka\/#co-zmerit' \)/);
  assert.match(page,/id="zp-identita-choditka-nadpis"/);
  assert.match(section,/href="#zp-identita-choditka-nadpis"/);
  assert.ok(!/https:\/\/(?:www\.)?(?:dpbolvw|ehub|anrdoezrs|kqzyfj)\./i.test(section));
  assert.match(section,/zp-disclaimer/);
  assert.match(section,/pojišťovna následně automaticky neproplácí/);
});

test("release 0.8.201 updates all 100 manifest markers and exact critical Git blob pins",()=>{
  assert.match(css,/^Version: 0\.8\.201$/m);
  assert.match(fn,/define\( 'ZAPRAZI_RELEASE', '0\.8\.201' \)/);
  const list=fn.match(/function zaprazi_2_release_integrity_ok\(\)[\s\S]*?\$files = array\(([\s\S]*?)\n  \);/);
  assert.ok(list,"Production integrity manifest required");
  const paths=[...list[1].matchAll(/'([^']+)'/g)].map(x=>x[1]);
  assert.equal(paths.length,100);
  assert.equal(new Set(paths).size,100);
  for(const file of paths){
    const source=read(file);
    assert.ok(source.includes("ZP_RELEASE_0_8_201"),"Stale/partial marker: "+file);
    assert.ok(!source.includes("ZP_RELEASE_0_8_200"),"Old marker still present: "+file);
  }
  assert.ok(page.startsWith("<?php\n/* ZP_RELEASE_0_8_201 */"));
  for(const file of [
    "src/bathroom/engine.js","src/bathroom/preview.js",
    "src/mobility/engine.js","src/mobility/offer-fit-gate.js"
  ]){
    const body=read(file);
    const bytes=Buffer.from(body,"utf8");
    const blob=createHash("sha1").update("blob "+bytes.length+"\0").update(bytes).digest("hex");
    const pinLine="'"+file+"' => '"+blob+"'";
    assert.ok(fn.includes(pinLine),"Critical source identity mismatch: "+file);
  }
});

test("exact-release postdeploy browser audit is read-only and never runs on undeployed PR HTML",()=>{
  const workflow=read(".github/workflows/production-advisor-qa.yml");
  const runner=read("scripts/audit-live-insurance-prep-201.mjs");
  assert.match(workflow,/node scripts\/audit-live-insurance-prep-201\.mjs/);
  assert.match(workflow,/if: github\.event_name != 'pull_request'[\s\S]{0,180}node scripts\/audit-live-insurance-prep-201\.mjs/);
  assert.match(runner,/GITHUB_EVENT_NAME==="pull_request"/);
  assert.match(runner,/SOURCE_THEME_RELEASE!=="0\.8\.201"/);
  assert.match(runner,/EXPECTED_LIVE_RELEASE,"0\.8\.201"/);
  assert.match(runner,/request\.method\(\)==="GET"/);
  assert.match(runner,/const origin="https:\/\/zaprazi\.cz"/);
  assert.match(runner,/INSURANCE_201_CHROME_PASS/);
  assert.doesNotMatch(runner,/page\.click\(["']a\[rel|wp_insert_post|wp_update_post|update_option/);
});
