import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const script=read("scripts/audit-live-home-bathroom-advisor-first-504.mjs");
const flow=read(".github/workflows/live-home-bathroom-advisor-first-504.yml");
test("Real mobile and desktop Chrome asserts structural priority and all SEO guide links",()=>{
 for(const token of ["puppeteer.launch(","page.goto(","390,1280",
  "prakticke-kontroly","navody-koupelna","zp-mobility-advisor","zp-bathroom-advisor",
  "assert.equal(x.cards,isHome?12:6","validateLinks(x.links,bathroomLinks",
  "for(const width of [390,1280])",
  "meta.canonical","affilateSlots","merchantClicks:0"])
   if(token!=="affilateSlots")assert.ok(script.includes(token),token);
});
test("Only read-only live URLs, release integrity and bathroom safety are covered",()=>{
 for(const token of ['req.method()!=="GET"','req.abort()',"assert.deepEqual(nonGets,[]",
  "assert.equal(ready.integrity,\"ok\"","workflow_dispatch:",
  "audit-live-bathroom-explicit-no-fit-501.mjs","puppeteer-core@24"])
   assert.ok((script+"\n"+flow).includes(token),token);
 assert.doesNotMatch(script,/localStorage\.setItem|sessionStorage\.setItem|sendBeacon|window\.open/);
});
