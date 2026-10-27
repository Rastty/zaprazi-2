/** Read-only acceptance of deployed Zápraží 0.8.176 and contextually connected topical hubs. */
import assert from "node:assert/strict";
import { auditPublicSitemap } from "./audit-public-sitemap.mjs";
import { liveVerifiedProblemPaths } from "./lib/live-verified-problem-paths.mjs";

const origin="https://zaprazi.cz",release="0.8.176";
const linksByHub={
  "/kompenzacni-pomucky-pro-seniory/":[
    ["/senior-odmita-choditko/","proc-senior-odmita"],
    ["/senior-odmita-koupani/","duvody-odmitani-koupani"],
    ["/senior-malo-pije/","varovne-priznaky-malo-pije"],
    ["/senior-doma-sam-sos-pomoc/","vyber-sos-pomoci"]
  ],
  "/navrat-z-nemocnice/":[
    ["/senior-odmita-choditko/","sedm-kroku-bez-natlaku"],
    ["/senior-odmita-koupani/","vyber-hygieny-bez-sprchy"],
    ["/senior-malo-pije/","varovne-priznaky-malo-pije"],
    ["/senior-doma-sam-sos-pomoc/","jak-funguje-pomoc-sos"]
  ],
  "/bezpecny-byt-pro-seniora/":[
    ["/senior-odmita-choditko/","proc-senior-odmita"],
    ["/senior-odmita-koupani/","duvody-odmitani-koupani"],
    ["/senior-malo-pije/","proc-senior-malo-pije"]
  ]
};
async function load(path,json=false){
 const response=await fetch(origin+path,{headers:{
   Accept:json?"application/json":"text/html","Cache-Control":"no-cache"
 },redirect:"follow",signal:AbortSignal.timeout(26000)});
 assert.equal(response.status,200,"HTTP "+response.status+" "+path);
 assert.equal(new URL(response.url).origin,origin,"Unexpected host "+response.url);
 return json?response.json():response.text();
}
const attr=(tag,key)=>tag.match(new RegExp("\\b"+key+"=[\"']([^\"']*)[\"']","i"))?.[1]??"";
const meta=(html,name)=>attr((html.match(/<meta\b[^>]*>/gi)||[])
  .find(t=>attr(t,"name")===name)||"","content");
const canonical=(html)=>attr((html.match(/<link\b[^>]*>/gi)||[])
  .find(t=>attr(t,"rel")==="canonical")||"","href");
function hrefs(html,from){
 return [...html.matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1/gi)]
   .map(m=>{try{return new URL(m[2].replaceAll("&amp;","&"),origin+from)}catch{return null}})
   .filter(Boolean);
}
const ready=await load("/wp-json/zaprazi/v1/affiliate-readiness",true);
assert.equal(ready.release,release,"Wrong live release (is Deployer Pull + Deploy complete?)");
assert.equal(ready.integrity,"ok","Partial release file integrity");
assert.equal(ready.slot_total,25);
assert.equal(ready.configured_total,25);
const home=await load("/");
assert.equal(meta(home,"zaprazi-release"),release,"Homepage release mismatch");
let contextual=0;
const discovered=new Set();
for(const [path,expected] of Object.entries(linksByHub)){
 const html=await load(path);
 assert.equal(meta(html,"zaprazi-release"),release,path+" release mismatch");
 assert.equal(meta(html,"zaprazi-integrity"),"ok",path+" integrity mismatch");
 assert.equal(canonical(html),origin+path,path+" HTTPS canonical mismatch");
 assert.ok(!/noindex/i.test(meta(html,"robots")),path+" is noindex");
 assert.ok(meta(html,"description").length>=70,path+" SEO description missing");
 const main=html.slice(html.indexOf("<main"));
 assert.equal((main.match(/<h1\b/gi)||[]).length,1,path+" wrong H1 count");
 for(const [destination,anchor] of expected){
   const match=hrefs(main,path).some(u=>u.origin===origin&&u.pathname===destination&&u.hash==="#"+anchor);
   assert.ok(match,path+" lacks relevant link to "+destination+"#"+anchor);
   discovered.add(destination);
   contextual++;
 }
}
assert.equal(contextual,11,"Unexpected navigation count");
assert.deepEqual([...discovered].sort(),[...liveVerifiedProblemPaths].sort(),"Hub links differ from audited guides");
for(const path of discovered){
 const html=await load(path);
 assert.equal(canonical(html),origin+path,path+" canonical mismatch");
 assert.ok(!/noindex/i.test(meta(html,"robots")),path+" blocked from indexing");
 assert.equal((html.slice(html.indexOf("<main")).match(/<h1\b/gi)||[]).length,1,path+" must have one H1");
 const ids=new Set([...html.matchAll(/\bid=(["'])([^"']+)\1/g)].map(x=>x[2]));
 for(const [hub,links] of Object.entries(linksByHub)){
   for(const [dest,anchor] of links.filter(([p])=>p===path))
     assert.ok(ids.has(anchor),hub+" link points to missing anchor "+dest+"#"+anchor);
 }
}
const map=await auditPublicSitemap();
assert.ok(!map.required_decision_paths_missing.length,"Core URLs missing from sitemap: "+map.required_decision_paths_missing.join(", "));
for(const path of discovered)
 assert.ok(map.staged_decision_paths_present.includes(path)||map.required_decision_paths_present.includes(path),"Unlisted guide: "+path);
const report={
 verdict:"PASS",release,integrity:ready.integrity,affiliate_configured:ready.configured_total,
 topical_hubs:Object.keys(linksByHub).length,contextual_inbound:contextual,
 live_guides:discovered.size,seo:"canonical/description/robots/H1/anchors/sitemap verified",
 indexation_from_google:"unknown",gsc_clicks:"not_available"
};
console.log("LIVE_176_ACCEPTANCE "+JSON.stringify(report));
