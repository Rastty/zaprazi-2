/**
 * Read-only production acceptance of the new bathroom decision-result handoff.
 *
 * For five independently deployed advisors, execute the real two-stage UI.
 * Unknown load/capacity -> measurement guide (without commerce).
 * Rejected load -> no guide framed as an approval and no merchant route.
 * Approved load + other positive fit checks -> merchant route may unlock.
 *
 * Questionnaire answers stay inside Chromium. No browser POST, referral clicks,
 * tracking, local storage, or personal/diagnostic data.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import {EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

const origin="https://zaprazi.cz";
const measure="/co-zmerit-v-koupelne-pred-vyberem-pomucky/";
const cases=[
  {
    path:"/nastavec-na-wc-pro-seniory/", key:"toilet-riser", anchor:"mereni-wc",
    stageOne:{transferAbility:"independent",duration:"long_term"},
    stageTwo:{toiletFit:"yes",feetFlatAtRaisedHeight:"yes"}
  },
  {
    path:"/sprchovaci-zidle-pro-seniory/", key:"shower-chair", anchor:"mereni-sprcha",
    stageOne:{transferAbility:"independent",floorStable:"yes",duration:"long_term"},
    stageTwo:{spaceFit:"yes"}
  },
  {
    path:"/toaletni-zidle-pro-seniory/", key:"toilet-chair", anchor:"mereni-wc",
    stageOne:{chairMode:"nearby",transferAbility:"independent",floorStable:"yes",duration:"long_term"},
    stageTwo:{spaceFit:"yes"}
  },
  {
    path:"/madlo-k-wc-pro-seniory/", key:"toilet-support", anchor:"mereni-wc",
    stageOne:{transferAbility:"steadying",wallFixing:"unverified",duration:"long_term"},
    stageTwo:{supportFrameFit:"yes"}
  },
  {
    path:"/sedatko-do-vany-pro-seniory/", key:"bath-transfer", anchor:"mereni-vana",
    stageOne:{transferAbility:"independent",bathTransferIndependent:"yes",duration:"long_term"},
    stageTwo:{bathFit:"yes"}
  }
];

const response=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",{
  signal:AbortSignal.timeout(30000)
});
assert.equal(response.status,200,"Affiliate readiness unavailable");
const readiness=await response.json();
assert.equal(readiness.release,EXPECTED_LIVE_RELEASE,"Wrong live WordPress version");
assert.equal(readiness.integrity,"ok","Partial deployed release");
assert.equal(readiness.configured_total,25);
assert.equal(readiness.slot_total,25);

const errors=[],attemptedMethods=[];
const browser=await puppeteer.launch({
  executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
try{
  for(const spec of cases){
    const page=await browser.newPage();
    try{
      await page.setViewport({width:390,height:844,deviceScaleFactor:1});
      await page.setRequestInterception(true);
      page.on("pageerror",e=>errors.push(spec.key+": "+e.message));
      page.on("request",request=>{
        attemptedMethods.push(request.method());
        if(request.method()!=="GET"||!request.url().startsWith(origin+"/"))request.abort();
        else request.continue();
      });
      const result=await page.goto(origin+spec.path,{waitUntil:"networkidle2",timeout:30000});
      assert.equal(result?.status(),200,"Missing route "+spec.path);
      const meta=await page.evaluate(()=>({
        release:document.querySelector('meta[name="zaprazi-release"]')?.content,
        integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content
      }));
      assert.equal(meta.release,EXPECTED_LIVE_RELEASE);
      assert.equal(meta.integrity,"ok");
      const resultSel="#zp-"+spec.key+"-result";
      const previewSel="#zp-"+spec.key+"-preview";
      const stageSel="#zp-"+spec.key+"-fit-stage";
      const submitSel="#zp-"+spec.key+"-submit";
      const choose=async (name,value)=>{
        const selector='input[name="'+name+'"][value="'+value+'"]';
        await page.$eval(selector,el=>el.click());
      };
      for(const [name,value] of Object.entries(spec.stageOne))await choose(name,value);
      await page.$eval(submitSel,button=>button.click());
      await page.waitForFunction(selector=>document.querySelector(selector)?.hidden===false,{timeout:12000},stageSel);
      assert.equal(await page.$eval(previewSel,el=>el.querySelectorAll('a[data-zp-merchant-link],a[data-zp-bath-merchant-link],a[href*="ehub.cz"]').length),0,
        "Unverified preview unexpectedly contains commerce: "+spec.key);
      for(const [name,value] of Object.entries(spec.stageTwo))await choose(name,value);

      const check=async (capacity,expected)=>{
        await choose("loadFit",capacity);
        await page.$eval(submitSel,button=>button.click());
        await page.waitForFunction(selector=>document.querySelector(selector)?.hidden===false,{timeout:10000},resultSel);
        const state=await page.$eval(resultSel,el=>({
          text:el.textContent?.slice(0,600),
          links:[...el.querySelectorAll('a[href]')].map(a=>a.getAttribute("href")),
          handoff:[...el.querySelectorAll(".zp-next-measurement a[href]")].map(a=>a.getAttribute("href")),
          commerce:[...el.querySelectorAll('[data-zp-merchant-link], [data-zp-toilet-merchant-link], [data-zp-chair-merchant-link], [data-zp-shower-merchant-link], [data-zp-support-merchant-link], [data-zp-bath-merchant-link]')].length
        }));
        if(expected==="unknown"){
          assert.deepEqual(state.handoff,[measure+"#"+spec.anchor],
            "Missing measured next step from "+spec.key+": "+JSON.stringify(state));
          assert.equal(state.commerce,0,"Unknown load unlocked a merchant: "+spec.key);
        }else if(expected==="rejected"){
          assert.equal(state.handoff.length,0,"Unsafe fit got measuring shortcut: "+spec.key);
          assert.equal(state.commerce,0,"Unsafe fit unlocked a merchant: "+spec.key);
        }else if(expected==="approved"){
          assert.equal(state.handoff.length,0,"Approved fit still says measurements are missing: "+spec.key);
          assert.ok(state.commerce>0,"Valid fit did not reveal product comparison: "+spec.key);
        }
      };
      await check("unknown","unknown");
      await check("no","rejected");
      await check("yes","approved");
      console.log("PASS bathroom stage-two handoff: "+spec.key+" ("+spec.anchor+")");
    }finally{await page.close();}
  }
  assert.deepEqual(errors,[],"JavaScript exceptions in production");
  assert.ok(attemptedMethods.every(method=>method==="GET"),"Unexpected write attempt");
  console.log("BATHROOM_RESULT_HANDOFF_QA",JSON.stringify({
    version:EXPECTED_LIVE_RELEASE,scenarios:cases.length,
    outcomes:cases.length*3,merchants_clicked:0,posts:0,
    affiliate_slots:readiness.configured_total
  }));
}finally{await browser.close();}
