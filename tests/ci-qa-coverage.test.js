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

test("0.8.121 production QA inspects all candidate acquisition links",()=>{
  const qa=read("tests/production-advisor-smoke.mjs");
  // Puppeteer's $eval returns one element; its .map() call would fail only
  // after deployment because this assertion is release-gated.
  assert.ok(qa.includes("const links=await page.$$eval(spec.result+' .zp-acquisition-summary a[href]'"),
    "Rental budget verification must enumerate links with $$eval");
  assert.doesNotMatch(qa,/const links=await page\.\$eval\(spec\.result\+' \.zp-acquisition-summary a\[href\]'/);
});

test("0.8.122 production QA enumerates Homepage acquisition links rather than treating one DOM element as an array", () => {
  const smoke = read("tests/production-advisor-smoke.mjs");
  assert.ok(smoke.includes('const candidateLinks = await page.$$eval("#zp-mobility-result .zp-acquisition-summary a[href]"'));
  assert.doesNotMatch(smoke, /const candidateLinks = await page\.\$eval\(/);
  assert.ok(smoke.includes('if (releaseAtLeast("0.8.123"))'));
});

test("0.8.123 three-advisor smoke enumerates all informational acquisition links", () => {
  const smoke = read("tests/production-advisor-smoke.mjs");
  assert.ok(smoke.includes("const urls=await page.$$eval(spec.result+' .zp-acquisition-summary a[href]'"),
    "0.8.123 test must not pass one ElementHandle to nodes.map");
  assert.doesNotMatch(smoke,/const urls=await page\.\$eval\(spec\.result/,
    "0.8.123 browser QA must not regress to $eval");
  assert.ok(smoke.includes('if (releaseAtLeast("0.8.124"))'),
    "Missing live acceptance for blocked Homepage edit controls");
});

test("no single-element Puppeteer eval may treat its argument as a collection", () => {
  const smoke = read("tests/production-advisor-smoke.mjs");
  // The 0.8.122, 0.8.123 and 0.8.126 post-deploy failures all came from
  // using page.$eval(selector, nodes => nodes.map(...)) instead of $$eval.
  // Check every release-gated block, not just one hard-coded selector.
  assert.doesNotMatch(smoke, /page\.\$eval\([^;]{0,300}\b(nodes|elements|els)\s*=>\s*\1\.map\(/,
    "A single DOM element cannot be .map()'d: use page.$$eval to enumerate nodes");
  assert.ok(smoke.includes('const ins=await page.$$eval(\'#zp-rollator-result a[href="/choditko-na-pojistovnu/"]\''));
});
