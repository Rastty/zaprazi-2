/**
 * Read-only postdeploy acceptance for 0.8.165. Run after WordPress Pull + Deploy.
 * Confirms public publication, not Google indexing, traffic or sales.
 */
import assert from "node:assert/strict";
import {auditPublicSitemap,stagedDecisionPaths} from "./audit-public-sitemap.mjs";
const site="https://zaprazi.cz",version="0.8.165",path="/invalidni-vozik-do-auta/";
const get=async p=>{
 const r=await fetch(site+p,{headers:{"Cache-Control":"no-cache"},redirect:"manual",signal:AbortSignal.timeout(25000)});
 assert.equal(r.status,200,"HTTP "+r.status+" at "+p);
 return r.text();
};
const attr=(tag,name)=>tag.match(new RegExp("\\b"+name+"=[\"']([^\"']*)[\"']","i"))?.[1]||"";
const meta=(html,name)=>{
 const tags=html.match(/<meta\b[^>]*>/gi)||[];
 return attr(tags.find(t=>attr(t,"name")===name)||"","content");
};
const section=(html,id)=>{
 const at=html.indexOf('id="'+id+'"');
 assert.ok(at>=0,"Missing section "+id);
 const start=html.lastIndexOf("<section",at),end=html.indexOf("</section>",at);
 assert.ok(start>=0&&end>at,"Malformed section "+id);
 return html.slice(start,end);
};
const hasId=(html,id)=>html.includes('id="'+id+'"')||html.includes("id='"+id+"'");
const to=(html,p,fragment)=>[...html.matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1/gi)]
 .some(match=>{try{const u=new URL(match[2].replaceAll("&amp;","&"),site);return u.origin===site&&u.pathname===p&&u.hash==="#"+fragment;}catch{return false;}});
const resp=await fetch(site+"/wp-json/zaprazi/v1/affiliate-readiness",{
 headers:{Accept:"application/json","Cache-Control":"no-cache"},signal:AbortSignal.timeout(25000)});
assert.equal(resp.status,200);
const ready=await resp.json();
assert.equal(ready.release,version,"WordPress not on "+version);
assert.equal(ready.integrity,"ok","Mixed theme markers / partial deploy");
assert.equal(ready.configured_total,25);
assert.equal(ready.slot_total,25);
console.log("PASS live release, theme integrity, 25/25 configured slots");
const raw=await get(path),main=raw.slice(raw.indexOf("<main"));
assert.equal(meta(raw,"zaprazi-release"),version);
assert.equal(meta(raw,"zaprazi-integrity"),"ok");
assert.ok(main.length>9500,"Published guide is incomplete");
assert.equal((main.match(/<h1\b/gi)||[]).length,1);
assert.ok(/<title\b[^>]*>[^<]*Invalidní vozík do auta/i.test(raw),"Missing SEO title");
const desc=meta(raw,"description");
assert.ok(desc.length>=90&&desc.length<=200,"Missing or unsuitable meta description");
assert.ok(!/\bnoindex\b/i.test(meta(raw,"robots")),"Guide is noindexed");
const canonical=(raw.match(/<link\b[^>]*>/gi)||[]).find(tag=>attr(tag,"rel")==="canonical")||"";
assert.equal(attr(canonical,"href"),site+path,"Unexpected canonical");
const decisions=section(main,"rozhodnuti-vozik-auto");
const measures=section(main,"mereni-kufru-vozik");
const worksheet=section(main,"pracovni-list-vozik-auto");
const types=section(main,"rozdily-voziku-auto");
const faq=section(main,"faq-vozik-do-auta");
const sources=section(main,"zdroje-vozik-auto");
for(const [s,count] of [[decisions,4],[measures,7],[worksheet,3],[types,3]]){
 assert.equal((s.match(/class="zp-decision-card"/g)||[]).length,count);
}
assert.equal((faq.match(/<details>/g)||[]).length,6);
assert.match(decisions,/cestovat přímo ve vozíku/);
assert.match(sources,/leedsth\.nhs\.uk/);
assert.match(sources,/motability\.co\.uk/);
assert.doesNotMatch(decisions+measures+worksheet+types+faq,
 /data-zp-merchant-link|data-zp-affiliate-target|ehub\.cz\/system\/scripts\/click/i);
console.log("PASS editorial content, measurement worksheet and safe decisions");
for(const [p,anchor] of [["/invalidni-vozik/","rozhodnuti-vozik-auto"],
 ["/navrat-z-nemocnice/","mereni-kufru-vozik"]]){
 const html=await get(p);
 assert.ok(to(html.slice(html.indexOf("<main")),path,anchor),"Missing inbound link from "+p);
}
assert.ok(to(main,"/invalidni-vozik/","poradce-vozik"),"Missing advisor handoff");
assert.ok(to(main,"/projede-invalidni-vozik-dvermi/","mereni-pruchodu"),"Missing doorway link");
assert.ok(hasId(await get("/invalidni-vozik/"),"poradce-vozik"),"Advisor target not rendered");
console.log("PASS contextual inbound and outgoing links");
const report=await auditPublicSitemap();
assert.ok(stagedDecisionPaths.includes(path),"Staged contract excludes published guide");
assert.ok(report.staged_decision_paths_present.includes(path),"New guide not in public sitemap");
assert.equal(report.staged_decision_paths_missing.length,0,"Staged URL missing in sitemap");
assert.equal(report.duplicate_paths_sample.length,0,"Duplicate sitemap locations");
console.log("PASS sitemap inclusion; Google indexation not inferred");
console.log("PASS 0.8.165 public wheelchair-to-car acceptance");
