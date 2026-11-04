import test from "node:test";
import assert from "node:assert/strict";
import {
  summarizeRepeatedMobileLighthouse,seriesMarkdown,
  REQUIRED_PATHS,REPEATS
} from "../scripts/audit-lighthouse-series.mjs";

const mock=(path="/",num=0)=>({
  lighthouseVersion:"13.5.0",
  configSettings:{formFactor:"mobile"},
  fetchTime:"2026-11-04T14:"+String(num).padStart(2,"0")+":00Z",
  finalDisplayedUrl:"https://zaprazi.cz"+path,
  categories:{performance:{score:[0.99,0.91,0.98][num%3]}},
  audits:{
    "largest-contentful-paint":{numericValue:[1000,1200,1100][num%3]},
    "first-contentful-paint":{numericValue:[700,800,750][num%3]},
    "cumulative-layout-shift":{numericValue:0},
    "total-blocking-time":{numericValue:[10,50,20][num%3]},
    "speed-index":{numericValue:[1500,1700,1600][num%3]},
    "network-requests":{details:{items:[
      {url:"https://zaprazi.cz/assets/main.js",transferSize:[70000,90000,85000][num%3],resourceType:"Script"},
      {url:"https://other.example/external.js",transferSize:90000,resourceType:"Script"}
    ]}}
  },
  runWarnings:[]
});
const series=()=>REQUIRED_PATHS.flatMap(path=>Array.from({length:REPEATS},(_,i)=>mock(path,i)));

test("reports exact three-run mobile medians, ranges and actual significant assets",()=>{
  const out=summarizeRepeatedMobileLighthouse(series(),{liveRelease:"0.8.195"});
  assert.equal(out.pages.length,3);
  assert.equal(out.lighthouse_version,"13.5.0");
  assert.equal(out.live_release,"0.8.195");
  assert.equal(out.pages[0].score.median,98);
  assert.equal(out.pages[0].score.min,91);
  assert.equal(out.pages[0].score.max,99);
  assert.equal(out.pages[0].metrics.LCP_ms.median,1100);
  assert.equal(out.pages[0].metrics.FCP_ms.median,750);
  assert.equal(out.pages[0].metrics.TBT_ms.median,20);
  assert.equal(out.pages[0].metrics.CLS.median,0,"Valid zero must remain zero");
  assert.equal(out.pages[0].first_party_transfer_kb.median,83);
  assert.ok(out.pages[0].large_first_party_assets[0].path.includes("main.js"));
  assert.equal(out.pages[0].large_first_party_assets.length,1,"Exclude third-party");
  assert.match(out.metric_limit,/not CrUX or INP/i);
  assert.equal(out.pages[0].sample_instability,false);
  const md=seriesMarkdown(out);
  assert.match(md,/LCP median ms/);
  assert.match(md,/choditka-pro-seniory/);
  assert.match(md,/not measure field INP/i);
});
test("reject partial sample sets and repeat count drift",()=>{
  const all=series();
  assert.throws(()=>summarizeRepeatedMobileLighthouse(all.slice(0,-1)),/Expected exactly/);
  const duplicate=[...all];
  duplicate[8]=mock("/",2);
  assert.throws(()=>summarizeRepeatedMobileLighthouse(duplicate),/Need 3 measured runs/);
});
test("reject external origins, unplanned URLs and non-mobile settings",()=>{
  const all=series();
  all[0].finalDisplayedUrl="https://merchant.example/";
  assert.throws(()=>summarizeRepeatedMobileLighthouse(all),/Unexpected final audit origin/);
  const unplanned=series();
  unplanned[0].finalDisplayedUrl="https://zaprazi.cz/random/";
  assert.throws(()=>summarizeRepeatedMobileLighthouse(unplanned),/Unexpected audited path/);
  const desktop=series();
  desktop[0].configSettings.formFactor="desktop";
  assert.throws(()=>summarizeRepeatedMobileLighthouse(desktop),/Only explicit mobile/);
});
test("reject mixed Lighthouse versions, missing metrics/timestamp and warnings",()=>{
  const mixed=series();
  mixed[0].lighthouseVersion="13.4.0";
  assert.throws(()=>summarizeRepeatedMobileLighthouse(mixed),/version drift/);
  const missing=series();
  delete missing[1].audits["largest-contentful-paint"];
  assert.throws(()=>summarizeRepeatedMobileLighthouse(missing),/Missing numeric/);
  const badDate=series();
  delete badDate[3].fetchTime;
  assert.throws(()=>summarizeRepeatedMobileLighthouse(badDate),/Missing audit timestamp/);
  const warning=series();
  warning[3].runWarnings=["Google Chrome crashed while measuring"];
  assert.throws(()=>summarizeRepeatedMobileLighthouse(warning),/Lighthouse emitted warnings/);
});
test("sample variance is visible and never automatically translated to growth or revenue",()=>{
  const all=series();
  all[0].categories.performance.score=0.45;
  const result=summarizeRepeatedMobileLighthouse(all);
  assert.equal(result.pages[0].sample_instability,true);
  assert.match(seriesMarkdown(result),/⚠️/);
  assert.doesNotMatch(seriesMarkdown(result),/organic clicks.*increased/i);
});

test("do not accept guessed or malformed observed production release",()=>{
  assert.throws(()=>summarizeRepeatedMobileLighthouse(series(),{liveRelease:"release-latest"}),/Malformed observed/);
  assert.equal(summarizeRepeatedMobileLighthouse(series()).live_release,null);
});
