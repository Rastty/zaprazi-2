#!/usr/bin/env node
/**
 * Strict postdeploy 0.8.203 consent-only acquisition event acceptance.
 * Chrome blocks ALL external requests: not one GA/merchant tracking payload is
 * transmitted. Interactions use preventDefault; no navigation or POST.
 */
import assert from "node:assert/strict";
import {SOURCE_THEME_RELEASE,EXPECTED_LIVE_RELEASE} from "./lib/live-release.mjs";

if(process.env.GITHUB_EVENT_NAME==="pull_request"){
  console.log("WALKER_NEXT_STEP_203_PREDEPLOY_SKIP");
  process.exit(0);
}
if(SOURCE_THEME_RELEASE!=="0.8.203"){
  console.log("WALKER_NEXT_STEP_203_NOT_APPLICABLE");
  process.exit(0);
}
assert.equal(EXPECTED_LIVE_RELEASE,"0.8.203");

const ORIGIN="https://zaprazi.cz";
const DESTINATIONS=[
  {path:"/choditko-na-pojistovnu/",hash:"#priprava-pro-lekare"},
  {path:"/pujceni-choditka/",hash:"#rozpocet-pujceni-choditka"},
  {path:"/",hash:"#poradce"}
];
const puppeteer=(await import("puppeteer-core")).default;
const browser=await puppeteer.launch({
  executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
try{
  async function verify(consent){
    const page=await browser.newPage();
    let externalBlocked=0,nonGet=0;
    try{
      await page.setViewport({width:390,height:844,deviceScaleFactor:1});
      await page.evaluateOnNewDocument(value=>{
        try{localStorage.setItem("zaprazi_analytics_consent_v1",value)}catch{}
      },consent);
      await page.setRequestInterception(true);
      page.on("request",request=>{
        let allowed=false;
        try{
          const u=new URL(request.url());
          allowed=u.origin===ORIGIN && request.method()==="GET" &&
            ![...u.searchParams.keys()].some(x=>/(?:answer|symptom|diagnos|health|patient)/i.test(x));
          if(u.origin!==ORIGIN)externalBlocked++;
        }catch{}
        if(request.method()!=="GET")nonGet++;
        void (allowed?request.continue():request.abort("blockedbyclient")).catch(()=>{});
      });
      const res=await page.goto(ORIGIN+"/co-zmerit-pred-vyberem-choditka/",{
        waitUntil:"networkidle2",timeout:40000
      });
      assert.equal(res?.status(),200);
      const result=await page.evaluate(()=>{
        const release=document.querySelector('meta[name="zaprazi-release"]')?.content;
        const integrity=document.querySelector('meta[name="zaprazi-integrity"]')?.content;
        const cards=[...document.querySelectorAll("#co-po-mereni article.zp-decision-card")];
        const links=cards.map(c=>c.querySelector("a[href]"));
        document.addEventListener("click",e=>e.preventDefault(),true);
        links.forEach(a=>a?.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true})));
        const entries=Array.from(window.dataLayer||[],v=>Array.from(v));
        const events=entries.filter(v=>v[0]==="event");
        const cfg=entries.find(v=>v[0]==="config");
        return {
          release,integrity,cards:cards.length,links:links.length,
          paths:links.map(link=>{
            if(!link)return null;
            try{
              const u=new URL(link.href,location.href);
              return u.protocol==="https:" && u.origin===location.origin &&
                !u.search && !u.username && !u.password
                ? {path:u.pathname,hash:u.hash} : null;
            }catch{return null}
          }),
          measured:events.map(v=>({name:v[1],argc:v.length})),
          page:cfg?.[2]?.page_location||null,
          ref:cfg?.[2]?.page_referrer||null,
          loadedGoogleTag:Boolean(document.querySelector('script[src^="https://www.googletagmanager.com/"]'))
        };
      });
      assert.equal(result.release,"0.8.203");
      assert.equal(result.integrity,"ok");
      assert.equal(result.cards,3);
      assert.equal(result.links,3);
      assert.deepEqual(result.paths,DESTINATIONS,
        "All three handoffs must remain on exact safe public paths and anchors");
      if(consent==="granted"){
        assert.deepEqual(result.measured.map(v=>v.name),
          ["next_step_click","next_step_click","guide_advisor_click"]);
        assert.ok(result.measured.every(v=>v.argc===2),
          "Generic event must have no category, URL or health-answer params");
        assert.equal(result.page,ORIGIN+"/co-zmerit-pred-vyberem-choditka/");
        assert.equal(result.loadedGoogleTag,true);
        assert.ok(externalBlocked>0,"Google tag request should be blocked by QA");
        // Since the older 0.8.202-only checker is release-guarded, preserve
        // its real destination-anchor acceptance for the 0.8.203 release.
        for(const destination of DESTINATIONS){
          const targetResponse=await page.goto(ORIGIN+destination.path,{
            waitUntil:"networkidle2",timeout:40000
          });
          assert.equal(targetResponse?.status(),200,"Destination must return HTTP 200");
          const evidence=await page.evaluate(anchorId=>({
            release:document.querySelector('meta[name="zaprazi-release"]')?.content,
            integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
            path:location.pathname,search:location.search,
            count:[...document.querySelectorAll("[id]")].filter(el=>el.id===anchorId).length
          }),destination.hash.slice(1));
          assert.equal(evidence.release,"0.8.203");
          assert.equal(evidence.integrity,"ok");
          assert.equal(evidence.path,destination.path,"No unrelated redirect");
          assert.equal(evidence.search,"","No query/answer transport");
          assert.equal(evidence.count,1,"Target fragment must exist exactly once");
        }
      }else{
        assert.deepEqual(result.measured,[]);
        assert.equal(result.loadedGoogleTag,false);
        assert.equal(externalBlocked,0);
      }
      assert.equal(nonGet,0);
      return {consent,events:result.measured.length,externalBlocked,nonGet};
    }finally{await page.close()}
  }
  const granted=await verify("granted");
  const denied=await verify("denied");
  console.log("WALKER_NEXT_STEP_203_CHROME_PASS "+
    JSON.stringify({release:"0.8.203",consentedEvents:granted.events,
      deniedEvents:denied.events,externalRequestsSent:0,
      nonGetRequests:0}));
}finally{await browser.close()}
