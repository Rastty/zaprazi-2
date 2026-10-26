/**
 * Read-only production acceptance: release 0.8.166 and two new problem guides.
 * Unlike static PHP tests, this confirms published WordPress markup & live XML.
 * Does not click merchants, submit a questionnaire or process personal data.
 */
import assert from "node:assert/strict";
import {auditPublicSitemap,stagedDecisionPaths} from "./audit-public-sitemap.mjs";

const site="https://zaprazi.cz";
const version="0.8.166";
const specs=[
 {path:"/najezdova-rampa-na-jeden-schod/",
  ids:["rozhodnuti-rampa-schod","vypocet-sklonu-rampy","mereni-rampy-schod","volba-rampy-jeden-schod","pracovni-list-rampa-schod","faq-rampa-schod","zdroje-rampa-schod"],
  counts:[["rozhodnuti-rampa-schod",4],["mereni-rampy-schod",7],["volba-rampy-jeden-schod",3]],
  list:["pracovni-list-rampa-schod",8],faq:6,
  inbound:[["/prahy-pro-choditko-a-vozik/","rozhodnuti-rampa-schod"],["/schody-pro-seniora-doma/","mereni-rampy-schod"],["/bezpecny-byt-pro-seniora/","vypocet-sklonu-rampy"]],
  to:[["/prahy-pro-choditko-a-vozik/","reseni-prahu"],["/invalidni-vozik/","poradce-vozik"]],
  phrases:["5 %","10 %","20 %","nejsou tři doporučené varianty"]},
 {path:"/prisavne-madlo-do-koupelny-bez-vrtani/",
  ids:["rozhodnuti-madlo-bez-vrtani","rozdily-madel-bez-vrtani","sedm-kontrol-madla-bez-vrtani","modelove-situace-madlo-bez-vrtani","list-madlo-bez-vrtani","faq-madlo-bez-vrtani","zdroje-madlo-bez-vrtani"],
  counts:[["rozhodnuti-madlo-bez-vrtani",4],["rozdily-madel-bez-vrtani",4],["modelove-situace-madlo-bez-vrtani",3]],
  list:["list-madlo-bez-vrtani",6],faq:6,
  inbound:[["/madlo-na-sadrokarton-u-wc/","rozhodnuti-madlo-bez-vrtani"],["/koupelna-a-wc/","rozdily-madel-bez-vrtani"],["/bezpecny-byt-pro-seniora/","rozhodnuti-madlo-bez-vrtani"]],
  to:[["/madlo-k-wc-pro-seniory/","rozhodnuti-opora-wc"],["/koupelna-a-wc/","poradce-koupelna"]],
  phrases:["Přísavné madlo jako nosnou oporu nevybírejte","Zákaz vrtání nemění potřebnou bezpečnost"]}
];
const cache=new Map();
async function get(path,kind="html"){
 const key=path+"|"+kind;
 if(cache.has(key))return cache.get(key);
 const resp=await fetch(site+path,{headers:{Accept:kind==="json"?"application/json":"text/html","Cache-Control":"no-cache"},signal:AbortSignal.timeout(26000),redirect:"manual"});
 assert.equal(resp.status,200,"HTTP "+resp.status+" at "+path);
 const result=kind==="json"?await resp.json():await resp.text();
 cache.set(key,result);
 return result;
}
function attr(html,name) {
 const match=String(html).match(new RegExp("\\b"+name+"=[\"']([^\"']*)[\"']","i"));
 return match?.[1]||"";
}
function meta(html,name){
 const tag=(html.match(/<meta\b[^>]*>/gi)||[]).find(t=>attr(t,"name")===name)||"";
 return attr(tag,"content");
}
function section(html,id){
 const marker=html.indexOf('id="'+id+'"');
 assert.ok(marker>=0,"Missing section "+id);
 const start=html.lastIndexOf("<section",marker),end=html.indexOf("</section>",marker);
 assert.ok(start>=0&&end>marker,"Malformed section "+id);
 return html.slice(start,end);
}
function linkTo(html,path,fragment,sourcePath){
 return [...html.matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1/gi)].some(m=>{
  try{
   const target=new URL(m[2].replaceAll("&amp;","&"),site+sourcePath);
   return target.origin===site&&target.pathname===path&&target.hash==="#"+fragment;
  }catch{return false;}
 });
}
const ready=await get("/wp-json/zaprazi/v1/affiliate-readiness","json");
assert.equal(ready.release,version,"WordPress has not deployed "+version);
assert.equal(ready.integrity,"ok","Release partially deployed");
assert.equal(ready.configured_total,25);
assert.equal(ready.slot_total,25);
console.log("PASS "+version+" release, integrity and 25/25 affiliate slots");
for(const guide of specs){
 const html=await get(guide.path),main=html.slice(html.indexOf("<main"));
 assert.equal(meta(html,"zaprazi-release"),version,"HTML release differs on "+guide.path);
 assert.equal(meta(html,"zaprazi-integrity"),"ok","Partial page release "+guide.path);
 assert.ok(main.length>9000,"Incomplete guide "+guide.path);
 assert.equal((main.match(/<h1\b/gi)||[]).length,1,"Expected one H1 "+guide.path);
 assert.ok(!/\bnoindex\b/i.test(meta(html,"robots")),"Noindex "+guide.path);
 const description=meta(html,"description");
 assert.ok(description.length>=90&&description.length<=200,"SEO description missing "+guide.path);
 const canonicalTag=(html.match(/<link\b[^>]*>/gi)||[]).find(t=>attr(t,"rel")==="canonical")||"";
 assert.equal(attr(canonicalTag,"href"),site+guide.path,"Wrong canonical "+guide.path);
 for(const id of guide.ids)section(main,id);
 for(const [id,count] of guide.counts){
  assert.equal((section(main,id).match(/class="zp-decision-card"/g)||[]).length,count,"Cards "+id);
 }
 assert.equal((section(main,guide.list[0]).match(/<li>/g)||[]).length,guide.list[1],"Worksheet "+guide.path);
 const faqId=guide.ids.find(id=>id.startsWith("faq-"));
 assert.equal((section(main,faqId).match(/<details>/g)||[]).length,guide.faq,"FAQ "+guide.path);
 for(const phrase of guide.phrases)assert.ok(main.includes(phrase),"Missing editorial safety detail "+phrase);
 for(const [path,anchor] of guide.inbound){
  const from=await get(path);
  assert.ok(linkTo(from,path===guide.path?path:guide.path,anchor,path),"Missing inbound "+path+" -> "+guide.path+"#"+anchor);
 }
 for(const [path,anchor] of guide.to){
  assert.ok(linkTo(main,path,anchor,guide.path),"Missing onward link "+guide.path+" -> "+path+"#"+anchor);
  const dest=await get(path);
  assert.ok(dest.includes('id="'+anchor+'"'),"Missing target "+path+"#"+anchor);
 }
 const allDecision=guide.counts.map(([id])=>section(main,id)).join("");
 assert.doesNotMatch(allDecision,/data-zp-merchant-link|data-zp-affiliate-target|ehub\.cz\/system\/scripts\/click/i,"Unsafe merchant shortcut");
 console.log("PASS "+guide.path+" canonical, content, safety, inbound and onward links");
}
const sitemap=await auditPublicSitemap();
for(const spec of specs){
 assert.ok(stagedDecisionPaths.includes(spec.path),"Staged tracking absent "+spec.path);
 assert.ok(sitemap.staged_decision_paths_present.includes(spec.path),"Sitemap missing "+spec.path);
}
assert.deepEqual(sitemap.duplicate_paths_sample,[],"Sitemap duplicates");
console.log("PASS live sitemap discovery for two guides (Google indexation not guaranteed)");
console.log("PASS deployed 0.8.166 two-guide publication acceptance");
