/**
 * Actual live Chrome read-only acceptance for PR #494:
 * central Bathroom/WC Advisor candidate, model-fit gate, editing, stale-offer
 * removal, changed family, blocked results and non-commercial privacy.
 * No POST, no merchant clicks, no storage or patient data transport.
 */
import assert from "node:assert/strict";
import {accessSync,constants} from "node:fs";
import puppeteer from "puppeteer-core";

const origin=(process.env.ZP_LIVE_ORIGIN||"https://zaprazi.cz").replace(/\/$/,"");
const chrome=[process.env.CHROME_BIN,"/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"]
  .filter(Boolean).find(p=>{try{accessSync(p,constants.X_OK);return true;}catch{return false;}});
assert.ok(chrome,"Real Chrome/Chromium is required");
const readiness=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",
  {signal:AbortSignal.timeout(25000)}).then(r=>{assert.equal(r.status,200);return r.json();});
assert.equal(readiness.integrity,"ok");
assert.ok(readiness.configured_total>=25);
assert.equal(readiness.configured_total,readiness.slot_total);

const browser=await puppeteer.launch({executablePath:chrome,headless:true,
  args:["--no-sandbox","--disable-dev-shm-usage","--disable-setuid-sandbox"]});
const errors=[],writes=[],checks=[];
const result="#zp-bathroom-result",preview="#zp-bathroom-preview",
  stage="#zp-bathroom-fit-stage",submit="#zp-bathroom-submit";
try{
  const page=await browser.newPage();
  try{
    await page.setViewport({width:390,height:844,deviceScaleFactor:1});
    page.setDefaultTimeout(16000);
    await page.setRequestInterception(true);
    page.on("request",req=>{
      if(req.method()!=="GET"){writes.push(req.method());return req.abort();}
      if(req.url().startsWith(origin+"/")||req.url().startsWith("data:")||req.url().startsWith("about:"))return req.continue();
      req.abort();
    });
    page.on("pageerror",e=>errors.push(e.message));
    const res=await page.goto(origin+"/koupelna-a-wc/",{waitUntil:"networkidle2",timeout:45000});
    assert.equal(res?.status(),200);
    const metadata=await page.evaluate(()=>({
      release:document.querySelector('meta[name="zaprazi-release"]')?.content,
      integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
      canonical:document.querySelector('link[rel="canonical"]')?.href,
      h1:document.querySelectorAll("main h1").length
    }));
    assert.equal(metadata.release,readiness.release);
    assert.equal(metadata.integrity,"ok");
    assert.equal(metadata.canonical,origin+"/koupelna-a-wc/");
    assert.equal(metadata.h1,1);

    const choose=async(name,value)=>{
      await page.$eval('input[name="'+name+'"][value="'+value+'"]',input=>{
        if(input.closest("[hidden]"))throw Error("Selected hidden answer "+input.name);
        input.click();
      });
    };
    const send=async()=>page.$eval(submit,b=>b.click());
    const shown=async(selector)=>page.waitForFunction(sel=>document.querySelector(sel)?.hidden===false,
      {timeout:16000},selector);
    const state=async()=>page.$eval(result,root=>({
      hidden:root.hidden,
      markup:root.innerHTML.length,
      editSituation:root.querySelectorAll('[data-zp-bathroom-edit="situation"]').length,
      editFit:root.querySelectorAll('[data-zp-bathroom-edit="fit"]').length,
      merchant:root.querySelectorAll('[data-zp-bath-merchant-link], [data-zp-merchant-link]').length,
      offers:root.querySelectorAll(".zp-offer").length,
      products:root.querySelectorAll(".zp-product-card").length,
      sellerLinks:root.querySelectorAll(".zp-offers a[href]").length
    }));
    const edit=async(which,expected)=>{
      await page.$eval(result+' [data-zp-bathroom-edit="'+which+'"]',b=>b.click());
      const focused=await page.evaluate(()=>({
        name:document.activeElement?.name,
        visible:!!document.activeElement?.getClientRects().length
      }));
      assert.equal(focused.name,expected,"Incorrect "+which+" focus");
      assert.equal(focused.visible,true,"Unfocusable hidden question");
    };
    // Independent WC use -> model preview. No commerce before exact fit.
    await choose("primaryNeed","raise_toilet");
    await choose("transferAbility","independent");
    await choose("duration","long_term");
    await send(); await shown(stage);
    const prelim=await page.$eval(preview,el=>({
      cards:el.querySelectorAll(".zp-product-card").length,
      merchants:el.querySelectorAll('[data-zp-merchant-link],[data-zp-bath-merchant-link]').length,
      hidden:el.hidden
    }));
    assert.ok(prelim.cards>0,"Preliminary verified products missing");
    assert.equal(prelim.merchants,0);
    assert.equal(prelim.hidden,false);
    // Model verified, full result with two edit actions.
    for(const [name,value] of Object.entries({
      toiletFit:"yes",feetFlatAtRaisedHeight:"yes",loadFit:"yes"
    }))await choose(name,value);
    await send(); await shown(result);
    let out=await state();
    assert.ok(out.merchant>0,"Safe model should show offer after fit");
    assert.equal(out.editSituation,1);
    assert.equal(out.editFit,1);

    await edit("fit","toiletFit");
    await choose("loadFit","unknown");
    let removed=await state();
    assert.equal(removed.hidden,true,"Changing load did not hide previous offer");
    assert.equal(removed.markup,0,"Stale merchant markup retained");
    assert.equal(removed.merchant,0);
    await send();await shown(result);
    out=await state();
    assert.equal(out.merchant,0,"Unverified load exposed merchant");
    assert.equal(out.editSituation,1);
    assert.equal(out.editFit,1);
    checks.push("candidate+fit+unknown-load-without-offer");

    // Restore the same exact model, then change the whole need:
    // old fit validations and products may not be reused across families.
    await edit("fit","toiletFit");
    await choose("loadFit","yes");
    await send();await shown(result);
    out=await state();
    assert.ok(out.merchant>0);
    assert.equal(out.editSituation,1);
    assert.equal(out.editFit,1);
    await edit("situation","primaryNeed");
    await choose("primaryNeed","shower_seated");
    removed=await state();
    assert.equal(removed.hidden,true);
    assert.equal(removed.markup,0);
    assert.equal(removed.merchant,0);
    const reset=await page.evaluate(()=>({
      stageHidden:document.querySelector("#zp-bathroom-fit-stage").hidden,
      previewHidden:document.querySelector("#zp-bathroom-preview").hidden,
      checked:[...document.querySelectorAll("#zp-bathroom-fit-stage input[type=radio]:checked")]
        .map(x=>x.name)
    }));
    assert.equal(reset.stageHidden,true,"Old fit step still visible");
    assert.equal(reset.previewHidden,true,"Old model preview still visible");
    assert.deepEqual(reset.checked,[],"Old model confirmations remain after changed need");
    checks.push("edit-family-resets-all-fit-and-stale-offers");

    // High risk transfer -> blocked first stage, only situation editing.
    await choose("transferAbility","person_assist");
    await choose("floorStable","yes");
    await send();await shown(result);
    out=await state();
    assert.equal(out.merchant,0);
    assert.equal(out.offers,0);
    assert.equal(out.products,0);
    assert.equal(out.editSituation,1);
    assert.equal(out.editFit,0);
    assert.equal(await page.$eval(stage,e=>e.hidden),true);
    await edit("situation","primaryNeed");
    const retained=await page.$eval("#zp-bathroom-advisor",f=>({
      need:f.querySelector('input[name="primaryNeed"]:checked')?.value,
      transfer:f.querySelector('input[name="transferAbility"]:checked')?.value,
      floor:f.querySelector('input[name="floorStable"]:checked')?.value
    }));
    assert.deepEqual(retained,{need:"shower_seated",transfer:"person_assist",floor:"yes"},
      "Edit must preserve original in-browser answers");
    checks.push("blocked-result-retains-answers-no-commerce");

    assert.deepEqual(errors,[],"Live JavaScript exceptions");
    assert.deepEqual(writes,[],"Unexpected write request");
    console.log("LIVE_BATHROOM_HUB_PR494",JSON.stringify({
      release:readiness.release,integrity:readiness.integrity,
      affiliateSlots:readiness.configured_total,
      scenarios:checks,merchantClicks:0,postRequests:writes.length,errors:errors.length
    }));
  }finally{await page.close();}
}finally{await browser.close();}
