import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const page=read("page-co-zmerit-pred-vyberem-choditka.php");
const sectionStart=page.indexOf('<section id="co-po-mereni"');
const sectionEnd=page.indexOf('    <div class="zp-wrap zp-faq">',sectionStart);
const section=page.slice(sectionStart,sectionEnd);

test("measurement guide keeps one original task/7 measurements, adds separate acquisition path AFTER safety advice",()=>{
  assert.equal((page.match(/<h1\b/g)||[]).length,1);
  assert.match(page,/Co změřit před výběrem chodítka nebo rollátoru\? Sedm věcí doma/);
  assert.ok(sectionStart>page.indexOf("Teď zvolte správnou cestu"),"safe advisors must come first");
  assert.ok(sectionEnd>sectionStart);
  assert.equal((page.match(/id="co-po-mereni"/g)||[]).length,1);
  assert.equal((section.match(/class="zp-decision-card"/g)||[]).length,3);
  assert.match(section,/Koupit, půjčit, nebo ověřit ePoukaz/);
  assert.match(section,/Prověřit úhradu přes ePoukaz/);
  assert.match(section,/Dočasně půjčit chodítko/);
  assert.match(section,/Porovnat konkrétní modely pro přímý nákup/);
  assert.match(section,/fyzickou pomoc/);
  assert.match(section,/požádejte o odborné posouzení/);
  assert.match(section,/pojišťovna/);
  assert.doesNotMatch(section,/<form\b|<input\b|<textarea\b|data-zp-merchant-link|rel="sponsored"|affiliateMap/);
});

test("three exact internal pathways are safe, real and do not hand off to merchants prematurely",()=>{
  const links=[...section.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map(m=>m[0]);
  assert.equal(links.length,3,"No hidden fourth CTA or extra merchant link");
  assert.match(section,/home_url\( '\/choditko-na-pojistovnu\/#priprava-pro-lekare' \)/);
  assert.match(section,/home_url\( '\/pujceni-choditka\/#rozpocet-pujceni-choditka' \)/);
  assert.match(section,/home_url\( '\/#poradce' \)/);
  const insurance=read("page-choditko-na-pojistovnu.php");
  const rental=read("page-pujceni-choditka.php");
  const home=read("front-page.php");
  assert.match(insurance,/id="priprava-pro-lekare"/);
  assert.match(rental,/id="rozpocet-pujceni-choditka"/);
  assert.match(home,/id="poradce"/);
  assert.equal((section.match(/data-zp-journey="advisor"/g)||[]).length,1);
  assert.match(section,/zobrazí až po samostatném potvrzení potřebných kontrol výrobku/);
  assert.doesNotMatch(section,/href="https?:\/\/|target="_blank"|[?&](?:diagnosis|health|answer)=/);
});

test("0.8.202 release contains all 100 markers and consistent exact critical Git blob pins",()=>{
  const fn=read("functions.php");
  assert.match(read("style.css"),/^Version: 0\.8\.202$/m);
  assert.match(fn,/define\( 'ZAPRAZI_RELEASE', '0\.8\.202' \)/);
  const manifest=fn.match(/function zaprazi_2_release_integrity_ok\(\)[\s\S]*?\$files = array\(([\s\S]*?)\n  \);/);
  assert.ok(manifest);
  const files=[...manifest[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
  assert.equal(files.length,100);
  assert.equal(new Set(files).size,100);
  for(const path of files){
    const body=read(path);
    assert.ok(body.includes("ZP_RELEASE_0_8_202"),"No current marker: "+path);
    assert.ok(!body.includes("ZP_RELEASE_0_8_201"),"Stale marker: "+path);
  }
  for(const path of ["src/bathroom/engine.js","src/bathroom/preview.js",
    "src/mobility/engine.js","src/mobility/offer-fit-gate.js"]){
    const buf=Buffer.from(read(path));
    const sha=createHash("sha1").update("blob "+buf.length+"\0").update(buf).digest("hex");
    assert.ok(fn.includes("'"+path+"' => '"+sha+"'"),"Critical Git source blob mismatch: "+path);
  }
});

test("postdeploy source Chrome must check actual 0.8.202 and never run on PR as deployed",()=>{
  const source=read("scripts/audit-live-walker-acquisition-202.mjs");
  const workflow=read(".github/workflows/production-advisor-qa.yml");
  assert.match(source,/SOURCE_THEME_RELEASE!=="0\.8\.202"/);
  assert.match(source,/GITHUB_EVENT_NAME==="pull_request"/);
  assert.match(source,/EXPECTED_LIVE_RELEASE,"0\.8\.202"/);
  assert.match(source,/request\.method\(\)==="GET"/);
  assert.match(source,/exactPath/);
  assert.match(source,/WALKER_ACQUISITION_202_CHROME_PASS/);
  assert.match(workflow,/node scripts\/audit-live-walker-acquisition-202\.mjs/);
  assert.match(workflow,/if: github\.event_name != 'pull_request'[\s\S]{0,160}run: node scripts\/audit-live-walker-acquisition-202\.mjs/);
  assert.doesNotMatch(source,/(?:page|element)\.click\(["'][^"']*(?:merchant|affiliate)/);
});
