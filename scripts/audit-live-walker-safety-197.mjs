/**
 * Exact 0.8.197 postdeploy Chrome acceptance for two walker hub safety changes.
 * Read-only: same-origin GET only, no merchant visits, no advisor answers,
 * no affiliate clicks, no identifying analytics or browser screenshots.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import {SOURCE_THEME_RELEASE,EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

if(process.env.GITHUB_EVENT_NAME==="pull_request"){
  console.log("PREDEPLOY_SKIP_WALKER_197_CHROME");
  process.exit(0);
}
if(SOURCE_THEME_RELEASE!=="0.8.197"){
  console.log("NOT_APPLICABLE_WALKER_197_CHROME");
  process.exit(0);
}
assert.equal(EXPECTED_LIVE_RELEASE,"0.8.197","Postdeploy must use source release");

const origin="https://zaprazi.cz";
const endpoint=origin+"/wp-json/zaprazi/v1/affiliate-readiness";
const readinessResponse=await fetch(endpoint,{
  redirect:"error",signal:AbortSignal.timeout(20000),headers:{Accept:"application/json"}
});
assert.equal(readinessResponse.status,200,"Readiness endpoint must be available");
assert.equal(readinessResponse.url,endpoint,"Unexpected readiness redirect");
const readiness=await readinessResponse.json();
assert.equal(readiness.release,"0.8.197","WordPress has not deployed 0.8.197");
assert.equal(readiness.integrity,"ok","Partial or inconsistent WordPress theme");
assert.equal(readiness.configured_total,25);
assert.equal(readiness.slot_total,25);

const browser=await puppeteer.launch({
  executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
let nonGetRequests=0,externalAttempts=0,merchantAttempts=0;
try{
  const page=await browser.newPage();
  try{
    await page.setViewport({width:390,height:844,deviceScaleFactor:1});
    await page.setRequestInterception(true);
    page.on("request",request=>{
      let permitted=false;
      try{
        const url=new URL(request.url());
        const local=url.origin===origin && !url.username && !url.password;
        if(!local){
          externalAttempts++;
          if(/lekarna|drmax|rehabilitac|unizdrav|affil|affiliate/i.test(url.hostname))
            merchantAttempts++;
        }
        permitted=local && request.method()==="GET" && !url.searchParams.has("s");
      }catch{}
      if(request.method()!=="GET")nonGetRequests++;
      return (permitted?request.continue():request.abort("blockedbyclient")).catch(()=>{});
    });

    const response=await page.goto(origin+"/choditka-pro-seniory/",{
      waitUntil:"domcontentloaded",timeout:30000
    });
    assert.equal(response?.status(),200,"Walker decision page must load");
    assert.equal(page.url(),origin+"/choditka-pro-seniory/");
    const data=await page.evaluate(()=>{
      const visible=el=>Boolean(el && el.getClientRects().length &&
        getComputedStyle(el).visibility!=="hidden");
      const cards=[...document.querySelectorAll("#vyber-typu article.zp-decision-card")];
      const outdoor=cards.find(c=>c.querySelector("h3")?.textContent.trim()==="Venku nebo doma i venku");
      const insurance=[...document.querySelectorAll("#jak-ziskat-choditko .zp-acquire-grid article")]
        .find(c=>c.querySelector("h3")?.textContent.trim()==="Pojišťovna");
      const source=[...insurance?.querySelectorAll("a[href]")||[]]
        .find(a=>a.href==="https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/proplaceni-choditka");
      const outdoorLink=outdoor?.querySelector("a[href]");
      const insuranceLink=[...insurance?.querySelectorAll("a[href]")||[]]
        .find(a=>a.href===location.origin+"/choditko-na-pojistovnu/");
      return{
        release:document.querySelector('meta[name="zaprazi-release"]')?.content,
        integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
        outdoorVisible:visible(outdoor),
        outdoorText:outdoor?.innerText.replace(/\s+/g," ").trim()||"",
        outdoorHref:outdoorLink?.href,
        outdoorMerchant:Boolean(outdoor?.querySelector("[data-zp-offer],[data-zp-merchant-link],a[rel~='sponsored']")),
        insuranceVisible:visible(insurance),
        insuranceText:insurance?.innerText.replace(/\s+/g," ").trim()||"",
        insuranceHref:insuranceLink?.href,
        insuranceMerchant:Boolean(insurance?.querySelector("[data-zp-offer],[data-zp-merchant-link],a[rel~='sponsored']")),
        sourceHref:source?.href,
        sourceRel:source?.rel||"",
        sourceTarget:source?.target||"",
        formCount:document.querySelectorAll("#vyber-typu form,#jak-ziskat-choditko form").length,
        advisorLink:document.querySelector("main .zp-hero a[data-zp-journey='advisor']")?.href
      };
    });
    assert.equal(data.release,"0.8.197");
    assert.equal(data.integrity,"ok");
    assert.equal(data.outdoorVisible,true);
    assert.match(data.outdoorText,/brzdy stisknout, bezpečně zastavit a zajistit parkovací brzdu/);
    assert.match(data.outdoorText,/praktické posouzení a nácvik/);
    assert.equal(data.outdoorHref,origin+"/rollator-pro-seniory/#poradce-rollator");
    assert.equal(data.outdoorMerchant,false);
    assert.equal(data.insuranceVisible,true);
    assert.match(data.insuranceText,/nekupujte chodítko z vlastních peněz/);
    assert.match(data.insuranceText,/není možné ani s následným doporučením lékaře/);
    assert.equal(data.insuranceHref,origin+"/choditko-na-pojistovnu/");
    assert.equal(data.sourceHref,"https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/proplaceni-choditka");
    assert.equal(data.sourceTarget,"_blank");
    assert.ok(data.sourceRel.split(/\s+/).includes("noopener"));
    assert.ok(data.sourceRel.split(/\s+/).includes("noreferrer"));
    assert.equal(data.insuranceMerchant,false);
    assert.equal(data.formCount,0);
    assert.equal(data.advisorLink,origin+"/#poradce");

    const consentVisible=await page.evaluate(()=>{
      const panel=document.querySelector("#zp-analytics-consent");
      return Boolean(panel&&!panel.hidden&&panel.getClientRects().length);
    });
    if(consentVisible){
      await page.click("#zp-analytics-deny");
      await page.waitForFunction(()=>document.querySelector("#zp-analytics-consent")?.hidden===true,
        {timeout:5000});
    }

    await page.click("#vyber-typu article.zp-decision-card:nth-child(2) a[href]");
    await page.waitForFunction(expected=>location.href===expected,{timeout:18000},
      origin+"/rollator-pro-seniory/#poradce-rollator");
    await page.waitForSelector("#poradce-rollator",{visible:true,timeout:18000});
    assert.equal(await page.$eval('meta[name="zaprazi-release"]',e=>e.content),"0.8.197");
    assert.equal(await page.$eval('meta[name="zaprazi-integrity"]',e=>e.content),"ok");

    await page.goto(origin+"/choditka-pro-seniory/",{waitUntil:"domcontentloaded",timeout:30000});
    await page.click("#jak-ziskat-choditko .zp-acquire-grid article:nth-child(3) a[href]");
    await page.waitForFunction(expected=>location.href===expected,{timeout:18000},
      origin+"/choditko-na-pojistovnu/");
    assert.equal(await page.$eval('meta[name="zaprazi-release"]',e=>e.content),"0.8.197");
    assert.equal(await page.$eval('meta[name="zaprazi-integrity"]',e=>e.content),"ok");
    assert.equal(nonGetRequests,0,"No non-GET requests are allowed");
    assert.equal(merchantAttempts,0,"No merchant tracking may be attempted");
    console.log("PASS_0_8_197_WALKER_HUB_POSTDEPLOY",JSON.stringify({
      release:"0.8.197",integrity:"ok",source:"/choditka-pro-seniory/",
      brakeWarning:true,reimbursementWarning:true,vzpSource:true,
      rollatorAdvisor:true,insuranceGuide:true,merchantAttempts,nonGetRequests,
      externalAttempts,affiliateSlots:25
    }));
  }finally{
    await page.close();
  }
}finally{
  await browser.close();
}
