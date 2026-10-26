/**
 * Read-only production acceptance for five action-focused guides in 0.8.162.
 * No WordPress writes, personal data, merchant clicks or medical-answer submissions.
 * Runs with Node 20+ (built-in fetch) without depending on browser startup.
 */
import assert from "node:assert/strict";

const origin=(process.env.ZP_LIVE_ORIGIN||"https://zaprazi.cz").replace(/\/$/,"");
const expected=process.env.ZP_REQUIRED_LIVE_RELEASE||"0.8.162";
const specs=[
  {path:"/sprchova-zidle-maly-kout-80x80/",decision:"rozhodovaci-tabulka-sprcha",cards:3,
   destinations:[["/sprchovaci-zidle-pro-seniory/","poradce-sprchovaci-zidle"]]},
  {path:"/toaletni-zidle-vedle-postele/",decision:"rozhodovaci-matice-zidle-postel",cards:3,
   destinations:[["/toaletni-zidle-pro-seniory/","poradce-toaletni-zidle"]]},
  {path:"/senior-nemuze-vstat-z-postele/",decision:"rozhodnuti-vstavani-postel",cards:4,
   destinations:[["/nocni-cesta-z-postele-na-wc/","nocni-audit"]]},
  {path:"/choditko-do-bytu-pro-seniory/",decision:"rozhodnuti-choditko-byt",cards:4,
   destinations:[["/choditko-do-bytu-pro-seniory/","poradce-choditko-byt"]]},
  {path:"/madlo-k-wc-pro-seniory/",decision:"rozhodnuti-opora-wc",cards:4,
   destinations:[["/madlo-k-wc-pro-seniory/","poradce-opora-wc"]]}
];

async function get(path,json=false){
  const response=await fetch(origin+path,{signal:AbortSignal.timeout(25000),
    headers:{Accept:json?"application/json":"text/html","Cache-Control":"no-cache"}});
  assert.equal(response.status,200,"HTTP "+response.status+" at "+path);
  return json?response.json():response.text();
}
const hasId=(html,id)=>html.includes('id="'+id+'"')||html.includes("id='"+id+"'");
const meta=(html,name)=>{
  const tags=html.match(/<meta\b[^>]*>/gi)||[];
  const tag=tags.find(tag=>tag.includes('name="'+name+'"')||tag.includes("name='"+name+"'"))||"";
  return /content=["']([^"']*)["']/i.exec(tag)?.[1]||"";
};
const allHref=(html)=>[...html.matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1/gi)]
  .map(m=>m[2].replace(/&amp;/g,"&"));
const linkTo=(html,path,hash,sourcePath)=>allHref(html).some(href=>{
  try{
    const url=new URL(href,origin+sourcePath);
    return url.origin===origin&&url.pathname===path&&url.hash==="#"+hash;
  }catch{return false;}
});
const ready=await get("/wp-json/zaprazi/v1/affiliate-readiness",true);
assert.equal(ready.release,expected,"Expected "+expected+" but live is "+ready.release);
assert.equal(ready.integrity,"ok","Production integrity is partial");
assert.equal(ready.configured_total,25,"Affiliate configured total changed");
assert.equal(ready.slot_total,25,"Affiliate slot inventory changed");
const cache=new Map();
async function page(path){
  if(!cache.has(path))cache.set(path,await get(path));
  return cache.get(path);
}
for(const spec of specs){
  const html=await page(spec.path);
  assert.equal(meta(html,"zaprazi-release"),expected,"Wrong page release "+spec.path);
  assert.equal(meta(html,"zaprazi-integrity"),"ok","Partial page "+spec.path);
  const main=html.slice(html.indexOf("<main"));
  assert.ok(main.length>150,"Missing main content "+spec.path);
  assert.equal((main.match(/<h1\b/gi)||[]).length,1,"Incorrect H1 "+spec.path);
  assert.ok(hasId(main,spec.decision),"Missing action plan "+spec.path);
  const heroStart=main.indexOf('<section class="zp-hero"');
  const hero=main.slice(heroStart,main.indexOf("</section>",heroStart)+10);
  assert.ok(hero.includes('href="#'+spec.decision+'"'),"Missing hero quicklink "+spec.path);
  const pos=main.indexOf('id="'+spec.decision+'"');
  const start=main.lastIndexOf("<section",pos);
  const end=main.indexOf("</section>",pos);
  assert.ok(start>=0&&end>pos,"Malformed action section "+spec.path);
  const section=main.slice(start,end);
  assert.equal((section.match(/class="zp-decision-card"/g)||[]).length,spec.cards,
    "Wrong decision count "+spec.path);
  assert.doesNotMatch(section,/data-zp-merchant-link|data-zp-affiliate-target|ehub\.cz\/system\/scripts\/click/i,
    "Unsafe merchant shortcut "+spec.path);
  for(const [dest,anchor] of spec.destinations){
    assert.ok(linkTo(section,dest,anchor,spec.path),"Missing safe destination "+spec.path+" -> "+dest+"#"+anchor);
    const target=await page(dest);
    assert.ok(hasId(target,anchor),"Missing target "+dest+"#"+anchor);
    assert.equal(meta(target,"zaprazi-integrity"),"ok","Target partial "+dest);
  }
  console.log("PASS "+spec.path+" release, integrity, decisions, hero and safe target");
}
console.log("PASS "+expected+": all five production guides and linked destinations");
