/** Live Chrome / PR506: measurable WC riser-height guide with exact contextual entry paths. */
import assert from "node:assert/strict";
import {accessSync,constants} from "node:fs";
import puppeteer from "puppeteer-core";

const origin=(process.env.ZP_LIVE_ORIGIN||"https://zaprazi.cz").replace(/\/$/,"");
const target="/nastavec-na-wc-pro-seniory/";
const anchor="vyska-nastavce-5-10-15";
const desired=origin+target+"#"+anchor;
const chrome=[process.env.CHROME_BIN,"/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"]
 .filter(Boolean).find(p=>{try{accessSync(p,constants.X_OK);return true;}catch{return false;}});
assert.ok(chrome,"Missing real Chrome binary");
const readyResponse=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",{signal:AbortSignal.timeout(25000)});
assert.equal(readyResponse.status,200,"Readiness endpoint unavailable");
const ready=await readyResponse.json();
assert.equal(ready.integrity,"ok","Full WordPress deployment integrity must be OK");
assert.equal(ready.configured_total,ready.slot_total);
assert.ok(ready.slot_total>=25);
const browser=await puppeteer.launch({executablePath:chrome,headless:true,
 args:["--no-sandbox","--disable-dev-shm-usage","--disable-setuid-sandbox"]});
const jsErrors=[],writes=[],checks=[];
async function goto(page,path){
 const response=await page.goto(origin+path,{waitUntil:"networkidle2",timeout:45000});
 assert.equal(response?.status(),200,path+" must be a live page");
 const meta=await page.evaluate(()=>({
  release:document.querySelector('meta[name="zaprazi-release"]')?.content,
  integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
  canonical:document.querySelector('link[rel="canonical"]')?.href,
  h1:document.querySelectorAll("h1").length
 }));
 assert.equal(meta.release,ready.release,path+" release");
 assert.equal(meta.integrity,"ok",path+" integrity");
 assert.equal(meta.canonical,origin+path,path+" canonical");
 assert.equal(meta.h1,1,path+" H1");
}
try{
 for(const width of [390,1280]){
  const page=await browser.newPage();
  try{
   await page.setViewport({width,height:844,deviceScaleFactor:1});
   page.setDefaultTimeout(15000);
   await page.setRequestInterception(true);
   page.on("request",req=>{
     if(req.method()!=="GET"){writes.push({width,method:req.method()});return req.abort();}
     if(req.url().startsWith(origin+"/")||req.url().startsWith("about:")||req.url().startsWith("data:"))
       return req.continue();
     return req.abort();
   });
   page.on("pageerror",e=>jsErrors.push({width,message:e.message}));
   for(const source of ["/koupelna-a-wc/","/co-zmerit-v-koupelne-pred-vyberem-pomucky/"]){
     await goto(page,source);
     const links=await page.$$eval('a[href]',all=>all.map(a=>({
       url:a.href,visible:!!a.getClientRects().length,text:a.textContent.trim()
     })));
     const hits=links.filter(l=>l.url===desired);
     assert.equal(hits.length,1,source+" must contain exactly one new contextual guide link");
     assert.equal(hits[0].visible,true,source+" link hidden");
     assert.match(hits[0].text,/výšk|5, 10|15 cm/i,source+" context unclear");
     const from=source;
     await page.$eval('a[href="'+desired+'"]',a=>a.click());
     await page.waitForFunction(({path,hash})=>location.pathname===path&&location.hash==="#"+hash,
       {timeout:16000},{path:target,hash:anchor});
     checks.push({width,from,reachable:true,anchor});
     console.log("PASS live height guide inbound",source,width);
   }
   await goto(page,target);
   const guide=await page.evaluate(anchor=>{
     const node=document.getElementById(anchor);
     const area=node?.querySelector(".zp-wrap");
     const h2=node?.querySelector("h2");
     const sectionText=area?.innerText||"";
     const parentArticle=document.querySelector("#zp-toilet-riser-advisor");
     const hero=document.querySelector(".zp-hero");
     const links=[...(area?.querySelectorAll("a[href]")||[])].map(a=>({href:a.href,text:a.textContent.trim()}));
     const order=(a,b)=>a?.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING;
     return {
       heading:h2?.textContent.trim(),
       headings:[...(area?.querySelectorAll("h3")||[])].map(n=>n.textContent.trim()),
       steps:node?.querySelectorAll("ol > li").length,
       cards:node?.querySelectorAll(".zp-decision-card").length,
       guideBeforeAdvisor:!!order(node,parentArticle),
       heroLink:hero?.querySelector('a[href="#'+anchor+'"]')?.textContent.trim(),
       returnLink:node?.querySelector('a[href="#poradce-nastavec-wc"]')?.textContent.trim(),
       labels:["5 cm","10 cm","15 cm","chodidla","nosnost","uchycení","fyzioterapeut","ergoterapeut"].map(w=>({w,exists:sectionText.includes(w)})),
       pdf:links.some(l=>l.href.startsWith("https://www.dmapraha.cz/")&&l.href.endsWith(".pdf")),
       merchant:node?.querySelectorAll('[data-zp-toilet-merchant-link],.zp-offer').length,
       advisor:!!parentArticle,
       submit:!!document.getElementById("zp-toilet-riser-submit"),
       fit:!!document.getElementById("zp-toilet-riser-fit-stage")
     };
   },anchor);
   assert.match(guide.heading,/5, 10 nebo 15 cm/);
   assert.equal(guide.guideBeforeAdvisor,false,"Editorial content must not replace advisor");
   assert.equal(guide.cards,3,"Three height comparison cards");
   assert.equal(guide.steps,6,"Six actual numbered instructions");
   assert.equal(guide.advisor,true);assert.equal(guide.submit,true);assert.equal(guide.fit,true);
   assert.ok(guide.heroLink,"New guide must be accessible from hero");
   assert.ok(guide.returnLink,"Guide must return to safe Advisor");
   assert.deepEqual(guide.labels.filter(x=>!x.exists),[],"Missing safety text in production");
   assert.equal(guide.pdf,true,"Missing source PDF reference");
   assert.equal(guide.merchant,0,"Editorial section must not contain commerce");
   // The independent WC advisor must still safely block physical-assist transfers.
   await page.$eval('input[name="transferAbility"][value="person_assist"]',el=>el.click());
   await page.$eval("#zp-toilet-riser-submit",el=>el.click());
   await page.waitForFunction(()=>document.querySelector("#zp-toilet-riser-result")?.hidden===false,
      {timeout:16000});
   const blocked=await page.$eval("#zp-toilet-riser-result",el=>({
     hasMerchant:!!el.querySelector('[data-zp-toilet-merchant-link],.zp-offers a[href]'),
     offers:el.querySelectorAll(".zp-offer").length,
     text:el.innerText.slice(0,500)
   }));
   assert.equal(blocked.hasMerchant,false,"Merchant enabled for physical-assist transfer");
   assert.equal(blocked.offers,0,"Product offers must be absent for physical assist");
   checks.push({width,path:target,guideCards:guide.cards,steps:guide.steps,safeBlocked:true});
   console.log("PASS live WC height 5/10/15 guide",width);
  }finally{await page.close();}
 }
 assert.deepEqual(jsErrors,[],"JavaScript errors");
 assert.deepEqual(writes,[],"Non-GET requests");
 console.log("LIVE_WC_HEIGHT_GUIDE_506",JSON.stringify({
  release:ready.release,integrity:ready.integrity,slots:ready.configured_total,
  checks,merchantClicks:0,nonGets:0
 }));
}finally{await browser.close();}
