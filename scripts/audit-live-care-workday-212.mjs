#!/usr/bin/env node
/**
 * 0.8.212+ postdeploy acceptance of the existing care-service SEO guide.
 * Read-only Chrome, same-origin GETs, no merchant clicks, forms or user answers.
 * PRs check only the previously deployed site and MUST NOT accept future HTML.
 */
import assert from "node:assert/strict";
import {SOURCE_THEME_RELEASE,EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

if(process.env.GITHUB_EVENT_NAME==="pull_request"){
  console.log("CARE_WORKDAY_212_PREDEPLOY_SKIP");
  process.exit(0);
}

const atLeast=(actual,minimum)=>{
  const a=actual.split(".").map(Number),b=minimum.split(".").map(Number);
  for(let i=0;i<3;i++){if(a[i]!==b[i])return a[i]>b[i];}
  return true;
};
if(!atLeast(SOURCE_THEME_RELEASE,"0.8.212")){
  console.log("CARE_WORKDAY_212_NOT_YET_DEPLOYED");
  process.exit(0);
}
assert.equal(EXPECTED_LIVE_RELEASE,SOURCE_THEME_RELEASE,
  "Postdeploy check must not accept an old live release");

const ORIGIN="https://zaprazi.cz";
const carePath="/jak-vybrat-pecovatelskou-sluzbu/";
const returnPath="/navrat-z-nemocnice/";
const anchor="pece-o-rodice-pri-praci";
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
        const target=new URL(request.url());
        allow=request.method()==="GET" && target.origin===ORIGIN &&
          !target.username && !target.password &&
          ![...target.searchParams.keys()].some(key=>
            /answer|symptom|diagnos|health|patient|condition|weight/i.test(key));
      }catch{}
      // No third-party requests, tracking calls, POSTs or data transfer.
      void(allow?request.continue():request.abort("blockedbyclient")).catch(()=>{});
    });

    async function visit(path){
      const response=await page.goto(ORIGIN+path,{
        waitUntil:"domcontentloaded",timeout:35000
      });
      assert.equal(response?.status(),200,"Care route must return HTTP 200: "+path);
      const result=await page.evaluate(()=>({
        path:location.pathname,
        query:location.search,
        release:document.querySelector('meta[name="zaprazi-release"]')?.content||"",
        integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content||"",
        canonical:document.querySelector('link[rel="canonical"]')?.href||"",
        h1:[...document.querySelectorAll("main h1")].length,
        overflow:Math.round(document.documentElement.scrollWidth-innerWidth)
      }));
      assert.equal(result.path,path,"Unexpected redirect");
      assert.equal(result.query,"","Care journey must not carry query or answers");
      assert.equal(result.release,SOURCE_THEME_RELEASE,"Not exact deployed theme");
      assert.equal(result.integrity,"ok","Partial theme deployment");
      assert.equal(result.h1,1,"Duplicate or missing H1");
      assert.ok(result.overflow<=2,"Mobile horizontal overflow: "+path);
      assert.equal(result.canonical,ORIGIN+path,"Wrong canonical URL");
      return result;
    }

    await visit(carePath);
    const care=await page.evaluate(id=>{
      const section=document.getElementById(id);
      const hero=document.querySelector("main .zp-hero");
      const links=[...section?.querySelectorAll("a[href]")||[]].map(a=>a.href);
      const cards=[...section?.querySelectorAll("article.zp-decision-card")||[]];
      const text=section?.textContent||"";
      return{
        count:document.querySelectorAll("#"+id).length,
        h2:section?.querySelector("h2")?.textContent||"",
        heroLink:Boolean(hero?.querySelector('a[href="#'+id+'"]')),
        schedule:[...section?.querySelectorAll("ol.zp-guide-steps > li")||[]].length,
        cards:cards.length,
        official:links.filter(href=>href==="https://mpsv.gov.cz/pece-a-sluzby" ||
          href==="https://mpsv.gov.cz/pece-a-prace"),
        registry:Boolean(section?.querySelector('a[href="#vyhledat-pecovatelskou-sluzbu-v-registru"]')),
        registryTarget:document.querySelectorAll("#vyhledat-pecovatelskou-sluzbu-v-registru").length,
        hospitalLink:links.includes(location.origin+"/navrat-z-nemocnice/#domaci-zdravotni-pece-nebo-pecovatelska-sluzba"),
        privacy:!section?.querySelector("form,input,textarea"),
        commerce:!section?.querySelector('[data-zp-merchant-link],[data-zp-offer],a[rel~="sponsored"]'),
        noCollection:/nic se neodesílá/i.test(text),
        noBlanketCapacity:/kapacit/i.test(text) && /potvrzený termín/i.test(text),
        safety:/SOS tlačítko ani krátká návštěva/i.test(text) &&
          /155/.test(text)
      };
    },anchor);
    assert.equal(care.count,1,"Missing/duplicated workday guide");
    assert.match(care.h2,/Jak zajistit péči o rodiče doma/);
    assert.equal(care.heroLink,true,"First-screen entry missing");
    assert.equal(care.schedule,4,"Daily coverage windows lost");
    assert.equal(care.cards,5,"Care and employment paths lost");
    assert.deepEqual([...new Set(care.official)].sort(),
      ["https://mpsv.gov.cz/pece-a-prace","https://mpsv.gov.cz/pece-a-sluzby"],
      "Missing official evidence links");
    for(const key of ["registry","hospitalLink","privacy","commerce","noCollection",
      "noBlanketCapacity","safety"])
      assert.equal(care[key],true,"Unsafe workday care regression: "+key);
    assert.equal(care.registryTarget,1,"Registry on-page target missing");
    evidence.push({path:carePath,coverageWindows:care.schedule,options:care.cards});

    await visit(returnPath);
    const source=await page.evaluate(id=>{
      const incoming=[...document.querySelectorAll('main a[href]')].filter(a=>{
        const u=new URL(a.href,location.href);
        return u.origin===location.origin &&
          u.pathname==="/jak-vybrat-pecovatelskou-sluzbu/" &&
          u.hash==="#"+id;
      });
      return{incoming:incoming.length,
        section:document.querySelectorAll("#domaci-zdravotni-pece-nebo-pecovatelska-sluzba").length};
    },anchor);
    assert.ok(source.incoming>=1,"Missing hospital-to-care contextual link");
    assert.equal(source.section,1,"Hospital source section missing");
    evidence.push({path:returnPath,contextualLinks:source.incoming});
  }finally{await page.close();}
}finally{await browser.close();}
// WordPress theme changes do not update WP post_modified. Confirm the two
// materially changed canonical pages advertise their real update date in the
// PUBLIC Yoast XML. This does not claim Google indexed or reranked either page.
async function verifyPublicSitemapDates(){
  const indexResponse=await fetch(ORIGIN+"/sitemap_index.xml",{redirect:"error"});
  assert.equal(indexResponse.status,200,"Public sitemap index not available");
  const index=await indexResponse.text();
  const children=[...index.matchAll(/<loc>\s*https:\/\/zaprazi\.cz\/(page-sitemap\d*\.xml)\s*<\/loc>/gi)]
    .map(match=>match[1]);
  assert.ok(children.length>0&&children.length<=10,"Missing/unsafe page sitemap list");
  const target=new Map([
    [carePath,0],[returnPath,0]
  ]);
  for(const child of children){
    const response=await fetch(ORIGIN+"/"+child,{redirect:"error"});
    assert.equal(response.status,200,"Page sitemap not available");
    const xml=await response.text();
    assert.match(xml,/<urlset\b/i,"Not a Yoast page URL set");
    for(const entry of xml.matchAll(/<url\b[^>]*>([\s\S]*?)<\/url>/gi)){
      const body=entry[1];
      const loc=body.match(/<loc>\s*(https:\/\/zaprazi\.cz\/[^<]+)\s*<\/loc>/i)?.[1];
      if(!loc)continue;
      const parsed=new URL(loc);
      if(parsed.search||parsed.hash||parsed.origin!==ORIGIN||!target.has(parsed.pathname))continue;
      const mod=body.match(/<lastmod>\s*([^<]+)\s*<\/lastmod>/i)?.[1];
      assert.ok(mod&&Number.isFinite(Date.parse(mod)),"Missing/invalid lastmod");
      assert.ok(Date.parse(mod)>=Date.parse("2026-11-10T00:00:00+00:00"),
        "Material care edit has stale public sitemap lastmod");
      target.set(parsed.pathname,target.get(parsed.pathname)+1);
    }
  }
  for(const [path,count] of target)
    assert.equal(count,1,"Missing/duplicated canonical care sitemap URL: "+path);
  return {canonicalCarePages:target.size,minimumMaterialDate:"2026-11-10"};
}
const sitemap=await verifyPublicSitemapDates();
console.log("CARE_WORKDAY_212_CHROME_PASS "+
  JSON.stringify({release:SOURCE_THEME_RELEASE,evidence,sitemap,externalRequestsSent:0,
    nonGetRequestsSent:0,formsSubmitted:0,affiliateClicks:0}));
