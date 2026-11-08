#!/usr/bin/env node
/**
 * Postdeploy, read-only Chrome acceptance of the practical acquisition
 * pathways after seven walker measurements. Never follows merchant or
 * affiliate links, never submits answers or logs personal/tracking URLs.
 */
import assert from "node:assert/strict";
import {SOURCE_THEME_RELEASE,EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

if(process.env.GITHUB_EVENT_NAME==="pull_request"){
  console.log("PREDEPLOY_WALKER_ACQUISITION_202_SKIP");
  process.exit(0);
}
if(SOURCE_THEME_RELEASE!=="0.8.202"){
  console.log("WALKER_ACQUISITION_202_NOT_APPLICABLE");
  process.exit(0);
}
assert.equal(EXPECTED_LIVE_RELEASE,"0.8.202");

const ORIGIN="https://zaprazi.cz";
const sourcePath="/co-zmerit-pred-vyberem-choditka/";
const destinations=[
  {exactPath:"/choditko-na-pojistovnu/",fragment:"priprava-pro-lekare"},
  {exactPath:"/pujceni-choditka/",fragment:"rozpocet-pujceni-choditka"},
  {exactPath:"/",fragment:"poradce"}
];
const puppeteer=(await import("puppeteer-core")).default;
const browser=await puppeteer.launch({
  executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
let noGet=0;
try{
  const page=await browser.newPage();
  try{
    await page.setViewport({width:390,height:844,deviceScaleFactor:1});
    page.setDefaultTimeout(15000);
    await page.setRequestInterception(true);
    page.on("request",request=>{
      let safe=false;
      try{
        const u=new URL(request.url());
        safe=u.origin===ORIGIN && request.method()==="GET" &&
          !u.username && !u.password &&
          ![...u.searchParams.keys()].some(k=>/^(?:answers?|health|diagnosis|patient|condition|weight|handbrakes)$/i.test(k));
      }catch{}
      if(request.method()!=="GET")noGet++;
      void (safe?request.continue():request.abort("blockedbyclient")).catch(()=>{});
    });
    const load=async path=>{
      const response=await page.goto(ORIGIN+path,{waitUntil:"networkidle2",timeout:40000});
      assert.equal(response?.status(),200,"Decision page should return HTTP 200");
      const meta=await page.evaluate(()=>({
        release:document.querySelector('meta[name="zaprazi-release"]')?.content,
        integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
        pathname:location.pathname,
        search:location.search
      }));
      assert.equal(meta.release,"0.8.202");
      assert.equal(meta.integrity,"ok");
      assert.equal(meta.search,"","No answer or personal query params");
      assert.equal(meta.pathname,path,"Unrelated redirect is not accepted");
    };

    await load(sourcePath);
    const result=await page.evaluate(()=>{
      const wrap=document.querySelector("#co-po-mereni");
      const cards=[...wrap?.querySelectorAll("article.zp-decision-card")||[]];
      const anchors=[...wrap?.querySelectorAll("a[href]")||[]];
      return {
        count:document.querySelectorAll("#co-po-mereni").length,
        heading:wrap?.querySelector("h2")?.textContent||"",
        countCards:cards.length,
        labels:cards.map(card=>card.querySelector("h3")?.textContent?.trim()||""),
        paths:anchors.map(a=>{
          const u=new URL(a.href);
          return u.origin===location.origin&&!u.search&&!u.username&&!u.password?
            {path:u.pathname,hash:u.hash,adLink:a.hasAttribute("data-zp-journey")}:
            {path:"REJECTED",hash:"",adLink:false};
        }),
        noCommerce:Boolean(wrap)&&!wrap.querySelector('[data-zp-merchant-link],a[rel~="sponsored"],form,input,textarea'),
        disclaimer:wrap?.querySelector(".zp-disclaimer")?.textContent||"",
        visible:Boolean(wrap&&getComputedStyle(wrap).display!=="none")
      };
    });
    assert.equal(result.count,1);
    assert.equal(result.visible,true);
    assert.equal(result.countCards,3);
    assert.equal(result.paths.length,3);
    assert.match(result.heading,/Koupit, půjčit, nebo ověřit ePoukaz/);
    assert.match(result.labels[0],/ePoukaz/);
    assert.match(result.labels[1],/půjčit/);
    assert.match(result.labels[2],/nákup/);
    assert.equal(result.noCommerce,true);
    assert.match(result.disclaimer,/odborné posouzení/);
    for(let i=0;i<destinations.length;i++){
      const {exactPath,fragment}=destinations[i];
      assert.equal(result.paths[i].path,exactPath);
      assert.equal(result.paths[i].hash,"#"+fragment);
      assert.equal(result.paths[i].adLink,i===2,"Only advisor entry is measured");
      await load(exactPath);
      assert.equal(await page.evaluate(id=>document.querySelectorAll('[id="'+id+'"]').length,fragment),1,
        "Live destination anchor cannot be missing/duplicated");
    }
    assert.equal(noGet,0,"QA cannot write to WordPress");
    console.log("WALKER_ACQUISITION_202_CHROME_PASS "+
      JSON.stringify({release:"0.8.202",paths:3,anchors:3,safeCommerceLinks:0,nonGetRequests:0}));
  }finally{await page.close();}
}finally{await browser.close();}
