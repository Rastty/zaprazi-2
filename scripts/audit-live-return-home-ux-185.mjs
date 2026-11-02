/**
 * Read-only, real-Chrome postdeploy acceptance for the 0.8.185 return-home UX.
 * Not a PR/predeploy substitute. No form answers, merchant clicks, storage,
 * screenshots or user data are submitted.
 */
import assert from "node:assert/strict";
import {accessSync,constants} from "node:fs";
import puppeteer from "puppeteer-core";
import {SOURCE_THEME_RELEASE,EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

const origin="https://zaprazi.cz";
const path="/navrat-z-nemocnice/";
const anchors=[
  ["/toaletni-zidle-vedle-postele/","#sedm-kontrol-zidle-postel"],
  ["/myti-vlasu-na-luzku/","#vyber-myti-vlasu"],
  ["/oblekani-ponozek-a-kalhot-bez-ohybani/","#podle-problemu-oblekani"],
  ["/hygiena-leziciho-seniora-doma/","#vyber-hygieny-na-luzku"],
  ["/nastupovani-seniora-do-auta/","#situace-nastupovani-auto"],
  ["/prevoz-seniora-k-lekari/","#vyber-dopravy"]
];
const versionAtLeast=(a,b)=>{
  const parts=s=>s.split(".").map(Number);
  const left=parts(a),right=parts(b);
  for(let i=0;i<3;i++)if(left[i]!==right[i])return left[i]>right[i];
  return true;
};
// A test-only QA PR may diagnose the ALREADY deployed identical release.
// The strict source-versus-live marker check below still applies.
if(process.env.GITHUB_EVENT_NAME==="pull_request" && process.env.ZP_SAME_RELEASE_QA_PR!=="1")
  throw new Error("Return-home live UX acceptance requires postdeploy or a same-release QA PR");
if(!versionAtLeast(SOURCE_THEME_RELEASE,"0.8.185")){
  console.log("NOT_APPLICABLE: live return-home UX is only required from source release 0.8.185");
  process.exit(0);
}
assert.equal(EXPECTED_LIVE_RELEASE,SOURCE_THEME_RELEASE,
  "A postdeploy acceptance must use the checked-out source release");
const chrome=[process.env.CHROME_BIN,"/usr/bin/google-chrome","/usr/bin/chromium"].filter(Boolean)
  .find(p=>{try{accessSync(p,constants.X_OK);return true;}catch{return false;}});
assert.ok(chrome,"Chrome is required for real postdeploy browser acceptance");
const browser=await puppeteer.launch({executablePath:chrome,headless:true,
  args:["--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage"]});

/** One retry for an intermittent CDN/HTML response; never treat missing
 * release metadata or the wrong release as a passing deployment. */
async function openChecked(page,knownPath){
  for(let attempt=0;attempt<2;attempt++){
    const response=await page.goto(origin+knownPath,{waitUntil:"domcontentloaded",timeout:25000});
    const actual=await page.$eval('meta[name="zaprazi-release"]',el=>el.content)
      .catch(()=>null);
    if(response?.status()===200&&actual===EXPECTED_LIVE_RELEASE)return;
    if(attempt===0){
      console.warn("RETRY_RELEASE_MARKER",knownPath,"missing_or_inconsistent");
      await page.setCacheEnabled(false);
      continue;
    }
    assert.equal(response?.status(),200,"Expected HTTP 200 on "+knownPath);
    assert.equal(actual,EXPECTED_LIVE_RELEASE,
      "Missing or incorrect release marker on "+knownPath);
  }
}
try{
  const page=await browser.newPage();
  await page.setViewport({width:390,height:844,deviceScaleFactor:1});
  await openChecked(page,path);
  const snapshot=await page.evaluate(()=>{
    const main=document.querySelector("main");
    const hero=main?.querySelector(".zp-hero");
    const cta=hero?.querySelector('a.zp-btn[href="#plan-navratu"]');
    const advisor=main?.querySelector("#plan-navratu");
    const steps=[...main.querySelectorAll("h2")]
      .find(node=>node.textContent.includes("Co má přednost před"));
    const guides=main?.querySelector("#navrat-prakticke-navody");
    const heading=document.querySelector("#navrat-prakticke-navody-title");
    const links=[...(guides?.querySelectorAll("a[href]")||[])]
      .filter(a=>a.getAttribute("href")!=="#plan-navratu")
      .map(a=>a.href);
    return {
      heroH1:hero?.querySelectorAll("h1").length||0,
      ctaPresent:!!cta&&cta.getBoundingClientRect().width>0,
      primaryBeforeAdvisor:!!cta&&!!advisor&&
        !!(cta.compareDocumentPosition(advisor)&Node.DOCUMENT_POSITION_FOLLOWING),
      advisorBeforeSafety:!!advisor&&!!steps&&
        !!(advisor.compareDocumentPosition(steps)&Node.DOCUMENT_POSITION_FOLLOWING),
      safetyBeforeGuides:!!steps&&!!guides&&
        !!(steps.compareDocumentPosition(guides)&Node.DOCUMENT_POSITION_FOLLOWING),
      namedGuides:guides?.getAttribute("aria-labelledby")==="navrat-prakticke-navody-title"&&!!heading,
      guideCards:guides?.querySelectorAll("article.zp-decision-card").length||0,
      guidesExplainSafety:guides?.textContent.includes("nenahrazují pokyny ošetřujícího týmu")||false,
      advisorReady:!!main?.querySelector("#zp-return-home-advisor")&&
        !!main?.querySelector("#zp-return-home-result")&&
        !!main?.querySelector("#zp-return-home-submit"),
      privacyNotice:!!main?.querySelector("#zp-return-home-privacy"),
      backToAdvisor:!!guides?.querySelector('a[href="#plan-navratu"]'),
      links
    };
  });
  assert.equal(snapshot.heroH1,1,"Hero must have one H1");
  for(const key of ["ctaPresent","primaryBeforeAdvisor","advisorBeforeSafety",
    "safetyBeforeGuides","namedGuides","guidesExplainSafety","advisorReady",
    "privacyNotice","backToAdvisor"]){
    assert.equal(snapshot[key],true,"Missing return-home UX safety invariant: "+key);
  }
  assert.equal(snapshot.guideCards,3,"Expected three grouped supporting guide cards");
  const expectedUrls=anchors.map(([p,h])=>origin+p+h).sort();
  for(const raw of snapshot.links){
    const u=new URL(raw);
    assert.equal(u.origin,origin,"Unexpected offsite supporting guide");
    assert.equal(u.search,"","Supporting guide must not leak answers through query parameters");
    assert.equal(u.username+u.password,"","Supporting guide cannot contain credentials");
  }
  assert.deepEqual(snapshot.links.sort(),expectedUrls,
    "The six reviewed supporting guide links must be present exactly once");

  await page.click('a.zp-btn[href="#plan-navratu"]');
  // Chromium's same-document hash navigation can be queued after the click
  // promise settles. Keep the real navigation invariant, but await the URL.
  await page.waitForFunction(()=>location.hash==="#plan-navratu",{timeout:4000});
  const jumped=await page.evaluate(()=>({
    hash:location.hash,advisor:!!document.querySelector("#plan-navratu")
  }));
  assert.equal(jumped.hash,"#plan-navratu","CTA must navigate to the actual advisor");
  assert.equal(jumped.advisor,true);
  await page.close();

  // Read-only, real Chromium navigation to every live destination. Source-
  // level anchor existence cannot certify published WordPress navigation.
  const destination=await browser.newPage();
  await destination.setViewport({width:390,height:844,deviceScaleFactor:1});
  for(const [target,hash] of anchors){
    await openChecked(destination,target+hash);
    const valid=await destination.evaluate(id=>!!document.getElementById(id),hash.slice(1));
    assert.equal(valid,true,"Destination anchor absent from live WordPress page: "+target);
  }
  await destination.close();
  console.log("PASS 0.8.185 RETURN_HOME_UX: mobile CTA, safety order, privacy, six real destination anchors");
}finally{
  await browser.close();
}
