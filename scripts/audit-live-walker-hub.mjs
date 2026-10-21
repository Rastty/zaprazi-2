/**
 * Read-only PROD 0.8.142 walker hub integration: live problem-to-advisor paths,
 * safe next steps, real anchor targets, no merchant requests or user answers.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

const origin="https://zaprazi.cz",version="0.8.142";
const paths={
  hub:"/choditka-pro-seniory/",
  indoor:"/choditko-do-bytu-pro-seniory/",
  outdoor:"/rollator-pro-seniory/",
  measuring:"/co-zmerit-pred-vyberem-choditka/"
};
const endpoints={
  indoor:origin+paths.indoor+"#poradce-choditko-byt",
  outdoor:origin+paths.outdoor+"#poradce-rollator",
  measuring:origin+paths.measuring+"#co-zmerit",
  comparison:origin+paths.hub+"#vyber-typu",
  saferoute:origin+"/#poradce"
};
const req=await fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",{
  signal:AbortSignal.timeout(30000),headers:{Accept:"application/json"}
});
assert.equal(req.status,200,"No public affiliate/readiness endpoint");
const readiness=await req.json();
assert.equal(readiness.release,version,"0.8.142 is not deployed");
assert.equal(readiness.integrity,"ok","Incomplete release deployment");
assert.equal(readiness.configured_total,25,"Affiliate slots missing");
assert.equal(readiness.slot_total,25,"Affiliate slot contract changed");
const browser=await puppeteer.launch({executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
const results=[];
async function inspect(path){
  const p=await browser.newPage();
  try{
    await p.setJavaScriptEnabled(false);
    await p.setRequestInterception(true);
    p.on("request",request=>
      request.isNavigationRequest()&&request.url()===origin+path
       ?request.continue():request.abort());
    const response=await p.goto(origin+path,{waitUntil:"domcontentloaded",timeout:30000});
    assert.equal(response?.status(),200,"Cannot open published "+path);
    const data=await p.evaluate(()=>({
      release:document.querySelector('meta[name="zaprazi-release"]')?.content,
      integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
      canonical:document.querySelector('link[rel="canonical"]')?.href,
      h1:document.querySelectorAll('main h1').length,
      ids:[...document.querySelectorAll("[id]")].map(n=>n.id),
      anchors:[...document.querySelectorAll("main a[href]")].map(a=>({text:a.textContent?.trim()||"",href:a.href})),
      cards:[...document.querySelectorAll("main .zp-decision-card")].map(n=>({
        heading:n.querySelector("h3")?.textContent?.trim()||"",
        text:n.textContent?.trim()||"",
        links:[...n.querySelectorAll('a[href]')].map(a=>a.href)
      })),
      text:document.querySelector("main")?.textContent||""
    }));
    assert.equal(data.release,version,"Page has a stale release "+path);
    assert.equal(data.integrity,"ok","Broken release integrity on "+path);
    assert.equal(data.canonical,origin+path,"Invalid canonical "+path);
    assert.equal(data.h1,1,"Page has multiple H1 or no H1: "+path);
    results.push({path,links:data.anchors.length,decisionCards:data.cards.length});
    return data;
  }finally{await p.close();}
}
try{
  const hub=await inspect(paths.hub);
  assert.ok(hub.ids.includes("vyber-typu"),"Comparison anchor disappeared");
  const findCard=heading=>hub.cards.find(card=>card.heading===heading);
  const checkLink=(heading,expected)=>{
    const card=findCard(heading);
    assert.ok(card,"Missing decision card "+heading);
    assert.ok(card.links.includes(expected),"Wrong decision link for "+heading);
    assert.equal(card.links.length,1,"Unexpected merchant link in "+heading);
  };
  checkLink("Hlavně doma",endpoints.indoor);
  checkLink("Venku nebo doma i venku",endpoints.outdoor);
  checkLink("Při chůzi běžně pomáhá druhá osoba",endpoints.saferoute);
  checkLink("Chodítko doma nejde při kroku nadzvednout",endpoints.indoor);
  checkLink("Venku by se hodila kolečka, ale brzdy nejsou jisté",endpoints.outdoor);
  checkLink("Nejužší dveře, práh nebo otočení na chodbě jsou problém",endpoints.measuring);
  assert.match(hub.text,/opakovaných pádech|opakovaným pádům/);
  assert.match(hub.text,/nevybírejte konkrétní výrobek jen podle online článku/);
  const indoor=await inspect(paths.indoor),outdoor=await inspect(paths.outdoor);
  assert.ok(indoor.ids.includes("poradce-choditko-byt"),"Indoor advisor anchor absent");
  assert.ok(outdoor.ids.includes("poradce-rollator"),"Rollator advisor anchor absent");
  for(const [name,page] of [["indoor",indoor],["outdoor",outdoor]]){
    assert.ok(page.anchors.some(a=>a.href===endpoints.comparison&&
      a.text.includes("Zpět na srovnání typů chodítek")),
      "Missing reciprocal comparison link: "+name);
  }
  const measure=await inspect(paths.measuring);
  assert.ok(measure.ids.includes("co-zmerit"),"Measurement anchor absent");
  console.log("LIVE_WALKER_HUB_0_8_138",JSON.stringify({
    release:version,integrity:readiness.integrity,affiliate_slots:readiness.configured_total,
    pages:results,safe_advisor_paths:[endpoints.indoor,endpoints.outdoor],
    measurements:endpoints.measuring,return_links:2,invalid_merchant_redirects:0
  }));
}finally{await browser.close();}
