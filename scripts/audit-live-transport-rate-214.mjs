#!/usr/bin/env node
/**
 * Exact-source read-only postdeploy acceptance for the VZP 2026
 * private-vehicle travel rate and medical transport answer.
 * Do not click merchants, submit forms or transmit Advisor answers.
 */
import assert from "node:assert/strict";
import {SOURCE_THEME_RELEASE,EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

if(process.env.GITHUB_EVENT_NAME==="pull_request"){
  console.log("TRANSPORT_RATE_214_PREDEPLOY_SKIP");
  process.exit(0);
}
const atLeast=(a,b)=>a.split(".").map(Number).reduce((result,n,i)=>{
  if(result!==0)return result;
  const other=Number(b.split(".")[i]);
  return Math.sign(n-other);
},0)>=0;
if(!atLeast(SOURCE_THEME_RELEASE,"0.8.214")){
  console.log("TRANSPORT_RATE_214_NOT_YET_RELEASED");
  process.exit(0);
}
assert.equal(EXPECTED_LIVE_RELEASE,SOURCE_THEME_RELEASE,
  "Live WordPress release must match the exact checked-out source");
const ORIGIN="https://zaprazi.cz";
const PATH="/prevoz-seniora-k-lekari/";
const VZP_RATE_SOURCE="https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/prispevek-na-dopravu-taxi-sluzbou";
const VZP_ELIGIBILITY="https://www.vzp.cz/o-nas/nejcasteji-resite/otazka/mam-narok-na-proplaceni-dopravy-k-lekari";

const nowParts=Object.fromEntries(new Intl.DateTimeFormat("en-GB",{
  timeZone:"Europe/Prague",year:"numeric",month:"2-digit",day:"2-digit"
}).formatToParts(new Date()).map(({type,value})=>[type,value]));
const today=[nowParts.year,nowParts.month,nowParts.day].join("-");
const rateValid=today>="2026-01-01"&&today<="2026-12-31";

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
          ![...u.searchParams.keys()].some(k=>/answer|health|diagnos|patient|symptom|weight|condition/i.test(k));
      }catch{}
      void(allowed?req.continue():req.abort("blockedbyclient")).catch(()=>{});
    });
    const response=await page.goto(ORIGIN+PATH,{waitUntil:"domcontentloaded",timeout:35000});
    assert.equal(response?.status(),200,"Transport guide must be public HTTP 200");
    const view=await page.evaluate(()=>{
      const hero=document.querySelector("main .zp-hero");
      const answer=hero?.querySelector("#rychla-odpoved-prevoz");
      const cards=[...document.querySelectorAll("#vyber-dopravy .zp-decision-card")];
      const car=cards.find(x=>/Schválená cesta soukromým vozidlem/.test(x.textContent||""));
      const carText=car?.textContent||"";
      const carLinks=[...car?.querySelectorAll("a[href]")||[]].map(x=>x.href);
      const answerLinks=[...answer?.querySelectorAll("a[href]")||[]].map(x=>x.href);
      return {
        path:location.pathname,search:location.search,
        release:document.querySelector('meta[name="zaprazi-release"]')?.content||"",
        integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content||"",
        canonical:document.querySelector('link[rel="canonical"]')?.href||"",
        h1:document.querySelectorAll("main h1").length,
        mobileOverflow:document.documentElement.scrollWidth-innerWidth,
        answerCount:document.querySelectorAll("#rychla-odpoved-prevoz").length,
        answerText:answer?.textContent||"",
        heroSource:answerLinks.includes("https://www.vzp.cz/o-nas/nejcasteji-resite/otazka/mam-narok-na-proplaceni-dopravy-k-lekari"),
        doctorAnchor:answerLinks.includes(location.origin+location.pathname+"#kdo-vystavuje-prikaz"),
        carCount:cards.filter(x=>/Schválená cesta soukromým vozidlem/.test(x.textContent||"")).length,
        currentRate:carText.includes("7,98 Kč/km"),
        staleRate:carText.includes("Historická sazba 2026 již není aktuální"),
        rateConditions:/zdravotní indikace a souhlas lékaře/i.test(carText)&&
          /řízeným jinou osobou/i.test(carText)&&/s pacientem/.test(carText)&&
          /ne libovolné kilometry rodiny/.test(carText),
        rateSource:carLinks.includes("https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/prispevek-na-dopravu-taxi-sluzbou"),
        expirySource:carLinks.includes("https://www.vzp.cz/o-nas/nejcasteji-resite/otazka/mam-narok-na-proplaceni-dopravy-k-lekari"),
        noMerchant:!car?.querySelector('[data-zp-merchant-link],[data-zp-offer],a[rel~="sponsored"]'),
        noForm:!car?.querySelector("form,input,textarea")
      };
    });
    assert.equal(view.path,PATH);
    assert.equal(view.search,"","No answer or sensitive fields in canonical URL");
    assert.equal(view.release,SOURCE_THEME_RELEASE);
    assert.equal(view.integrity,"ok");
    assert.equal(view.canonical,ORIGIN+PATH);
    assert.equal(view.h1,1);
    assert.ok(view.mobileOverflow<=2,"Unexpected mobile horizontal overflow");
    assert.equal(view.answerCount,1);
    assert.equal(view.carCount,1);
    assert.equal(view.heroSource,true);
    assert.equal(view.doctorAnchor,true);
    assert.match(view.answerText,/zdravotní stav neumožňuje běžnou cestu/);
    assert.match(view.answerText,/Příkaz ke zdravotnímu transportu/);
    assert.match(view.answerText,/Samotný věk, chybějící auto nebo špatné spojení nárok nezakládají/);
    assert.equal(view.noMerchant,true);
    assert.equal(view.noForm,true);
    if(rateValid){
      assert.equal(view.currentRate,true,"2026 VZP mileage rate was not published");
      assert.equal(view.staleRate,false);
      assert.equal(view.rateConditions,true,"2026 rate missing clinical/transport eligibility limits");
      assert.equal(view.rateSource,true,"Official source missing for the published amount");
    }else{
      assert.equal(view.currentRate,false,"Expired 2026 rate must not be shown as current");
      assert.equal(view.staleRate,true);
      assert.equal(view.expirySource,true,"Future-year rate requires current official source");
    }
    console.log("TRANSPORT_RATE_214_CHROME_PASS "+JSON.stringify({
      release:SOURCE_THEME_RELEASE,canonical:PATH,
      bounded2026RateVisible:rateValid,officialRateSourceConfirmed:rateValid&&view.rateSource,
      noMerchantClicks:true,noFormsSubmitted:true,noThirdPartyRequests:true
    }));
  }finally{await page.close();}
}finally{await browser.close();}
