/**
 * Read-only postdeploy release 0.8.157 smoke: seat-specific intent -> gated Rollator Advisor.
 * Explicit release readback protects against GitHub merge != deployed WordPress.
 * Does not click merchants, POST, submit forms or send private answers.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

const origin = "https://zaprazi.cz", expected = "0.8.157";
const readinessResponse = await fetch(origin + "/wp-json/zaprazi/v1/affiliate-readiness", {
  signal: AbortSignal.timeout(20000), headers: {Accept:"application/json"}
});
assert.equal(readinessResponse.status, 200, "Cannot verify production readiness");
const readiness = await readinessResponse.json();
assert.equal(readiness.release, expected, "Deployment not active: expected 0.8.157, got " + readiness.release);
assert.equal(readiness.integrity, "ok", "Partial theme deploy");
assert.equal(readiness.configured_total, 25, "Affiliate slots not configured");
assert.equal(readiness.slot_total, 25, "Affiliate inventory differs");

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_BIN || "/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
const results=[];
const launch=async path=>{
  const page=await browser.newPage();
  await page.setJavaScriptEnabled(false);
  await page.setViewport({width:390,height:844,deviceScaleFactor:1});
  await page.setRequestInterception(true);
  page.on("request",request=>{
    if(request.method()!=="GET"||!request.url().startsWith(origin+"/"))request.abort();
    else request.continue();
  });
  const response=await page.goto(origin+path,{waitUntil:"domcontentloaded",timeout:30000});
  assert.equal(response?.status(),200,"Public page not HTTP 200: "+path);
  return page;
};
try {
  const rollator=await launch("/rollator-pro-seniory/");
  const data=await rollator.evaluate(()=>{
    const main=document.querySelector("main");
    const section=document.getElementById("rollator-se-sedatkem");
    return {
      release:document.querySelector('meta[name="zaprazi-release"]')?.content,
      integrity:document.querySelector('meta[name="zaprazi-integrity"]')?.content,
      title:document.title,
      meta:document.querySelector('meta[name="description"]')?.content||"",
      canonical:document.querySelector('link[rel="canonical"]')?.href,
      robots:document.querySelector('meta[name="robots"]')?.content||"",
      h1:[...(main?.querySelectorAll("h1")||[])].map(h=>h.textContent.trim()),
      seatSections:main?.querySelectorAll("#rollator-se-sedatkem").length||0,
      seatH2:section?.querySelector("h2")?.textContent.trim()||"",
      seatCards:section?.querySelectorAll(".zp-decision-card").length||0,
      seatText:section?.textContent||"",
      seatLinks:[...(section?.querySelectorAll("a[href]")||[])].map(a=>a.href),
      merchantLinks:section?.querySelectorAll("a[rel~=sponsored],.zp-offer,[data-zp-merchant-link],[data-zp-affiliate-target]").length||0,
      advisorForm:!!document.getElementById("zp-rollator-advisor"),
      brakes:!!document.querySelector('#zp-rollator-advisor input[name="handBrakes"]'),
      ids:[...main.querySelectorAll("[id]")].map(el=>el.id)
    };
  });
  assert.equal(data.release,expected,"Page serves old release");
  assert.equal(data.integrity,"ok","Page assets partially deployed");
  assert.equal(data.canonical,origin+"/rollator-pro-seniory/","Canonical unexpectedly changed");
  assert.doesNotMatch(data.robots,/noindex/i);
  assert.equal(data.h1.length,1,"One H1 required");
  assert.equal(data.seatSections,1,"New section missing from real DOM");
  assert.equal(data.seatCards,3,"Expected three use-case decision cards");
  assert.match(data.seatH2,/Rollátor se sedátkem pro seniory/i);
  assert.match(data.title,/Rollátor se sedátkem pro seniory/i);
  assert.match(data.meta,/sedátkem pro seniory/i);
  for(const phrase of ["42 cm","61 cm","parkovací brzdy","transportní invalidní vozík"])
    assert.ok(data.seatText.includes(phrase),"Missing key product/fit evidence: "+phrase);
  assert.equal(data.merchantLinks,0,"Seat content shortcuts unsafe merchant offer");
  assert.equal(data.advisorForm,true,"Safe Advisor missing");
  assert.equal(data.brakes,true,"Handbrake suitability gate missing");
  for(const id of ["poradce-rollator","rollator-se-sedatkem"])
    assert.ok(data.ids.includes(id),"Core anchor missing: "+id);
  const related=[
    {path:"/co-zmerit-pred-vyberem-choditka/",anchor:"co-zmerit"},
    {path:"/pujceni-choditka/",anchor:"rozpocet-pujceni-choditka"},
    {path:"/invalidni-vozik/",anchor:"poradce-vozik"}
  ];
  for(const {path,anchor} of related) {
    assert.ok(data.seatLinks.includes(origin+path+"#"+anchor),"Missing actionable link "+path+"#"+anchor);
    const target=await launch(path);
    assert.ok(await target.evaluate(a=>!!document.getElementById(a),anchor),"Destination anchor missing "+path+"#"+anchor);
    await target.close();
  }
  assert.ok(data.seatLinks.includes(origin+"/rollator-pro-seniory/#poradce-rollator"),"Unsafe advisor bypass");
  await rollator.close();
  results.push({page:"/rollator-pro-seniory/",seo:"ok",h1:1,cards:3,gatedAdvisor:true,deepLinks:related.length});
  const searches=[
    ["rollator se sedatkem","/rollator-pro-seniory/#rollator-se-sedatkem"],
    ["choditko se sedatkem","/rollator-pro-seniory/#rollator-se-sedatkem"],
    ["sedatko do vany","/sedatko-do-vany-pro-seniory/#poradce-sedatko-vana"]
  ];
  for(const [term,first] of searches) {
    const url=new URL(origin+"/");url.searchParams.set("s",term);
    const path=url.pathname+url.search;
    const page=await launch(path);
    const result=await page.evaluate(()=>{
      const guided=document.querySelector(".zp-search-guidance");
      return {
        release:document.querySelector('meta[name="zaprazi-release"]')?.content,
        h1:document.querySelectorAll("main h1").length,
        links:[...(guided?.querySelectorAll("a[href]")||[])].map(a=>a.href),
        legacyPreserved:!guided || !document.querySelector(".zp-archive-list") ||
          Boolean(guided.compareDocumentPosition(document.querySelector(".zp-archive-list"))&Node.DOCUMENT_POSITION_FOLLOWING)
      };
    });
    assert.equal(result.release,expected,"Search has stale release");
    assert.equal(result.h1,1,"Search H1 count");
    assert.ok(result.legacyPreserved,"Historic archive results displaced");
    assert.equal(result.links[0],origin+first,"Search intent directs to wrong first decision route: "+term);
    assert.ok(result.links.every(h=>h.startsWith(origin+"/")&&!/[?]|ehub|awin|desturl|click[.]php/i.test(h)),"Unsafe search result");
    results.push({query:term,first,links:result.links.length});
    await page.close();
  }
  console.log("LIVE_ROLLATOR_SEAT_0_8_157",JSON.stringify({
    release:readiness.release,integrity:readiness.integrity,affiliate_slots:readiness.configured_total,
    checks:results,merchants_clicked:0,post_requests:0,
    indexation_and_revenue:"not measured"
  }));
}finally{await browser.close();}
