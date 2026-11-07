/**
 * Read-only real Chrome acceptance of the 0.8.200 Mobility editorial handoffs.
 * Postdeploy only. No Advisor answers, analytics opt-in, affiliate requests or
 * WordPress writes. This runs for 0.8.200+ so later releases retain coverage.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import {SOURCE_THEME_RELEASE, EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

if (process.env.GITHUB_EVENT_NAME === "pull_request") {
  console.log("PREDEPLOY_SKIP_MOBILITY_GUIDE_HANDOFF_200");
  process.exit(0);
}
const components=release=>String(release).split(".").map(Number);
const atLeast=(release,minimum)=>{
  if(!/^\d+\.\d+\.\d+$/.test(release)) return false;
  const a=components(release),b=components(minimum);
  for(let i=0;i<3;i++){if(a[i]!==b[i])return a[i]>b[i];}
  return true;
};
if(!atLeast(SOURCE_THEME_RELEASE,"0.8.200")){
  console.log("NOT_APPLICABLE_MOBILITY_GUIDE_HANDOFF_200");
  process.exit(0);
}
assert.equal(EXPECTED_LIVE_RELEASE,SOURCE_THEME_RELEASE,"Only exact checked-out postdeploy source");

const origin="https://zaprazi.cz";
const readyUrl=origin+"/wp-json/zaprazi/v1/affiliate-readiness";
const readyResponse=await fetch(readyUrl,{
  method:"GET",redirect:"error",cache:"no-store",
  headers:{Accept:"application/json"},signal:AbortSignal.timeout(20000)
});
assert.equal(readyResponse.status,200,"Public readiness unavailable");
assert.equal(readyResponse.url,readyUrl,"Readiness redirect not allowed");
const readiness=await readyResponse.json();
assert.equal(readiness.release,SOURCE_THEME_RELEASE,"New version not deployed");
assert.equal(readiness.integrity,"ok","Incomplete production release");
assert.equal(readiness.slot_total,25);
assert.equal(readiness.configured_total,25);

// All targets must be same-origin, have no query parameters and have a real
// Advisor section. Do not accidentally treat a merchant CTA as an Advisor CTA.
const cases=[
  {
    from:"/choditka-pro-seniory/",
    selector:'main .zp-hero a[data-zp-journey="advisor"][href="https://zaprazi.cz/choditko-do-bytu-pro-seniory/#poradce-choditko-byt"]',
    target:"/choditko-do-bytu-pro-seniory/#poradce-choditko-byt",
    label:"Hlavně doma: poradce pro chodítko"
  },
  {
    from:"/choditka-pro-seniory/",
    selector:'main .zp-hero a[data-zp-journey="advisor"][href="https://zaprazi.cz/rollator-pro-seniory/#poradce-rollator"]',
    target:"/rollator-pro-seniory/#poradce-rollator",
    label:"Venku: poradce pro rollátor a brzdy"
  },
  {
    from:"/choditko-do-bytu-pro-seniory/",
    selector:'main .zp-hero a[data-zp-journey="advisor"][href="#poradce-choditko-byt"]',
    target:"/choditko-do-bytu-pro-seniory/#poradce-choditko-byt",
    label:"Ověřit vhodný typ v poradci"
  },
  {
    from:"/choditko-na-pojistovnu/",
    selector:'#rychla-cesta-na-epoukaz a[data-zp-journey="advisor"][href="https://zaprazi.cz/#poradce"]',
    target:"/#poradce",
    label:"Začít orientačním poradcem"
  }
];
const browser=await puppeteer.launch({
  executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
let nonGet=0,merchantAttempts=0,analyticsAttempts=0;
const checked=[];
try{
  for(const scenario of cases){
    const page=await browser.newPage();
    try{
      await page.setViewport({width:390,height:844,deviceScaleFactor:1});
      await page.setRequestInterception(true);
      page.on("request",request=>{
        let allow=false;
        try{
          const u=new URL(request.url());
          if(request.method()!=="GET")nonGet++;
          if(/(?:^|\.)google-analytics\.com$|(?:^|\.)googletagmanager\.com$/.test(u.hostname))
            analyticsAttempts++;
          if(/lekarna|drmax|rehabilitac|unizdrav|affil|affiliate|zdrava-obuv/i.test(u.hostname)&&u.origin!==origin)
            merchantAttempts++;
          allow=u.origin===origin&&request.method()==="GET"&&
            u.search===""&&!u.username&&!u.password;
        }catch{}
        return (allow?request.continue():request.abort("blockedbyclient")).catch(()=>{});
      });

      const start=origin+scenario.from;
      const response=await page.goto(start,{waitUntil:"domcontentloaded",timeout:30000});
      assert.equal(response?.status(),200,"Guide unavailable: "+scenario.from);
      assert.equal(page.url(),start,"Unexpected guide redirect");
      const htmlProof=await page.evaluate(()=>{
        const meta=name=>document.querySelector('meta[name="'+name+'"]')?.content;
        const hero=document.querySelector("main .zp-hero");
        const first=document.querySelector("#rychla-cesta-na-epoukaz");
        return {
          release:meta("zaprazi-release"),
          integrity:meta("zaprazi-integrity"),
          hubActions:hero?.querySelectorAll('a.zp-text-link[data-zp-journey="advisor"]').length,
          firstSteps:first?.querySelectorAll("ol > li").length,
          firstText:first?.innerText||"",
          insuranceOfferShortcut:!!first?.querySelector(
            '[data-zp-offer],[data-zp-merchant-link],a[rel~="sponsored"],form')
        };
      });
      assert.equal(htmlProof.release,SOURCE_THEME_RELEASE,"Mixed release on "+scenario.from);
      assert.equal(htmlProof.integrity,"ok","Corrupt release on "+scenario.from);
      if(scenario.from==="/choditka-pro-seniory/")
        assert.equal(htmlProof.hubActions,2,"Two explicit specialist paths must be visible");
      if(scenario.from==="/choditko-na-pojistovnu/"){
        assert.equal(htmlProof.firstSteps,3,"ePoukaz first answer needs three real steps");
        assert.match(htmlProof.firstText,/Neplaťte předem v očekávání zpětného proplacení/);
        assert.equal(htmlProof.insuranceOfferShortcut,false,"No merchant shortcut in first answer");
      }

      const link=await page.$eval(scenario.selector,anchor=>({
        href:anchor.href,text:anchor.textContent.trim(),
        visible:!!anchor.getClientRects().length&&getComputedStyle(anchor).visibility!=="hidden",
        sponsored:anchor.rel.split(/\s+/).includes("sponsored"),
        merchant:anchor.hasAttribute("data-zp-merchant-link")
      }));
      assert.equal(link.href,origin+scenario.target,"Exact safe route required");
      assert.equal(link.text,scenario.label,"Action copy changed");
      assert.equal(link.visible,true,"Advisor action hidden on mobile");
      assert.equal(link.sponsored,false,"Advisor handoff cannot be affiliate");
      assert.equal(link.merchant,false,"Advisor handoff cannot be merchant");
      const destination=new URL(link.href);
      assert.equal(destination.origin,origin);
      assert.equal(destination.search,"","No query/answers in destination");
      assert.match(destination.hash,/^#poradce(?:-[a-z0-9-]+)?$/);

      // Browser context is fresh: do not grant analytics consent. Deny any
      // visible banner so a user interaction cannot trigger consent.
      const granted=await page.evaluate(
        ()=>localStorage.getItem("zaprazi_analytics_consent_v1"));
      assert.notEqual(granted,"granted","QA must start with consent not granted");
      const visibleDeny=await page.evaluate(()=>{
        const banner=document.querySelector("#zp-analytics-consent");
        const deny=document.querySelector("#zp-analytics-deny");
        return !!banner&&!banner.hidden&&!!banner.getClientRects().length&&!!deny;
      });
      if(visibleDeny)await page.click("#zp-analytics-deny");

      await page.click(scenario.selector);
      await page.waitForFunction(expected=>location.href===expected,
        {timeout:18000,polling:250},origin+scenario.target);
      assert.equal(page.url(),origin+scenario.target,"Wrong user navigation");
      await page.waitForSelector(destination.hash,{visible:true,timeout:18000});
      assert.equal(await page.$eval('meta[name="zaprazi-release"]',e=>e.content),
        SOURCE_THEME_RELEASE,"Destination has wrong release");
      assert.equal(await page.$eval('meta[name="zaprazi-integrity"]',e=>e.content),
        "ok","Destination integrity failed");
      checked.push(scenario.from+" -> "+scenario.target);
    }finally{
      await page.close();
    }
  }
  assert.equal(nonGet,0,"Browser test must never submit answers or POST");
  assert.equal(merchantAttempts,0,"Browser test must never visit a merchant");
  assert.equal(analyticsAttempts,0,"Analytics must stay off without explicit opt-in");
  console.log("PASS_MOBILITY_GUIDE_HANDOFF_200",JSON.stringify({
    release:SOURCE_THEME_RELEASE,paths_checked:checked.length,
    affiliate_slots:25,nonGet,merchantAttempts,analyticsAttempts,
    answerPayloads:0
  }));
}finally{
  await browser.close();
}
