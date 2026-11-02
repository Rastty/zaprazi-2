import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {parseGscCsv} from "../scripts/lib/gsc-prioritization.mjs";
import {compareGscPeriods,renderGscComparison,cliArgs} from "../scripts/gsc-period-compare.mjs";

const csv=rows=>[
  "Top pages,Clicks,Impressions,CTR,Position",
  ...rows.map(([url,clicks,impressions,position=10])=>
    [url,clicks,impressions,"0%",position].join(","))
].join("\n")+"\n";
const url=p=>"https://zaprazi.cz"+p;
const parse=rows=>parseGscCsv(csv(rows),"page");
const beforeFrom="2026-09-07",beforeTo="2026-10-04";
const afterFrom="2026-10-05",afterTo="2026-11-01";
const compare=(before,after,opts={})=>compareGscPeriods({before:parse(before),after:parse(after),
  beforeFrom,beforeTo,afterFrom,afterTo,...opts});

test("equal-length 28-day comparison prioritizes real losses, not synthetic ranking",()=>{
  const r=compare([
    [url("/pujceni-choditka/"),10,200],
    [url("/choditka-pro-seniory/"),1,150]
  ],[
    [url("/pujceni-choditka/"),4,230],
    [url("/choditka-pro-seniory/"),2,240]
  ]);
  assert.equal(r.periodDays,28);
  assert.equal(r.matched.length,2);
  assert.equal(r.matched[0].path,"/pujceni-choditka/");
  assert.equal(r.matched[0].deltaClicks,-6);
  assert.equal(r.matched[0].deltaImpressions,30);
  assert.deepEqual(r.matchedTotals,{beforeClicks:11,afterClicks:6,
    beforeImpressions:350,afterImpressions:470});
  const md=renderGscComparison(r);
  assert.match(md,/10 prioritních kontrol/);
  assert.match(md,/Prověřit pokles/);
  assert.match(md,/není výkon celé property/);
});
test("missing export page stays UNKNOWN; never treated as zero or paired",()=>{
  const r=compare([
    [url("/pujceni-choditka/"),7,100],
    [url("/choditka-pro-seniory/"),3,300]
  ],[
    [url("/pujceni-choditka/"),4,200],
    [url("/koupelna-a-wc/"),1,70]
  ]);
  assert.equal(r.matched.length,1);
  assert.deepEqual(r.baselineOnly,["/choditka-pro-seniory/"]);
  assert.deepEqual(r.currentOnly,["/koupelna-a-wc/"]);
  const md=renderGscComparison(r);
  assert.match(md,/výkon UNKNOWN/);
  assert.match(md,/není 0 kliků/);
});
test("refuses incomparable periods: overlap, different duration, invalid dates",()=>{
  const rows=[[url("/pujceni-choditka/"),1,30]];
  assert.throws(()=>compare(rows,rows,{afterFrom:"2026-10-04",afterTo:"2026-10-31"}),/start after/);
  assert.throws(()=>compare(rows,rows,{afterTo:"2026-10-31"}),/equal-length/);
  assert.throws(()=>compare(rows,rows,{beforeFrom:"2026-02-30"}),/ISO date/);
  assert.throws(()=>compare(rows,rows,{afterFrom:"2026-12-01",afterTo:"2026-12-28",beforeFrom:"2026-11-01",beforeTo:"2026-11-28"}),/start after/);
});
test("never exposes off-topic, unknown or query-bearing URL in output",()=>{
  const marker="private-secret-string";
  const r=compare([
    [url("/pujceni-choditka/"),3,100],
    [url("/legacy-"+marker+"/"),4,100],
    [url("/?medical="+marker),3,60]
  ],[
    [url("/pujceni-choditka/"),5,100],
    [url("/legacy-"+marker+"/"),2,100],
    [url("/?medical="+marker),0,20]
  ]);
  const md=renderGscComparison(r);
  assert.equal(r.ignoredBefore,2);
  assert.equal(r.ignoredAfter,2);
  assert.doesNotMatch(md,/private-secret-string/);
  assert.equal(r.matched.length,1);
});
test("offline CLI accepts six required unique flags and rejects extras",()=>{
  const args=["--before-pages","a.csv","--before-from",beforeFrom,"--before-to",beforeTo,
    "--after-pages","b.csv","--after-from",afterFrom,"--after-to",afterTo];
  assert.equal(cliArgs(args)["--after-pages"],"b.csv");
  assert.throws(()=>cliArgs([...args,"--queries","q.csv"]),/six unique/);
  assert.throws(()=>cliArgs(args.slice(0,-2)),/required/);
});
test("comparison tool cannot make HTTP calls, publish or write files",()=>{
  const src=readFileSync(new URL("../scripts/gsc-period-compare.mjs",import.meta.url),"utf8");
  for(const pattern of [/\bfetch\s*\(/,/\bhttps\.request\b/,/\bwriteFile\b/,/writeFileSync/,
    /\bwp_update_post\b/,/XMLHttpRequest/,/sendBeacon/])
    assert.doesNotMatch(src,pattern);
});
