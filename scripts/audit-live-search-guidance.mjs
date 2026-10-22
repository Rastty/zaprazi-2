/**
 * Production browser acceptance for 0.8.146 search rescue.
 * Read-only GET; no form submission, merchant navigation or health answers.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import { EXPECTED_LIVE_RELEASE } from "./lib/live-release.mjs";

const origin="https://zaprazi.cz";
const checks=[
  {query:"sprcha",links:[
    "/sprchovaci-zidle-pro-seniory/#poradce-sprchovaci-zidle",
    "/koupelna-a-wc/#poradce-koupelna",
    "/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-sprcha"
  ],expectLegacy:true},
  {query:"vozík",links:[
    "/invalidni-vozik/",
    "/projede-invalidni-vozik-dvermi/",
    "/invalidni-vozik-na-pojistovnu/"
  ],expectLegacy:true},
  {query:"polohovací postel",links:[
    "/polohovaci-postel/",
    "/polohovaci-postel-na-pojistovnu/"
  ]},
  {query:"toaletní židle",links:[
    "/toaletni-zidle-pro-seniory/#poradce-toaletni-zidle",
    "/nocni-cesta-z-postele-na-wc/#nocni-audit"
  ]},
  {query:"noční cesta na WC",links:[
    "/nocni-cesta-z-postele-na-wc/#nocni-audit",
    "/toaletni-zidle-pro-seniory/#poradce-toaletni-zidle"
  ]},
  {query:"fotovoltaika",links:[],expectLegacy:true}
];
const readinessResponse=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",{
  headers:{Accept:"application/json"},signal:AbortSignal.timeout(30000)});
assert.equal(readinessResponse.status,200,"Production readiness endpoint unavailable");
const readiness=await readinessResponse.json();
assert.equal(readiness.release,EXPECTED_LIVE_RELEASE,"Wrong live theme release");
assert.equal(readiness.integrity,"ok","Partial live release");
assert.equal(readiness.configured_total,25,"Incomplete affiliate configuration");
assert.equal(readiness.slot_total,25,"Unexpected affiliate inventory");
const browser=await puppeteer.launch({executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
const report=[];
try{
  for(const check of checks){
    const page=await browser.newPage();
    await page.setJavaScriptEnabled(false);
    await page.setViewport({width:390,height:844,deviceScaleFactor:1});
    const methods=[],errors=[];
    await page.setRequestInterception(true);
    page.on("request",req=>{
      methods.push(req.method());
      if(req.method()==="GET"&&req.url().startsWith(origin+"/")) req.continue();
      else req.abort();
    });
    page.on("pageerror",e=>errors.push(String(e)));
    try{
      // Browser/URLSearchParams produces correctly encoded Czech multiword input.
      const url=new URL(origin+"/");
      url.searchParams.set("s",check.query);
      const response=await page.goto(url.href,{waitUntil:"domcontentloaded",timeout:30000});
      assert.equal(response?.status(),200,"Search endpoint failed for "+check.query);
      const data=await page.evaluate(()=>{
        const main=document.querySelector("main");
        const guided=document.querySelector(".zp-search-guidance");
        const old=document.querySelector(".zp-archive-list");
        const links=guided?[...guided.querySelectorAll("a[href]")].map(a=>({
          href:a.href,target:a.target||"",rel:a.rel||"",text:a.textContent.trim()})):[];
        return{
          searchLabel:main?.querySelector("h1")?.textContent.trim()||"",
          h1Count:main?.querySelectorAll("h1").length||0,
          release:document.querySelector('meta[name="zaprazi-release"]')?.content,
          integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
          canonical:document.querySelector('link[rel="canonical"]')?.href||"",
          links,
          guidanceCount:main?.querySelectorAll(".zp-search-guidance").length||0,
          oldExists:!!old,
          oldAfterGuidance:!guided||!old||Boolean(guided.compareDocumentPosition(old)&Node.DOCUMENT_POSITION_FOLLOWING),
          oldCount:old?.querySelectorAll(".zp-archive-card").length||0,
          pagination:!!main?.querySelector(".zp-pagination")
        };
      });
      assert.equal(data.release,EXPECTED_LIVE_RELEASE,"Unexpected per-page release");
      assert.equal(data.integrity,"ok","Live search render has partial integrity");
      assert.equal(data.h1Count,1,"Search page must have one H1");
      assert.ok(data.searchLabel.toLowerCase().includes(check.query.toLowerCase()),
        "Search query changed in rendered heading: "+check.query+" -> "+data.searchLabel);
      assert.equal(data.guidanceCount,check.links.length?1:0,
        "Incorrect contextual guidance for "+check.query);
      assert.deepEqual(data.links.map(a=>a.href),check.links.map(x=>origin+x),
        "Search intent must show exact safe curated Advisor links");
      assert.ok(data.links.every(a=>a.href.startsWith(origin+"/")&&!a.href.includes("?")&&
        !/ehub|awin|merchant|desturl|click\.php|affiliate/i.test(a.href)),
        "Guide must not directly link merchants or echo search terms");
      assert.equal(data.oldAfterGuidance,true,"Old search results must remain below guidance");
      if(check.expectLegacy)assert.ok(data.oldCount>0,
        "Existing legacy search results were removed for "+check.query);
      assert.deepEqual(errors,[],"Search produced runtime JS errors");
      assert.ok(methods.every(method=>method==="GET"),"Browser must never submit search form");
      report.push({query:check.query,guided:data.links.length,legacyResults:data.oldCount,
        oldResultsPreserved:data.oldAfterGuidance});
    }finally{await page.close();}
  }
  console.log("LIVE_SEARCH_GUIDANCE",JSON.stringify({release:readiness.release,
    integrity:readiness.integrity,affiliate_slots:readiness.configured_total,
    queries:report,post_requests:0,merchant_clicks:0}));
}finally{await browser.close();}
