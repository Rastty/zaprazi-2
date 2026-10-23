/**
 * Read-only DOM acceptance for dated source transparency (0.8.152).
 * On predeploy PR checks with an earlier live release, explicitly skip.
 * Manual workflow_dispatch strictly matches source release and tests both
 * real two-stage bathroom product results. No external merchant clicks.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import {EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

const atLeast=(a,b)=>{
 const left=a.split(".").map(Number),right=b.split(".").map(Number);
 for(let i=0;i<3;i++)if(left[i]!==right[i])return left[i]>right[i];
 return true;
};
const origin="https://zaprazi.cz";
const readyResponse=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness");
assert.equal(readyResponse.status,200);
const ready=await readyResponse.json();
assert.equal(ready.release,EXPECTED_LIVE_RELEASE,"Live release differs from QA target");
assert.equal(ready.integrity,"ok");
assert.equal(ready.configured_total,25);
assert.equal(ready.slot_total,25);
if(!atLeast(ready.release,"0.8.152")){
 console.log("NOT_YET_DEPLOYED: 0.8.152 source transparency – live "+ready.release);
 process.exit(0);
}
const scenarios=[
 {path:"/madlo-k-wc-pro-seniory/",key:"toilet-support",
  initial:{transferAbility:"steadying",wallFixing:"unverified",duration:"long_term"},
  fit:{supportFrameFit:"yes",loadFit:"yes"},sourceLinks:0},
 {path:"/sedatko-do-vany-pro-seniory/",key:"bath-transfer",
  initial:{transferAbility:"independent",bathTransferIndependent:"yes",duration:"long_term"},
  fit:{bathFit:"yes",loadFit:"yes"},sourceLinks:2}
];
const browser=await puppeteer.launch({
 executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
 headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
const failures=[];
try{
 for(const scenario of scenarios){
  const page=await browser.newPage();
  try{
   await page.setViewport({width:390,height:844});
   await page.setRequestInterception(true);
   page.on("pageerror",e=>failures.push(scenario.key+": "+e.message));
   page.on("request",req=>{
    if(req.method()!=="GET"||!req.url().startsWith(origin+"/"))req.abort();
    else req.continue();
   });
   const response=await page.goto(origin+scenario.path,{waitUntil:"networkidle2",timeout:35000});
   assert.equal(response?.status(),200);
   const id="#zp-"+scenario.key;
   const choose=async(name,value)=>{
    await page.$eval('input[name="'+name+'"][value="'+value+'"]',el=>el.click());
   };
   for(const [name,value] of Object.entries(scenario.initial))await choose(name,value);
   await page.$eval(id+"-submit",button=>button.click());
   await page.waitForFunction(selector=>document.querySelector(selector)?.hidden===false,
    {timeout:12000},id+"-fit-stage");
   assert.equal(await page.$eval(id+"-preview",el=>el.querySelectorAll(".zp-sources a").length),0,
    "Unverified preview must not show source links");
   for(const [name,value] of Object.entries(scenario.fit))await choose(name,value);
   await page.$eval(id+"-submit",button=>button.click());
   await page.waitForFunction(selector=>document.querySelector(selector)?.hidden===false,
    {timeout:12000},id+"-result");
   const inspected=await page.$eval(id+"-result",el=>{
    const panel=el.querySelector(".zp-product-card .zp-sources");
    return{
     product:el.querySelector(".zp-product-card h4")?.textContent||"",
     heading:panel?.querySelector("summary")?.textContent?.trim()||"",
     checked:panel?.textContent?.includes("7. 10. 2026")||false,
     caution:panel?.textContent?.includes("Nejde o dnešní potvrzení ceny")||false,
     sources:[...(panel?.querySelectorAll('a[href]')||[])].map(a=>({href:a.href,rel:a.rel})),
     merchant:el.querySelectorAll("[data-zp-support-merchant-link], [data-zp-bath-merchant-link]").length,
     sponsor:el.querySelectorAll(".zp-offer .zp-affiliate-label").length
    };
   });
   assert.match(inspected.heading,/Odkud máme parametry výrobku/);
   assert.equal(inspected.checked,true,"Source date missing "+scenario.key);
   assert.equal(inspected.caution,true,"No stale-data disclaimer "+scenario.key);
   assert.equal(inspected.sources.length,scenario.sourceLinks,
    "Source panel must only link to independent documentation: "+scenario.key);
   assert.ok(inspected.sources.every(src=>src.href.startsWith("https://")&&
     !/unizdrav\.cz|rehabilitacnipomucky\.cz/.test(src.href)&&
     src.rel.includes("noopener")&&src.rel.includes("noreferrer")));
   assert.ok(inspected.merchant>0,"No actual candidate offer");
   assert.equal(inspected.sponsor,1,"Affiliate disclosure missing: "+scenario.key);
   console.log("PASS source provenance: "+scenario.key+" "+inspected.product);
  }finally{await page.close();}
 }
 assert.deepEqual(failures,[]);
 console.log("PRODUCT_EVIDENCE_0_8_152",JSON.stringify({
  release:ready.release,cards:scenarios.length,integrity:ready.integrity,
  affiliate_slots:ready.configured_total,merchant_clicks:0
 }));
}finally{await browser.close();}
