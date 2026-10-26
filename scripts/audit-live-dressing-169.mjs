/** Live read-only acceptance for deployed Zápraží 0.8.169 dressing guide. */
import assert from "node:assert/strict";
import { auditPublicSitemap } from "./audit-public-sitemap.mjs";
const site="https://zaprazi.cz";
const version="0.8.169";
async function get(path,asJson=false) {
 const response=await fetch(site+path,{signal:AbortSignal.timeout(30000),
   headers:{Accept:asJson?"application/json":"text/html","Cache-Control":"no-cache"}});
 assert.equal(response.status,200,"HTTP "+response.status+": "+path);
 return asJson?response.json():response.text();
}
function attr(tag,name) {
 return tag.match(new RegExp("\\b"+name+"=[\"']([^\"']*)[\"']","i"))?.[1]??"";
}
function meta(html,name) {
 const tag=(html.match(/<meta\b[^>]*>/gi)||[]).find(x=>attr(x,"name")===name);
 return attr(tag??"", "content");
}
function section(html,id) {
 const index=html.indexOf('id="'+id+'"');
 assert.ok(index>=0,"Missing "+id);
 const start=html.lastIndexOf("<section",index);
 const end=html.indexOf("</section>",index);
 assert.ok(start>=0 && end>index,"Malformed "+id);
 return html.slice(start,end);
}
function internalHref(html,sourcePath,targetPath,anchor) {
 return [...html.matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1/gi)].some(match=>{
  try {const u=new URL(match[2].replaceAll("&amp;","&"),site+sourcePath);
   return u.origin===site&&u.pathname===targetPath&&u.hash==="#"+anchor;
  } catch {return false}
 });
}
const readiness=await get("/wp-json/zaprazi/v1/affiliate-readiness",true);
assert.equal(readiness.release,version,"Incorrect live release");
assert.equal(readiness.integrity,"ok","Partial deployment");
assert.equal(readiness.configured_total,25);
assert.equal(readiness.slot_total,25);
const path="/oblekani-ponozek-a-kalhot-bez-ohybani/";
const html=await get(path),main=html.slice(html.indexOf("<main"));
assert.ok(main.length>12000,"Article render unusually short");
assert.equal(meta(html,"zaprazi-release"),version);
assert.equal(meta(html,"zaprazi-integrity"),"ok");
assert.equal((main.match(/<h1\b/gi)||[]).length,1);
assert.match(main,/Jak si obléct ponožky a kalhoty bez ohýbání/);
assert.ok(!/\bnoindex\b/i.test(meta(html,"robots")));
const desc=meta(html,"description");
assert.ok(desc.length>=85 && desc.length<=200,"Meta description missing or too long");
const canonical=(html.match(/<link\b[^>]*>/gi)||[]).find(x=>attr(x,"rel")==="canonical");
assert.equal(attr(canonical??"","href"),site+path,"Incorrect canonical");
for(const [id,count] of [["bezpecnost-oblekani",4],["podle-problemu-oblekani",4],["srovnani-pomucek-oblekani",4]]) {
 assert.equal((section(html,id).match(/class="zp-decision-card"/g)||[]).length,count,"Wrong card count "+id);
}
for(const [id,count] of [["postup-ponozky",4],["postup-kalhoty",5],["pred-vyberem-oblekani",7]]) {
 assert.equal((section(html,id).match(/<li>/g)||[]).length,count,"Wrong steps "+id);
}
assert.equal((section(html,"faq-oblekani").match(/<details>/g)||[]).length,6);
for(const source of ["/sobestacnost/","/obuv-pro-seniory/","/navrat-z-nemocnice/","/otazky-pred-propustenim-z-nemocnice/"]) {
 assert.ok(internalHref(await get(source),source,path,"podle-problemu-oblekani"),"Missing inbound from "+source);
}
const sitemap=await auditPublicSitemap();
assert.ok(sitemap.required_decision_paths_present.includes(path)||sitemap.staged_decision_paths_present.includes(path),
  "Guide absent from public page sitemap");
console.log("PASS 0.8.169 live, integrity, 25 configured slots, dressing FAQ, 4 inbound routes, sitemap");
