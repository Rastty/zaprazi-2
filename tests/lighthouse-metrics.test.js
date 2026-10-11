import test from "node:test";
import assert from "node:assert/strict";
import { summarizeLighthouseReport, summarizeLighthouseReports } from "../scripts/audit-lighthouse-metrics.mjs";
const sample=(path="/")=>({
  lighthouseVersion:"13.5.0",fetchTime:"2026-10-11T16:00:00.000Z",
  finalDisplayedUrl:"https://zaprazi.cz"+path,
  categories:{performance:{score:0.73}},audits:{
    "largest-contentful-paint":{numericValue:3250},
    "first-contentful-paint":{numericValue:1500},
    "cumulative-layout-shift":{numericValue:0.00759},
    "total-blocking-time":{numericValue:120},
    "speed-index":{numericValue:2400},
    "network-requests":{details:{items:[
      {url:"https://zaprazi.cz/assets/hero.webp",transferSize:143360,resourceType:"Image"},
      {url:"https://zaprazi.cz/style.css",transferSize:16000,resourceType:"Stylesheet"},
      {url:"https://others.example/tracker.js",transferSize:100000,resourceType:"Script"}]}}
  },runWarnings:[]});
test("Real Lighthouse report extraction yields data, not fabricated field INP",()=>{
  const x=summarizeLighthouseReport(sample("/koupelna-a-wc/"));
  assert.equal(x.path,"/koupelna-a-wc/");
  assert.equal(x.score,73);
  assert.equal(x.metrics.LCP_ms,3250);
  assert.equal(x.metrics.CLS,0.01);
  assert.equal(x.metrics.TBT_ms,120);
  assert.equal(x.requests.total,3);
  assert.equal(x.requests.first_party,2);
  assert.equal(x.requests.first_party_transfer_kb,156);
  assert.equal(x.requests.large_first_party[0].transfer_kb,140);
  assert.ok(!("INP_ms" in x.metrics));
  assert.match(x.disclaimers,/not p75/);
});
test("Refuse reports from other origins, malformed payloads and duplicate pages",()=>{
  const outside=sample();
  outside.finalDisplayedUrl="https://not-zaprazi.cz/";
  assert.throws(()=>summarizeLighthouseReport(outside),/Unexpected final audit origin/);
  assert.throws(()=>summarizeLighthouseReport({}),/Invalid Lighthouse/);
  assert.throws(()=>summarizeLighthouseReports([sample(),sample()]),/Duplicate report path/);
});
test("Missing measurements are explicitly null instead of false zeros",()=>{
  const s=sample();
  delete s.audits["largest-contentful-paint"];
  assert.equal(summarizeLighthouseReport(s).metrics.LCP_ms,null);
  const result=summarizeLighthouseReports([s]);
  assert.equal(result.pages.length,1);
  assert.match(result.measurement,/Single-run/);
});
