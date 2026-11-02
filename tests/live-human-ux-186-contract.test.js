import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

test("0.8.186 live acceptance cannot falsely pass PR predeploy or a different version",()=>{
  const script=read("scripts/audit-live-human-ux-186.mjs");
  const workflow=read(".github/workflows/production-advisor-qa.yml");
  assert.match(script,/import puppeteer from "puppeteer-core"/);
  assert.match(script,/process\.env\.GITHUB_EVENT_NAME==="pull_request"/);
  assert.match(script,/SOURCE_THEME_RELEASE!=="0\.8\.186"/);
  assert.match(script,/EXPECTED_LIVE_RELEASE,SOURCE_THEME_RELEASE/);
  assert.match(script,/metadata\.release,"0\.8\.186"/);
  assert.match(script,/metadata\.integrity,"ok"/);
  assert.match(script,/setViewport\(\{width:390,height:844/);
  const begin=workflow.indexOf("  human-ux-186:");
  const end=workflow.indexOf("  editorial-seo-audit:",begin);
  assert.ok(begin>0&&end>begin,"Browser QA must have independent job");
  const job=workflow.slice(begin,end);
  assert.match(job,/if: github\.event_name != 'pull_request'/);
  assert.match(job,/contents: read/);
  assert.match(job,/run: node scripts\/audit-live-human-ux-186\.mjs/);
  assert.match(job,/puppeteer-core@24/);
});

test("read-only live Chrome test validates both human UX paths without network writes or merchant clicks",()=>{
  const script=read("scripts/audit-live-human-ux-186.mjs");
  for(const part of [
    "/pujceni-choditka/","#zp-walker-own-quote-budget",
    "#zp-walker-own-quote-monthly","#zp-walker-own-quote-result",
    "/navrat-z-nemocnice/","zp-critical-plan","zp-return-overview",
    "zp-return-checklist","zp-return-home-submit",
    "result.criticalCount>=3","result.overviewCards,3",
    "Changing a critical answer must remove the stale result"
  ]) assert.ok(script.includes(part),"Missing Chrome invariant: "+part);
  assert.doesNotMatch(script,/localStorage|sessionStorage|sendBeacon|XMLHttpRequest|data-zp-merchant-link|wp_update_post|window\.print/);
});

test("new Chrome postdeploy gate matches source and does not touch decision or commerce rules",()=>{
  const result=read("assets/js/return-home-advisor.js");
  const rental=read("page-pujceni-choditka.php");
  assert.match(result,/renderOverview\(output\)/);
  assert.match(rental,/id="zp-walker-own-quote-budget"/);
  assert.match(read("style.css"),/^Version:\s*0\.8\.186$/m);
  assert.match(read("functions.php"),/define\( 'ZAPRAZI_RELEASE', '0\.8\.186' \)/);
});
