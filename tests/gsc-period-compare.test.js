import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {parseGscCsv} from "../scripts/lib/gsc-prioritization.mjs";
import {compareGscPeriods,compareSanitizedGscSnapshots,parseSanitizedGscSnapshot,renderGscComparison,cliArgs} from "../scripts/gsc-period-compare.mjs";

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
  assert.throws(()=>compare(rows,rows,{afterFrom:"2026-11-20",afterTo:"2026-12-17",beforeFrom:"2026-11-01",beforeTo:"2026-11-28"}),/start after/);
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


const gscSnapshot=(from,to,trackedPages)=>({
  schemaVersion:1,status:"evidence_available",site:"zaprazi.cz",
  source:"Google Search Console Search Analytics API",
  property:{url:"https://zaprazi.cz/",permission:"siteOwner",hostRestricted:true},
  period:{startDate:from,endDate:to,days:28,finalityLagDays:3,
    dataState:"final",searchType:"web"},
  sitewide:{clicks:9,impressions:941,ctr:0.0096,position:20.13},
  trackedPages,queryIntentEvidence:{status:"no_safe_groups_or_unavailable",pages:[]}
});
const insurance={path:"/choditko-na-pojistovnu/",clicks:1,impressions:60,
  ctr:0.0167,position:10.43};
const rental={path:"/pujceni-choditka/",clicks:0,impressions:5,
  ctr:0,position:5.4};
const older=()=>gscSnapshot("2026-10-10","2026-11-06",[insurance,rental]);
const newer=()=>gscSnapshot("2026-11-10","2026-12-07",[
  {...insurance,clicks:5,impressions:125,ctr:0.04,position:8.5},
  {...rental,clicks:1,impressions:12,ctr:0.0833,position:6.2}
]);

test("Prometheus final snapshot is compared using existing canonical page engine",()=>{
  const a=parseSanitizedGscSnapshot(older());
  assert.deepEqual(a.rows,[insurance,rental]);
  assert.equal(a.from,"2026-10-10");
  const result=compareSanitizedGscSnapshots(older(),newer());
  assert.equal(result.source,"prometheus_sanitized_gsc_final");
  assert.equal(result.periodDays,28);
  assert.equal(result.matched.length,2);
  const row=result.matched.find(x=>x.path===insurance.path);
  assert.equal(row.deltaClicks,4);
  assert.equal(row.deltaImpressions,65);
  const output=renderGscComparison(result);
  assert.match(output,/anonymizovaný finální 28denní agregát Prometheus/);
  assert.match(output,/choditko-na-pojistovnu/);
  assert.match(output,/není 0 kliků/);
  assert.doesNotMatch(output,/provize se zvýšily|prokazatelný růst SEO/i);
});

test("Missing page in a later sanitized snapshot is UNKNOWN, not zero",()=>{
  const newerWithoutRental=newer();
  newerWithoutRental.trackedPages=[newerWithoutRental.trackedPages[0]];
  const result=compareSanitizedGscSnapshots(older(),newerWithoutRental);
  assert.deepEqual(result.baselineOnly,["/pujceni-choditka/"]);
  assert.equal(result.matched.length,1);
  assert.doesNotMatch(renderGscComparison(result),/\| \/pujceni-choditka\/ \|/);
});

test("Invalid, non-final and untrusted GSC snapshots fail closed without leaking fields",()=>{
  for(const change of [
    x=>{x.status="no_final_gsc_rows";},
    x=>{x.property.url="https://foreign.example/";},
    x=>{x.period.searchType="image";},
    x=>{x.period.dataState="partial";},
    x=>{x.period.days=27;},
    x=>{x.period.endDate="2026-11-09";},
    x=>{x.trackedPages[0].clicks=80;},
    x=>{x.trackedPages[0].ctr=0.5;},
    x=>{x.trackedPages[0].path="/private-answer-KEEP_SECRET/";},
    x=>{x.trackedPages.push({...x.trackedPages[0]});}
  ]){
    const invalid=older();
    invalid.trackedPages=invalid.trackedPages.map(y=>({...y}));
    change(invalid);
    assert.throws(()=>parseSanitizedGscSnapshot(invalid),error=>
      !error.message.includes("KEEP_SECRET")&&!error.message.includes("foreign.example"));
  }
  assert.throws(()=>compareSanitizedGscSnapshots(older(),
    gscSnapshot("2026-11-01","2026-11-28",[insurance])),/start after/);
});

test("Snapshot mode requires exactly two flags and never accepts raw query output",()=>{
  assert.deepEqual(cliArgs(["--before-snapshot","a.json","--after-snapshot","b.json"]),
    {"--before-snapshot":"a.json","--after-snapshot":"b.json"});
  assert.throws(()=>cliArgs(["--before-snapshot","a.json","--after-pages","b.csv"]),/required/);
  const before=older();
  before.queryIntentEvidence={rawQueries:["SENSITIVE_QUERY_NEVER_REPORT"]};
  before.rawAnswers=["SENSITIVE_HEALTH_ANSWER"];
  const output=renderGscComparison(compareSanitizedGscSnapshots(before,newer()));
  assert.ok(!output.includes("SENSITIVE_QUERY_NEVER_REPORT"));
  assert.ok(!output.includes("SENSITIVE_HEALTH_ANSWER"));
});
