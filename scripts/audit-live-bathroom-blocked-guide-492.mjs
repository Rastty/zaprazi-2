/**
 * Live, real Chrome, read-only acceptance of PR #492 blocked Bathroom handoffs.
 * Five scenarios: high-risk assisted transfer -> no model or purchase CTA,
 * one vetted educational guide in a new tab, prior private answers retained.
 * No merchant clicks, no POST, no stored answers, no reporting of user answers.
 */
import assert from "node:assert/strict";
import {accessSync,constants} from "node:fs";
import puppeteer from "puppeteer-core";

const origin=(process.env.ZP_LIVE_ORIGIN||"https://zaprazi.cz").replace(/\/$/,"");
const chrome=[process.env.CHROME_BIN,"/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"]
 .filter(Boolean).find(file=>{try{accessSync(file,constants.X_OK);return true;}catch{return false;}});
assert.ok(chrome,"A real Chrome executable is required");

const cases=[
 {key:"toilet-riser",path:"/nastavec-na-wc-pro-seniory/",
  answers:{transferAbility:"person_assist",duration:"long_term"},
  guide:"/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-wc"},
 {key:"shower-chair",path:"/sprchovaci-zidle-pro-seniory/",
  answers:{transferAbility:"person_assist",floorStable:"yes",duration:"long_term"},
  guide:"/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-sprcha"},
 {key:"toilet-chair",path:"/toaletni-zidle-pro-seniory/",
  answers:{chairMode:"nearby",transferAbility:"person_assist",floorStable:"yes",duration:"long_term"},
  guide:"/toaletni-zidle-vedle-postele/#sedm-kontrol-zidle-postel"},
 {key:"toilet-support",path:"/madlo-k-wc-pro-seniory/",
  answers:{transferAbility:"person_assist",wallFixing:"unverified",duration:"long_term"},
  guide:"/madlo-na-sadrokarton-u-wc/#kontroly-madla-sadrokarton"},
 {key:"bath-transfer",path:"/sedatko-do-vany-pro-seniory/",
  answers:{transferAbility:"person_assist",bathTransferIndependent:"yes",duration:"long_term"},
  guide:"/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-vana"}
];
const r=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",{headers:{Accept:"application/json"},signal:AbortSignal.timeout(25000)});
assert.equal(r.status,200,"Public readiness HTTP status");
const readiness=await r.json();
assert.equal(readiness.integrity,"ok");
assert.ok(readiness.slot_total>=25);
assert.equal(readiness.slot_total,readiness.configured_total);
const browser=await puppeteer.launch({executablePath:chrome,headless:true,
 args:["--no-sandbox","--disable-dev-shm-usage","--disable-setuid-sandbox"]});
const errors=[],nonGet=[],verified=[];
try{
 for(const spec of cases){
  const page=await browser.newPage();
  try{
   await page.setViewport({width:390,height:844,deviceScaleFactor:1});
   page.setDefaultTimeout(15000);
   await page.setRequestInterception(true);
   page.on("request",req=>{
    if(req.method()!=="GET"){nonGet.push({case:spec.key,method:req.method()});return req.abort();}
    if(req.url().startsWith(origin+"/")||req.url().startsWith("data:")||req.url().startsWith("about:"))return req.continue();
    return req.abort();
   });
   page.on("pageerror",e=>errors.push({case:spec.key,message:e.message}));
   const nav=await page.goto(origin+spec.path,{waitUntil:"networkidle2",timeout:40000});
   assert.equal(nav?.status(),200,spec.key+" live page missing");
   const metadata=await page.evaluate(()=>({
    release:document.querySelector('meta[name="zaprazi-release"]')?.content,
    integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
    canonical:document.querySelector('link[rel="canonical"]')?.href
   }));
   assert.equal(metadata.release,readiness.release,spec.key+" version");
   assert.equal(metadata.integrity,"ok",spec.key+" integrity");
   assert.equal(metadata.canonical,origin+spec.path,spec.key+" canonical");

   const form="#zp-"+spec.key+"-advisor";
   const result="#zp-"+spec.key+"-result";
   const preview="#zp-"+spec.key+"-preview";
   const stage="#zp-"+spec.key+"-fit-stage";
   for(const [name,value] of Object.entries(spec.answers)){
    await page.$eval('input[name="'+name+'"][value="'+value+'"]',el=>{
      if(el.closest("[hidden]"))throw new Error("Needed question hidden: "+el.name);
      el.click();
    });
   }
   await page.$eval("#zp-"+spec.key+"-submit",el=>el.click());
   await page.waitForFunction(sel=>document.querySelector(sel)?.hidden===false,{timeout:15000},result);

   const current=await page.$eval(result,root=>{
    const link=root.querySelector('a.zp-bath-safe-guide[href]');
    return{
      visible:!root.hidden,
      help:[...root.querySelectorAll("a[href]")].map(a=>({
        href:a.getAttribute("href"),target:a.target,rel:a.rel,label:a.textContent?.trim()
      })),
      selectedGuide:link?.getAttribute("href"),
      productCards:root.querySelectorAll(".zp-product-card").length,
      offers:root.querySelectorAll(".zp-offer").length,
      merchants:root.querySelectorAll('[data-zp-merchant-link],[data-zp-toilet-merchant-link],[data-zp-chair-merchant-link],[data-zp-shower-merchant-link],[data-zp-support-merchant-link],[data-zp-bath-merchant-link]').length,
      acquisition:root.querySelectorAll(".zp-acquisition-summary a[href]").length,
      fitEdit:root.querySelectorAll('[data-zp-bath-edit="fit"]').length,
      situationEdit:root.querySelectorAll('[data-zp-bath-edit="situation"]').length,
      unsafeCta:/Zobrazit cenu a dostupnost|Prověřit půjčení|Koupit|Objednat/.test(root.textContent||""),
      explanation:root.textContent?.includes("Bez splnění bezpečnostních podmínek")
    };
   });
   assert.equal(current.visible,true);
   assert.equal(current.selectedGuide,spec.guide,spec.key+" wrong educational route");
   assert.equal(current.help.length,1,spec.key+" blocked result unexpectedly contains additional links");
   assert.equal(current.help[0].target,"_blank",spec.key+" guide replaces current browser tab");
   assert.deepEqual(current.help[0].rel.split(/\s+/).sort(),["noopener","noreferrer"].sort());
   assert.ok(current.help[0].label.includes("kontrolní návod"));
   assert.equal(current.productCards,0);
   assert.equal(current.offers,0);
   assert.equal(current.merchants,0);
   assert.equal(current.acquisition,0);
   assert.equal(current.unsafeCta,false);
   assert.equal(current.explanation,true);
   assert.equal(current.fitEdit,0);
   assert.equal(current.situationEdit,1);
   assert.equal(await page.$eval(preview,el=>el.hidden),true);
   assert.equal(await page.$eval(stage,el=>el.hidden),true);

   // Open the actual help tab, verify the exact guide anchor, then return:
   // the selected situation and blocked result must remain unchanged.
   const newPage=new Promise((resolve,reject)=>{
     const timeout=setTimeout(()=>reject(new Error("No help popup for "+spec.key)),18000);
     page.once("popup",p=>{clearTimeout(timeout);resolve(p);});
   });
   await page.$eval(result+" a.zp-bath-safe-guide",el=>el.click());
   const popup=await newPage;
   try{
    const u=new URL(spec.guide,origin);
    await popup.waitForFunction(({path,hash})=>location.pathname===path&&location.hash===hash,
      {timeout:18000},{path:u.pathname,hash:u.hash});
    const destination=await popup.evaluate(anchor=>({
      path:location.pathname,
      query:location.search,
      hash:location.hash,
      heading:document.querySelector("main h1")?.textContent?.trim(),
      anchorFound:!!document.getElementById(anchor)
    }),u.hash.slice(1));
    assert.equal(destination.path,u.pathname);
    assert.equal(destination.hash,u.hash);
    assert.equal(destination.query,"",spec.key+" private answers in URL");
    assert.equal(destination.anchorFound,true,spec.key+" broken destination anchor");
    assert.ok(destination.heading?.length>10,spec.key+" guide has no useful heading");
   }finally{await popup.close();}

   const after=await page.evaluate(({form,result,answers})=>{
     const f=document.querySelector(form);
     const r=document.querySelector(result);
     return{
       path:location.pathname,query:location.search,
       blockedResultVisible:!r.hidden,
       guideHref:r.querySelector("a.zp-bath-safe-guide")?.getAttribute("href"),
       answers:Object.fromEntries(Object.keys(answers).map(name=>[
         name,f.querySelector('input[name="'+name+'"]:checked')?.value
       ])),
       merchantCount:r.querySelectorAll(".zp-offer a[href]").length
     };
   },{form,result,answers:spec.answers});
   assert.equal(after.path,spec.path);
   assert.equal(after.query,"");
   assert.equal(after.blockedResultVisible,true);
   assert.equal(after.guideHref,spec.guide);
   assert.deepEqual(after.answers,spec.answers,spec.key+" original private answers lost");
   assert.equal(after.merchantCount,0);

   // The safe edit handoff from PR #490 remains usable after returning.
   await page.$eval(result+' [data-zp-bath-edit="situation"]',el=>el.click());
   const focus=await page.evaluate(()=>({name:document.activeElement?.name,
      visible:!!document.activeElement?.getClientRects().length}));
   assert.equal(focus.visible,true,spec.key+" non-focusable edit action");
   assert.ok(Object.hasOwn(spec.answers,focus.name),spec.key+" edit did not return to a relevant question");

   verified.push({advisor:spec.key,blocked:true,guide:spec.guide,
     popupAnchorVerified:true,answersRetained:true,merchants:0,editFocus:focus.name});
   console.log("PASS blocked Bathroom guide popup:",spec.key);
  }finally{await page.close();}
 }
 assert.deepEqual(errors,[],"Live browser JS errors");
 assert.deepEqual(nonGet,[],"Network write attempted");
 console.log("LIVE_BATHROOM_BLOCKED_GUIDE_492",JSON.stringify({
   release:readiness.release,integrity:readiness.integrity,
   affiliateSlots:readiness.configured_total,advisors:verified.length,
   results:verified,merchantClicks:0,postRequests:nonGet.length
 }));
}finally{await browser.close();}
