import test from "node:test";
import assert from "node:assert/strict";
import {mkdtempSync,readFileSync,rmSync,writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";
import {cliArgs,reportFromFiles,reportFromSanitizedSnapshot} from "../scripts/gsc-opportunity-report.mjs";

const genuineShape=()=>({
  schemaVersion:1,status:"evidence_available",site:"zaprazi.cz",
  source:"Google Search Console Search Analytics API",
  property:{url:"https://zaprazi.cz/",permission:"siteOwner",hostRestricted:true},
  period:{startDate:"2026-10-11",endDate:"2026-11-07",days:28,
    dataState:"final",searchType:"web"},
  sitewide:{clicks:8,impressions:928,ctr:8/928,position:20.23},
  trackedPages:[
    {path:"/choditko-na-pojistovnu/",clicks:1,impressions:60,
      ctr:1/60,position:10.43},
    {path:"/rollator-pro-seniory/",clicks:0,impressions:0,
      ctr:null,position:null}
  ]
});
test("single authorized final 28-day Prometheus snapshot produces bounded editorial triage",()=>{
  const data=genuineShape();
  data.rawQueries=["NEVER_SHOW_RAW_PRIVATE_QUERY"];
  data.answers=["NEVER_SHOW_HEALTH_ANSWER"];
  const report=reportFromSanitizedSnapshot(data);
  assert.match(report,/finální anonymizovaný 28denní/);
  assert.match(report,/2026-10-11 až 2026-11-07/);
  assert.match(report,/choditko-na-pojistovnu/);
  assert.match(report,/chybějící řádek = UNKNOWN/);
  assert.match(report,/n\/a/);
  assert.match(report,/Surové|Dotazové řádky nejsou součástí/);
  assert.match(report,/53 schválených hlavních URL/);
  assert.doesNotMatch(report,/NEVER_SHOW_RAW_PRIVATE_QUERY|NEVER_SHOW_HEALTH_ANSWER/);
  assert.doesNotMatch(report,/0 kliků = neindexováno|garantovaná změna pozice/);
});
test("refuse invented, stale, foreign or private snapshot without printing its fields",()=>{
  const changes=[
    x=>{x.property.url="https://foreign.example/";},
    x=>{x.property.permission="siteUnverifiedUser";},
    x=>{x.period.dataState="partial";},
    x=>{x.period.days=27;},
    x=>{x.site="not-zaprazi";},
    x=>{x.trackedPages[0].path="/private-health-ANSWER_SECRET/";},
    x=>{x.trackedPages[0].clicks=700;},
    x=>{x.trackedPages[0].ctr=0.77;},
    x=>{x.trackedPages[1].ctr=0;}
  ];
  for(const change of changes){
    const invalid=genuineShape();invalid.trackedPages=invalid.trackedPages.map(v=>({...v}));
    change(invalid);
    assert.throws(()=>reportFromSanitizedSnapshot(invalid),error=>
      !String(error.message).includes("ANSWER_SECRET") &&
      !String(error.message).includes("foreign.example"));
  }
});
test("CSV syntax remains supported; snapshot mode cannot mix fabricated CSV periods",()=>{
  assert.deepEqual(cliArgs(["--snapshot","/private/gsc.json"]),{"--snapshot":"/private/gsc.json"});
  assert.throws(()=>cliArgs(["--snapshot","/private/a.json","--from","2026-11-07"]),/sole flag/);
  assert.throws(()=>cliArgs(["--snapshot","a.json","--snapshot","b.json"]),/Repeated/);
  const csvFlags=["--pages","/private/Pages.csv","--from","2026-10-11",
    "--to","2026-11-07"];
  assert.equal(cliArgs(csvFlags)["--pages"],"/private/Pages.csv");
  assert.throws(()=>cliArgs(["--queries","q.csv","--snapshot","a.json"]),/sole flag/);
});
test("local snapshot CLI reads exact finalized file and never writes to the repository",()=>{
  const dir=mkdtempSync(join(tmpdir(),"zp-gsc-single-"));
  try{
    const path=join(dir,"snapshot.json");
    writeFileSync(path,JSON.stringify(genuineShape()));
    const report=reportFromFiles({"--snapshot":path});
    assert.match(report,/60/);
    const result=spawnSync(process.execPath,["scripts/gsc-opportunity-report.mjs",
      "--snapshot",path],{encoding:"utf8",timeout:12000});
    assert.equal(result.status,0,result.stderr);
    assert.match(result.stdout,/choditko-na-pojistovnu/);
    assert.match(result.stdout,/n\/a/);
    assert.doesNotMatch(result.stdout,/garantovaný růst/);
  }finally{rmSync(dir,{recursive:true,force:true});}
});
test("Prometheus adapter remains offline, without credentials, website writes or synthetic queries",()=>{
  const src=readFileSync(new URL("../scripts/gsc-opportunity-report.mjs",import.meta.url),"utf8");
  for(const pattern of [/\bfetch\s*\(/,/\bhttps\.request\b/,/\bwriteFileSync\b/,
    /\bwp_update_post\b/,/\baxios\b/,/XMLHttpRequest/,/sendBeacon/])
    assert.doesNotMatch(src,pattern);
});


const safeIntents=()=>({
  status:"privacy_aggregated",
  source:"page-filtered GSC query dimension, final 28 days",
  pagesAttempted:6,pagesResponded:6,pagesWithSafeGroups:2,
  pages:[
    {path:"/choditko-na-pojistovnu/",intents:[
      {label:"reimbursement",clicks:1,impressions:20,ctr:0.05,position:8.4},
      {label:"walker_selection",clicks:0,impressions:11,ctr:0,position:null}
    ]},
    {path:"/prevoz-seniora-k-lekari/",intents:[
      {label:"transport_eligibility",clicks:0,impressions:15,ctr:0,position:7.2}
    ]}
  ],
  limitations:["Only 6 fixed canonical pages"]
});
test("page-filtered intent groups appear without raw query text or invented totals",()=>{
 const data=genuineShape();
 data.queryIntentEvidence=safeIntents();
 data.queryIntentEvidence.rawQueries=["NEVER_RENDER_SENSITIVE_SEARCH"];
 data.queryIntentEvidence.pages[0].intents[0].rawQuery="NEVER_RENDER_SPECIFIC_QUERY";
 // Unsupported keys cause fail-closed for the optional intent lane,
 // without invalidating trustworthy page-level GSC totals.
 const guarded=reportFromSanitizedSnapshot(data);
 assert.match(guarded,/UNKNOWN: pro dané finální období/);
 assert.doesNotMatch(guarded,/NEVER_RENDER_/);
 assert.match(guarded,/choditko-na-pojistovnu/);
 delete data.queryIntentEvidence.rawQueries;
 delete data.queryIntentEvidence.pages[0].intents[0].rawQuery;
 const valid=reportFromSanitizedSnapshot(data);
 const section=valid.split("## 1c. Stránkově filtrované vyhledávací záměry")[1]
   .split("## 1b. Všechny doložené hlavní URL")[0];
 assert.match(section,/Úhrada \/ ePoukaz/);
 assert.match(section,/Nárok a úhrada převozu/);
 assert.match(section,/\/prevoz-seniora-k-lekari\//);
 assert.match(section,/jen|Pouze agregované kategorie/);
 assert.ok(valid.indexOf("## 1c.")<valid.indexOf("## 1b."),
   "Owner summary must show the useful safe intent lane before 53-page table");
 assert.doesNotMatch(valid,/NEVER_RENDER_/);
});
test("unsafe or sparse Core intent buckets can never become an editorial recommendation",()=>{
 const changes=[
  x=>{x.pages[0].intents[0].label="private_medical_condition";},
  x=>{x.pages[0].intents[0].impressions=9;},
  x=>{x.pages[0].intents[0].clicks=200;},
  x=>{x.pages[0].intents[0].ctr=0.99;},
  x=>{x.pages[0].intents[0].position=-2;},
  x=>{x.pages[0].path="/private-secret-diagnosis/";},
  x=>{x.pages.push({...x.pages[0]});},
  x=>{x.pages[1].intents[0].label="rental";},
  x=>{x.pagesWithSafeGroups=4;},
  x=>{x.pagesResponded=7;},
  x=>{x.source="unverified query strings";},
  x=>{x.pages[0].intents[0].query="NEVER_RENDER_QUERY";},
  x=>{x.status="unknown_unvalidated";},
 ];
 for(const change of changes){
   const data=genuineShape();
   data.queryIntentEvidence=safeIntents();
   change(data.queryIntentEvidence);
   const report=reportFromSanitizedSnapshot(data);
   assert.match(report,/UNKNOWN: pro dané finální období/);
   assert.doesNotMatch(report,/private-secret-diagnosis|NEVER_RENDER_QUERY|unverified query strings/);
 }
 const missing=reportFromSanitizedSnapshot(genuineShape());
 assert.match(missing,/UNKNOWN: pro dané finální období/);
 const noGroups=genuineShape();
 noGroups.queryIntentEvidence={...safeIntents(),
   status:"no_safe_groups_or_unavailable",pagesWithSafeGroups:0,pages:[]};
 assert.match(reportFromSanitizedSnapshot(noGroups),/UNKNOWN: pro dané finální období/);
});


const indexPaths=[
 "/", "/choditko-na-pojistovnu/", "/pujceni-choditka/",
 "/rollator-pro-seniory/", "/choditka-pro-seniory/",
 "/choditko-do-bytu-pro-seniory/", "/co-zmerit-pred-vyberem-choditka/",
 "/kompenzacni-pomucky-pro-seniory/", "/koupelna-a-wc/",
 "/sprchovaci-zidle-pro-seniory/", "/navrat-z-nemocnice/",
 "/invalidni-vozik/", "/polohovaci-postel/", "/bezpecny-byt-pro-seniora/",
 "/sobestacnost/"
];
const excludedIndexPaths=new Set([
 "/choditka-pro-seniory/",
 "/choditko-do-bytu-pro-seniory/",
 "/co-zmerit-pred-vyberem-choditka/",
 "/sprchovaci-zidle-pro-seniory/"
]);
const indexEvidence=()=>{
 const pages=indexPaths.map(path=>excludedIndexPaths.has(path)?{
   path,status:"excluded",verdict:"NEUTRAL",coverage:"discovered_not_indexed",
   robots:"UNKNOWN",indexing:"UNKNOWN",pageFetch:"UNKNOWN",
   googleCanonical:"unknown",userCanonical:"unknown",lastCrawlDate:null,
   sitemapReported:true,reviewPriority:"coverage_review"
 }:{
   path,status:"indexed",verdict:"PASS",coverage:"submitted_indexed",
   robots:"ALLOWED",indexing:"INDEXING_ALLOWED",pageFetch:"SUCCESSFUL",
   googleCanonical:"matches",userCanonical:"matches",lastCrawlDate:"2026-10-07",
   sitemapReported:true,reviewPriority:"monitor"
 });
 return {
   status:"google_indexed_version_only",
   source:"GSC URL Inspection API — indexed-version snapshot, NOT live URL test",
   pages,inspected:15,indexed:11,excluded:4,error:0,unknown:0,
   limitations:["UNTRUSTED_RAW_INDEX_DATA"],
   reviewCandidates:[],externalBusinessWrites:0
 };
};
test("Google indexed-version summary preserves 11/15 and four not-yet-crawled URLs",()=>{
 const snapshot=genuineShape();
 snapshot.indexInspectionEvidence=indexEvidence();
 const report=reportFromSanitizedSnapshot(snapshot);
 assert.match(report,/15 pevně sledovaných URL:\*\* 11 indexovaných/);
 assert.match(report,/4 nyní nezařazené/);
 assert.match(report,/\/choditka-pro-seniory\/ \| Mimo index/);
 assert.match(report,/\/co-zmerit-pred-vyberem-choditka\/ \| Mimo index/);
 assert.match(report,/Objeveno, zatím bez doloženého crawl/);
 assert.match(report,/nikoli právě načtený WordPress/);
 assert.doesNotMatch(report,/UNTRUSTED_RAW_INDEX_DATA/);
 assert.doesNotMatch(report,/Google stránku blokuje noindex|automaticky přesměrovat/);
 assert.ok(report.indexOf("## Indexace Google")<report.indexOf("## 1b. Všechny doložené hlavní URL"),
   "owner short summary sees indexation evidence before long SEO table");
});
test("bad or partial indexed-version evidence fails closed, never leaks unknown paths",()=>{
 const corrupt=[
  d=>{d.indexed=12;},
  d=>{d.pages.pop();},
  d=>{d.status="live-index-test";},
  d=>{d.source="unverified";},
  d=>{d.pages[0].path="/private-medical-SECRET/";},
  d=>{d.pages[4].coverage="SECRET_UNTRUSTED_REASON";},
  d=>{d.pages[4].lastCrawlDate="unvalidated_timestamp";},
  d=>{d.pages[4].verdict="PASS";},
  d=>{d.pages[4].rawUrl="https://private-medical-SECRET.example";},
  d=>{d.pages[1].sitemapReported="not known";},
  d=>{d.pages[4].robots="RAW_ROBOTS_SECRET";},
  d=>{d.pages[4].reviewPriority="DELETE_ALL_NOT_INDEXED";},
  d=>{d.pages[4].status="indexed";},
  d=>{d.pages[4].googleCanonical="SECRET_CANONICAL_URL";},
 ];
 for(const edit of corrupt){
  const snapshot=genuineShape();snapshot.indexInspectionEvidence=indexEvidence();
  edit(snapshot.indexInspectionEvidence);
  const report=reportFromSanitizedSnapshot(snapshot);
  assert.match(report,/UNKNOWN: chybí ověřený úplný výsledek 15 URL/);
  assert.doesNotMatch(report,/private-medical-SECRET|SECRET_UNTRUSTED_REASON|DELETE_ALL_NOT_INDEXED|SECRET_CANONICAL_URL|RAW_ROBOTS_SECRET/);
  assert.match(report,/choditko-na-pojistovnu/,"trusted performance rows remain available");
 }
 assert.match(reportFromSanitizedSnapshot(genuineShape()),
   /UNKNOWN: chybí ověřený úplný výsledek 15 URL/);
});
test("index review does not confuse GSC first crawl with organic impressions",()=>{
 const snapshot=genuineShape();
 snapshot.indexInspectionEvidence=indexEvidence();
 // One indexed page with no performance row, and one excluded page with
 // performance signals, remain valid independent dimensions.
 snapshot.trackedPages[0].path="/choditka-pro-seniory/";
 const report=reportFromSanitizedSnapshot(snapshot);
 assert.match(report,/\/choditka-pro-seniory\/ \| Mimo index/);
 assert.match(report,/60/);
 assert.doesNotMatch(report,/všechny stránky mají nulové zobrazení/);
});
