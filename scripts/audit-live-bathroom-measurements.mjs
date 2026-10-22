/**
 * Production acceptance of educational bathroom measuring page.
 * Read-only; no user personal or health data; never initiates affiliate clicks.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import { EXPECTED_LIVE_RELEASE } from "./lib/live-release.mjs";

const origin="https://zaprazi.cz";
const version=EXPECTED_LIVE_RELEASE;
const route="/co-zmerit-v-koupelne-pred-vyberem-pomucky/";
const expectedInbound=[
  ["/koupelna-a-wc/","#vyberte-misto","#zp-bathroom-fit-stage"],
  ["/sprchovaci-zidle-pro-seniory/","#mereni-sprcha","#zp-shower-chair-fit-stage"],
  ["/nastavec-na-wc-pro-seniory/","#mereni-wc","#zp-toilet-riser-fit-stage"],
  ["/madlo-k-wc-pro-seniory/","#mereni-wc","#zp-toilet-support-fit-stage"],
  ["/sedatko-do-vany-pro-seniory/","#mereni-vana","#zp-bath-transfer-fit-stage"],
  ["/toaletni-zidle-pro-seniory/","#kontrolni-list-koupelna","#zp-toilet-chair-fit-stage"]
];
const expectedOutbound=[
  "/koupelna-a-wc/#poradce-koupelna",
  "/nastavec-na-wc-pro-seniory/#poradce-nastavec-wc",
  "/madlo-k-wc-pro-seniory/#poradce-opora-wc",
  "/sprchovaci-zidle-pro-seniory/#poradce-sprchovaci-zidle",
  "/sedatko-do-vany-pro-seniory/#poradce-sedatko-vana",
  "/toaletni-zidle-pro-seniory/#poradce-toaletni-zidle",
  "/bezpecny-byt-pro-seniora/",
  "/pomucky-do-koupelny-na-pojistovnu/"
];

const response=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",{
  headers:{Accept:"application/json"},signal:AbortSignal.timeout(30000)
});
assert.equal(response.status,200,"Readiness endpoint is unavailable");
const readiness=await response.json();
assert.equal(readiness.release,version,"Unexpected production version");
assert.equal(readiness.integrity,"ok","Live theme integrity is not OK");
assert.equal(readiness.configured_total,25,"Affiliate configuration changed");
assert.equal(readiness.slot_total,25,"Affiliate inventory changed");

const browser=await puppeteer.launch({
  executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
const jsErrors=[],methods=[];
async function openPage(path){
  const page=await browser.newPage();
  await page.setViewport({width:390,height:844,deviceScaleFactor:1});
  await page.setRequestInterception(true);
  page.on("pageerror",e=>jsErrors.push(e.message));
  page.on("request",req=>{
    methods.push(req.method());
    if(!req.url().startsWith(origin+"/")||req.method()!=="GET")req.abort();
    else req.continue();
  });
  const result=await page.goto(origin+path,{waitUntil:"domcontentloaded",timeout:30000});
  assert.equal(result?.status(),200,"No valid page at "+path);
  const meta=await page.evaluate(()=>({
    release:document.querySelector('meta[name="zaprazi-release"]')?.content,
    integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
    canonical:document.querySelector('link[rel="canonical"]')?.href,
    description:document.querySelector('meta[name="description"]')?.content,
    h1:document.querySelectorAll("main h1").length,
    title:document.title,
    text:document.querySelector("main")?.innerText||"",
    ids:[...document.querySelectorAll("main [id]")].map(x=>x.id),
    links:[...document.querySelectorAll("main a[href]")].map(x=>x.href),
    forms:document.querySelectorAll("main form").length,
    overflow:document.documentElement.scrollWidth-innerWidth
  }));
  assert.equal(meta.release,version,"Wrong release on "+path);
  assert.equal(meta.integrity,"ok","Partial render on "+path);
  assert.equal(meta.canonical,origin+path,"Unexpected canonical on "+path);
  assert.equal(meta.h1,1,"Wrong H1 count on "+path);
  assert.ok(meta.overflow<=2,"Mobile horizontal overflow on "+path);
  return {page,meta};
}
try{
  const {page,meta}=await openPage(route);
  try{
    assert.match(meta.title,/Co změřit v koupelně/);
    assert.ok((meta.description||"").length>=70,"No useful page snippet");
    for(const anchor of ["vyberte-misto","mereni-wc","mereni-sprcha","mereni-vana","kontrolni-list-koupelna"])
      assert.ok(meta.ids.includes(anchor),"Missing anchor "+anchor);
    assert.equal(meta.forms,0,"Article must not collect form inputs");
    assert.match(meta.text,/Samy ale neprokážou stabilitu/);
    assert.match(meta.text,/nosný podklad/);
    assert.match(meta.text,/fyzicky zvedat/);
    const numCards=await page.$$eval("#mereni-wc article.zp-decision-card, #mereni-sprcha article.zp-decision-card, #mereni-vana article.zp-decision-card",x=>x.length);
    assert.equal(numCards,7,"Expected seven practical checks");
    for(const path of expectedOutbound)
      assert.ok(meta.links.includes(origin+path),"No useful advisor path "+path);
    assert.ok(!meta.links.some(href=>/ehub\.cz|awin|cj\.com|click\.php/i.test(href)),
      "Editorial measuring guide must not deep-link to merchant");
  }finally{await page.close();}
  // A visitor measuring an exact candidate must be able to open help without
  // abandoning their browser-only answers. All six stage-two links stay noncommercial.
  for(const [path,hash,stage] of expectedInbound){
    const {page,meta}=await openPage(path);
    try{
      assert.ok(meta.links.includes(origin+route+hash),
        "Missing inbound link "+path+" -> "+hash);
      const help=await page.$eval(stage,section=>{
        const link=section.querySelector(".zp-fit-measurement-help a[href]");
        return {
          hidden:section.hidden,
          href:link?.href||"",
          target:link?.target||"",
          rel:link?.rel||"",
          label:link?.textContent?.trim()||"",
          offerMarkers:section.querySelectorAll("[data-zp-bath-merchant-link]").length
        };
      });
      assert.equal(help.hidden,true,"Fit stage should initially be hidden: "+path);
      assert.equal(help.href,origin+route+hash,"Wrong fit help target on "+path);
      assert.equal(help.target,"_blank","Fit help would abandon answers on "+path);
      assert.deepEqual(help.rel.split(/\s+/).sort(),["noopener","noreferrer"].sort(),
        "New-tab link must not expose window.opener: "+path);
      assert.match(help.label,/nová karta/,"New-tab behavior is not explained: "+path);
      assert.equal(help.offerMarkers,0,"Help link must never contain a merchant action: "+path);

      if(path==="/koupelna-a-wc/"){
        // One real browser journey: start stage one, open the help in a new tab,
        // and confirm the existing advisor state remains unchanged in the first tab.
        await page.waitForNetworkIdle({idleTime:400,timeout:15000});
        await page.$eval('input[name="primaryNeed"][value="raise_toilet"]',x=>x.click());
        await page.$eval('input[name="transferAbility"][value="independent"]',x=>x.click());
        await page.$eval('input[name="duration"][value="long_term"]',x=>x.click());
        await page.$eval("#zp-bathroom-submit",x=>x.click());
        await page.waitForFunction(
          ()=>document.querySelector("#zp-bathroom-fit-stage")?.hidden===false,
          {timeout:5500}
        ).catch(async ()=>{
          const diagnostic=await page.evaluate(()=>({
            checked:[...document.querySelectorAll("#zp-bathroom-advisor input:checked")].map(x=>x.name+"="+x.value),
            previewHidden:document.querySelector("#zp-bathroom-preview")?.hidden,
            stageHidden:document.querySelector("#zp-bathroom-fit-stage")?.hidden,
            errorText:document.querySelector("#zp-bathroom-errors")?.textContent?.trim(),
            resultText:document.querySelector("#zp-bathroom-result")?.textContent?.slice(0,250),
            button:document.querySelector("#zp-bathroom-submit")?.textContent
          }));
          throw new Error("Bathroom stage-one smoke did not advance: "+JSON.stringify(diagnostic));
        });
        const popupPromise=new Promise((resolve,reject)=>{
          const timer=setTimeout(()=>reject(new Error("Measurement help did not open a new tab")),12000);
          page.once("popup",tab=>{clearTimeout(timer);resolve(tab);});
        });
        await page.click(stage+" .zp-fit-measurement-help a");
        const popup=await popupPromise;
        try{
          await popup.waitForFunction(
            ()=>location.pathname==="/co-zmerit-v-koupelne-pred-vyberem-pomucky/",
            {timeout:15000}
          );
          const kept=await page.evaluate(()=>({
            url:location.pathname,
            need:document.querySelector('input[name="primaryNeed"]:checked')?.value,
            transfer:document.querySelector('input[name="transferAbility"]:checked')?.value,
            fitVisible:document.querySelector("#zp-bathroom-fit-stage")?.hidden===false,
            resultHidden:document.querySelector("#zp-bathroom-result")?.hidden
          }));
          assert.deepEqual(kept,{
            url:"/koupelna-a-wc/",need:"raise_toilet",transfer:"independent",
            fitVisible:true,resultHidden:true
          },"Opening measuring instructions must not clear or finalize the Advisor");
        }finally{await popup.close();}
      }
    }finally{await page.close();}
  }
  assert.deepEqual(jsErrors,[],"Runtime JS errors");
  assert.ok(!methods.some(m=>m!=="GET"),"The audit attempted a write");
  console.log("LIVE_BATHROOM_MEASUREMENTS",JSON.stringify({
    version,integrity:readiness.integrity,affiliate_slots:readiness.configured_total,
    article:route,checklist_items:7,inbound_routes:expectedInbound.length,fit_stage_help_routes:expectedInbound.length,
    advisor_and_support_links:expectedOutbound.length,forms:0,post_requests:0,
    js_errors:0
  }));
}finally{await browser.close();}
