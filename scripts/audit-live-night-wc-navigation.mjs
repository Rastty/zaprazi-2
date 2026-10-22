/**
 * Read-only, postdeploy browser contract for the specific night WC problem.
 * Must not create analytic events, submit advisor answers or follow a merchant.
 * Run against the checked-out theme release.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import { EXPECTED_LIVE_RELEASE } from "./lib/live-release.mjs";
const origin="https://zaprazi.cz",expectedVersion=EXPECTED_LIVE_RELEASE;
const night="/nocni-cesta-z-postele-na-wc/";
const riser="/nastavec-na-wc-pro-seniory/";
const support="/madlo-k-wc-pro-seniory/";
const riserTarget=origin+riser+"#poradce-nastavec-wc";
const supportTarget=origin+support+"#poradce-opora-wc";
const fallback=origin+"/koupelna-a-wc/";
const expectedHome=origin+night;
const response=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",{signal:AbortSignal.timeout(30000)});
assert.equal(response.status,200,"Release readiness endpoint unavailable");
const ready=await response.json();
assert.equal(ready.release,expectedVersion,"Version not yet deployed");
assert.equal(ready.integrity,"ok","Partial deploy");
assert.equal(ready.configured_total,25,"Missing affiliate configuration");
const browser=await puppeteer.launch({executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
const inspected=[];
async function openPage(path){
  const page=await browser.newPage();
  await page.setJavaScriptEnabled(false);
  await page.setRequestInterception(true);
  page.on("request",req=>req.isNavigationRequest()&&req.url()===origin+path?req.continue():req.abort());
  const r=await page.goto(origin+path,{waitUntil:"domcontentloaded",timeout:30000});
  assert.equal(r?.status(),200,"HTTP failure: "+path);
  const data=await page.evaluate(()=>({
    release:document.querySelector('meta[name="zaprazi-release"]')?.content,
    integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
    canonical:document.querySelector('link[rel="canonical"]')?.href,
    h1s:document.querySelectorAll("main h1").length,
    idList:[...document.querySelectorAll("[id]")].map(n=>n.id),
    anchors:[...document.querySelectorAll("main a[href]")].map(a=>({href:a.href,text:a.textContent?.trim()||""})),
    issueCards:[...document.querySelectorAll(".zp-decision-card")].map(card=>({
      heading:card.querySelector("h3")?.textContent?.trim()||"",
      text:card.textContent?.trim()||"",
      links:[...card.querySelectorAll("a[href]")].map(a=>a.href)
    })),
    text:document.querySelector("main")?.textContent||""
  }));
  assert.equal(data.release,expectedVersion,"Page uses outdated theme: "+path);
  assert.equal(data.integrity,"ok","Page integrity check failed: "+path);
  assert.equal(data.h1s,1,"Wrong H1 count: "+path);
  assert.equal(data.canonical,origin+path,"Wrong canonical: "+path);
  inspected.push(path);
  await page.close();
  return data;
}
try{
  const overview=await openPage(night);
  const issue=overview.issueCards.find(c=>c.heading.includes("Člověk dojde, ale WC je příliš nízké"));
  assert.ok(issue,"Night article has no scenario-specific decision card");
  for(const expected of [riserTarget,supportTarget,fallback])
    assert.ok(issue.links.includes(expected),"Missing specialist/fallback in issue card: "+expected);
  assert.equal(issue.links.length,3,"Unexpected links or merchant destination in WC issue card");
  assert.match(issue.text,/Nástavec, toaletní rám a pevné madlo nejsou zaměnitelné/);
  const riserPage=await openPage(riser);
  const supportPage=await openPage(support);
  for(const [path,data,anchor] of [
    [riser,riserPage,"poradce-nastavec-wc"],
    [support,supportPage,"poradce-opora-wc"]
  ]){
    assert.ok(data.idList.includes(anchor),"Missing live advisor anchor on "+path);
    const back=data.anchors.find(a=>a.href===expectedHome&&a.text.includes("Projít celou noční trasu"));
    assert.ok(back,"No reciprocal contextual link from "+path);
    assert.match(data.text,/samotná pomůcka nemusí stačit/);
  }
  // 0.8.145: the pre-discharge checklist must lead to a practical first-night
  // problem and back without bypassing a safe product-selection stage.
  const discharge="/otazky-pred-propustenim-z-nemocnice/";
  const returnHome="/navrat-z-nemocnice/";
  const chair="/toaletni-zidle-pro-seniory/";
  const hospital=await openPage(discharge);
  assert.ok(hospital.idList.includes("wc-prvni-noc"),
    "Pre-discharge first-night WC section missing");
  const wcQuestions=hospital.issueCards.find(c=>c.heading==="Noční cesta z postele na WC");
  assert.ok(wcQuestions,"Hospital checklist lacks first-night WC questions");
  const routeTargets=[
    origin+night+"#nocni-audit",
    origin+chair+"#poradce-toaletni-zidle"
  ];
  assert.deepEqual(wcQuestions.links,routeTargets,
    "First-night WC section must link only to existing safety checklist and specialized Advisor");
  assert.match(wcQuestions.text,/fyzické zvedání|přesun nejistý/);
  assert.match(wcQuestions.text,/Samotná toaletní židle neřeší nebezpečný přesun/);

  const entry=origin+discharge+"#wc-prvni-noc";
  assert.ok(overview.idList.includes("nocni-audit"),"Night route checklist anchor missing");
  const unsafe=overview.issueCards.find(c=>c.heading==="Samostatná cesta na WC není bezpečná");
  assert.ok(unsafe&&unsafe.links.includes(entry),
    "Unsafe night-WC branch must link back to the hospital question");
  assert.match(unsafe.text,/Proberte bezpečný transfer/);
  const possibleChair=overview.issueCards.find(c=>c.heading.includes("WC je příliš daleko"));
  assert.ok(possibleChair&&possibleChair.links.includes(routeTargets[1]),
    "Potential bedside-chair branch must lead to the exact Advisor");

  const returnPage=await openPage(returnHome);
  const toiletPriority=returnPage.issueCards.find(c=>c.heading==="2. WC a postel");
  assert.ok(toiletPriority&&toiletPriority.links.includes(entry),
    "Return-home priority must link to the pre-discharge WC question");
  assert.match(toiletPriority.text,/Ještě před propuštěním/);

  const chairPage=await openPage(chair);
  assert.ok(chairPage.idList.includes("poradce-toaletni-zidle"),
    "Specialist destination no longer has the correct Advisor anchor");

  console.log("LIVE_NIGHT_WC_NAVIGATION",JSON.stringify({
    release:expectedVersion,integrity:ready.integrity,affiliate_slots:ready.configured_total,
    pages:inspected,issue_card_links:issue.links,riser_anchor:"poradce-nastavec-wc",
    support_anchor:"poradce-opora-wc",both_return_links:true,
    discharge_routes:routeTargets.length,reciprocal_hospital_links:2,
    bedside_chair_fit_advisor:true,merchant_links_followed:0
  }));
}finally{await browser.close();}
