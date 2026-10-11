import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root=new URL("../",import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),"utf8");

test("CI lints all 39 tracked PHP templates, not just a selected subset",()=>{
  const workflow=read(".github/workflows/ci.yml");
  assert.match(workflow,/git ls-files -z -- '\*\.php' \| xargs -0 -r -n1 php -l/);
  const list=fs.readdirSync(root).filter(name=>name.endsWith(".php"));
  assert.ok(list.length>=35,"Unexpected regression in PHP theme file count");
  for(const template of [
    "page-jak-zmerit-chodidlo-pro-vyber-obuvi.php",
    "page-rollator-pro-seniory.php",
    "page-sedatko-do-vany-pro-seniory.php",
    "page-invalidni-vozik.php"
  ])assert.ok(list.includes(template),"Important advisor PHP file missing: "+template);
});

test("read-only production browser QA detects all Advisor offer markers without hard-coded allowlist",()=>{
  const qa=read("tests/production-advisor-smoke.mjs");
  assert.match(qa,/async function detectCommerce\(page, selector\)/);
  assert.match(qa,/offerMarker = \/\^data-zp-/);
  assert.match(qa,/\[\.\.\.element\.attributes\]/);
  assert.match(qa,/state\.trackingLinks/);
  assert.match(qa,/async function checkNoMerchant/);
  const attrs=new Set();
  for(const asset of fs.readdirSync(new URL("assets/js/",root)).filter(n=>n.endsWith(".js"))) {
    for(const match of read("assets/js/"+asset).matchAll(/data-zp-[a-z0-9-]*merchant-link/g)) attrs.add(match[0]);
  }
  assert.ok(attrs.size>=12,"Merchant CTA marker coverage unexpectedly contracted");
  const genericPattern=/^data-zp-(?:[a-z0-9-]+-)?merchant-link$/;
  for(const name of attrs)assert.match(name,genericPattern,"Offer bypasses generic detection: "+name);
  for(const type of ["footwear","adl","indoor","rollator","shower","toilet","chair"]) {
    assert.ok(attrs.has("data-zp-"+type+"-merchant-link"),"Previous QA gap not covered: "+type);
  }
});
