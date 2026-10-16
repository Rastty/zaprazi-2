/**
 * 0.8.136 POSTDEPLOY, read-only real DOM fidelity. 5448 was truncated by
 * an open English AI/editor note. Compare exact links/media and content
 * after excluding that proven non-reader note. No WP or merchant writes.
 */
import puppeteer from "puppeteer-core";
import assert from "node:assert/strict";
const origin="https://zaprazi.cz",id=5448,expectedVersion="0.8.136";
const marker="<!-- The above HTML code represents a blog post in Czech about the influence of pump performance on the efficiency of garden irrigation.";
const readinessRes=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",{
  signal:AbortSignal.timeout(30000),headers:{Accept:"application/json"}
});
assert.equal(readinessRes.status,200,"Affiliate/readiness endpoint unavailable");
const readiness=await readinessRes.json();
assert.equal(readiness.release,expectedVersion,"Wrong live release");
assert.equal(readiness.integrity,"ok","Partial WordPress deploy");
assert.equal(readiness.configured_total,25,"Affiliate config has missing positions");
assert.equal(readiness.slot_total,25,"Unexpected affiliate slot count");
const srcRes=await fetch(origin+"/wp-json/wp/v2/posts/"+id+"?_fields=id,slug,link,content",{
  signal:AbortSignal.timeout(30000),headers:{Accept:"application/json"}
});
assert.equal(srcRes.status,200,"Source WordPress post unavailable");
const post=await srcRes.json();
assert.equal(post.id,id);
assert.ok(post.slug&&post.link===origin+"/"+post.slug+"/","Invalid historical target");
const raw=post.content?.rendered;
assert.ok(typeof raw==="string"&&raw.length>1000,"Unexpected published post content");
const noteStart=raw.indexOf(marker),imageStart=raw.indexOf("<img",noteStart+marker.length);
assert.ok(noteStart>0&&imageStart>noteStart&&imageStart-noteStart<1500,
  "Known unclosed editor-note signature has changed");
assert.ok(!raw.slice(noteStart,imageStart).includes("-->"),"Source comment already closed");
const readableRaw=raw.slice(0,noteStart)+raw.slice(imageStart);
const wordCount=s=>(String(s).match(/[\p{L}\p{N}]+/gu)||[]).length;
const strip=s=>String(s).replace(/<title\b[^>]*>[\s\S]*?<\/title\s*>/gi," ")
  .replace(/<(?:style|script)\b[^>]*>[\s\S]*?<\/(?:style|script)>/gi," ")
  .replace(/<[^>]+>/g," ");
const decode=s=>s.replace(/&amp;|&#0*38;|&#x0*26;/gi,"&");
function targets(html,tag,attr){
  const re=new RegExp("<"+tag+"\\b[^>]*\\b"+attr+"\\s*=\\s*([\"'])(.*?)\\1","gi");
  return [...html.matchAll(re)].map(m=>new URL(decode(m[2]),post.link).href).sort();
}
const expectedLinks=targets(raw,"a","href"),expectedImages=targets(raw,"img","src");
const browser=await puppeteer.launch({
  executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
let actual;
try{
  const page=await browser.newPage();
  await page.setJavaScriptEnabled(false);
  await page.setRequestInterception(true);
  page.on("request",r=>r.isNavigationRequest()&&r.url()===post.link?r.continue():r.abort());
  const response=await page.goto(post.link,{waitUntil:"domcontentloaded",timeout:30000});
  assert.equal(response?.status(),200,"Live post not accessible");
  const head=await page.evaluate(()=>({
    release:document.querySelector('meta[name="zaprazi-release"]')?.content,
    integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content
  }));
  assert.equal(head.release,expectedVersion,"Page is stale after deploy");
  assert.equal(head.integrity,"ok","Page has partial theme");
  actual=await page.$eval(".zp-legacy-body",el=>({
    text:el.innerText,html:el.innerHTML,
    links:[...el.querySelectorAll("a[href]")].map(a=>a.href).sort(),
    images:[...el.querySelectorAll("img[src]")].map(a=>a.src).sort()
  }));
}finally{await browser.close();}
const sourceWords=wordCount(strip(readableRaw));
const liveWords=wordCount(actual.text);
const ratio=sourceWords?liveWords/sourceWords:0;
const linksOk=JSON.stringify(actual.links)===JSON.stringify(expectedLinks);
const imagesOk=JSON.stringify(actual.images)===JSON.stringify(expectedImages);
const shell=/<\/?(?:html|head|body)\b|<!doctype/i.test(actual.html);
const noteVisible=actual.text.includes("The above HTML code represents a blog post");
const summary={
  id,release:expectedVersion,integrity:readiness.integrity,
  affiliate_slots:readiness.configured_total,source_words:sourceWords,visible_words:liveWords,
  text_ratio:Number(ratio.toFixed(3)),links:[expectedLinks.length,actual.links.length],
  images:[expectedImages.length,actual.images.length],
  exact_links_ok:linksOk,exact_images_ok:imagesOk,nested_shell:shell,editor_note_visible:noteVisible,
  restored_tail_visible:actual.text.includes("Kategorie - čerpadla a vodárny")
};
console.log("LIVE_0_8_136_POST_5448",JSON.stringify(summary));
assert.ok(ratio>=.95,"Live article still has missing content");
assert.ok(linksOk&&imagesOk,"Lost or changed original href/src destinations");
assert.ok(!shell&&!noteVisible,"Unclosed editor note or document shell remains");
assert.ok(summary.restored_tail_visible,"Final article section missing");
