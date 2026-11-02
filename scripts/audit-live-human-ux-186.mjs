/**
 * Postdeploy browser acceptance of the user-facing 0.8.186 changes.
 * Real Chrome; read-only interaction with public forms. No offer clicks,
 * WordPress writes, visitor records, health profile or screenshot uploads.
 */
import assert from "node:assert/strict";
import {accessSync,constants} from "node:fs";
import puppeteer from "puppeteer-core";
import {SOURCE_THEME_RELEASE,EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

// A test-only QA PR can diagnose the ALREADY deployed identical release.
// It never substitutes for the scheduled/authorized postdeploy acceptance.
if(process.env.GITHUB_EVENT_NAME==="pull_request" && process.env.ZP_SAME_RELEASE_QA_PR!=="1")
  throw new Error("This acceptance requires postdeploy or an explicit same-release read-only QA PR");
if(SOURCE_THEME_RELEASE!=="0.8.186"){
  console.log("NOT_APPLICABLE: 0.8.186 Human UX audit");
  process.exit(0);
}
assert.equal(EXPECTED_LIVE_RELEASE,SOURCE_THEME_RELEASE,
  "Only the checked-out 0.8.186 release may pass postdeploy acceptance");
const browserExecutable=[process.env.CHROME_BIN,"/usr/bin/google-chrome","/usr/bin/chromium"]
  .filter(Boolean).find(p=>{try{accessSync(p,constants.X_OK);return true;}catch{return false;}});
assert.ok(browserExecutable,"Real Chrome executable is required");
const browser=await puppeteer.launch({executablePath:browserExecutable,headless:true,
  args:["--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage"]});
const origin="https://zaprazi.cz";

async function open(page,path){
  for(let n=0;n<2;n++){
    const response=await page.goto(origin+path,{waitUntil:"domcontentloaded",timeout:30000});
    const metadata=await page.evaluate(()=>({
      release:document.querySelector('meta[name="zaprazi-release"]')?.content,
      integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content
    }));
    if(response?.status()===200&&metadata.release==="0.8.186"&&metadata.integrity==="ok")return;
    if(n===0){console.warn("RETRY_186_RELEASE_MARKERS",path);await page.setCacheEnabled(false);}
    else {
      assert.equal(response?.status(),200,"HTTP 200 on "+path);
      assert.equal(metadata.release,"0.8.186","Exact live release on "+path);
      assert.equal(metadata.integrity,"ok","Runtime integrity on "+path);
    }
  }
}

try {
  const page=await browser.newPage();
  await page.setViewport({width:390,height:844,deviceScaleFactor:1});
  await open(page,"/pujceni-choditka/");
  const initial=await page.evaluate(()=>{
    const form=document.querySelector("#zp-walker-own-quote-budget");
    return {
      visible:!!form&&!form.hidden,
      sourcePricePrefilled:!!document.querySelector("#zp-walker-own-quote-monthly")?.value,
      noServerAction:!form?.getAttribute("action"),
      liveRateCalculator:!!document.querySelector("#zp-walker-rental-budget")
    };
  });
  assert.equal(initial.visible,true,"Voluntary visitor-verified quote must be visible");
  assert.equal(initial.sourcePricePrefilled,false,"Old provider price must never be prefilled");
  assert.equal(initial.noServerAction,true,"Custom quote must stay in the browser");
  const beginningUrl=page.url();
  await page.$eval("#zp-walker-own-quote-monthly",el=>{
    el.value="450";el.dispatchEvent(new Event("input",{bubbles:true}));
  });
  await page.select("#zp-walker-own-quote-months","3");
  await page.click('#zp-walker-own-quote-budget button[type="submit"]');
  const price=await page.$eval("#zp-walker-own-quote-result",el=>el.textContent);
  assert.match(price,/1[\s\u00a0\u202f]*350/,"450 Kč x 3 = 1 350 Kč");
  assert.match(price,/kauci, dopravu/);
  assert.equal(page.url(),beginningUrl,"Quote must never be sent in URL");

  await page.$eval("#zp-walker-own-quote-monthly",el=>{
    el.value="500";el.dispatchEvent(new Event("input",{bubbles:true}));
  });
  const afterInput=await page.$eval("#zp-walker-own-quote-result",el=>el.textContent);
  assert.doesNotMatch(afterInput,/1[\s\u00a0\u202f]*350/,"Old estimate cleared when own input changes");
  await page.close();

  const family=await browser.newPage();
  await family.setViewport({width:390,height:844,deviceScaleFactor:1});
  await open(family,"/navrat-z-nemocnice/");
  // Static, synthetic and intentionally unsafe scenario; never stored or sent.
  const answers={
    timing:"today_or_tomorrow",
    entranceReady:"no",transferAbility:"person_assist",
    walking:"independent",toiletReady:"no",bathroomReady:"yes",
    bedReady:"no",homeCare:"needed_not_arranged"
  };
  for(const [name,value] of Object.entries(answers)){
    const selector='input[name="'+name+'"][value="'+value+'"]';
    await family.$eval(selector,el=>{el.checked=true;el.dispatchEvent(
      new Event("change",{bubbles:true})
    );});
  }
  await family.click("#zp-return-home-submit");
  const result=await family.evaluate(()=>{
    const el=document.querySelector("#zp-return-home-result");
    const critical=el?.querySelector(".zp-critical-plan");
    const overview=el?.querySelector(".zp-return-overview");
    const full=el?.querySelector(".zp-return-checklist");
    return {
      visible:!!el&&!el.hidden,
      criticalCount:critical?.querySelectorAll("article").length||0,
      overviewCards:overview?.querySelectorAll("article.zp-decision-card").length||0,
      overviewTitle:overview?.querySelector("#zp-return-overview-title")?.textContent,
      plainText:overview?.textContent,
      checklistPresent:!!full,
      criticalBeforeOverview:!!critical&&!!overview&&
        !!(critical.compareDocumentPosition(overview)&Node.DOCUMENT_POSITION_FOLLOWING),
      overviewBeforeChecklist:!!overview&&!!full&&
        !!(overview.compareDocumentPosition(full)&Node.DOCUMENT_POSITION_FOLLOWING),
      order:!!critical&&!!overview&&!!full&&
        !!(critical.compareDocumentPosition(overview)&Node.DOCUMENT_POSITION_FOLLOWING)&&
        !!(overview.compareDocumentPosition(full)&Node.DOCUMENT_POSITION_FOLLOWING),
      printAvailable:!!el?.querySelector("#zp-return-home-print"),
      linkLeak:!![...document.querySelectorAll("a[href]")]
        .some(a=>a.href.includes("person_assist")||a.href.includes("needed_not_arranged"))
    };
  });
  assert.equal(result.visible,true);
  assert.ok(result.criticalCount>=3,"Unsafe return requires multiple explicit blockers");
  assert.equal(result.overviewCards,3,"Three practical orientation cards expected");
  assert.equal(result.overviewTitle,"Váš plán ve třech bodech");
  console.log("LIVE_186_PLAN_DOM",JSON.stringify({critical:result.criticalCount,overviewCards:result.overviewCards,checklistPresent:result.checklistPresent,criticalBeforeOverview:result.criticalBeforeOverview,overviewBeforeChecklist:result.overviewBeforeChecklist,printAvailable:result.printAvailable}));
  assert.equal(result.checklistPresent,true,"Original full family task list must be present");
  assert.equal(result.order,true,"Full critical blockers must precede orientation and checklist");
  assert.equal(result.printAvailable,true);
  assert.equal(result.linkLeak,false,"Health-state answer must never leak in links");
  assert.match(result.plainText,/Co víme z odpovědí/);
  assert.match(result.plainText,/Co ještě ověřit/);
  assert.match(result.plainText,/Co udělat jako první/);
  assert.match(result.plainText,/Nejde o potvrzení zdravotní způsobilosti/);

  await family.$eval('input[name="entranceReady"][value="yes"]',el=>{
    el.checked=true;el.dispatchEvent(new Event("change",{bubbles:true}));
  });
  assert.equal(await family.$eval("#zp-return-home-result",el=>el.hidden),true,
    "Changing a critical answer must remove the stale result and every offer");
  assert.equal(new URL(family.url()).search,"","Answers must not appear in URL");
  await family.close();
  console.log("PASS 0.8.186 LIVE HUMAN UX: verified-price quote, critical-first family plan, browser privacy");
}finally{
  await browser.close();
}
