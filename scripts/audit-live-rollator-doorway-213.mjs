#!/usr/bin/env node
/**
 * Exact 0.8.213+ live acceptance for 60 cm doorway and MEYRA model identity.
 * Same-origin GET-only Chromium, no merchant click, form or health data.
 * A pull-request predeploy pass must never attest future WordPress content.
 */
import assert from "node:assert/strict";
import {SOURCE_THEME_RELEASE,EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

if(process.env.GITHUB_EVENT_NAME==="pull_request"){
  console.log("ROLLATOR_DOORWAY_213_PREDEPLOY_SKIP");
  process.exit(0);
}
const atLeast=(actual,minimum)=>{
  const a=actual.split(".").map(Number),b=minimum.split(".").map(Number);
  for(let i=0;i<3;i++)if(a[i]!==b[i])return a[i]>b[i];
  return true;
};
if(!atLeast(SOURCE_THEME_RELEASE,"0.8.213")){
  console.log("ROLLATOR_DOORWAY_213_NOT_YET_RELEASED");
  process.exit(0);
}
assert.equal(EXPECTED_LIVE_RELEASE,SOURCE_THEME_RELEASE,
  "Only exact current WordPress release can pass postdeploy acceptance");

const ORIGIN="https://zaprazi.cz";
const rollator="/rollator-pro-seniory/";
const hub="/choditka-pro-seniory/";
const insurance="/choditko-na-pojistovnu/";
const targetAnchor="rollator-uzke-dvere";
const puppeteer=(await import("puppeteer-core")).default;
const browser=await puppeteer.launch({
  executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
const evidence=[];
try{
  const page=await browser.newPage();
  try{
    await page.setViewport({width:390,height:844,deviceScaleFactor:1});
    await page.setRequestInterception(true);
    page.on("request",request=>{
      let allow=false;
      try{
        const u=new URL(request.url());
        allow=request.method()==="GET" && u.origin===ORIGIN &&
          !u.username&&!u.password&&
          ![...u.searchParams.keys()].some(k=>/answer|health|symptom|diagnos|patient|weight|condition/i.test(k));
      }catch{}
      void(allow?request.continue():request.abort("blockedbyclient")).catch(()=>{});
    });
    async function visit(path){
      const response=await page.goto(ORIGIN+path,{
        waitUntil:"domcontentloaded",timeout:35000
      });
      assert.equal(response?.status(),200,"Canonical must return HTTP 200: "+path);
      const d=await page.evaluate(()=>({
        path:location.pathname,query:location.search,
        release:document.querySelector('meta[name="zaprazi-release"]')?.content||"",
        integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content||"",
        canonical:document.querySelector('link[rel="canonical"]')?.href||"",
        h1:document.querySelectorAll("main h1").length,
        mobileOverflow:Math.round(document.documentElement.scrollWidth-innerWidth)
      }));
      assert.equal(d.path,path,"Unexpected URL redirect");
      assert.equal(d.query,"","No query strings or health answers in URLs");
      assert.equal(d.release,SOURCE_THEME_RELEASE,"Source and WordPress release mismatch");
      assert.equal(d.integrity,"ok","Incomplete theme release");
      assert.equal(d.canonical,ORIGIN+path,"Wrong self-canonical");
      assert.equal(d.h1,1,"Missing or duplicate H1");
      assert.ok(d.mobileOverflow<=2,"Mobile horizontal overflow");
    }
    await visit(rollator);
    const answer=await page.evaluate(id=>{
      const section=document.getElementById(id);
      const text=section?.textContent||"";
      const links=[...section?.querySelectorAll("a[href]")||[]].map(a=>a.href);
      const official=[
        "https://eshop.meyra.cz/product/choditka_-berle_-hole/ctyrkolove-choditko-ideal-rollator-/191",
        "https://eshop.meyra.cz/product/choditka_-berle_-hole/ctyrkolove-choditko-rollator-2/428",
        "https://www.meyra.cz/upload/files/produkty/Hole-berle-choditka/navod-k-pouziti-ideal-rollator.pdf",
        "https://www.meyra.cz/upload/files/produkty/Hole-berle-choditka/Navod-k-pouziti-rollator-3061982.pdf"
      ];
      return {
        count:document.querySelectorAll("#"+id).length,
        heroLink:Boolean(document.querySelector('main .zp-hero a[href="#'+id+'"]')),
        title:section?.querySelector("h2")?.textContent||"",
        threeSteps:section?.querySelectorAll("article.zp-decision-card").length||0,
        allManufacturerSources:official.every(h=>links.includes(h)),
        accurateWidth:/61,5 cm/.test(text)&&/59 cm/.test(text)&&/615 mm/.test(text),
        modelIdentity:/3061982-R/.test(text)&&/IDEAL ROLLATOR 3061982/.test(text),
        noGuaranteedFit:/nepotvrzuje/i.test(text)&&/ověř(?:te|it|ení)/i.test(text),
        brakingAndSafety:/brzd/.test(text)&&/Nezkoušejte průchod vynutit/.test(text),
        measuringGuide:links.includes(location.origin+"/co-zmerit-pred-vyberem-choditka/#co-zmerit"),
        privateAdvisor:links.includes(location.origin+"/choditko-do-bytu-pro-seniory/#poradce-choditko-byt"),
        rollatorAdvisor:links.includes(location.origin+"/rollator-pro-seniory/#poradce-rollator"),
        noMerchant:!section?.querySelector('[data-zp-merchant-link],[data-zp-offer],a[rel~="sponsored"]'),
        noForm:!section?.querySelector("form,input,textarea")
      };
    },targetAnchor);
    assert.equal(answer.count,1,"Missing or duplicate 60cm guide");
    assert.match(answer.title,/Projde rollátor dveřmi širokými 60 cm/);
    assert.equal(answer.threeSteps,3,"Practical decision steps lost");
    for(const key of ["heroLink","allManufacturerSources","accurateWidth","modelIdentity",
      "noGuaranteedFit","brakingAndSafety","measuringGuide","privateAdvisor",
      "rollatorAdvisor","noMerchant","noForm"])
      assert.equal(answer[key],true,"Unsafe or missing rollator guide: "+key);
    evidence.push({path:rollator,threeSteps:answer.threeSteps,sourceCount:4});

    for(const path of [hub,insurance]){
      await visit(path);
      const inbound=await page.evaluate(id=>
        [...document.querySelectorAll("main a[href]")].filter(a=>{
          const u=new URL(a.href,location.href);
          return u.origin===location.origin &&
            u.pathname==="/rollator-pro-seniory/" && u.hash==="#"+id;
        }).length,targetAnchor);
      assert.equal(inbound,1,"Expected one contextual link on: "+path);
      evidence.push({path,contextualLinks:inbound});
    }
  }finally{await page.close();}
}finally{await browser.close();}

// Exact public Yoast <lastmod>; legitimate theme edits do not change WP post_modified.
const childrenResponse=await fetch(ORIGIN+"/sitemap_index.xml",{redirect:"error"});
assert.equal(childrenResponse.status,200,"Yoast index missing");
const children=[...(await childrenResponse.text()).matchAll(
  /<loc>\s*https:\/\/zaprazi\.cz\/(page-sitemap\d*\.xml)\s*<\/loc>/gi
)].map(x=>x[1]);
assert.ok(children.length>0&&children.length<=10,"Unexpected page sitemap inventory");
const dates=new Map([[rollator,0],[hub,0],[insurance,0]]);
for(const child of children){
  const r=await fetch(ORIGIN+"/"+child,{redirect:"error"});
  assert.equal(r.status,200,"Public page sitemap missing");
  const xml=await r.text();
  assert.match(xml,/<urlset\b/i,"Invalid Yoast page sitemap");
  for(const entry of xml.matchAll(/<url\b[^>]*>([\s\S]*?)<\/url>/gi)){
    const loc=entry[1].match(/<loc>\s*(https:\/\/zaprazi\.cz\/[^<]+)\s*<\/loc>/i)?.[1];
    if(!loc)continue;
    const u=new URL(loc);
    if(u.origin!==ORIGIN||u.search||u.hash||!dates.has(u.pathname))continue;
    const mod=entry[1].match(/<lastmod>\s*([^<]+)\s*<\/lastmod>/i)?.[1];
    assert.ok(mod&&Number.isFinite(Date.parse(mod)),"Missing material edit timestamp");
    assert.ok(Date.parse(mod)>=Date.parse("2026-11-10T00:00:00+00:00"),
      "0.8.213 material mobility edit has stale public sitemap lastmod");
    dates.set(u.pathname,dates.get(u.pathname)+1);
  }
}
for(const [path,count] of dates)
  assert.equal(count,1,"Missing/duplicated canonical 213 sitemap URL: "+path);
console.log("ROLLATOR_DOORWAY_213_CHROME_PASS "+
  JSON.stringify({release:SOURCE_THEME_RELEASE,evidence,
    materialSitemapPages:dates.size,nonGetRequestsSent:0,
    thirdPartyRequestsSent:0,formsSubmitted:0,merchantClicks:0}));
