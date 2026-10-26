/** Read-only production acceptance of Zápraží 0.8.171 senior car entry article. */
import assert from "node:assert/strict";
import { auditPublicSitemap } from "./audit-public-sitemap.mjs";
const origin="https://zaprazi.cz",release="0.8.171";
async function load(path,asJson=false) {
 const response=await fetch(origin+path,{
  signal:AbortSignal.timeout(30000),
  headers:{Accept:asJson?"application/json":"text/html","Cache-Control":"no-cache"}
 });
 assert.equal(response.status,200,"Expected 200 at "+path+", got "+response.status);
 return asJson?response.json():response.text();
}
const attr=(tag,key)=>tag.match(new RegExp("\\b"+key+"=[\"']([^\"']*)[\"']","i"))?.[1]??"";
function meta(html,name){return attr((html.match(/<meta\b[^>]*>/gi)||[]).find(s=>attr(s,"name")===name)??"","content");}
function section(html,id){
 const i=html.indexOf('id="'+id+'"');
 assert.ok(i>=0,"Missing "+id);
 const a=html.lastIndexOf("<section",i),b=html.indexOf("</section>",i);
 assert.ok(a>=0&&b>i,"Malformed section "+id);
 return html.slice(a,b);
}
function linked(html,source,target,anchor){
 const hrefs=[...html.matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1/gi)].map(x=>x[2]);
 return hrefs.some(link=>{
  try {const url=new URL(link.replaceAll("&amp;","&"),origin+source);
   return url.origin===origin&&url.pathname===target&&url.hash==="#"+anchor;
  }catch{return false}
 });
}
const r=await load("/wp-json/zaprazi/v1/affiliate-readiness",true);
assert.equal(r.release,release,"Wrong WordPress deployment");
assert.equal(r.integrity,"ok","Incomplete protected release");
assert.equal(r.configured_total,25);assert.equal(r.slot_total,25);
const path="/nastupovani-seniora-do-auta/",html=await load(path);
assert.equal(meta(html,"zaprazi-release"),release);
assert.equal(meta(html,"zaprazi-integrity"),"ok");
const main=html.slice(html.indexOf("<main"));
assert.ok(main.length>=11000,"Article content unexpectedly short");
assert.equal((main.match(/<h1\b/gi)||[]).length,1);
assert.match(main,/Jak pomoci seniorovi nastoupit a vystoupit z auta/);
assert.ok(!/\bnoindex\b/i.test(meta(html,"robots")),"Article is noindex");
const description=meta(html,"description");
assert.ok(description.length>=85&&description.length<=210,"Missing/invalid meta description");
const canonical=(html.match(/<link\b[^>]*>/gi)||[]).find(s=>attr(s,"rel")==="canonical");
assert.equal(attr(canonical??"","href"),origin+path,"Wrong canonical");
for(const id of ["bezpecnost-nastupovani-auto","situace-nastupovani-auto","srovnani-pomucek-auto"])
 assert.equal((section(main,id).match(/class="zp-decision-card"/g)||[]).length,4,"Cards "+id);
for(const id of ["bezpecny-postup-auto","sedm-mereni-auto"])
 assert.equal((section(main,id).match(/<li>/g)||[]).length,7,"Checklist "+id);
assert.equal((section(main,"faq-nastupovani-auto").match(/<details>/g)||[]).length,6);
for(const source of ["/invalidni-vozik-do-auta/","/navrat-z-nemocnice/",
 "/otazky-pred-propustenim-z-nemocnice/","/vstavani-z-kresla-pro-seniora/"])
 assert.ok(linked(await load(source),source,path,"situace-nastupovani-auto"),"Missing inbound link from "+source);
const hy=await load("/hygiena-leziciho-seniora-doma/");
assert.equal(meta(hy,"zaprazi-release"),release,"Previous guide not updated");
assert.match(hy,/Jak zvládnout hygienu ležícího seniora doma/);
const sitemap=await auditPublicSitemap();
assert.ok(sitemap.staged_decision_paths_present.includes(path)
 || sitemap.required_decision_paths_present.includes(path),"Car guide absent from XML sitemap");
assert.ok(sitemap.staged_decision_paths_present.includes("/hygiena-leziciho-seniora-doma/")
 || sitemap.required_decision_paths_present.includes("/hygiena-leziciho-seniora-doma/"),"Previous hygiene article not published");
console.log("PASS 0.8.171: live release, integrity, car guide SEO + 4 inbound links, 7+7 steps, 6 FAQ, hygiene and sitemap");
