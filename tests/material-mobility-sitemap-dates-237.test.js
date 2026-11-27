import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {SOURCE_DATES,PREDEPLOY_236_MATERIAL_DATES,assertMaterialLastmod}
  from "../scripts/audit-205-postdeploy-seo.mjs";
import {assertMaterialWebpageSchema}
  from "../scripts/audit-live-schema-material-dates-216.mjs";

// Only these PRs materially changed the page's first-screen explanation or
// decision flow. A layout-only release must not become a freshness stamp.
const evidenced=Object.freeze([
  {path:"/choditko-na-pojistovnu/",date:"2026-11-27",pr:941},
  {path:"/co-zmerit-pred-vyberem-choditka/",date:"2026-11-16",pr:812},
  {path:"/choditka-pro-seniory/",date:"2026-11-17",pr:814}
]);
const edits=JSON.parse(readFileSync(new URL("../config/gsc-material-edits.json",import.meta.url),"utf8"));

function xmlFor(dates){
  return "<urlset>"+Object.entries(dates).map(([path,date])=>
    "<url><loc>https://zaprazi.cz"+path+"</loc><lastmod>"+date+
      "T00:00:00+00:00</lastmod></url>").join("")+"</urlset>";
}
function schemaFor(path,modified){
  const url="https://zaprazi.cz"+path;
  const graph=JSON.stringify({"@graph":[{"@type":"WebPage","@id":url,url,
    dateModified:modified+"T00:00:00+00:00",
    datePublished:"2026-10-06T20:35:01+00:00"}]});
  return '<head><meta name="zaprazi-release" content="0.8.237">'+
    '<meta name="zaprazi-integrity" content="ok">'+
    '<link rel="canonical" href="'+url+'">'+
    '<script type="application/ld+json" class="yoast-schema-graph">'+graph+
    '</script></head>';
}

test("three evidence-backed Mobility edit dates match the source of live Yoast metadata",()=>{
  assert.equal(edits.schemaVersion,1);
  for(const {path,date,pr} of evidenced){
    const records=edits.changes.filter(entry=>entry.path===path);
    assert.equal(records.length,1,"Exactly one material edit record: "+path);
    assert.equal(records[0].mergedDate,date);
    assert.equal(records[0].pullRequest,"https://github.com/Rastty/zaprazi-2/pull/"+pr);
    assert.equal(SOURCE_DATES[path],date,"Yoast date drift: "+path);
    assert.ok(PREDEPLOY_236_MATERIAL_DATES[path]<date,
      "Predeploy must represent the observed old release, not this candidate");
  }
  assert.equal(SOURCE_DATES["/senior-nemuze-vstat-z-postele/"],"2026-11-09",
    "A layout-only revision must not receive a speculative metadata bump");
});

test("old live 0.8.236 sitemap passes predecessor checks but fails new release dates",()=>{
  const old=xmlFor(PREDEPLOY_236_MATERIAL_DATES);
  assert.equal(assertMaterialLastmod(old,"2026-11-19",PREDEPLOY_236_MATERIAL_DATES).lastmodsVerified,12);
  assert.throws(()=>assertMaterialLastmod(old,"2026-11-19",SOURCE_DATES),
    /SITEMAP_LASTMOD_OUTSIDE_MATERIAL_WINDOW/);
  assert.equal(assertMaterialLastmod(xmlFor(SOURCE_DATES),"2026-11-27",SOURCE_DATES).lastmodsVerified,12);
});

test("each corrected page has a matching bounded future-release Yoast WebPage date",()=>{
  for(const {path,date} of evidenced){
    const html=schemaFor(path,date);
    assert.deepEqual(assertMaterialWebpageSchema(html,path,date,"0.8.237",
      new Date("2026-11-27T12:00:00Z")),{path,verified:true});
    const stale=PREDEPLOY_236_MATERIAL_DATES[path];
    assert.throws(()=>assertMaterialWebpageSchema(schemaFor(path,stale),path,date,"0.8.237",
      new Date("2026-11-27T12:00:00Z")),/SCHEMA_MODIFIED_MATERIAL_DATE_NOT_VERIFIED/);
  }
});
