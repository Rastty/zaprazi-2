/**
 * Postdeploy read-only acceptance for reimbursement guidance. Every approved
 * bathroom result must open the public reimbursement article in a second tab
 * while leaving the full original result and private answers in place.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import {EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

const origin="https://zaprazi.cz";
const reimbursement="/pomucky-do-koupelny-na-pojistovnu/";
const specs=[
 {key:"toilet-riser",path:"/nastavec-na-wc-pro-seniory/",
  first:{transferAbility:"independent",duration:"long_term"},
  fit:{toiletFit:"yes",feetFlatAtRaisedHeight:"yes",loadFit:"yes"}},
 {key:"shower-chair",path:"/sprchovaci-zidle-pro-seniory/",
  first:{transferAbility:"independent",floorStable:"yes",duration:"long_term"},
  fit:{spaceFit:"yes",loadFit:"yes"}},
 {key:"toilet-chair",path:"/toaletni-zidle-pro-seniory/",
  first:{chairMode:"nearby",transferAbility:"independent",floorStable:"yes",duration:"long_term"},
  fit:{spaceFit:"yes",loadFit:"yes"}},
 {key:"toilet-support",path:"/madlo-k-wc-pro-seniory/",
  first:{transferAbility:"steadying",wallFixing:"unverified",duration:"long_term"},
  fit:{supportFrameFit:"yes",loadFit:"yes"}},
 {key:"bath-transfer",path:"/sedatko-do-vany-pro-seniory/",
  first:{transferAbility:"independent",bathTransferIndependent:"yes",duration:"long_term"},
  fit:{bathFit:"yes",loadFit:"yes"}}
];
const isDeployed=(current,minimum)=>{
 const a=current.split(".").map(Number),b=minimum.split(".").map(Number);
 for(let i=0;i<3;i++)if(a[i]!==b[i])return a[i]>b[i];
 return true;
};
const readinessResponse=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",{signal:AbortSignal.timeout(30000)});
assert.equal(readinessResponse.status,200);
const live=await readinessResponse.json();
assert.equal(live.release,EXPECTED_LIVE_RELEASE,"Live WordPress release does not match QA target");
assert.equal(live.integrity,"ok");
assert.equal(live.configured_total,25);
assert.equal(live.slot_total,25);
if(!isDeployed(live.release,"0.8.154")){
 console.log("NOT_YET_DEPLOYED: reimbursement-tab behavior requires 0.8.154 (live "+live.release+")");
 process.exit(0);
}
const browser=await puppeteer.launch({
 executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
 headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
const errors=[],methods=[];
try{
 for(const spec of specs){
  const page=await browser.newPage();
  try{
   await page.setViewport({width:390,height:844,deviceScaleFactor:1});
   await page.setRequestInterception(true);
   page.on("pageerror",e=>errors.push(spec.key+": "+e.message));
   page.on("request",req=>{
    methods.push(req.method());
    if(req.method()!=="GET"||!req.url().startsWith(origin+"/"))req.abort();
    else req.continue();
   });
   const response=await page.goto(origin+spec.path,{waitUntil:"networkidle2",timeout:35000});
   assert.equal(response?.status(),200);
   const meta=await page.evaluate(()=>({
    version:document.querySelector('meta[name="zaprazi-release"]')?.content,
    integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content
   }));
   assert.equal(meta.version,live.release);
   assert.equal(meta.integrity,"ok");

   if(await page.$("#zp-analytics-consent") &&
      await page.$eval("#zp-analytics-consent",el=>!el.hidden)){
     await page.$eval("#zp-analytics-deny",el=>el.click());
   }
   const root="#zp-"+spec.key;
   const choose=async (name,value)=>
    page.$eval('input[name="'+name+'"][value="'+value+'"]',el=>el.click());
   for(const [name,value] of Object.entries(spec.first))await choose(name,value);
   await page.$eval(root+"-submit",el=>el.click());
   await page.waitForFunction(sel=>document.querySelector(sel)?.hidden===false,
    {timeout:12000},root+"-fit-stage");
   for(const [name,value] of Object.entries(spec.fit))await choose(name,value);
   await page.$eval(root+"-submit",el=>el.click());
   await page.waitForFunction(sel=>document.querySelector(sel)?.hidden===false,
    {timeout:12000},root+"-result");

   const selector=root+'-result .zp-acquisition-summary a[href="'+reimbursement+'"]';
   const before=await page.$eval(root+"-result",(el,href)=>{
    const link=el.querySelector('.zp-acquisition-summary a[href="'+href+'"]');
    return{
      resultVisible:!el.hidden,
      target:link?.target,
      rel:link?.rel,
      label:link?.textContent?.trim(),
      commerce:el.querySelectorAll(".zp-offer a[href]").length
    };
   },reimbursement);
   assert.equal(before.resultVisible,true);
   assert.equal(before.target,"_blank",spec.key+" navigates away from advisor");
   assert.deepEqual(before.rel.split(/\s+/).sort(),["noopener","noreferrer"].sort());
   assert.match(before.label,/otevře se v nové kartě/);
   assert.ok(before.commerce>0,"Approval should preserve gated product offers");

   const newTab=new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>reject(new Error("No reimbursement popup for "+spec.key)),12000);
    page.once("popup",p=>{clearTimeout(timeout);resolve(p);});
   });
   await page.click(selector);
   const popup=await newTab;
   try{
    await popup.waitForFunction(path=>location.pathname===path,
      {timeout:16000},reimbursement);
    const destination=await popup.evaluate(()=>({
      path:location.pathname,
      query:location.search,
      hash:location.hash,
      title:document.querySelector("h1")?.textContent?.trim()||""
    }));
    assert.equal(destination.path,reimbursement);
    assert.equal(destination.query,"","Private answers must never appear in destination query");
    assert.equal(destination.hash,"","Private answers must never appear in destination fragment");
    assert.match(destination.title,/Pomůcky do koupelny.*na pojišťovnu/i,
      "Opened an unrelated or missing reimbursement article");
    const after=await page.evaluate(({root,first,fit})=>({
      path:location.pathname,
      resultVisible:document.querySelector(root+"-result")?.hidden===false,
      first:Object.fromEntries(Object.keys(first).map(key=>[key,
        document.querySelector('input[name="'+key+'"]:checked')?.value])),
      fit:Object.fromEntries(Object.keys(fit).map(key=>[key,
        document.querySelector('input[name="'+key+'"]:checked')?.value])),
      commerce:document.querySelector(root+"-result")?.querySelectorAll(".zp-offer a[href]").length
    }),{root,first:spec.first,fit:spec.fit});
    assert.equal(after.path,spec.path);
    assert.equal(after.resultVisible,true);
    assert.deepEqual(after.first,spec.first,"Lost first-stage answers "+spec.key);
    assert.deepEqual(after.fit,spec.fit,"Lost fit confirmations "+spec.key);
    assert.equal(after.commerce,before.commerce,"Lost product cards after new tab "+spec.key);
   }finally{await popup.close();}
   console.log("PASS reimbursement guidance preserves advisor: "+spec.key);
  }finally{await page.close();}
 }
 assert.deepEqual(errors,[]);
 assert.ok(methods.every(m=>m==="GET"),"Unexpected network write");
 console.log("REIMBURSEMENT_TAB_QA",JSON.stringify({
  version:live.release,advisors:specs.length,retained:specs.length,
  affiliate_slots:live.configured_total,merchant_clicks:0,posts:0
 }));
}finally{await browser.close();}
