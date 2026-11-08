/**
 * 0.8.201 exact-release acceptance: practical questions for the doctor and
 * authorized dispenser on the existing insurance walker SEO landing.
 * Read-only Chrome: same-origin GET only; no affiliate clicks or visitor answers.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import {SOURCE_THEME_RELEASE,EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

if(process.env.GITHUB_EVENT_NAME==="pull_request"){
  console.log("PREDEPLOY_INSURANCE_201_SKIP");
  process.exit(0);
}
if(SOURCE_THEME_RELEASE!=="0.8.201"){
  console.log("INSURANCE_201_NOT_APPLICABLE");
  process.exit(0);
}
assert.equal(EXPECTED_LIVE_RELEASE,"0.8.201");

const origin="https://zaprazi.cz";
const url=origin+"/choditko-na-pojistovnu/";
const browser=await puppeteer.launch({
  executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
let nonGet=0,thirdParty=0;
try{
  const page=await browser.newPage();
  try{
    await page.setViewport({width:390,height:844,deviceScaleFactor:1});
    await page.setRequestInterception(true);
    page.on("request",request=>{
      let allow=false;
      try{
        const parsed=new URL(request.url());
        allow=parsed.origin===origin && request.method()==="GET" &&
          !parsed.username && !parsed.password &&
          ![...parsed.searchParams.keys()].some(k=>/(?:answer|diagnosis|health|patient|condition)/i.test(k));
        if(parsed.origin!==origin)thirdParty++;
      }catch{}
      if(request.method()!=="GET")nonGet++;
      void (allow?request.continue():request.abort("blockedbyclient")).catch(()=>{});
    });
    const res=await page.goto(url,{waitUntil:"networkidle2",timeout:35000});
    assert.equal(res?.status(),200);
    const facts=await page.evaluate(()=>{
      const content=document.querySelector("#priprava-pro-lekare");
      const visible=el=>Boolean(el&&!el.closest("[hidden]")&&
        getComputedStyle(el).display!=="none");
      const cards=[...content?.querySelectorAll(".zp-decision-card")||[]];
      const links=[...content?.querySelectorAll("a[href]")||[]];
      const safeLinks=links.every(a=>{
        try{
          const u=new URL(a.href,location.href);
          return u.protocol==="https:" && !u.username && !u.password &&
            !u.search && (
              u.origin===location.origin ||
              u.hostname==="sukl.gov.cz" ||
              u.hostname==="www.vzp.cz"
            );
        }catch{return false;}
      });
      return {
        release:document.querySelector('meta[name="zaprazi-release"]')?.content,
        integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
        heroHeading:document.querySelector("main .zp-hero h1")?.textContent?.trim(),
        heroAnchor:document.querySelector('main .zp-hero a[href="#priprava-pro-lekare"]')?.textContent?.trim(),
        sectionVisible:visible(content),
        sections:document.querySelectorAll("#priprava-pro-lekare").length,
        headings:cards.map(c=>c.querySelector("h3")?.textContent?.trim()||""),
        linkCount:links.length,
        safeLinks,
        noCommerce:!content?.querySelector('[data-zp-merchant-link],[data-zp-offer],a[rel~="sponsored"]'),
        noForms:!content?.querySelector("input,form,textarea"),
        sourceSukl:links.some(a=>a.hostname==="sukl.gov.cz"),
        sourceVzp:links.some(a=>a.hostname==="www.vzp.cz"),
        measurements:links.some(a=>a.pathname==="/co-zmerit-pred-vyberem-choditka/"),
        correctPrivacyUrl:!location.search && !location.hash
      };
    });
    assert.equal(facts.release,"0.8.201");
    assert.equal(facts.integrity,"ok");
    assert.equal(facts.heroHeading,"Chodítko na pojišťovnu v roce 2026.");
    assert.match(facts.heroAnchor||"",/lékaři a výdejně/);
    assert.equal(facts.sections,1);
    assert.equal(facts.sectionVisible,true);
    assert.equal(facts.headings.length,2);
    assert.match(facts.headings[0],/lékař/);
    assert.match(facts.headings[1],/výdejna/);
    for(const key of ["safeLinks","noCommerce","noForms","sourceSukl","sourceVzp","measurements","correctPrivacyUrl"])
      assert.equal(facts[key],true,"Broken insurance prep "+key);
    assert.ok(facts.linkCount>=4);
    assert.equal(nonGet,0);
    console.log("INSURANCE_201_CHROME_PASS "+JSON.stringify({release:facts.release,
      integrity:facts.integrity,questions:2,officialSources:2,
      commerceLinks:0,nonGetRequests:0}));
  }finally{await page.close();}
}finally{await browser.close();}
