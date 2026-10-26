/** Read-only acceptance of actually deployed Zápraží 0.8.171 car-access guide. */
import assert from "node:assert/strict";
import { auditPublicSitemap } from "./audit-public-sitemap.mjs";
const site="https://zaprazi.cz",version="0.8.171";
async function get(path,json=false) {
 const res=await fetch(site+path,{signal:AbortSignal.timeout(30000),headers:{Accept:json?"application/json":"text/html","Cache-Control":"no-cache"}});
 assert.equal(res.status,200,"Unexpected HTTP "+res.status+" at "+path);
 return json?res.json():res.text();
}
function attr(tag,name){return tag.match(new RegExp("\\b"+name+"=[\"']([^\"']*)[\"']","i"))?.[1]??""}
function meta(html,name){const tag=(html.match(/<meta\b[^>]*>/gi)||[]).find(x=>attr(x,"name")===name);return attr(tag??"","content")}
function section(html,id){const i=html.indexOf('id="'+id+'"');assert.ok(i>=0,"Missing "+id);const a=html.lastIndexOf("<section",i),b=html.indexOf("</section>",i);assert.ok(a>=0&&b>i,"Missing closing section "+id);return html.slice(a,b)}
function linksTo(html,from,path,hash){
 return [...html.matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1/gi)].some(m=>{
  try{const u=new URL(m[2].replaceAll("&amp;","&"),site+from);return u.origin===site&&u.pathname===path&&u.hash==="#"+hash;}
  catch{return false}
 });
}
const ready=await get("/wp-json/zaprazi/v1/affiliate-readiness",true);
assert.equal(ready.release,version);
assert.equal(ready.integrity,"ok","Partial theme deploy");
assert.equal(ready.configured_total,25);
assert.equal(ready.slot_total,25);
const path="/nastupovani-seniora-do-auta/",html=await get(path),main=html.slice(html.indexOf("<main"));
assert.ok(main.length>12000,"Rendered guide suspiciously short");
assert.equal(meta(html,"zaprazi-release"),version);
assert.equal(meta(html,"zaprazi-integrity"),"ok");
assert.equal((main.match(/<h1\b/gi)||[]).length,1);
assert.match(main,/Jak pomoci seniorovi nastoupit a vystoupit z auta/);
assert.ok(!/\bnoindex\b/i.test(meta(html,"robots")));
const desc=meta(html,"description");
assert.ok(desc.length>=85&&desc.length<=200,"Meta description missing or too long");
const canonical=(html.match(/<link\b[^>]*>/gi)||[]).find(x=>attr(x,"rel")==="canonical");
assert.equal(attr(canonical??"","href"),site+path);
for(const [id,count] of [["bezpecnost-nastupovani-auto",4],["situace-nastupovani-auto",4],["srovnani-pomucek-auto",4]])
 assert.equal((section(main,id).match(/class="zp-decision-card"/g)||[]).length,count,id);
assert.equal((section(main,"bezpecny-postup-auto").match(/<li>/g)||[]).length,7);
assert.equal((section(main,"sedm-mereni-auto").match(/<li>/g)||[]).length,7);
assert.equal((section(main,"faq-nastupovani-auto").match(/<details>/g)||[]).length,6);
for(const source of ["/navrat-z-nemocnice/","/invalidni-vozik-do-auta/","/vstavani-z-kresla-pro-seniora/","/otazky-pred-propustenim-z-nemocnice/"])
 assert.ok(linksTo(await get(source),source,path,"situace-nastupovani-auto"),"Missing inbound link from "+source);
const map=await auditPublicSitemap();
assert.ok(map.staged_decision_paths_present.includes(path)||map.required_decision_paths_present.includes(path),"Car access URL not in live sitemap");
console.log("PASS 0.8.171: live release, integrity, 25/25 slots, guide SEO, 4+4+4 cards, 7+7 steps, 6 FAQ, 4 inbound links, sitemap");
