import test from "node:test";
import assert from "node:assert/strict";
import { summarizeEditorialPages, googlebotBlockedByXRobotsTag } from "../scripts/lib/editorial-seo-rules.mjs";
const good=(path,title,links=[],ids=[])=>({
  path,status:200,h1:[title],title,description:"Praktický návod "+title,
  canonical:"https://zaprazi.cz"+path,robots:"index,follow",mainWords:170,
  mainContentLinks:links,ids
});
test("Clean internal editorial graph has no hard SEO violations and tracks inbound",()=>{
  const rows=[good("/","Úvod",["https://zaprazi.cz/koupelna-a-wc/#poradce"],[]),
    good("/koupelna-a-wc/","Koupelna",["https://zaprazi.cz/"],["poradce"])];
  const r=summarizeEditorialPages(rows);
  assert.equal(r.audited,2);
  assert.deepEqual(r.errors,[]);
  assert.equal(r.inbound["/koupelna-a-wc/"],1);
  assert.equal(r.inbound["/"],1);
  assert.ok(r.pages.find(p=>p.path==="/koupelna-a-wc/").outboundCore>=1);
});
test("Broken anchors, duplicate metadata, noindex, HTTP links are diagnosed",()=>{
  const a=good("/","Stejný",["http://zaprazi.cz/other/#missing"],[]);
  const b=good("/other/","Stejný",["https://zaprazi.cz/"],[]);
  b.robots="noindex,follow";
  const r=summarizeEditorialPages([a,b]);
  const codes=r.errors.map(e=>e.code);
  assert.ok(codes.includes("NOINDEX"));
  assert.ok(r.warnings.some(w=>w.code==="DUPLICATE_TITLE"));
  assert.ok(r.warnings.some(w=>w.code==="HTTP_INTERNAL_LINK"));
  assert.ok(r.warnings.some(w=>w.code==="BROKEN_INPAGE_ANCHOR"));
});
test("Wrong canonical, unavailable page and missing description are unambiguously reported",()=>{
  const a=good("/page/","Test",[],[]);a.canonical="https://bad.example/page/";a.description="";
  const b=good("/broken/","Gone");b.status=404;
  const result=summarizeEditorialPages([a,b]);
  assert.ok(result.errors.some(e=>e.code==="CANONICAL_MISMATCH"&&e.path==="/page/"));
  assert.ok(result.errors.some(e=>e.code==="HTTP_NOT_200"&&e.path==="/broken/"));
  assert.ok(result.warnings.some(w=>w.code==="MISSING_DESCRIPTION"));
  assert.ok(result.warnings.some(w=>w.code==="ZERO_CORE_CONTEXT_INBOUND"&&w.path==="/page/"));
});

test("HTTP X-Robots-Tag and Googlebot meta noindex fail the decision-page SEO gate",()=>{
  for (const [field,value,code] of [
    ["xRobotsTag","noindex, nofollow","X_ROBOTS_NOINDEX"],
    ["xRobotsTag","none","X_ROBOTS_NOINDEX"],
    ["xRobotsTag","googlebot: noindex","X_ROBOTS_NOINDEX"],
    ["xRobotsTag","bingbot: noindex, googlebot: noindex","X_ROBOTS_NOINDEX"],
    ["googlebotRobots","noindex,follow","GOOGLEBOT_NOINDEX"],
    ["googlebotRobots","none","GOOGLEBOT_NOINDEX"],
    ["robots","none","NOINDEX"]
  ]){
    const page=good("/choditka-pro-seniory/","Chodítka");
    page[field]=value;
    assert.ok(summarizeEditorialPages([page]).errors.some(e=>e.code===code),
      field+"="+value+" should block indexability QA");
  }
});

test("Bot-specific X-Robots directives do not falsely block generic Googlebot",()=>{
  for (const header of [
    "", "index, follow", "bingbot: noindex", "googlebot-news: noindex",
    "bingbot: noindex, googlebot: index", "googlebot: index, follow"
  ]){
    assert.equal(googlebotBlockedByXRobotsTag(header),false);
    const page=good("/choditka-pro-seniory/","Chodítka");
    page.xRobotsTag=header;
    assert.ok(!summarizeEditorialPages([page]).errors.some(e=>e.code==="X_ROBOTS_NOINDEX"));
  }
});

test("SEO errors never reflect untrusted X-Robots-Tag or Googlebot meta values",()=>{
  const secret="PRIVATE_ADVISOR_ANSWER_DO_NOT_LOG_20261102";
  const page=good("/choditka-pro-seniory/","Chodítka");
  page.xRobotsTag="googlebot: noindex, "+secret;
  page.googlebotRobots="noindex, "+secret;
  const report=summarizeEditorialPages([page]);
  assert.ok(report.errors.some(e=>e.code==="X_ROBOTS_NOINDEX"));
  assert.ok(report.errors.some(e=>e.code==="GOOGLEBOT_NOINDEX"));
  assert.ok(!JSON.stringify(report.errors).includes(secret));
});
