/** Read-only acceptance of deployed Zápraží 0.8.168 hair-washing problem guide. */
import assert from "node:assert/strict";
import { auditPublicSitemap } from "./audit-public-sitemap.mjs";
const base="https://zaprazi.cz";
async function load(path,json=false) {
 const response=await fetch(base+path,{signal:AbortSignal.timeout(25000),headers:{Accept:json?"application/json":"text/html","Cache-Control":"no-cache"}});
 assert.equal(response.status,200,"Unexpected HTTP "+response.status+" at "+path);
 return json?response.json():response.text();
}
function attr(tag,name) {const m=tag.match(new RegExp("\\b"+name+"=[\"']([^\"']*)[\"']","i"));return m?.[1]??""}
function meta(html,name) {const tag=(html.match(/<meta\b[^>]*>/gi)||[]).find(x=>attr(x,"name")===name);return tag?attr(tag,"content"):""}
function section(html,id){const idx=html.indexOf('id="'+id+'"');assert.ok(idx>=0,"Missing "+id);const start=html.lastIndexOf("<section",idx),end=html.indexOf("</section>",idx);assert.ok(start>=0&&end>idx);return html.slice(start,end)}
function hasLink(html,from,path,fragment){
 const links=[...html.matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1/gi)].map(m=>m[2]);
 return links.some(href=>{try{const url=new URL(href.replaceAll("&amp;","&"),base+from);return url.origin===base&&url.pathname===path&&url.hash==="#"+fragment}catch{return false}});
}
const r=await load("/wp-json/zaprazi/v1/affiliate-readiness",true);
assert.equal(r.release,"0.8.168");assert.equal(r.integrity,"ok");
assert.equal(r.configured_total,25);assert.equal(r.slot_total,25);
const path="/myti-vlasu-na-luzku/",html=await load(path);
assert.equal(meta(html,"zaprazi-release"),"0.8.168");
assert.equal(meta(html,"zaprazi-integrity"),"ok");
assert.equal((html.match(/<h1\b/gi)||[]).length,1);
assert.match(html,/Jak umýt vlasy ležícímu člověku doma/);
assert.ok(!/\bnoindex\b/i.test(meta(html,"robots")));
assert.ok(meta(html,"description").length>=90);
const canon=(html.match(/<link\b[^>]*>/gi)||[]).find(x=>attr(x,"rel")==="canonical");
assert.equal(attr(canon??"","href"),base+path);
for(const [id,expected] of [["bezpecnost-myti-vlasu",4],["vyber-myti-vlasu",4],["srovnani-pomucek-vlasy",3]]){
 assert.equal((section(html,id).match(/class="zp-decision-card"/g)||[]).length,expected);
}
for(const id of ["postup-myti-vlasu","kontrolni-seznam-vlasy"])
 assert.equal((section(html,id).match(/<li>/g)||[]).length,7);
assert.equal((section(html,"faq-myti-vlasu").match(/<details>/g)||[]).length,6);
for(const source of ["/navrat-z-nemocnice/","/koupelna-a-wc/","/polohovaci-postel/"]){
 assert.ok(hasLink(await load(source),source,path,"vyber-myti-vlasu"),"Missing live inbound "+source);
}
const map=await auditPublicSitemap();
assert.ok(map.staged_decision_paths_present.includes(path)||map.required_decision_paths_present.includes(path),"URL absent in page sitemap");
console.log("PASS 0.8.168: release integrity, live guide SEO, 7+7 steps, FAQ, 3 inbound routes and sitemap.");
