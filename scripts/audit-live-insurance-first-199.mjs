/**
 * Exact 0.8.199 postdeploy read-only Chrome acceptance of first-screen
 * ePoukaz guidance. No purchases, no diagnoses, no form submissions.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import {SOURCE_THEME_RELEASE,EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

if(process.env.GITHUB_EVENT_NAME==="pull_request"){
  console.log("PREDEPLOY_SKIP_INSURANCE_FIRST_199");
  process.exit(0);
}
if(SOURCE_THEME_RELEASE!=="0.8.199"){
  console.log("NOT_APPLICABLE_INSURANCE_FIRST_199");
  process.exit(0);
}
assert.equal(EXPECTED_LIVE_RELEASE,"0.8.199","Exact source release required");
const origin="https://zaprazi.cz";
const readinessUrl=origin+"/wp-json/zaprazi/v1/affiliate-readiness";
const response=await fetch(readinessUrl,{
  method:"GET",redirect:"error",headers:{Accept:"application/json"},
  signal:AbortSignal.timeout(20000)
});
assert.equal(response.status,200,"Readiness endpoint unavailable");
assert.equal(response.url,readinessUrl,"Unexpected redirect");
const readiness=await response.json();
assert.equal(readiness.release,"0.8.199");
assert.equal(readiness.integrity,"ok","Partial WordPress deployment");
assert.equal(readiness.configured_total,25);
assert.equal(readiness.slot_total,25);

const browser=await puppeteer.launch({
  executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
let blocked=0,nonGet=0,merchantAttempts=0;
try {
  const page=await browser.newPage();
  try {
    await page.setViewport({width:390,height:844,deviceScaleFactor:1});
    await page.setRequestInterception(true);
    page.on("request",req=>{
      let safe=false;
      try {
        const u=new URL(req.url());
        if(req.method()!=="GET")nonGet++;
        if(u.origin!==origin&&/lekarna|drmax|rehabilitac|unizdrav|affil|affiliate/i.test(u.hostname))
          merchantAttempts++;
        safe=u.origin===origin&&req.method()==="GET"&&
          !u.search&&!u.username&&!u.password;
      } catch {}
      if(!safe)blocked++;
      return (safe?req.continue():req.abort("blockedbyclient")).catch(()=>{});
    });
    const target=origin+"/choditko-na-pojistovnu/";
    const nav=await page.goto(target,{waitUntil:"domcontentloaded",timeout:30000});
    assert.equal(nav?.status(),200);
    assert.equal(page.url(),target);
    const data=await page.evaluate(()=>{
      const entry=document.querySelector("#rychla-cesta-na-epoukaz");
      const hero=document.querySelector("main .zp-hero");
      const facts=document.querySelector(".zp-resource-summary");
      const links=[...(entry?.querySelectorAll("a[href]")||[])].map(a=>({
        href:a.href,target:a.target,rel:a.rel,visible:Boolean(a.getClientRects().length)
      }));
      const body=entry?.innerText||"";
      return {
        release:document.querySelector('meta[name="zaprazi-release"]')?.content,
        integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
        order:Boolean(entry&&hero&&facts&&hero.compareDocumentPosition(entry)&Node.DOCUMENT_POSITION_FOLLOWING&&
          entry.compareDocumentPosition(facts)&Node.DOCUMENT_POSITION_FOLLOWING),
        visible:Boolean(entry&&entry.getClientRects().length),
        numberedSteps:entry?.querySelectorAll("ol > li").length,
        headline:entry?.querySelector("h2")?.textContent?.trim(),
        text:body.replace(/\s+/g," "),
        links,
        offerShortcut:Boolean(entry?.querySelector(
          '[data-zp-offer],[data-zp-merchant-link],a[rel~="sponsored"],form'))
      };
    });
    assert.equal(data.release,"0.8.199");
    assert.equal(data.integrity,"ok");
    assert.equal(data.visible,true);
    assert.equal(data.order,true,"Three-step answer must precede historical amount");
    assert.equal(data.numberedSteps,3);
    assert.match(data.headline,/Jak získat chodítko na pojišťovnu/);
    assert.match(data.text,/Ověřte bezpečný typ pomůcky/);
    assert.match(data.text,/Zeptejte se předepisujícího lékaře/);
    assert.match(data.text,/U oprávněného výdejce ověřte přesný model/);
    assert.match(data.text,/Neplaťte předem v očekávání zpětného proplacení/);
    assert.equal(data.offerShortcut,false);
    for(const href of [
      origin+"/#poradce",
      target+"#postup",
      target+"#zp-overit-mesicni-seznam",
      "https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/proplaceni-choditka"
    ]) assert.ok(data.links.some(link=>link.href===href&&link.visible),"Missing safe route");
    const official=data.links.find(link=>link.href.startsWith("https://www.vzp.cz/"));
    assert.equal(official?.target,"_blank");
    assert.ok(official?.rel.split(/\s+/).includes("noopener"));
    assert.ok(official?.rel.split(/\s+/).includes("noreferrer"));

    const consent=await page.evaluate(()=>{
      const p=document.querySelector("#zp-analytics-consent");
      return Boolean(p&&!p.hidden&&p.getClientRects().length);
    });
    if(consent) {
      await page.click("#zp-analytics-deny");
      await page.waitForFunction(()=>document.querySelector("#zp-analytics-consent")?.hidden===true,
        {timeout:5000});
    }
    await page.click('#rychla-cesta-na-epoukaz a[href="'+origin+'/#poradce"]');
    await page.waitForFunction(url=>location.href===url,
      {timeout:18000,polling:250},origin+"/#poradce");
    assert.equal(page.url(),origin+"/#poradce");
    await page.waitForSelector("#poradce #zp-mobility-advisor",{visible:true,timeout:18000});
    assert.equal(await page.$eval('meta[name="zaprazi-release"]',x=>x.content),"0.8.199");
    assert.equal(await page.$eval('meta[name="zaprazi-integrity"]',x=>x.content),"ok");
    assert.equal(nonGet,0,"Never submit forms or analytics POST");
    assert.equal(merchantAttempts,0,"Never click or load affiliate merchants");
    console.log("PASS_0_8_199_INSURANCE_FIRST_ANSWER",JSON.stringify({
      release:"0.8.199",steps:3,advisorHandoff:true,affiliateConfigured:25,
      blocked,nonGet,merchantAttempts,answerPayloads:0
    }));
  }finally{await page.close();}
}finally{await browser.close();}
