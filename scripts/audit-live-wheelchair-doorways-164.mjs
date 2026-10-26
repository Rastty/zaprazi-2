/**
 * Read-only verification of wheelchair doorway guide released in 0.8.164.
 * Runs on GitHub Actions without a browser, and never submits personal data.
 */
import assert from "node:assert/strict";

const origin=(process.env.ZP_LIVE_ORIGIN||"https://zaprazi.cz").replace(/\/$/,"");
const expected=process.env.ZP_REQUIRED_LIVE_RELEASE||"0.8.164";
const pagePath="/projede-invalidni-vozik-dvermi/";

async function get(path,json=false){
  const response=await fetch(origin+path,{
    headers:{Accept:json?"application/json":"text/html","Cache-Control":"no-cache"},
    signal:AbortSignal.timeout(25000)
  });
  assert.equal(response.status,200,"Unreachable public path "+path+" ("+response.status+")");
  return json?response.json():response.text();
}
const hasId=(html,id)=>new RegExp("\\bid=[\"']"+id+"[\"']").test(html);
const meta=(html,name)=>{
 const tag=(html.match(/<meta\b[^>]*>/gi)||[]).find(x=>
   x.includes('name="'+name+'"')||x.includes("name='"+name+"'"))||"";
 return /content=["']([^"']*)["']/i.exec(tag)?.[1]||"";
};
const mainHtml=html=>html.slice(html.indexOf("<main"));
const section=(html,id)=>{
 const pos=html.indexOf('id="'+id+'"');
 assert.ok(pos>=0,"Missing section "+id);
 const start=html.lastIndexOf("<section",pos),end=html.indexOf("</section>",pos);
 assert.ok(start>=0&&end>start,"Malformed section "+id);
 return html.slice(start,end);
};
const ready=await get("/wp-json/zaprazi/v1/affiliate-readiness",true);
assert.equal(ready.release,expected,"Unexpected live release (possibly not yet deployed)");
assert.equal(ready.integrity,"ok","Incomplete WordPress theme deployment");
assert.equal(ready.configured_total,25,"Unexpected configured affiliate inventory");
assert.equal(ready.slot_total,25,"Unexpected total affiliate inventory");
console.log("PASS readiness "+ready.release+" / "+ready.integrity+" / 25 configured of 25");

const raw=await get(pagePath);
assert.equal(meta(raw,"zaprazi-release"),expected,"HTML has different release than REST");
assert.equal(meta(raw,"zaprazi-integrity"),"ok","Partial theme in HTML");
const html=mainHtml(raw);
assert.ok(html.length>8000,"Incomplete guide HTML");
assert.equal((html.match(/<h1\b/gi)||[]).length,1,"Guide should have one main H1");
for(const id of ["mereni-pruchodu","modelove-situace-pruchod",
 "pracovni-list-pruchody","chyby-mereni-pruchodu",
 "porovnani-sirek","otazky-prujezd-dvermi","zp-doorway-check"]){
 assert.ok(hasId(html,id),"Missing published section: "+id);
}
const model=section(html,"modelove-situace-pruchod");
assert.equal((model.match(/class="zp-decision-card"/g)||[]).length,4,"Missing examples");
for(const expectedCopy of ["70 cm, vozík 68 cm","75 cm, vozík 78 cm",
 "90 cm, vozík 70 cm","Šířku vozíku nebo otvoru neznáte",
 "nejsou univerzální limity","To neznamená, že vozík projede bezpečně"]){
 assert.ok(model.includes(expectedCopy),"Missing explanation "+expectedCopy);
}
const sheet=section(html,"pracovni-list-pruchody");
assert.equal((sheet.match(/<li>/g)||[]).length,7,"Missing printed measurement items");
const pitfalls=section(html,"chyby-mereni-pruchodu");
assert.equal((pitfalls.match(/class="zp-decision-card"/g)||[]).length,5);
const faq=section(html,"otazky-prujezd-dvermi");
assert.equal((faq.match(/<details>/g)||[]).length,5,"Missing doorway FAQs");
assert.match(faq,/Projde invalidní vozík dveřmi 70 cm/);
assert.doesNotMatch(model+sheet+pitfalls+faq,
 /data-zp-merchant-link|data-zp-affiliate-target|ehub\.cz\/system\/scripts\/click/i,
 "Editorial guide must not have premature merchant offers");
console.log("PASS four scenarios, seven measurements, five pitfalls, five FAQs");

const hero=html.slice(html.indexOf('<section class="zp-hero"'),
 html.indexOf("</section>",html.indexOf('<section class="zp-hero"')));
assert.ok(hero.includes('href="#modelove-situace-pruchod"'),
 "Hero link to scenarios missing");
assert.ok(hero.includes('href="#porovnani-sirek"'),
 "Hero link to interactive checker missing");
assert.ok(html.includes("https://www.access-board.gov/ada/guides/chapter-4-entrances-doors-and-gates/"));
assert.ok(html.includes("Bydleni_bez_barier_Liga_vozic.pdf"),"Czech source not linked");
assert.ok(html.includes("Americké pokyny nejsou automaticky použitelný český právní limit"));
assert.ok(html.includes('id="zp-doorway-result"')&&html.includes('aria-live="polite"'));
const sourcePaths=["/invalidni-vozik/","/bezpecny-byt-pro-seniora/"];
for(const path of sourcePaths){
 const inbound=mainHtml(await get(path));
 assert.ok(inbound.includes("/projede-invalidni-vozik-dvermi/"),
   "Missing inbound discovery link from "+path);
}
const advisor=mainHtml(await get("/invalidni-vozik/"));
assert.ok(hasId(advisor,"poradce-vozik"),"Main wheelchair advisor missing");
assert.ok(html.includes("/invalidni-vozik/#poradce-vozik"),"Deep link to advisor absent");
console.log("PASS hero links, both inbound links, live advisor target, privacy-safe checker and sources");
console.log("PASS complete 0.8.164 production wheelchair-doorway QA");
