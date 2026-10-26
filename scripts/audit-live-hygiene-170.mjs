/** Read-only acceptance of deployed Zápraží 0.8.170 bedside hygiene guide. */
import assert from "node:assert/strict";
import {auditPublicSitemap} from "./audit-public-sitemap.mjs";
const site="https://zaprazi.cz",version="0.8.170";
async function get(path,json=false) {
 const res=await fetch(site+path,{signal:AbortSignal.timeout(30000),headers:{Accept:json?"application/json":"text/html","Cache-Control":"no-cache"}});
 assert.equal(res.status,200,"HTTP "+res.status+" "+path);
 return json?res.json():res.text();
}
function attr(tag,name){return tag.match(new RegExp("\\b"+name+"=[\"']([^\"']*)[\"']","i"))?.[1]??""}
function meta(html,name){const tag=(html.match(/<meta\b[^>]*>/gi)||[]).find(x=>attr(x,"name")===name);return attr(tag??"","content")}
function section(html,id){const i=html.indexOf('id="'+id+'"');assert.ok(i>=0,"Missing "+id);const a=html.lastIndexOf("<section",i),b=html.indexOf("</section>",i);assert.ok(a>=0&&b>i,"Missing section closing tag "+id);return html.slice(a,b)}
function linksTo(html,source,pathname,hash){
 return [...html.matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1/gi)].some(m=>{
  try {const u=new URL(m[2].replaceAll("&amp;","&"),site+source);return u.origin===site&&u.pathname===pathname&&u.hash==="#"+hash;}catch{return false}
 });
}
const ready=await get("/wp-json/zaprazi/v1/affiliate-readiness",true);
assert.equal(ready.release,version,"Incorrect WordPress release");
assert.equal(ready.integrity,"ok","Partial release");
assert.equal(ready.configured_total,25);
assert.equal(ready.slot_total,25);
const path="/hygiena-leziciho-seniora-doma/",html=await get(path),main=html.slice(html.indexOf("<main"));
assert.ok(main.length>12000,"Rendered guide too short");
assert.equal(meta(html,"zaprazi-release"),version);
assert.equal(meta(html,"zaprazi-integrity"),"ok");
assert.equal((main.match(/<h1\b/gi)||[]).length,1);
assert.match(main,/Jak zvládnout hygienu ležícího seniora doma/);
assert.ok(!/\bnoindex\b/i.test(meta(html,"robots")));
const desc=meta(html,"description");
assert.ok(desc.length>=85&&desc.length<=200,"Incorrect SEO description");
const canon=(html.match(/<link\b[^>]*>/gi)||[]).find(x=>attr(x,"rel")==="canonical");
assert.equal(attr(canon??"","href"),site+path,"Wrong HTTPS canonical");
for(const [id,count] of [["bezpecnost-hygiena-na-luzku",4],["vyber-hygieny-na-luzku",4],["intimni-hygiena-na-luzku",3],["srovnani-hygienickych-pomucek",4]])
 assert.equal((section(main,id).match(/class="zp-decision-card"/g)||[]).length,count,id);
assert.equal((section(main,"plan-hygieny-na-luzku").match(/<li>/g)||[]).length,7);
assert.equal((section(main,"checklist-hygiena-na-luzku").match(/<li>/g)||[]).length,8);
assert.equal((section(main,"faq-hygiena-na-luzku").match(/<details>/g)||[]).length,6);
for(const source of ["/myti-vlasu-na-luzku/","/antidekubitni-matrace-na-polohovaci-postel/","/polohovaci-postel/","/navrat-z-nemocnice/","/koupelna-a-wc/"])
 assert.ok(linksTo(await get(source),source,path,"vyber-hygieny-na-luzku"),"Missing inbound "+source);
const map=await auditPublicSitemap();
assert.ok(map.staged_decision_paths_present.includes(path)||map.required_decision_paths_present.includes(path),"Hygiene URL missing in live sitemap");
console.log("PASS 0.8.170 live, integrity, SEO, 7-step hygiene, 8-checklist, 6 FAQ, 5 inbound links and sitemap");
