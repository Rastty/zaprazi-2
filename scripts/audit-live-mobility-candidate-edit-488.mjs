/**
 * Read-only, real-Chrome postdeploy acceptance for all three Mobility Advisors.
 * PR #486: fit-gated merchant links and measurement help.
 * PR #487: useful non-commercial recovery on blocked routes.
 * PR #488: edit successful answers without stale purchase/rental links.
 *
 * No merchant links are clicked, no WordPress writes, no answer payloads or
 * derived health data are sent to telemetry, URLs or server-side storage.
 * The smoke is intentionally NOT gated on theme version 0.8.183: successive
 * releases can carry the same version and must prove actual behavior.
 */
import assert from "node:assert/strict";
import {accessSync, constants} from "node:fs";
import puppeteer from "puppeteer-core";

const origin=(process.env.ZP_LIVE_ORIGIN||"https://zaprazi.cz").replace(/\/$/,"");
const executable=[process.env.CHROME_BIN,"/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"]
  .filter(Boolean).find(p=>{try{accessSync(p,constants.X_OK);return true}catch{return false}});
assert.ok(executable,"A real Chrome/Chromium binary is required; do not fake browser acceptance");

const specs=[
  {
    id:"homepage",path:"/",form:"#zp-mobility-advisor",result:"#zp-mobility-result",
    submit:"#zp-mobility-submit",merchant:"[data-zp-merchant-link]",
    answers:[["environment","indoor"],["supportNeed","steady"],["canLiftWalker","yes"]],
    expectedEditFocus:"environment",
    blocked:["supportNeed","person_assist"],
    recovery:"/jak-vybrat-pecovatelskou-sluzbu/#vyber-pecovatelske-sluzby-kroky"
  },
  {
    id:"indoor",path:"/choditko-do-bytu-pro-seniory/",
    form:"#zp-indoor-walker-advisor",result:"#zp-indoor-walker-result",
    submit:"#zp-indoor-walker-submit",merchant:"[data-zp-indoor-merchant-link]",
    answers:[["supportNeed","steady"],["canLiftWalker","yes"]],
    expectedEditFocus:"supportNeed",
    blocked:["canLiftWalker","unknown"],
    recovery:"/choditka-pro-seniory/#vyber-typu"
  },
  {
    id:"rollator",path:"/rollator-pro-seniory/",
    form:"#zp-rollator-advisor",result:"#zp-rollator-result",
    submit:"#zp-rollator-submit",merchant:"[data-zp-rollator-merchant-link]",
    answers:[["supportNeed","steady"],["handBrakes","yes"]],
    expectedEditFocus:"supportNeed",
    blocked:["handBrakes","no"],
    recovery:"/rollator-pro-seniory/#bezpecne-pouziti-rollatoru"
  }
];

const response=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",{
  headers:{Accept:"application/json"},signal:AbortSignal.timeout(25000)
});
assert.equal(response.status,200,"Production readiness endpoint not available");
const ready=await response.json();
assert.equal(ready.integrity,"ok","A broken integrity gate cannot pass");
assert.equal(ready.configured_total,ready.slot_total);
assert.ok(ready.slot_total>=25);

const browser=await puppeteer.launch({
  executablePath:executable,headless:true,
  args:["--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage"]
});
const results=[];
const errors=[];
const forbiddenWrites=[];
let merchantClicks=0;
try{
  for(const spec of specs){
    const page=await browser.newPage();
    try{
      await page.setViewport({width:390,height:844,deviceScaleFactor:1});
      page.setDefaultTimeout(14000);
      await page.setRequestInterception(true);
      page.on("request",req=>{
        const url=req.url();
        const isSameOrigin=url.startsWith(origin+"/");
        if(req.method()!=="GET"){
          forbiddenWrites.push({advisor:spec.id,method:req.method()});
          return req.abort();
        }
        if(!isSameOrigin && !url.startsWith("data:") && !url.startsWith("about:"))return req.abort();
        return req.continue();
      });
      page.on("pageerror",e=>errors.push({advisor:spec.id,message:e.message}));
      const res=await page.goto(origin+spec.path,{waitUntil:"networkidle2",timeout:42000});
      assert.equal(res?.status(),200,"Production route is not HTTP 200: "+spec.path);
      const metadata=await page.evaluate(()=>({
        release:document.querySelector('meta[name="zaprazi-release"]')?.content,
        integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
        canonical:document.querySelector('link[rel="canonical"]')?.href,
        h1:document.querySelectorAll("main h1").length
      }));
      assert.equal(metadata.release,ready.release,spec.id+" version mismatch");
      assert.equal(metadata.integrity,"ok",spec.id+" integrity mismatch");
      assert.equal(metadata.h1,1,spec.id+" main H1 count");
      assert.equal(metadata.canonical,origin+spec.path,spec.id+" canonical");

      // The actual browser fires change events and conditional-question logic.
      const choose=async(name,value)=>{
        const selector='input[name="'+name+'"][value="'+value+'"]';
        await page.$eval(selector,el=>{
          if(el.closest("[hidden]"))throw Error("Safety input unexpectedly hidden: "+el.name);
          el.click();
        });
      };
      for(const [name,value] of spec.answers)await choose(name,value);
      await page.$eval(spec.submit,el=>el.click());
      await page.waitForFunction(selector=>document.querySelector(selector)?.hidden===false,
        {timeout:14000},spec.result);

      const initial=await page.$eval(spec.result,(root,merchant)=>{
        const gate=root.querySelector(".zp-mobility-fit-gate");
        const edit=root.querySelector('button[data-zp-edit-answers="1"]');
        const offer=gate?.querySelector(".zp-fit-locked-offers");
        const link=offer?.querySelector(merchant);
        return {
          gateCount:root.querySelectorAll(".zp-mobility-fit-gate").length,
          firstGateChecks:gate?.querySelectorAll("[data-zp-mobility-fit-confirm]").length,
          firstGateChecked:gate?.querySelectorAll("[data-zp-mobility-fit-confirm]:checked").length,
          firstOfferHidden:offer?.hidden,
          merchantInsideGate:Boolean(link),
          visibleMerchants:[...root.querySelectorAll(merchant)].filter(x=>!x.closest("[hidden]")).length,
          editLabel:edit?.textContent?.trim(),editIsButton:edit?.type==="button",
          editFocus:edit?.dataset.zpEditFocus||"",
          fitHelp:gate?.querySelector(".zp-fit-help summary")?.textContent?.trim()
        };
      },spec.merchant);
      assert.ok(initial.gateCount>0,spec.id+" no candidate fit gate");
      assert.ok(initial.firstGateChecks>=3,spec.id+" incomplete model checks");
      assert.equal(initial.firstGateChecked,0);
      assert.equal(initial.firstOfferHidden,true);
      assert.equal(initial.merchantInsideGate,true,spec.id+" merchant not under lock");
      assert.equal(initial.visibleMerchants,0,spec.id+" showed merchant before fit");
      assert.equal(initial.editIsButton,true,spec.id+" edit button missing");
      assert.match(initial.editLabel,/Upravit odpovědi a přepočítat výsledek/);
      assert.match(initial.fitHelp,/Nemůžete některý bod potvrdit/);

      // No partial model confirmation may unlock an offer.
      const fitSelector=spec.result+" .zp-mobility-fit-gate:first-of-type [data-zp-mobility-fit-confirm]";
      await page.$eval(fitSelector,el=>el.click());
      assert.equal(await page.$eval(
        spec.result+" .zp-mobility-fit-gate:first-of-type .zp-fit-locked-offers",
        el=>el.hidden),true,spec.id+" partially checked gate unlocked an offer");

      // Real change listeners: all model checks -> unlock only this model.
      await page.$$eval(fitSelector,checks=>checks.filter(el=>!el.checked).forEach(el=>el.click()));
      assert.equal(await page.$eval(
        spec.result+" .zp-mobility-fit-gate:first-of-type .zp-fit-locked-offers",
        el=>el.hidden),false,spec.id+" failed to unlock after all checks");
      if(initial.gateCount>1){
        const unrelated=await page.$$eval(spec.result+" .zp-mobility-fit-gate",nodes=>
          nodes.slice(1).map(gate=>({
            offerCount:gate.querySelectorAll(".zp-fit-locked-offers").length,
            offerHidden:gate.querySelector(".zp-fit-locked-offers")?.hidden??true,
            visibleMerchants:[...gate.querySelectorAll("a[data-zp-merchant-link],a[data-zp-indoor-merchant-link],a[data-zp-rollator-merchant-link]")].filter(link=>!link.closest("[hidden]")).length
          })));
        assert.ok(unrelated.length>0);
        assert.ok(unrelated.every(other=>other.offerHidden && other.visibleMerchants===0),
          spec.id+" unlocked an unrelated model: "+JSON.stringify(unrelated));
      }
      await page.$eval(fitSelector,el=>el.click());
      assert.equal(await page.$eval(
        spec.result+" .zp-mobility-fit-gate:first-of-type .zp-fit-locked-offers",
        el=>el.hidden),true,spec.id+" offer did not re-lock on withdrawal");

      // Edit candidate: focus original question; do not erase answers merely by clicking.
      await page.$eval(spec.result+' button[data-zp-edit-answers="1"]',el=>el.click());
      const focus=await page.evaluate(()=>({
        name:document.activeElement?.name,
        visible:document.activeElement?.getClientRects().length>0,
        resultStillVisible:document.querySelector(".zp-result:not([hidden])")!==null
      }));
      assert.equal(focus.name,spec.expectedEditFocus,spec.id+" focus not returned to form");
      assert.equal(focus.visible,true,spec.id+" focus fell on hidden question");

      // Changing a single answer immediately destroys the old candidate and
      // all its merchant links, including previously checked model selections.
      await choose(...spec.blocked);
      const stale=await page.$eval(spec.result,root=>({
        hidden:root.hidden,content:root.innerHTML.trim(),merchants:root.querySelectorAll("a[data-zp-merchant-link],a[data-zp-indoor-merchant-link],a[data-zp-rollator-merchant-link],a[data-zp-mobility-rental-link]").length
      }));
      assert.equal(stale.hidden,true,spec.id+" stale recommendation remained visible");
      assert.equal(stale.content,"",spec.id+" old model HTML was retained");
      assert.equal(stale.merchants,0,spec.id+" stale merchant/rental links remain");

      await page.$eval(spec.submit,el=>el.click());
      await page.waitForFunction(selector=>document.querySelector(selector)?.hidden===false,
        {timeout:14000},spec.result);
      const blocked=await page.$eval(spec.result,(root,merchant)=>{
        const link=root.querySelector(".zp-safe-recovery a[href]");
        const edit=root.querySelector('button[data-zp-edit-answers="1"]');
        return{
          recoveryHref:link?.getAttribute("href"),
          recoveryLabel:link?.textContent?.trim(),
          productCards:root.querySelectorAll(".zp-product-card").length,
          offerGates:root.querySelectorAll(".zp-mobility-fit-gate").length,
          merchantLinks:root.querySelectorAll(merchant).length,
          rentalLinks:root.querySelectorAll("[data-zp-mobility-rental-link]").length,
          acquisitionLinks:root.querySelectorAll(".zp-acquisition-summary a[href]").length,
          editButton:Boolean(edit)
        };
      },spec.merchant);
      assert.equal(blocked.recoveryHref,spec.recovery,spec.id+" wrong safe recovery path");
      assert.ok(blocked.recoveryLabel.length>10);
      assert.equal(blocked.productCards,0,spec.id+" unsafe result still showed a product");
      assert.equal(blocked.offerGates,0);
      assert.equal(blocked.merchantLinks,0);
      assert.equal(blocked.rentalLinks,0);
      assert.equal(blocked.acquisitionLinks,0);
      assert.equal(blocked.editButton,true);

      results.push({
        advisor:spec.id,path:spec.path,candidate:true,
        fitChecks:initial.firstGateChecks,merchantInitiallyLocked:true,
        partialFitLocked:true,allFitUnlock:true,revokedFitRelock:true,
        editFocus:focus.name,staleOfferCleared:true,
        safeRecovery:blocked.recoveryHref,unsafeCommerce:0
      });
      console.log("PASS real Chrome Mobility candidate/edit/blocked:",spec.id);
    }finally{await page.close();}
  }
  assert.deepEqual(errors,[],"Client-side JavaScript exceptions");
  assert.deepEqual(forbiddenWrites,[],"Browser attempted a non-GET network request");
  assert.equal(merchantClicks,0);
  console.log("LIVE_MOBILITY_CANDIDATE_EDIT_488",JSON.stringify({
    release:ready.release,integrity:ready.integrity,affiliateSlots:ready.configured_total,
    verified:results.length,results,merchantClicks,postRequests:forbiddenWrites.length
  }));
}finally{await browser.close();}
