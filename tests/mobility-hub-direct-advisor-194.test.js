import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=p=>readFileSync(p,"utf8");
test("Mobility hub has one clear primary path directly into Home Advisor",()=>{
  const template=read("page-choditka-pro-seniory.php");
  const hero=template.split('<section class="zp-hero zp-illustrated-hero">')[1]
    ?.split("</section>")[0];
  assert.ok(hero,"Missing original Mobility hub hero");
  const primary=hero.match(/<a class="zp-btn"[^>]*>[^<]*<\/a>/g)??[];
  assert.equal(primary.length,1,"Exactly one visual primary CTA on the hub");
  assert.match(primary[0],/data-zp-journey="advisor"/);
  assert.match(primary[0],/home_url\( '\/#poradce' \)/);
  assert.match(primary[0],/>Ověřit vhodný typ v poradci<\/a>/);
  assert.ok(hero.includes('<a class="zp-text-link" href="#vyber-typu">Porovnat typy chodítek</a>'),
    "Keep the compare-first option as a visible secondary link");
  assert.ok(hero.indexOf("Ověřit vhodný typ v poradci")<
    hero.indexOf("Porovnat typy chodítek"));
  assert.doesNotMatch(hero,/Spustit celý poradce pro chůzi|>Vybrat typ chodítka<\/a>/,
    "No redundant or misleading hero action");
  assert.doesNotMatch(hero,/data-zp-merchant-link|data-zp-affiliate-target|rel="sponsored"|[?&](?:answer|health|diagnosis)=/);
});
test("Hub preserves its existing comparison, safer-help and acquisition paths",()=>{
  const src=read("page-choditka-pro-seniory.php");
  for(const path of [
    'id="vyber-typu"',
    'id="hul-nebo-choditko"',
    "/co-zmerit-pred-vyberem-choditka/",
    "/pujceni-choditka/",
    "/choditko-na-pojistovnu/",
    "/senior-odmita-choditko/",
    "/#poradce"
  ])assert.ok(src.includes(path),"Do not remove essential safe route: "+path);
  assert.match(src,/Pokud člověk opakovaně padá/);
  assert.match(src,/volejte 155/);
});
test("new 0.8.194 hub Chrome audit runs only as exact-release postdeploy QA",()=>{
  const wf=read(".github/workflows/production-advisor-qa.yml");
  const script=read("scripts/audit-live-mobility-hub-194.mjs");
  assert.match(wf,/node scripts\/audit-live-mobility-hub-194\.mjs/);
  assert.match(wf,/Verify 0\.8\.194 Mobility hub hero-to-Advisor handoff/);
  assert.match(script,/SOURCE_THEME_RELEASE!=="0\.8\.194"/);
  assert.match(script,/EXPECTED_LIVE_RELEASE,"0\.8\.194"/);
  assert.match(script,/GITHUB_EVENT_NAME==="pull_request"/);
  assert.match(script,/page\.click\("main \.zp-hero a\.zp-btn"\)/);
  assert.match(script,/page\.click\("#zp-analytics-deny"\)/);
  assert.match(script,/waitForSelector\("#poradce #zp-mobility-advisor"/);
  assert.doesNotMatch(script,/[.\w]post\(|method:\s*["']POST["']|merchant_click/i);
});
