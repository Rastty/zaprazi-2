/**
 * Postdeploy read-only acceptance: measuring instructions opened from an
 * unresolved bathroom result must never discard the original questionnaire.
 * This is the result handoff, not the earlier fit-stage help link.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import {EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

const origin="https://zaprazi.cz";
const route="/co-zmerit-v-koupelne-pred-vyberem-pomucky/";
const specs=[
  {key:"toilet-riser",path:"/nastavec-na-wc-pro-seniory/",anchor:"mereni-wc",
   first:{transferAbility:"independent",duration:"long_term"},
   fit:{toiletFit:"yes",feetFlatAtRaisedHeight:"yes"}},
  {key:"shower-chair",path:"/sprchovaci-zidle-pro-seniory/",anchor:"mereni-sprcha",
   first:{transferAbility:"independent",floorStable:"yes",duration:"long_term"},
   fit:{spaceFit:"yes"}},
  {key:"toilet-chair",path:"/toaletni-zidle-pro-seniory/",anchor:"mereni-wc",
   first:{chairMode:"nearby",transferAbility:"independent",floorStable:"yes",duration:"long_term"},
   fit:{spaceFit:"yes"}},
  {key:"toilet-support",path:"/madlo-k-wc-pro-seniory/",anchor:"mereni-wc",
   first:{transferAbility:"steadying",wallFixing:"unverified",duration:"long_term"},
   fit:{supportFrameFit:"yes"}},
  {key:"bath-transfer",path:"/sedatko-do-vany-pro-seniory/",anchor:"mereni-vana",
   first:{transferAbility:"independent",bathTransferIndependent:"yes",duration:"long_term"},
   fit:{bathFit:"yes"}}
];

const atLeast=(value,minimum)=>{
 const a=value.split(".").map(Number),b=minimum.split(".").map(Number);
 for(let i=0;i<3;i++)if(a[i]!==b[i])return a[i]>b[i];
 return true;
};
const response=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",{
 signal:AbortSignal.timeout(30000)
});
assert.equal(response.status,200);
const ready=await response.json();
assert.equal(ready.release,EXPECTED_LIVE_RELEASE,"Expected deployed release does not match");
assert.equal(ready.integrity,"ok");
assert.equal(ready.configured_total,25);
assert.equal(ready.slot_total,25);
if(!atLeast(ready.release,"0.8.153")){
 console.log("NOT_YET_DEPLOYED: result measuring-tab navigation starts at 0.8.153; current "+ready.release);
 process.exit(0);
}

const browser=await puppeteer.launch({
 executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
 headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
const errors=[],requests=[];
try{
 for(const spec of specs){
  const page=await browser.newPage();
  try{
   await page.setViewport({width:390,height:844,deviceScaleFactor:1});
   await page.setRequestInterception(true);
   page.on("pageerror",error=>errors.push(spec.key+": "+error.message));
   page.on("request",req=>{
    requests.push(req.method());
    if(req.method()!=="GET"||!req.url().startsWith(origin+"/"))req.abort();
    else req.continue();
   });
   const res=await page.goto(origin+spec.path,{waitUntil:"networkidle2",timeout:35000});
   assert.equal(res?.status(),200);
   const metadata=await page.evaluate(()=>({
    version:document.querySelector('meta[name="zaprazi-release"]')?.content,
    integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content
   }));
   assert.equal(metadata.version,ready.release);
   assert.equal(metadata.integrity,"ok");
   const consent=await page.$("#zp-analytics-consent");
   if(consent && await page.$eval("#zp-analytics-consent",el=>!el.hidden)){
     await page.$eval("#zp-analytics-deny",el=>el.click());
     assert.equal(await page.$eval("#zp-analytics-consent",el=>el.hidden),true);
   }
   const root="#zp-"+spec.key;
   const choose=async(name,value)=>{
    await page.$eval('input[name="'+name+'"][value="'+value+'"]',el=>el.click());
   };
   for(const [name,value] of Object.entries(spec.first))await choose(name,value);
   await page.$eval(root+"-submit",el=>el.click());
   await page.waitForFunction(selector=>document.querySelector(selector)?.hidden===false,
    {timeout:12000},root+"-fit-stage");
   for(const [name,value] of Object.entries(spec.fit))await choose(name,value);
   await choose("loadFit","unknown");
   await page.$eval(root+"-submit",el=>el.click());
   await page.waitForFunction(selector=>document.querySelector(selector)?.hidden===false,
    {timeout:12000},root+"-result");
   const state=await page.$eval(root+"-result",el=>{
    const link=el.querySelector(".zp-next-measurement a[href]");
    return{
     href:link?.getAttribute("href"),
     target:link?.target,
     rel:link?.rel,
     label:link?.textContent?.trim(),
     commerce:el.querySelectorAll(".zp-offer a[href], [data-zp-merchant-link], [data-zp-support-merchant-link], [data-zp-bath-merchant-link]").length
    };
   });
   assert.equal(state.href,route+"#"+spec.anchor,"Wrong measuring destination: "+spec.key);
   assert.equal(state.target,"_blank","Instructions abandon user answers: "+spec.key);
   assert.deepEqual(state.rel.split(/\s+/).sort(),["noopener","noreferrer"].sort());
   assert.match(state.label,/otevře se v nové kartě/);
   assert.equal(state.commerce,0,"Unknown fit must not show a purchase CTA");

   const popupReady=new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>reject(new Error("No new tab for "+spec.key)),12000);
    page.once("popup",p=>{clearTimeout(timeout);resolve(p);});
   });
   await page.click(root+"-result .zp-next-measurement a");
   const popup=await popupReady;
   try{
    await popup.waitForFunction(({route,anchor})=>
      location.pathname===route && location.hash==="#"+anchor,
      {timeout:16000},{route,anchor:spec.anchor});
    const kept=await page.evaluate((args)=>({
      path:location.pathname,
      resultVisible:document.querySelector(args.root+"-result")?.hidden===false,
      stageVisible:document.querySelector(args.root+"-fit-stage")?.hidden===false,
      checked:Object.fromEntries(Object.keys(args.answers).map(name=>[
        name,document.querySelector('input[name="'+name+'"]:checked')?.value
      ])),
      fitChecked:Object.fromEntries(Object.keys(args.fit).map(name=>[
        name,document.querySelector('input[name="'+name+'"]:checked')?.value
      ])),
      loadFit:document.querySelector('input[name="loadFit"]:checked')?.value,
      commerce:document.querySelectorAll(args.root+"-result .zp-offer a[href]").length
    }),{root,answers:spec.first,fit:spec.fit});
    assert.equal(kept.path,spec.path);
    assert.equal(kept.resultVisible,true);
    assert.equal(kept.stageVisible,true);
    assert.deepEqual(kept.checked,spec.first,"Stage-one answers were lost after opening guide");
    assert.deepEqual(kept.fitChecked,spec.fit,"Fit-stage answers were lost after opening guide");
    assert.equal(kept.loadFit,"unknown");
    assert.equal(kept.commerce,0);
   }finally{await popup.close();}
   console.log("PASS retained answers after measuring-guide popup: "+spec.key);
  }finally{await page.close();}
 }
 assert.deepEqual(errors,[],"Unexpected browser JavaScript errors");
 assert.ok(requests.every(m=>m==="GET"),"Unexpected network write");
 console.log("RESULT_MEASUREMENT_TAB_QA",JSON.stringify({
  version:ready.release,advisors:specs.length,retained_results:specs.length,
  affiliate_slots:ready.configured_total,merchant_clicks:0,posts:0
 }));
}finally{await browser.close();}
