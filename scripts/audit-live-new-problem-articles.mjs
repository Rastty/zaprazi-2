/**
 * Zápraží 0.8.159 postdeploy article acceptance.
 * Only GET public production pages. No WordPress writes or affiliate clicks.
 * Tests the already-live 0.8.158 mobility links even before deploying 0.8.159.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import {extractLocs} from "./audit-public-sitemap.mjs";

const origin="https://zaprazi.cz";
const minimum=[0,8,158], articlesVersion=[0,8,159];
const parseRelease=value=>{
  assert.match(value||"",/^\d+\.\d+\.\d+$/,"Invalid live release");
  return value.split(".").map(Number);
};
const atLeast=(actual,need)=>actual.some((n,i)=>
  n!==need[i] && actual.slice(0,i).every((p,k)=>p===need[k]) && n>need[i]) ||
  actual.every((n,i)=>n===need[i]);
const get=async url=>{
  assert.ok(url.startsWith(origin+"/")&&!url.includes("@"),"Off-domain request");
  const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
  assert.equal(response.status,200,"Missing public resource: "+url);
  return response;
};
const readiness=await (await get(origin+"/wp-json/zaprazi/v1/affiliate-readiness")).json();
const live=parseRelease(readiness.release);
assert.ok(atLeast(live,minimum),"Live release older than 0.8.158: "+readiness.release);
assert.equal(readiness.integrity,"ok","Incomplete theme deployment");
assert.equal(readiness.configured_total,25);
assert.equal(readiness.slot_total,25);

const browser=await puppeteer.launch({
  executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
const inspect=async path=>{
  const page=await browser.newPage();
  try {
    await page.setJavaScriptEnabled(false);
    await page.setViewport({width:390,height:844,deviceScaleFactor:1});
    await page.setRequestInterception(true);
    page.on("request",r=>r.method()==="GET"&&r.url().startsWith(origin+"/")?r.continue():r.abort());
    const res=await page.goto(origin+path,{waitUntil:"domcontentloaded",timeout:30000});
    assert.equal(res?.status(),200,"Page not published: "+path);
    return await page.evaluate(()=>{
      const main=document.querySelector("main");
      return {
        h1:[...(main?.querySelectorAll("h1")||[])].map(h=>h.textContent.trim()),
        title:document.title,
        description:document.querySelector('meta[name="description"]')?.content||"",
        canonical:document.querySelector('link[rel="canonical"]')?.href||"",
        robots:document.querySelector('meta[name="robots"]')?.content||"",
        release:document.querySelector('meta[name="zaprazi-release"]')?.content||"",
        integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content||"",
        links:[...(main?.querySelectorAll("a[href]")||[])].map(a=>a.href),
        ids:[...(main?.querySelectorAll("[id]")||[])].map(a=>a.id),
        measurements:main?.querySelectorAll(".zp-check-grid > div").length||0,
        faqs:main?.querySelectorAll(".zp-faq details").length||0,
        merchantElements:main?.querySelectorAll(".zp-offer,[data-zp-merchant-link],[data-zp-affiliate-target]").length||0,
        text:main?.textContent||""
      };
    });
  } finally {await page.close();}
};

const seat="/rollator-pro-seniory/#rollator-se-sedatkem";
const upstream=["/choditka-pro-seniory/","/co-zmerit-pred-vyberem-choditka/","/pujceni-choditka/"];
const guideSpecs=[
  {
    path:"/prahy-pro-choditko-a-vozik/",anchor:"mereni-prahu",
    heading:/vysoký práh a chodítko/i,
    sources:["/","/bezpecny-byt-pro-seniora/","/choditka-pro-seniory/"],
    targets:["/choditko-do-bytu-pro-seniory/#poradce-choditko-byt","/invalidni-vozik/#poradce-vozik"],
    keywords:["prostor na obou stranách","nosnost","zámku","neukotvenou desku"]
  },
  {
    path:"/sprchova-zidle-maly-kout-80x80/",anchor:"sedm-mereni-sprchy",
    heading:/sprchová židle do koutu 80/i,
    sources:["/","/co-zmerit-v-koupelne-pred-vyberem-pomucky/","/koupelna-a-wc/"],
    targets:["/sprchovaci-zidle-pro-seniory/#poradce-sprchovaci-zidle","/koupelna-a-wc/#poradce-koupelna"],
    keywords:["čtyři nohy","vaničku","bezpečný","šířka vstupu"]
  }
];
const reports=[];
try {
  for(const from of upstream) {
    const page=await inspect(from);
    assert.equal(page.release,readiness.release,"Old themed page: "+from);
    assert.equal(page.integrity,"ok","Partial page: "+from);
    assert.ok(page.links.includes(origin+seat),"Missing live seated-rollator link from "+from);
  }
  if(!atLeast(live,articlesVersion)) {
    console.log("POSTDEPLOY_ARTICLES_0_8_159",JSON.stringify({
      status:"awaiting_deploy",live_release:readiness.release,
      target_release:"0.8.159",rollator_inbound_links_verified:upstream.length,
      note:"Green PR is not evidence that the two new articles are published."
    }));
  } else {
    for(const guide of guideSpecs) {
      const page=await inspect(guide.path);
      assert.equal(page.release,readiness.release,"Article serves a stale theme");
      assert.equal(page.integrity,"ok");
      assert.equal(page.canonical,origin+guide.path,"Invalid HTTPS self canonical");
      assert.doesNotMatch(page.robots,/noindex/i,"Article must be indexable");
      assert.equal(page.h1.length,1,"Exactly one H1");
      assert.match(page.h1[0],guide.heading);
      assert.ok(page.title.includes("Zápraží")&&page.title.length>30,"Unique branded SEO title");
      assert.ok(page.description.length>=100,"Missing informative SEO description");
      assert.equal(page.measurements,7,"Expected seven concrete check steps");
      assert.ok(page.faqs>=5,"Expected substantive five FAQs");
      assert.ok(page.ids.includes(guide.anchor),"Missing useful deep-link target");
      assert.equal(page.merchantElements,0,"Ungated commerce links forbidden");
      assert.ok(page.text.length>4500,"Article body unexpectedly thin");
      for(const target of guide.targets) {
        assert.ok(page.links.includes(origin+target),"Missing related advisor link: "+target);
      }
      for(const from of guide.sources) {
        const parent=await inspect(from);
        assert.ok(parent.links.includes(origin+guide.path+"#"+guide.anchor),
          "Missing public inbound context link from "+from);
      }
      reports.push({path:guide.path,h1:1,measurements:page.measurements,faq:page.faqs,
        inbound:guide.sources.length,canonical:page.canonical});
    }
    const sitemapIndex=extractLocs(await (await get(origin+"/sitemap_index.xml")).text());
    const pageMaps=sitemapIndex.filter(loc=>/^\/page-sitemap\d*\.xml$/.test(new URL(loc).pathname));
    assert.ok(pageMaps.length,"Page sitemap leaf missing");
    const sitemapUrls=[];
    for(const url of pageMaps){
      const safeUrl=origin+new URL(url).pathname;
      const xml=await (await get(safeUrl)).text();
      sitemapUrls.push(...extractLocs(xml));
    }
    for(const spec of guideSpecs)
      assert.ok(sitemapUrls.includes(origin+spec.path),"Published article absent from clean HTTPS Yoast page-sitemap.xml: "+spec.path);
    console.log("POSTDEPLOY_ARTICLES_0_8_159",JSON.stringify({
      status:"verified",live_release:readiness.release,integrity:readiness.integrity,
      rollator_inbound_links_verified:upstream.length,articles:reports,
      indexed_by_google:"unknown",revenue:"unknown"
    }));
  }
}finally{await browser.close();}
