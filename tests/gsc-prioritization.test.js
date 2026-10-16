import test from "node:test";
import assert from "node:assert/strict";
import {csvRecords,parseGscCsv,analyzeGsc,renderGscReport} from "../scripts/lib/gsc-prioritization.mjs";
import {readFileSync} from "node:fs";
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
