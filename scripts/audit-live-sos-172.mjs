/** Read-only production verification of deployed Zápraží 0.8.172 and its first-party illustrations. */
import assert from "node:assert/strict";
import { auditPublicSitemap } from "./audit-public-sitemap.mjs";
const root="https://zaprazi.cz",release="0.8.172",path="/senior-doma-sam-sos-pomoc/";
async function fetchSite(path,json=false){
 const res=await fetch(root+path,{headers:{Accept:json?"application/json":"text/html","Cache-Control":"no-cache"},signal:AbortSignal.timeout(30000)});
 assert.equal(res.status,200,"HTTP "+res.status+" "+path);
 return json?res.json():res.text();
}
function attr(tag,key){return tag.match(new RegExp("\\b"+key+"=[\"']([^\"']*)[\"']","i"))?.[1]??""}
function meta(html,name){return attr((html.match(/<meta\b[^>]*>/gi)||[]).find(m=>attr(m,"name")===name)??"","content")}
function section(html,id){const i=html.indexOf('id="'+id+'"');assert.ok(i>0,"Missing "+id);const a=html.lastIndexOf("<section",i),b=html.indexOf("</section>",i);assert.ok(a>=0&&b>i,"Malformed section "+id);return html.slice(a,b)}
function containsLink(html,sourcePath,destPath,anchor){
 return [...html.matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1/gi)].some(m=>{
  try{const u=new URL(m[2].replaceAll("&amp;","&"),root+sourcePath);return u.origin===root&&u.pathname===destPath&&u.hash==="#"+anchor;}
  catch{return false}
 });
}
function illustratedImg(html){
 const tags=(html.match(/<img\b[^>]*>/gi)||[]);
 const image=tags.find(x=>attr(x,"src").includes("/assets/illustrations/doma-v-bezpeci.svg"));
 assert.ok(image,"Missing original hero illustration");
 assert.equal(attr(image,"width"),"720");assert.equal(attr(image,"height"),"510");
 assert.ok(attr(image,"alt").length>=30,"Illustration must have meaningful alt");
 const src=attr(image,"src").replaceAll("&amp;","&");
 const url=new URL(src,root);
 assert.equal(url.origin,root,"Images must be first-party");
 return url;
}
const r=await fetchSite("/wp-json/zaprazi/v1/affiliate-readiness",true);
assert.equal(r.release,release);
assert.equal(r.integrity,"ok","Partial protected release");
assert.equal(r.configured_total,25);assert.equal(r.slot_total,25);
const html=await fetchSite(path),main=html.slice(html.indexOf("<main"));
assert.ok(main.length>12500,"Rendered article unexpectedly short");
assert.equal(meta(html,"zaprazi-release"),release);
assert.equal(meta(html,"zaprazi-integrity"),"ok");
assert.equal((main.match(/<h1\b/gi)||[]).length,1);
assert.match(main,/Senior žije sám: jak si přivolá pomoc/);
assert.ok(!/\bnoindex\b/i.test(meta(html,"robots")));
assert.ok(meta(html,"description").length>=85);
const canonical=(html.match(/<link\b[^>]*>/gi)||[]).find(x=>attr(x,"rel")==="canonical");
assert.equal(attr(canonical??"","href"),root+path);
for(const [id,n] of [["krize-a-bezpeci",2],["vyber-sos-pomoci",4],["jak-overit-sluzbu-sos",3],["navazujici-pomoc-sos",3]])
 assert.equal((section(main,id).match(/class="zp-decision-card"/g)||[]).length,n,"Wrong cards "+id);
assert.equal((section(main,"sos-kontrolni-seznam").match(/<li>/g)||[]).length,9);
assert.equal((section(main,"faq-sos-senior").match(/<details>/g)||[]).length,6);
assert.equal((section(main,"jak-funguje-pomoc-sos").match(/class="zp-sos-flow-item"/g)||[]).length,3);
const home=await fetchSite("/");
assert.ok(home.includes("zp-illustrated-hero"),"Home hero lacks new warm visual");
const art=illustratedImg(html),homeArt=illustratedImg(home);
assert.equal(homeArt.toString(),art.toString());
const svgRes=await fetch(art,{signal:AbortSignal.timeout(20000),headers:{Accept:"image/svg+xml"}});
assert.equal(svgRes.status,200,"First-party SVG missing on production");
assert.match(await svgRes.text(),/^<svg[^>]+viewBox="0 0 720 510"/);
for(const from of ["/","/senior-spadl-doma/","/bezpecny-byt-pro-seniora/","/nocni-cesta-z-postele-na-wc/"])
 assert.ok(containsLink(from==="/"?home:await fetchSite(from),from,path,"vyber-sos-pomoci"),"Missing inbound "+from);
const map=await auditPublicSitemap();
assert.ok(map.staged_decision_paths_present.includes(path)||map.required_decision_paths_present.includes(path),"SOS page missing from Yoast sitemap");
console.log("PASS 0.8.172: release, SEO, 25/25 affiliate slots, illustrations, 4 inbound, 9 checks, 6 FAQ, sitemap");
