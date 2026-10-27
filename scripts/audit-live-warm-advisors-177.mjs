/** Read-only live acceptance of Zápraží 0.8.177 and 3 illustrative advisor heroes. */
import assert from "node:assert/strict";
const origin="https://zaprazi.cz", release="0.8.177";
const pages=[
  {path:"/choditka-pro-seniory/",img:"chuze-s-oporou.svg",needle:"Chodítka pro seniory",link:"/choditko-do-bytu-pro-seniory/"},
  {path:"/koupelna-a-wc/",img:"koupelna-s-jistotou.svg",needle:"Pomůcky do koupelny pro seniory",link:"/co-zmerit-v-koupelne-pred-vyberem-pomucky/"},
  {path:"/sobestacnost/",img:"sobestacnost-u-stolu.svg",needle:"Pomůcky pro sebeobsluhu",link:"/navrat-z-nemocnice/"}
];
async function get(path,accept="text/html"){
 const result=await fetch(origin+path,{headers:{Accept:accept,"Cache-Control":"no-cache"},redirect:"follow",signal:AbortSignal.timeout(26000)});
 assert.equal(result.status,200,"Bad HTTP status "+result.status+" on "+path);
 assert.equal(new URL(result.url).origin,origin,"Unexpected redirect origin");
 return result.text();
}
function attr(tag,key){
 return tag?.match(new RegExp("\\b"+key+"=[\"']([^\"']*)[\"']","i"))?.[1]??"";
}
function meta(html,name){
 return attr((html.match(/<meta\b[^>]*>/gi)||[]).find(x=>attr(x,"name")===name),"content");
}
const ready=JSON.parse(await get("/wp-json/zaprazi/v1/affiliate-readiness","application/json"));
assert.equal(ready.release,release,"Deployed theme is not 0.8.177");
assert.equal(ready.integrity,"ok","WordPress theme integrity failure");
assert.equal(ready.slot_total,25,"Affiliate slot count changed");
assert.equal(ready.configured_total,25,"Affiliate mapping changed");
for(const item of pages){
 const html=await get(item.path);
 assert.equal(meta(html,"zaprazi-release"),release,item.path+" release mismatch");
 assert.equal(meta(html,"zaprazi-integrity"),"ok",item.path+" integrity mismatch");
 assert.ok(!/noindex/i.test(meta(html,"robots")),item.path+" noindex");
 assert.ok(meta(html,"description").length>=70,item.path+" missing description");
 const canon=(html.match(/<link\b[^>]*>/gi)||[]).find(tag=>attr(tag,"rel")==="canonical");
 assert.equal(attr(canon,"href"),origin+item.path,item.path+" incorrect canonical");
 const main=html.slice(html.indexOf("<main"));
 assert.equal((main.match(/<h1\b/gi)||[]).length,1,item.path+" malformed H1");
 assert.ok(main.includes(item.needle),item.path+" title changed");
 assert.match(main,/zp-illustrated-hero/,item.path+" no illustrated hero");
 assert.match(main,/zp-hero-layout/,item.path+" no responsive grid");
 const picture=(main.match(/<img\b[^>]*>/gi)||[]).find(x=>attr(x,"src").includes(item.img));
 assert.ok(picture,item.path+" does not render assigned image");
 assert.equal(attr(picture,"width"),"720");
 assert.equal(attr(picture,"height"),"510");
 assert.ok(attr(picture,"alt").length>=40,item.path+" missing helpful alt");
 const imageUrl=new URL(attr(picture,"src").replaceAll("&amp;","&"),origin);
 assert.equal(imageUrl.origin,origin,item.path+" image not hosted locally");
 assert.ok(imageUrl.pathname.endsWith("/assets/illustrations/"+item.img));
 const svg=await get(imageUrl.pathname,"image/svg+xml");
 assert.match(svg,/<svg\b/);
 assert.match(svg,/<title id="title">/);
 assert.match(svg,/<desc id="desc">/);
 assert.ok(main.includes(item.link),item.path+" existing advisor path lost");
}
console.log("LIVE_177_PASS "+JSON.stringify({
 release,integrity:ready.integrity,rendered_advisors:3,distinct_local_svg:3,
 seo:"HTTPS canonicals, H1, noindex absent, descriptions and alt texts",
 affiliate_slots_configured:ready.configured_total,
 limitations:"Google indexing, traffic, sales and mobile appearance not measured"
}));
