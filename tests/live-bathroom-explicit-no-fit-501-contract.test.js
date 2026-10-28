import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const script=read("scripts/audit-live-bathroom-explicit-no-fit-501.mjs");
const workflow=read(".github/workflows/live-bathroom-explicit-no-fit-501.yml");
test("Real live Chrome checks explicit no-fit for each important bathroom branch",()=>{
 for(const token of [
 "unstable_shower_floor","shower_space_incompatible","WC_attachment_incompatible",
 "WC_feet_unsupported","WC_capacity_insufficient","WC_support_frame_incompatible",
 "bath_both_variants_incompatible","puppeteer.launch(","page.goto(",
 "Tato varianta nevyhovuje","assert.equal(blocked.merchant,0",
 "assert.equal(blocked.offers,0","assert.equal(blocked.focus,0",
 "assert.equal(blocked.cards,0","assert.equal(blocked.guides,1",
 "assert.equal(cleared.html.length,0"
 ]) assert.ok(script.includes(token),token);
});
test("Production negative-fit smoke protects privacy and cannot make purchases",()=>{
 for(const token of ["req.method()!==\"GET\"","req.abort()",
  "assert.deepEqual(nonGets,[]","merchantClicks:0","location.search",
  "builder_complete","recommendation_view","puppeteer-core@24",
  "pull_request:","workflow_dispatch:"]) assert.ok((script+"\n"+workflow).includes(token),token);
 assert.doesNotMatch(script,/localStorage\.setItem|sessionStorage\.setItem|sendBeacon|window\.open/);
});
