import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const script=read("scripts/audit-live-return-home-ux-185.mjs");
const workflow=read(".github/workflows/production-advisor-qa.yml");

test("new return-home 0.8.185 acceptance uses real Chrome and checks the exact deployed release",()=>{
  assert.match(script,/import puppeteer from "puppeteer-core"/);
  assert.match(script,/EXPECTED_LIVE_RELEASE,SOURCE_THEME_RELEASE/);
  assert.match(script,/process\.env\.GITHUB_EVENT_NAME==="pull_request"/);
  assert.match(script,/versionAtLeast\(SOURCE_THEME_RELEASE,"0\.8\.185"\)/);
  assert.match(script,/assert\.equal\(actual,EXPECTED_LIVE_RELEASE/);
  assert.match(script,/document\.getElementById\(id\)/);
  assert.match(script,/await page\.click\('a\.zp-btn\[href="#plan-navratu"\]'\)/);
});

test("postdeploy script verifies mobile-first safety sequence and six exact internal guide anchors",()=>{
  const source=read("page-navrat-z-nemocnice.php");
  for(const marker of ["primaryBeforeAdvisor","advisorBeforeSafety","safetyBeforeGuides",
    "privacyNotice","advisorReady","guideCards","expectedUrls","guidesExplainSafety"]){
    assert.ok(script.includes(marker),"Missing postdeploy acceptance invariant "+marker);
  }
  const exactPaths=[
    "/toaletni-zidle-vedle-postele/","#sedm-kontrol-zidle-postel",
    "/myti-vlasu-na-luzku/","#vyber-myti-vlasu",
    "/oblekani-ponozek-a-kalhot-bez-ohybani/","#podle-problemu-oblekani",
    "/hygiena-leziciho-seniora-doma/","#vyber-hygieny-na-luzku",
    "/nastupovani-seniora-do-auta/","#situace-nastupovani-auto",
    "/prevoz-seniora-k-lekari/","#vyber-dopravy"
  ];
  for(const part of exactPaths){
    assert.ok(script.includes(part),"Missing expected destination "+part);
    assert.ok(source.includes(part),"Destination missing from source "+part);
  }
  assert.match(script,/setViewport\(\{width:390,height:844/);
  assert.match(script,/await destination\.setViewport/);
  assert.doesNotMatch(script,/(?:localStorage|sessionStorage|sendBeacon|XMLHttpRequest|data-zp-merchant-link|wp_update_post|\.submit\()/);
});

test("daily and manually dispatched production QA run independent return-home Chrome acceptance, never PR predeploy",()=>{
  assert.match(workflow,/return-home-ux-185:/);
  const job=workflow.slice(workflow.indexOf("  return-home-ux-185:"),
    workflow.indexOf("  editorial-seo-audit:"));
  assert.match(job,/if: github\.event_name != 'pull_request'/);
  assert.match(job,/contents: read/);
  assert.match(job,/npm install --no-save --no-package-lock puppeteer-core@24/);
  assert.match(job,/run: node scripts\/audit-live-return-home-ux-185\.mjs/);
  assert.doesNotMatch(job,/workflow_dispatch:\s*\n/);
});
