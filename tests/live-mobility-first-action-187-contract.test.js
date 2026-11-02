import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("Mobility first-action postdeploy acceptance uses real read-only Chrome, exact release and safety scenarios",()=>{
  const script=read("scripts/audit-live-mobility-first-action-187.mjs");
  const workflow=read(".github/workflows/production-advisor-qa.yml");
  const guard=workflow.indexOf("  mobility-first-action-187:");
  const next=workflow.indexOf("  editorial-seo-audit:",guard);
  assert.ok(guard>0&&next>guard,"Independent postdeploy browser job must exist");
  const job=workflow.slice(guard,next);
  assert.match(job,/if: github\.event_name != 'pull_request'/);
  assert.match(job,/contents: read/);
  assert.match(job,/run: node scripts\/audit-live-mobility-first-action-187\.mjs/);
  assert.match(script,/SOURCE_THEME_RELEASE!=="0\.8\.187"/);
  assert.match(script,/readiness\.release,"0\.8\.187"/);
  assert.match(script,/readiness\.integrity,"ok"/);
  assert.match(script,/setViewport\(\{width:390,height:844/);
  for(const part of ["zp-result-orientation","zp-fit-locked-offers[hidden]","handBrakes:","supportNeed:","e=>e.hidden","All theme files"]){
    assert.ok(script.includes(part),"Missing browser acceptance contract: "+part);
  }
  assert.doesNotMatch(script,/window\.print|sendBeacon|localStorage|sessionStorage|wp_update_post/);
});
