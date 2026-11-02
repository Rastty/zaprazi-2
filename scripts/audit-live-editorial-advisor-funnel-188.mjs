/**
 * Read-only Chrome acceptance of six editorial-to-Advisor CTAs in 0.8.188.
 * Synthetic anonymous browsing only. Never submit any answers, merchant
 * links, consent grants or personal data. Source tests separately prove
 * exact consent-only event dispatch and parameter-free analytics payload.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import {SOURCE_THEME_RELEASE,EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";
if(process.env.GITHUB_EVENT_NAME==="pull_request")
  throw new Error("0.8.188 postdeploy acceptance must not test a future PR on the old site");
if(SOURCE_THEME_RELEASE!=="0.8.188"){
  console.log("NOT_APPLICABLE: editorial Advisor funnel 0.8.188");
  process.exit(0);
}
assert.equal(EXPECTED_LIVE_RELEASE,SOURCE_THEME_RELEASE,"Exact source version required");
const origin="https://zaprazi.cz";
const readyRes=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness");
assert.equal(readyRes.status,200,"Public readiness API");
const ready=await readyRes.json();
assert.equal(ready.release,"0.8.188","Current WordPress theme must be deployed");
assert.equal(ready.integrity,"ok");
assert.equal(ready.configured_total,25);
assert.equal(ready.slot_total,25);
const cases=[
  ["/choditka-pro-seniory/","/#poradce"],
  ["/polohovaci-postel-na-pojistovnu/","/polohovaci-postel/#poradce-postel"],
  ["/polohovaci-postel/","/polohovaci-postel/#poradce-postel"],
  ["/invalidni-vozik/","/invalidni-vozik/#poradce-vozik"],
  ["/koupelna-a-wc/","/koupelna-a-wc/#poradce-koupelna"],
  ["/rollator-pro-seniory/","/rollator-pro-seniory/#poradce-rollator"]
];
const browser=await puppeteer.launch({executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
let forbiddenWrites=0,analyticsWithoutConsent=0;
const checkedTargets=new Set();
try{
  for(const [path,target] of cases){
    const page=await browser.newPage();
    await page.setViewport({width:390,height:844,deviceScaleFactor:1});
    await page.setRequestInterception(true);
    page.on("request",req=>{
      if(req.method()!=="GET"){forbiddenWrites++;return req.abort();}
      if(/googletagmanager\.com\/gtag\/js/.test(req.url()))analyticsWithoutConsent++;
      req.continue();
    });
    const res=await page.goto(origin+path,{waitUntil:"domcontentloaded",timeout:30000});
    assert.equal(res.status(),200,"Editorial URL must respond 200: "+path);
    const snapshot=await page.evaluate(()=>{
      const links=[...document.querySelectorAll('a[data-zp-journey="advisor"][href]')];
      return {
        release:document.querySelector('meta[name="zaprazi-release"]')?.content,
        integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
        links:links.map(a=>({href:a.getAttribute("href"),
          sponsored:a.matches('a[rel~="sponsored"]'),
          merchant:a.hasAttribute("data-zp-merchant-link"),
          button:a.classList.contains("zp-btn")}))
      };
    });
    assert.equal(snapshot.release,"0.8.188","Exact marker on "+path);
    assert.equal(snapshot.integrity,"ok","Integrity on "+path);
    assert.equal(snapshot.links.length,1,"One explicit primary CTA on "+path);
    const link=snapshot.links[0];
    assert.equal(link.button,true);
    assert.equal(link.sponsored,false);
    assert.equal(link.merchant,false);
    const destination=new URL(link.href,origin+path);
    assert.equal(destination.href,origin+target,"Correct safe Advisor anchor on "+path);
    assert.equal(destination.search,"","No query/answer storage in links");
    assert.match(destination.hash,/^#poradce(?:-[a-z0-9-]+)?$/);
    await page.close();
    if(!checkedTargets.has(target)){
      checkedTargets.add(target);
      const destPage=await browser.newPage();
      const targetResponse=await destPage.goto(origin+target,{waitUntil:"domcontentloaded",timeout:30000});
      assert.equal(targetResponse.status(),200,"Target reachable "+target);
      assert.equal(await destPage.evaluate(hash=>!!document.getElementById(hash.slice(1)),new URL(origin+target).hash),true,
        "Real Advisor anchor must exist "+target);
      await destPage.close();
    }
  }
  assert.equal(forbiddenWrites,0,"Read-only Chrome: no POST/writes");
  assert.equal(analyticsWithoutConsent,0,"Never load GA4 without explicit consent");
  console.log("PASS_0_8_188_EDITORIAL_ADVISOR_FUNNEL",JSON.stringify({
    release:"0.8.188",integrity:"ok",affiliate_slots:25,
    editorial_pages_checked:cases.length,unique_advisor_targets:checkedTargets.size,
    synthetic_health_answers:0,merchant_clicks:0,forbidden_writes:forbiddenWrites
  }));
}finally{await browser.close();}
