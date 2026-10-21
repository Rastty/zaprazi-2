/**
 * Production acceptance of educational bathroom measuring page.
 * Read-only; no user personal or health data; never initiates affiliate clicks.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import { EXPECTED_LIVE_RELEASE } from "./lib/live-release.mjs";

const origin="https://zaprazi.cz";
const version=EXPECTED_LIVE_RELEASE;
const route="/co-zmerit-v-koupelne-pred-vyberem-pomucky/";
const expectedInbound=[
  ["/koupelna-a-wc/","#vyberte-misto"],
  ["/sprchovaci-zidle-pro-seniory/","#mereni-sprcha"],
  ["/nastavec-na-wc-pro-seniory/","#mereni-wc"],
  ["/madlo-k-wc-pro-seniory/","#mereni-wc"],
  ["/sedatko-do-vany-pro-seniory/","#mereni-vana"]
];
const expectedOutbound=[
  "/koupelna-a-wc/#poradce-koupelna",
  "/nastavec-na-wc-pro-seniory/#poradce-nastavec-wc",
  "/madlo-k-wc-pro-seniory/#poradce-opora-wc",
  "/sprchovaci-zidle-pro-seniory/#poradce-sprchovaci-zidle",
  "/sedatko-do-vany-pro-seniory/#poradce-sedatko-vana",
  "/bezpecny-byt-pro-seniora/",
  "/pomucky-do-koupelny-na-pojistovnu/"
];

const response=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",{
  headers:{Accept:"application/json"},signal:AbortSignal.timeout(30000)
});
assert.equal(response.status,200,"Readiness endpoint is unavailable");
const readiness=await response.json();
assert.equal(readiness.release,version,"Unexpected production version");
assert.equal(readiness.integrity,"ok","Live theme integrity is not OK");
assert.equal(readiness.configured_total,25,"Affiliate configuration changed");
assert.equal(readiness.slot_total,25,"Affiliate inventory changed");

const browser=await puppeteer.launch({
  executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
const jsErrors=[],methods=[];
async function openPage(path){
  const page=await browser.newPage();
  await page.setViewport({width:390,height:844,deviceScaleFactor:1});
  await page.setRequestInterception(true);
  page.on("pageerror",e=>jsErrors.push(e.message));
  page.on("request",req=>{
    methods.push(req.method());
    if(!req.url().startsWith(origin+"/")||req.method()!=="GET")req.abort();
    else req.continue();
  });
  const result=await page.goto(origin+path,{waitUntil:"domcontentloaded",timeout:30000});
  assert.equal(result?.status(),200,"No valid page at "+path);
  const meta=await page.evaluate(()=>({
    release:document.querySelector('meta[name="zaprazi-release"]')?.content,
    integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
    canonical:document.querySelector('link[rel="canonical"]')?.href,
    description:document.querySelector('meta[name="description"]')?.content,
    h1:document.querySelectorAll("main h1").length,
    title:document.title,
    text:document.querySelector("main")?.innerText||"",
    ids:[...document.querySelectorAll("main [id]")].map(x=>x.id),
    links:[...document.querySelectorAll("main a[href]")].map(x=>x.href),
    forms:document.querySelectorAll("main form").length,
    overflow:document.documentElement.scrollWidth-innerWidth
  }));
  assert.equal(meta.release,version,"Wrong release on "+path);
  assert.equal(meta.integrity,"ok","Partial render on "+path);
  assert.equal(meta.canonical,origin+path,"Unexpected canonical on "+path);
  assert.equal(meta.h1,1,"Wrong H1 count on "+path);
  assert.ok(meta.overflow<=2,"Mobile horizontal overflow on "+path);
  return {page,meta};
}
try{
  const {page,meta}=await openPage(route);
  try{
    assert.match(meta.title,/Co změřit v koupelně/);
    assert.ok((meta.description||"").length>=70,"No useful page snippet");
    for(const anchor of ["vyberte-misto","mereni-wc","mereni-sprcha","mereni-vana","kontrolni-list-koupelna"])
      assert.ok(meta.ids.includes(anchor),"Missing anchor "+anchor);
    assert.equal(meta.forms,0,"Article must not collect form inputs");
    assert.match(meta.text,/Samy ale neprokážou stabilitu/);
    assert.match(meta.text,/nosný podklad/);
    assert.match(meta.text,/fyzicky zvedat/);
    const numCards=await page.$$eval("#mereni-wc article.zp-decision-card, #mereni-sprcha article.zp-decision-card, #mereni-vana article.zp-decision-card",x=>x.length);
    assert.equal(numCards,7,"Expected seven practical checks");
    for(const path of expectedOutbound)
      assert.ok(meta.links.includes(origin+path),"No useful advisor path "+path);
    assert.ok(!meta.links.some(href=>/ehub\.cz|awin|cj\.com|click\.php/i.test(href)),
      "Editorial measuring guide must not deep-link to merchant");
  }finally{await page.close();}
  for(const [path,hash] of expectedInbound){
    const {page,meta}=await openPage(path);
    try{assert.ok(meta.links.includes(origin+route+hash),
      "Missing inbound link "+path+" -> "+hash);
    }finally{await page.close();}
  }
  assert.deepEqual(jsErrors,[],"Runtime JS errors");
  assert.ok(!methods.some(m=>m!=="GET"),"The audit attempted a write");
  console.log("LIVE_BATHROOM_MEASUREMENTS",JSON.stringify({
    version,integrity:readiness.integrity,affiliate_slots:readiness.configured_total,
    article:route,checklist_items:7,inbound_routes:expectedInbound.length,
    advisor_and_support_links:expectedOutbound.length,forms:0,post_requests:0,
    js_errors:0
  }));
}finally{await browser.close();}
