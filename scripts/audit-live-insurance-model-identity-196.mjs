/**
 * Read-only exact-release production Chrome QA: reimbursement code must not
 * be presented as an interchangeable exact MEYRA model identity.
 * Never clicks manufacturer/merchant sites or submits advisor/health answers.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import {SOURCE_THEME_RELEASE,EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

if(process.env.GITHUB_EVENT_NAME==="pull_request"){
  console.log("PREDEPLOY_SKIP_WALKER_INSURANCE_MODEL_IDENTITY_196");
  process.exit(0);
}
if(SOURCE_THEME_RELEASE!=="0.8.196"){
  console.log("NOT_APPLICABLE_WALKER_INSURANCE_MODEL_IDENTITY_196");
  process.exit(0);
}
assert.equal(EXPECTED_LIVE_RELEASE,"0.8.196");
const origin="https://zaprazi.cz";
const readinessURL=origin+"/wp-json/zaprazi/v1/affiliate-readiness";
const r=await fetch(readinessURL,{redirect:"error",signal:AbortSignal.timeout(20000)});
assert.equal(r.status,200,"Expected exact live Zápraží readiness");
assert.equal(r.url,readinessURL,"Unexpected readiness redirect");
const readiness=await r.json();
assert.equal(readiness.release,"0.8.196");
assert.equal(readiness.integrity,"ok");
assert.equal(readiness.configured_total,25);
assert.equal(readiness.slot_total,25);
const browser=await puppeteer.launch({
  executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
let nonGetRequests=0,externalAttempts=0,merchantAttempts=0;
try{
  const page=await browser.newPage();
  await page.setViewport({width:390,height:844,deviceScaleFactor:1});
  await page.setRequestInterception(true);
  page.on("request",req=>{
    const url=req.url();
    let local=false;
    try{
      const u=new URL(url);
      local=u.origin===origin;
      if(!local){
        externalAttempts++;
        if(/lekarna|drmax|rehabilitac|unizdrav|affil|affiliate/i.test(u.hostname))
          merchantAttempts++;
      }
    }catch{}
    if(req.method()!=="GET")nonGetRequests++;
    (req.method()==="GET"&&local?req.continue():req.abort("blockedbyclient")).catch(()=>{});
  });
  try{
    const response=await page.goto(origin+"/choditko-na-pojistovnu/",
      {waitUntil:"domcontentloaded",timeout:30000});
    assert.equal(response?.status(),200);
    assert.equal(page.url(),origin+"/choditko-na-pojistovnu/");
    const data=await page.evaluate(()=>{
      const heading=document.getElementById("zp-identita-choditka-nadpis");
      const note=heading?.closest('[role="note"]');
      const section=document.querySelector("#zp-overit-mesicni-seznam");
      const noteText=note?.textContent||"";
      const links=[...note?.querySelectorAll("a[href]")||[]].map(a=>a.href);
      const heroCTA=document.querySelector("main .zp-hero a[data-zp-journey='advisor']");
      const visible=el=>Boolean(el&&el.getClientRects().length&&getComputedStyle(el).visibility!=="hidden");
      return{
        release:document.querySelector('meta[name="zaprazi-release"]')?.content,
        integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
        noteVisible:visible(note),noteHeading:heading?.textContent?.trim()||"",
        noteText,links,sourceSectionPresent:Boolean(section),
        faqVisible:[...document.querySelectorAll(".zp-faq summary")]
          .some(x=>x.textContent?.includes("Stačí kód SÚKL 5005963")),
        merchantCTAInsideNote:Boolean(note?.querySelector("[data-zp-merchant-link],[data-zp-offer]")),
        heroCTA:heroCTA?.href,
        historical:document.body.innerText.includes("Historická úhrada v říjnovém seznamu"),
        octoberCurrent:document.body.innerText.includes("Úhrada v aktuálním říjnovém seznamu")
      };
    });
    assert.equal(data.release,"0.8.196");
    assert.equal(data.integrity,"ok");
    assert.equal(data.noteVisible,true);
    assert.match(data.noteHeading,/Stejný kód ZP ještě neurčuje přesnou variantu/);
    for(const s of ["IDEAL ROLLATOR 3061982","ROLLATOR 2 3061982-R","07-5005963",
      "Samotný kód z pojišťovny tedy nestačí",
      "rozměry nedoplňujte odhadem","aktuální úhradu"])
      assert.ok(data.noteText.includes(s),
        "Missing visitor-visible source/fit warning: "+s+
        " | noteText="+JSON.stringify(data.noteText.replace(/\\s+/g," ").trim().slice(0,2200)));
    assert.ok(data.links.includes("https://www.meyra.cz/ctyrkolove-choditko-rollator.html"));
    assert.ok(data.links.includes("https://www.meyra.cz/ctyrkolove-choditko-rollator2.html"));
    assert.ok(data.links.includes(origin+"/choditko-na-pojistovnu/#zp-overit-mesicni-seznam")||
      data.links.includes("#zp-overit-mesicni-seznam"),
      "Official current-month SÚKL anchor absent");
    assert.equal(data.sourceSectionPresent,true);
    assert.equal(data.faqVisible,true);
    assert.equal(data.heroCTA,origin+"/#poradce","Unsafe or missing advisor route");
    assert.equal(data.merchantCTAInsideNote,false);
    assert.equal(data.historical,true,"Expired SÚKL figure must remain historical");
    assert.equal(data.octoberCurrent,false);
    assert.equal(nonGetRequests,0);
    assert.equal(merchantAttempts,0);
    console.log("PASS_0_8_196_INSURANCE_MODEL_IDENTITY",JSON.stringify({
      release:"0.8.196",integrity:"ok",page:"/choditko-na-pojistovnu/",
      models:2,manufacturerSources:2,monthHistorical:true,advisorSafe:true,
      faqPresent:true,nonGetRequests,merchantAttempts,externalAttempts,affiliateSlots:25
    }));
  }finally{await page.close();}
}finally{await browser.close();}
