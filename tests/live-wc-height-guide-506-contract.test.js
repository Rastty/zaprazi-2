import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const get=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const s=get("scripts/audit-live-wc-height-guide-506.mjs");
const w=get(".github/workflows/live-wc-height-guide-506.yml");
test("Real browser tests exact contextual SEO anchor and safe WC Advisor",()=>{
 for(const t of ["puppeteer.launch(","vyska-nastavce-5-10-15",
  "/co-zmerit-v-koupelne-pred-vyberem-pomucky/","/koupelna-a-wc/",
  "for(const width of [390,1280])","guide.cards,3","guide.steps,6",
  "guide.pdf,true","guide.merchant,0","person_assist",
  "blocked.hasMerchant,false","blocked.offers,0",
  "assert.deepEqual(jsErrors,[]","assert.deepEqual(writes,[]"])
  assert.ok(s.includes(t),t);
});
test("No merchant clicks, no personal answer telemetry, production readiness check",()=>{
 for(const t of ['req.method()!=="GET"',"req.abort()","ready.integrity,\"ok\"",
   "merchantClicks:0","puppeteer-core@24","workflow_dispatch:"])
  assert.ok((s+"\n"+w).includes(t),t);
 assert.doesNotMatch(s,/localStorage\.setItem|sessionStorage\.setItem|sendBeacon|window\.open/);
});
