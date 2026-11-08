#!/usr/bin/env node
/**
 * Read-only Chrome acceptance of the three launch-critical Mobility product
 * paths. All product and network URLs are compared INSIDE the browser; no
 * tracking URL or health-answer combination is ever returned or logged.
 * Never clicks merchants or follows CJ/eHUB redirects.
 */
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";
import {MOBILITY_PRODUCTS} from "../src/mobility/catalog.js";

const ORIGIN="https://zaprazi.cz";
export const SCENARIOS=Object.freeze([
  {id:"wa17",key:"rehabilitacni-pomucky-cz:besco-wa17",
    title:"BESCO WA17",environment:"indoor",canLiftWalker:"yes",
    handBrakes:null,brakes:false,otherLocked:true},
  {id:"wa21",key:"rehabilitacni-pomucky-cz:besco-wa21",
    title:"BESCO WA21",environment:"indoor",canLiftWalker:"no",
    handBrakes:null,brakes:false,otherLocked:false},
  {id:"meyra",key:"lekarna-cz:meyra-ideal-3061982",
    title:"MEYRA Ideal Rollator",environment:"outdoor",canLiftWalker:null,
    handBrakes:"yes",brakes:true,otherLocked:false}
]);

export function validOfferCard(result,expected,unlocked=false){
  assert.equal(result.cardCount,1,expected.id+": exact card must exist once");
  assert.equal(result.linkCount,expected.id==="meyra"?2:1,
    expected.id+": exact source-backed merchant link count required");
  assert.equal(result.affiliateCount,1,expected.id+": exactly one approved affiliate CTA");
  assert.equal(result.directCount,expected.id==="meyra"?1:0,
    expected.id+": manufacturer route must remain separate");
  assert.equal(result.directMatches,true,expected.id+": direct manufacturer path/rel mismatch");
  assert.equal(result.runtimeMatches,true,expected.id+": CTA must use THIS product's runtime affiliate slot");
  assert.equal(result.sponsored,true,expected.id+": publisher disclosure and safe target required");
  assert.equal(result.sameModel,true,expected.id+": exact model title mismatch");
  assert.equal(result.requiredControlsOk,true,expected.id+": corrupted model-specific fit checklist");
  assert.equal(result.hasBrakeControl,expected.brakes,expected.id+": incorrect braking gate");
  assert.equal(result.hidden,!unlocked,expected.id+": merchant link prematurely shown or not unlocked");
  assert.equal(result.directVisibilityMatches,true,expected.id+": direct offer bypassed model gate");
  assert.equal(result.otherModelsLocked,true,expected.id+": another product card was accidentally unlocked");
}

async function readCard(page,expected){
  const model=MOBILITY_PRODUCTS.find(p=>p.offers?.some(o=>o.affiliateKey===expected.key));
  assert.ok(model,"Canonical model missing in source catalog");
  const directUrls=model.offers.filter(o=>!o.affiliateKey).map(o=>o.url);
  // Public canonical manufacturer URLs are passed into the browser but never logged.
  // Publisher tracking URLs never leave the browser-side equality checks.
  return page.evaluate(({key,title,directUrls})=>{
    const root=document.querySelector("#zp-mobility-result");
    const cards=[...root?.querySelectorAll(".zp-product-card")||[]];
    const matching=cards.filter(card=>card.querySelector("h4")?.textContent.includes(title));
    const card=matching[0];
    const links=card?[...card.querySelectorAll("a[data-zp-merchant-link]")]:[];
    const sponsoredLinks=links.filter(a=>(a.getAttribute("rel")||"").split(/\s+/).includes("sponsored"));
    const directLinks=links.filter(a=>!sponsoredLinks.includes(a));
    const link=sponsoredLinks[0];
    const gate=card?.querySelector(".zp-mobility-fit-gate");
    const expectedKeys=gate?.getAttribute("data-zp-fit-required")?.split(",")||[];
    const actual=[...gate?.querySelectorAll("[data-zp-mobility-fit-confirm]")||[]]
      .map(box=>box.getAttribute("data-zp-mobility-fit-confirm"));
    const runtime=window.ZaPraziRuntime?.affiliateMap;
    const rel=link?.getAttribute("rel")?.split(/\s+/)||[];
    const otherModelsLocked=cards.filter(item=>item!==card)
      .every(item=>[...item.querySelectorAll("[data-zp-merchant-link]")].every(a=>Boolean(a.closest("[hidden]"))));
    return {
      cardCount:matching.length,
      linkCount:links.length,
      affiliateCount:sponsoredLinks.length,
      directCount:directLinks.length,
      directMatches:directLinks.length===directUrls.length&&
        directLinks.every((a,i)=>a.getAttribute("href")===directUrls[i]&&
          a.getAttribute("target")==="_blank"&&
          ["noopener","nofollow"].every(x=>(a.getAttribute("rel")||"").split(/\s+/).includes(x))&&
          !a.closest(".zp-offer")?.querySelector(".zp-affiliate-label")),
      sameModel:Boolean(card&&card.querySelector("h4")?.textContent.includes(title)),
      runtimeMatches:Boolean(link&&typeof runtime?.[key]==="string"&&
        link.getAttribute("href")===runtime[key]),
      sponsored:Boolean(link&&link.getAttribute("target")==="_blank"&&
        ["noopener","nofollow","sponsored"].every(token=>rel.includes(token))&&
        link.closest(".zp-offer")?.querySelector(".zp-affiliate-label")?.textContent.includes("Partnerský odkaz")),
      requiredControlsOk:expectedKeys.length>=3&&expectedKeys.length===actual.length&&
        new Set(actual).size===actual.length&&expectedKeys.every((x,i)=>x===actual[i]),
      hasBrakeControl:actual.includes("brakes"),
      hidden:Boolean(link?.closest("[hidden]")),
      directVisibilityMatches:directLinks.every(a=>
        Boolean(a.closest("[hidden]"))===Boolean(link?.closest("[hidden]"))),
      otherModelsLocked
    };
  },{key:expected.key,title:expected.title,directUrls});
}

async function choose(page,name,value){
  const selector='input[name="'+name+'"][value="'+value+'"]';
  await page.$eval(selector,el=>{
    if(el.closest("[hidden]"))throw new Error("HIDDEN_QUESTION");
    el.click();
  });
}

async function evaluateSafety(page){
  return page.evaluate(()=>{
    const root=document.querySelector("#zp-mobility-result");
    return {
      hidden:root?.hidden,
      visibleMerchants:[...root?.querySelectorAll("[data-zp-merchant-link]")||[]]
        .filter(a=>!a.closest("[hidden]")).length
    };
  });
}

export async function runBrowserAcceptance(){
  const puppeteer=(await import("puppeteer-core")).default;
  const browser=await puppeteer.launch({
    executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
    headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
  });
  let blockedNonGet=0,blockedMerchant=0;
  const complete=[];
  try{
    for(const scenario of SCENARIOS){
      const page=await browser.newPage();
      try{
        await page.setViewport({width:390,height:844,deviceScaleFactor:1});
        page.setDefaultTimeout(12000);
        await page.setRequestInterception(true);
        page.on("request",request=>{
          let permit=false;
          try{
            const u=new URL(request.url());
            const local=u.origin===ORIGIN&&!u.username&&!u.password;
            const safeQuery=[...u.searchParams.keys()].every(k=>
              !/^(?:answer|answers|health|patient|diagnosis|supportneed|canliftwalker|handbrakes|weight)$/i.test(k));
            permit=local&&request.method()==="GET"&&safeQuery;
            if(!local&&/(?:ehub|kqzyfj|dpbolvw|anrdoezrs|tkqlhce|jdoqocy|lekarna|rehabilitacni)/i.test(u.hostname))
              blockedMerchant++;
          }catch{}
          if(request.method()!=="GET")blockedNonGet++;
          return (permit?request.continue():request.abort("blockedbyclient")).catch(()=>{});
        });

        const response=await page.goto(ORIGIN+"/",{waitUntil:"networkidle2",timeout:35000});
        assert.equal(response?.status(),200,"Homepage must serve HTTP 200");
        const meta=await page.evaluate(()=>({
          release:document.querySelector('meta[name="zaprazi-release"]')?.content,
          integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
          runtimeCount:Object.keys(window.ZaPraziRuntime?.affiliateMap||{}).length
        }));
        assert.equal(meta.release,EXPECTED_LIVE_RELEASE,"Exact deployed release required");
        assert.equal(meta.integrity,"ok","Partial WordPress release");
        assert.equal(meta.runtimeCount,25,"All 25 publisher slots must reach browser");

        if(await page.$("#zp-analytics-deny"))
          await page.$eval("#zp-analytics-deny",el=>el.click());

        await choose(page,"environment",scenario.environment);
        await choose(page,"supportNeed","steady");
        if(scenario.canLiftWalker)await choose(page,"canLiftWalker",scenario.canLiftWalker);
        if(scenario.handBrakes)await choose(page,"handBrakes",scenario.handBrakes);
        await page.$eval("#zp-mobility-submit",el=>el.click());
        await page.waitForSelector("#zp-mobility-result:not([hidden]) .zp-product-card");

        validOfferCard(await readCard(page,scenario),scenario,false);
        await page.evaluate(title=>{
          const card=[...document.querySelectorAll("#zp-mobility-result .zp-product-card")]
            .find(el=>el.querySelector("h4")?.textContent.includes(title));
          for(const box of card.querySelectorAll("[data-zp-mobility-fit-confirm]"))box.click();
        },scenario.title);
        validOfferCard(await readCard(page,scenario),scenario,true);

        // Existing product offer must disappear after any answer changes.
        await choose(page,"supportNeed","light");
        const after=await evaluateSafety(page);
        assert.equal(after.hidden,true,"Changed input must hide old result");
        assert.equal(after.visibleMerchants,0,"Old product route cannot remain usable");
        assert.equal(new URL(page.url()).search,"","Advisor answer must never enter URL");
        complete.push(scenario.id);
      }finally{await page.close();}
    }

    // An unsafe braking answer must never display a merchant link.
    const page=await browser.newPage();
    try{
      await page.setRequestInterception(true);
      page.on("request",req=>{
        let permitted=false;
        try{const u=new URL(req.url());permitted=u.origin===ORIGIN&&req.method()==="GET";}catch{}
        if(req.method()!=="GET")blockedNonGet++;
        void (permitted?req.continue():req.abort("blockedbyclient")).catch(()=>{});
      });
      await page.goto(ORIGIN+"/",{waitUntil:"networkidle2",timeout:35000});
      await choose(page,"environment","outdoor");
      await choose(page,"supportNeed","steady");
      await choose(page,"handBrakes","unknown");
      await page.$eval("#zp-mobility-submit",el=>el.click());
      const blocked=await evaluateSafety(page);
      assert.equal(blocked.visibleMerchants,0,"Unknown brakes must not offer rollator");
    }finally{await page.close();}
    assert.equal(blockedMerchant,0,"No merchant tracking request without real user click");
    assert.equal(blockedNonGet,0,"Read-only QA must never make POST/non-GET");
    return {release:EXPECTED_LIVE_RELEASE,verifiedProducts:complete.length,
      models:complete,unknownBrakesBlocked:true,merchantRequests:0,nonGetRequests:0};
  }finally{await browser.close();}
}

if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
  runBrowserAcceptance().then(summary=>{
    console.log("MOBILITY_3_OFFERS_CHROME_PASS "+JSON.stringify(summary));
  }).catch(error=>{
    // Do not print URLs, tracking IDs, responses, visitor answers or stacks.
    console.error("MOBILITY_3_OFFERS_CHROME_FAILED "+String(error.message)
      .replace(/https?:\/\/\S+/g,"[redacted]"));
    process.exitCode=1;
  });
}
