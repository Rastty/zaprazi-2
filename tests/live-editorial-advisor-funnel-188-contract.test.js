import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("0.8.188 editorial funnel real Chrome job runs only after deploy with strict release and privacy checks",()=>{
 const script=read("scripts/audit-live-editorial-advisor-funnel-188.mjs");
 const workflow=read(".github/workflows/production-advisor-qa.yml");
 const start=workflow.indexOf("  editorial-advisor-funnel-188:");
 const end=workflow.indexOf("  editorial-seo-audit:",start);
 assert.ok(start>=0&&end>start);
 const job=workflow.slice(start,end);
 assert.match(job,/if: github\.event_name != 'pull_request'/);
 assert.match(job,/contents: read/);
 assert.match(job,/node scripts\/audit-live-editorial-advisor-funnel-188\.mjs/);
 for(const token of ["0.8.188","analyticsWithoutConsent","forbiddenWrites",
   "readiness","configured_total","zp-journey"]){
   assert.ok(script.includes(token),"Missing acceptance guard "+token);
 }
 assert.match(script,/cases\.length/);
 assert.match(script,/link\.sponsored,false/);
 assert.match(script,/assert\.equal\(destination\.search,""/);
 assert.match(script,/No query\/answer storage in links/);
 assert.doesNotMatch(script,/window\.print\(|sendBeacon\(|localStorage\.setItem|wp_update_post|merchant_click.*gtag/);
});
