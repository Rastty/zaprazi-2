/**
 * 0.8.198 strict read-only production Chrome test for the walker hub's
 * two direct first-screen journeys. No form submission or merchant visits.
 * Must never turn a PR preview into a claim about the deployed version.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import {SOURCE_THEME_RELEASE,EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

if(process.env.GITHUB_EVENT_NAME==="pull_request"){
  console.log("PREDEPLOY_SKIP_WALKER_HERO_198");
  process.exit(0);
}
if(SOURCE_THEME_RELEASE!=="0.8.198"){
  console.log("NOT_APPLICABLE_WALKER_HERO_198");
  process.exit(0);
}
assert.equal(EXPECTED_LIVE_RELEASE,"0.8.198","Exact source/live QA required");

const origin="https://zaprazi.cz";
const readinessUrl=origin+"/wp-json/zaprazi/v1/affiliate-readiness";
const readinessResponse=await fetch(readinessUrl,{
  redirect:"error",headers:{Accept:"application/json"},signal:AbortSignal.timeout(20000)
});
assert.equal(readinessResponse.status,200,"Release readiness endpoint unavailable");
assert.equal(readinessResponse.url,readinessUrl,"Unexpected readiness redirect");
const readiness=await readinessResponse.json();
assert.equal(readiness.release,"0.8.198","New release not yet deployed");
assert.equal(readiness.integrity,"ok","Partial or mixed WordPress deployment");
assert.equal(readiness.configured_total,25);
assert.equal(readiness.slot_total,25);

const paths=[
  {href:"/choditko-do-bytu-pro-seniory/#poradce-choditko-byt",section:"#poradce-choditko-byt"},
  {href:"/rollator-pro-seniory/#poradce-rollator",section:"#poradce-rollator"}
];
const browser=await puppeteer.launch({
  executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
let nonGetRequests=0,merchantRequests=0;
try{
  const page=await browser.newPage();
  try{
    await page.setViewport({width:390,height:844,deviceScaleFactor:1});
    await page.setRequestInterception(true);
    page.on("request",request=>{
      let allowed=false;
      try{
        const url=new URL(request.url());
        if(request.method()!=="GET")nonGetRequests++;
        if(url.origin!==origin&&/lekarna|drmax|rehabilitac|unizdrav|affil|affiliate/i.test(url.hostname))
          merchantRequests++;
        allowed=url.origin===origin&&request.method()==="GET"&&
          url.search===""&&url.username===""&&url.password==="";
      }catch{}
      return (allowed?request.continue():request.abort("blockedbyclient")).catch(()=>{});
    });

    for(const {href,section} of paths){
      const response=await page.goto(origin+"/choditka-pro-seniory/",{
        waitUntil:"domcontentloaded",timeout:30000
      });
      assert.equal(response?.status(),200);
      const hero=await page.evaluate(()=>{
        const root=document.querySelector("main .zp-hero");
        return{
          release:document.querySelector('meta[name="zaprazi-release"]')?.content,
          integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
          primaryCount:root?.querySelectorAll("a.zp-btn").length,
          trackedCount:root?.querySelectorAll('a[data-zp-journey="advisor"]').length,
          hasMerchant:!!root?.querySelector('[data-zp-offer],[data-zp-merchant-link],a[rel~="sponsored"]')
        };
      });
      assert.equal(hero.release,"0.8.198");
      assert.equal(hero.integrity,"ok");
      assert.equal(hero.primaryCount,1);
      assert.equal(hero.trackedCount,1);
      assert.equal(hero.hasMerchant,false);
      const selector='main .zp-hero a[href="'+origin+href+'"]';
      const safeLink=await page.$eval(selector,a=>({
        href:a.href,rel:a.rel,tracked:a.hasAttribute("data-zp-journey"),
        visible:!!a.getClientRects().length&&getComputedStyle(a).visibility!=="hidden"
      }));
      assert.equal(safeLink.href,origin+href);
      assert.equal(safeLink.tracked,false,"Secondary link must not spoof primary funnel");
      assert.equal(safeLink.visible,true,"Link not visible on mobile");
      assert.ok(!safeLink.rel.includes("sponsored"));

      const banner=await page.evaluate(()=>{
        const el=document.querySelector("#zp-analytics-consent");
        return !!el&&!el.hidden&&!!el.getClientRects().length;
      });
      if(banner){
        await page.click("#zp-analytics-deny");
        await page.waitForFunction(()=>document.querySelector("#zp-analytics-consent")?.hidden===true,
          {timeout:5000});
      }
      await page.click(selector);
      await page.waitForFunction(expected=>location.href===expected,
        {timeout:18000,polling:250},origin+href);
      assert.equal(page.url(),origin+href);
      await page.waitForSelector(section,{visible:true,timeout:18000});
      assert.equal(await page.$eval('meta[name="zaprazi-release"]',el=>el.content),"0.8.198");
      assert.equal(await page.$eval('meta[name="zaprazi-integrity"]',el=>el.content),"ok");
    }
    assert.equal(nonGetRequests,0,"No user form or analytics POST allowed");
    assert.equal(merchantRequests,0,"No merchant request allowed");
    console.log("PASS_0_8_198_DIRECT_WALKER_HERO",JSON.stringify({
      release:"0.8.198",checkedPaths:paths.map(p=>p.href),merchantRequests,nonGetRequests,
      affiliateConfigured:25,answerPayloads:0
    }));
  }finally{await page.close();}
}finally{await browser.close();}
