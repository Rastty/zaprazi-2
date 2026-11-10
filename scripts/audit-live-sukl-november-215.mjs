#!/usr/bin/env node
/**
 * 0.8.215 exact-live SÚKL 5005963 November 2026 acceptance.
 * Browser is a same-origin GET-only witness; never click offers,
 * submit personal data or infer an individual patient's entitlement.
 */
import assert from "node:assert/strict";
import {SOURCE_THEME_RELEASE,EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

if(process.env.GITHUB_EVENT_NAME==="pull_request"){
  console.log("SUKL_NOVEMBER_215_PREDEPLOY_SKIP");
  process.exit(0);
}
const atLeast=(a,b)=>{
  const av=a.split(".").map(Number),bv=b.split(".").map(Number);
  for(let i=0;i<3;i++)if(av[i]!==bv[i])return av[i]>bv[i];
  return true;
};
if(!atLeast(SOURCE_THEME_RELEASE,"0.8.215")){
  console.log("SUKL_NOVEMBER_215_NOT_YET_RELEASED");
  process.exit(0);
}
assert.equal(EXPECTED_LIVE_RELEASE,SOURCE_THEME_RELEASE,"Exact current release required");
const ORIGIN="https://zaprazi.cz";
const PATH="/choditko-na-pojistovnu/";
const pdf="https://eud.sukl.gov.cz/pub/deska/40000001/athena/26V01973@SUKLAA/26D0TU21@SUKLAA/ZPSCAU_20261101.pdf";
const officialIndex="https://eud.sukl.gov.cz/pub/deska/40000001/athena/?kategorie_id=11";
const todayParts=Object.fromEntries(new Intl.DateTimeFormat("en-GB",{
  timeZone:"Europe/Prague",year:"numeric",month:"2-digit",day:"2-digit"
}).formatToParts(new Date()).map(({type,value})=>[type,value]));
const today=[todayParts.year,todayParts.month,todayParts.day].join("-");
const novemberActive=today>="2026-11-01"&&today<="2026-11-30";
const puppeteer=(await import("puppeteer-core")).default;
const browser=await puppeteer.launch({
  executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
try{
  const page=await browser.newPage();
  try{
    await page.setViewport({width:390,height:844,deviceScaleFactor:1});
    await page.setRequestInterception(true);
    page.on("request",req=>{
      let allowed=false;
      try{
        const u=new URL(req.url());
        allowed=req.method()==="GET"&&u.origin===ORIGIN&&!u.username&&!u.password&&
          ![...u.searchParams.keys()].some(k=>/answer|health|symptom|diagnos|patient|weight|condition/i.test(k));
      }catch{}
      void(allowed?req.continue():req.abort("blockedbyclient")).catch(()=>{});
    });
    const res=await page.goto(ORIGIN+PATH,{waitUntil:"domcontentloaded",timeout:35000});
    assert.equal(res?.status(),200);
    const observed=await page.evaluate(()=>{
      const summary=[...document.querySelectorAll(".zp-resource-summary .zp-card")].find(x=>x.textContent?.includes("Ověřený příklad"));
      const source=document.querySelector("#zp-overit-mesicni-seznam");
      const model=[...document.querySelectorAll("main .zp-method-grid")].find(x=>x.textContent?.includes("MEYRA Ideal Rollator 3061982"));
      const factText=model?.textContent||"";
      const official=[...source?.querySelectorAll("a[href]")||[]].map(x=>x.href);
      const absoluteSource=[...document.querySelectorAll(".zp-resource-sources a[href]")].map(x=>x.href);
      return{
        pathname:location.pathname,search:location.search,
        release:document.querySelector('meta[name="zaprazi-release"]')?.content||"",
        integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content||"",
        canonical:document.querySelector('link[rel="canonical"]')?.href||"",
        h1:document.querySelectorAll("main h1").length,
        mobileOverflow:document.documentElement.scrollWidth-innerWidth,
        quickAnswer:document.querySelector(".zp-hero")?.textContent||"",
        hasDoctorFirst:Boolean(document.querySelector('a[href="#rychla-cesta-na-epoukaz"]')),
        currentSummary:summary?.textContent||"",
        sourceText:source?.textContent||"",
        factText,sourceLinks:official,archiveLinks:absoluteSource,
        noMerchant:!source?.querySelector('[data-zp-merchant-link],[data-zp-offer],a[rel~="sponsored"]'),
        noForm:!source?.querySelector("form,input,textarea")
      };
    });
    assert.equal(observed.pathname,PATH);
    assert.equal(observed.search,"");
    assert.equal(observed.release,SOURCE_THEME_RELEASE);
    assert.equal(observed.integrity,"ok");
    assert.equal(observed.canonical,ORIGIN+PATH);
    assert.equal(observed.h1,1);
    assert.ok(observed.mobileOverflow<=2,"Mobile horizontal overflow");
    assert.match(observed.quickAnswer,/Rychlá odpověď/);
    assert.equal(observed.hasDoctorFirst,true);
    assert.match(observed.sourceText,/neprokazuje individuální nárok, konečný doplatek ani vhodnost/);
    assert.match(observed.factText,/07-5005963/);
    assert.match(observed.factText,/IDEAL ROLLATOR 3061982/);
    assert.match(observed.factText,/ROLLATOR 2 3061982-R/);
    assert.equal(observed.noMerchant,true);
    assert.equal(observed.noForm,true);
    assert.ok(observed.archiveLinks.includes(pdf),"Exact verified final PDF must be linked as evidence");
    assert.ok(observed.sourceLinks.includes(officialIndex),"Current-month lookup must remain possible");
    if(novemberActive){
      assert.match(observed.currentSummary,/Listopad 2026: úhrada 3 408 Kč/);
      assert.match(observed.factText,/Úhrada v aktuálním listopadovém seznamu/);
      assert.match(observed.sourceText,/5005963\s*·\s*IDEAL ROLLATOR 3061982\s*·\s*úhrada 3 408 Kč/);
      assert.match(observed.sourceText,/sukl313250\/2026/);
      assert.equal(observed.sourceLinks.includes(pdf),true,"November amount must have exact PDF");
      assert.doesNotMatch(observed.currentSummary,/bez doplatku|garantovaná úhrada|vždy zdarma/i);
    }else{
      assert.doesNotMatch(observed.currentSummary,/Listopad 2026: úhrada 3 408 Kč/);
      assert.doesNotMatch(observed.factText,/Úhrada v aktuálním listopadovém seznamu/);
      assert.match(observed.currentSummary,/Poslední ověřený záznam už není aktuální/);
      assert.match(observed.factText,/Historická úhrada v listopadovém seznamu/);
    }
    console.log("SUKL_NOVEMBER_215_CHROME_PASS "+JSON.stringify({
      release:SOURCE_THEME_RELEASE,path:PATH,novemberActive,
      officialPdfLinked:true,zeroCopayNotAssumed:true,thirdPartyRequestsSent:0,
      merchantClicks:0,formsSubmitted:0
    }));
  }finally{await page.close();}
}finally{await browser.close();}
