import test from "node:test";
import assert from "node:assert/strict";
import {csvRecords,parseGscCsv,analyzeGsc,renderGscReport} from "../scripts/lib/gsc-prioritization.mjs";
import {readFileSync} from "node:fs";
import {requiredDecisionPaths} from "../scripts/audit-public-sitemap.mjs";
const fixture=(lines)=>lines.join("\r\n")+"\r\n";
const pageRows=fixture([
  "\uFEFFTop pages,Clicks,Impressions,CTR,Position",
  "https://zaprazi.cz/choditka-pro-seniory/,25,200,12.5%,8.6",
  "https://zaprazi.cz/pujceni-choditka/,0,450,0%,12.1",
  "https://zaprazi.cz/solarni-panely/,12,210,5.7%,4.2",
  "https://zaprazi.cz/what/?gclid=x,2,23,8.7%,10",
  "https://example.org/unrelated/,999,1000,90%,1"
]);
const queryRows=fixture([
  "Top queries,Clicks,Impressions,CTR,Position",
  "\"chodítko, půjčení\",3,100,3%,10.5",
  "polohovací postel,2,50,4%,19.4"
]);
test("UTF-8 BOM, quoted CSV fields, CRLF and GSC pages + queries are parsed by dimension",()=>{
 const rec=csvRecords(queryRows);
 assert.equal(rec[1][0],"chodítko, půjčení");
 const pages=parseGscCsv(pageRows,"page");
 assert.equal(pages.length,5);
 assert.deepEqual(pages.map(p=>p.path),[
  "/choditka-pro-seniory/","/pujceni-choditka/","/solarni-panely/",null,null
 ]);
 const q=parseGscCsv(queryRows,"query");
 assert.equal(q[0].query,"chodítko, půjčení");
 assert.equal(q[0].impressions,100);
});
test("noncanonical GSC URL variants never inflate canonical landing evidence",()=>{
 const variants=[
  "https://zaprazi.cz/choditka-pro-seniory/",
  "http://zaprazi.cz/choditka-pro-seniory/",
  "https://zaprazi.cz/choditka-pro-seniory",
  "https://zaprazi.cz//choditka-pro-seniory/",
  "https://www.zaprazi.cz/choditka-pro-seniory/",
  "https://zaprazi.cz/choditka-pro-seniory/?src=campaign",
  "https://zaprazi.cz/choditka-pro-seniory/#poradce",
  "https://zaprazi.cz:8443/choditka-pro-seniory/",
  "https://zaprazi.cz/choditka%2Fpro-seniory/",
  "https://zaprazi.cz:443/choditka-pro-seniory/",
  "https://ZAPRAZI.cz/choditka-pro-seniory/",
  "HTTPS://zaprazi.cz/choditka-pro-seniory/",
  "https://zaprazi.cz/old/../choditka-pro-seniory/",
  "https://zaprazi.cz/%2e/choditka-pro-seniory/",
  "https://zaprazi.cz/choditka-pro-seniory/?",
  "https://zaprazi.cz/choditka-pro-seniory/#"
 ];
 const csv=fixture([
  "Top pages,Clicks,Impressions,CTR,Position",
  ...variants.map((url,i)=>url+","+(i+1)+",100,1%,8")
 ]);
 const rows=parseGscCsv(csv,"page");
 assert.deepEqual(rows.map(row=>row.path),[
  "/choditka-pro-seniory/",...Array(variants.length-1).fill(null)
 ]);
 const result=analyzeGsc({pages:rows,periodStart:"2026-10-01",periodEnd:"2026-10-28"});
 assert.equal(result.core.find(row=>row.path==="/choditka-pro-seniory/").clicks,1);
 assert.equal(result.skipped_external_or_parameterized_rows,variants.length-1);
 const report=renderGscReport(result);
 assert.match(report,/nekanonických URL/);
 assert.doesNotMatch(report,/src=campaign/);
});

test("Czech semicolon export, Czech decimal comma, grouped counts and UTF-8 are supported",()=>{
 const csv="Nejlepší stránky;Kliknutí;Zobrazení;CTR;Pozice\n"+
  "https://zaprazi.cz/rollator-pro-seniory/;1;1 234;0,08%;12,5\n";
 const [r]=parseGscCsv(csv,"page");
 assert.equal(r.impressions,1234);
 assert.equal(r.position,12.5);
 assert.equal(r.clicks,1);
});
test("Triages core pages separately from unknown legacy without merging property queries",()=>{
 const pages=parseGscCsv(pageRows,"page");
 const queries=parseGscCsv(queryRows,"query");
 const report=analyzeGsc({pages,queries,periodStart:"2026-09-01",periodEnd:"2026-09-28"});
 assert.equal(report.core.length,2);
 assert.equal(report.other.length,1);
 assert.equal(report.skipped_external_or_parameterized_rows,2);
 assert.equal(report.core[0].path,"/pujceni-choditka/");
 assert.equal(report.queries[0].query,"chodítko, půjčení");
 assert.equal(report.missing_core_from_export.includes("/navrat-z-nemocnice/"),true);
 assert.equal(report.core[0].clicks,0);
 const markdown=renderGscReport(report);
 assert.match(markdown,/unknown/, "Absent pages stay unknown, not zero");
 assert.match(markdown,/Jiné a historické stránky/);
 assert.match(markdown,/Samostatný dotaz, bez přiřazené URL/);
 assert.match(markdown,/POUZE návrhy ke kontrole/);
 assert.doesNotMatch(markdown,/redirect na homepage/);
});
test("Impossible GSC click-to-impression ratios fail closed for pages and queries",()=>{
 for(const kind of ["page","query"]){
   const dimension=kind==="page"?"Top pages":"Top queries";
   const value=kind==="page"?"https://zaprazi.cz/choditka-pro-seniory/":"chodítko pro seniora";
   const csv=(clicks,impressions)=>fixture([
     dimension+",Clicks,Impressions,CTR,Position",
     value+","+clicks+","+impressions+",0%,8"
   ]);
   assert.throws(()=>parseGscCsv(csv(2,1),kind),/clicks exceed impressions/);
   assert.throws(()=>parseGscCsv(csv(1,0),kind),/clicks exceed impressions/);
   assert.equal(parseGscCsv(csv(1,1),kind)[0].ctr,1);
   assert.equal(parseGscCsv(csv(0,0),kind)[0].ctr,null);
 }
});
test("GSC query is never assigned to a specific page by row number",()=>{
 const x=analyzeGsc({pages:parseGscCsv(pageRows,"page"),queries:parseGscCsv(queryRows,"query"),
  periodStart:"2026-09-01",periodEnd:"2026-09-28"});
 assert.equal(x.core[0].query,undefined);
 assert.equal(x.queries[0].path,undefined);
});
test("Untrusted CSV cannot inject invalid dates, foreign URLs or duplicate rows",()=>{
 assert.throws(()=>csvRecords('A,B\n"a",b\n"unclosed,b'),/Unterminated/);
 assert.throws(()=>csvRecords("A,B\nx,y,z\n"),/Inconsistent/);
 assert.throws(()=>parseGscCsv(fixture([
  "Top pages,Clicks,Impressions,CTR,Position",
  "https://zaprazi.cz/,2,50,4%,1",
  "https://zaprazi.cz/,1,40,2.5%,2"
 ]),"page"),/Duplicate/);
 assert.throws(()=>parseGscCsv(fixture([
  "Top pages,Clicks,Impressions,CTR,Position",
  "https://zaprazi.cz/,-10,50,4%,1"
 ]),"page"),/Invalid/);
 assert.throws(()=>analyzeGsc({pages:parseGscCsv(pageRows,"page"),
   periodStart:"2026-02-30",periodEnd:"2026-04-01"}),/valid/);
 assert.throws(()=>analyzeGsc({pages:parseGscCsv(pageRows,"page"),
   periodStart:"2026-09-30",periodEnd:"2026-09-01"}),/valid/);
});
test("Markdown user query cannot render HTML or table extra columns",()=>{
 const q=[{query:"<script>alert(1)</script>|other",clicks:1,impressions:20,ctr:0.05,position:10}];
 const report=analyzeGsc({pages:parseGscCsv(pageRows,"page"),queries:q,
   periodStart:"2026-09-01",periodEnd:"2026-09-28"});
 const output=renderGscReport(report);
 assert.doesNotMatch(output,/<script>/);
 assert.match(output,/&lt;script&gt;/);
 assert.match(output,/\\\|other/);
});
test("No network, no filesystem writes or made-up Search Console rows in offline report",()=>{
 const src=readFileSync(new URL("../scripts/lib/gsc-prioritization.mjs",import.meta.url),"utf8");
 const cli=readFileSync(new URL("../scripts/gsc-opportunity-report.mjs",import.meta.url),"utf8");
 for(const pattern of [/\bfetch\s*\(/,/\bhttps\.request\b/,/\bwriteFile\b/,/writeFileSync/,/axios|XMLHttpRequest|sendBeacon/,/deletePost|wp_update_post|noindex\\s*=\\s*true/])
   assert.doesNotMatch(src+"\n"+cli,pattern);
});

test("GSC report includes every published core route, not only the historical first 27",()=>{
 const paths=["/",...requiredDecisionPaths];
 assert.equal(paths.length,53,"All 52 live decision routes plus homepage are monitored");
 const csv=fixture([
   "Top pages,Clicks,Impressions,CTR,Position",
   ...paths.map(path=>"https://zaprazi.cz"+path+",0,25,0%,12")
 ]);
 const result=analyzeGsc({pages:parseGscCsv(csv,"page"),
   periodStart:"2026-10-01",periodEnd:"2026-10-28"});
 assert.equal(result.monitored_core_url_count,53);
 assert.equal(result.exported_core_url_count,53);
 assert.deepEqual(result.missing_core_from_export,[]);
 const markdown=renderGscReport(result);
 assert.match(markdown,/53 z 53 schválených hlavních URL/);
 for(const path of paths){
   assert.ok(markdown.includes("| "+path+" |"),"Missing published landing from GSC report: "+path);
 }
 assert.equal((markdown.match(/\| https?:\/\/zaprazi\.cz/g)||[]).length,0,
   "Only safe canonical paths, not raw URLs, may be printed");
});



test("early GSC evidence gets a separate exploratory review queue, not a false CTR claim",()=>{
 const page=(path,impressions,clicks,position)=>({
   path,impressions,clicks,position,ctr:impressions?clicks/impressions:null
 });
 const r=analyzeGsc({
   pages:[
     page("/otazky-pred-propustenim-z-nemocnice/",13,0,6.69),
     page("/senior-nemuze-vstat-z-postele/",19,0,5.79),
     page("/pujceni-choditka/",10,0,12),
     page("/rollator-pro-seniory/",20,0,6),
     page("/choditko-na-pojistovnu/",9,0,5),
     page("/choditka-pro-seniory/",18,1,7),
     page("/co-zmerit-pred-vyberem-choditka/",18,0,null),
     page("/choditko-do-bytu-pro-seniory/",17,0,3.99),
     page("/sprchovaci-zidle-pro-seniory/",11,0,12.01),
     page("/unlisted-secret-health-answer/",17,0,7)
   ],periodStart:"2026-10-11",periodEnd:"2026-11-07"
 });
 const output=renderGscReport(r,{source:"prometheus_final_28d"});
 const section=output.split("## 1a. Rané signály")[1]?.split("## 2.")[0];
 assert.ok(section,"The early signal section must be visible");
 assert.ok(section.indexOf("/senior-nemuze-vstat-z-postele/")<
   section.indexOf("/otazky-pred-propustenim-z-nemocnice/"),
   "Highest genuine exposure first, never predicted score");
 assert.match(section,/\/pujceni-choditka\//);
 for(const path of ["/rollator-pro-seniory/","/choditko-na-pojistovnu/",
   "/choditka-pro-seniory/","/co-zmerit-pred-vyberem-choditka/",
   "/choditko-do-bytu-pro-seniory/","/sprchovaci-zidle-pro-seniory/",
   "/unlisted-secret-health-answer/"])
   assert.ok(!section.includes(path),"Unqualified or unknown URL must not leak: "+path);
 assert.match(section,/malý skutečný GSC vzorek/);
 assert.match(section,/ne prokázanou chybu CTR/);
 assert.match(section,/dotazy filtrované na tuto URL/);
 assert.ok(!section.includes("nejlepší CTR"));
 assert.ok(!section.includes("garantovaný"));
});
test("early GSC queue is empty without qualified observed page rows",()=>{
 const r=analyzeGsc({pages:[{
   path:"/pujceni-choditka/",impressions:2,clicks:0,position:8,ctr:0
 }],periodStart:"2026-10-11",periodEnd:"2026-11-07"});
 const output=renderGscReport(r,{source:"prometheus_final_28d"});
 const section=output.split("## 1a. Rané signály")[1]?.split("## 2.")[0];
 assert.match(section,/Zatím žádný doložený raný signál/);
 assert.doesNotMatch(section,/\/pujceni-choditka\//);
});
