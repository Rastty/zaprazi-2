import test from "node:test";
import assert from "node:assert/strict";
import {ehubAdlTargets,classifyEhubAdlHtml,
  classifyEhubAdlResponse,auditEhubAdlListings}
  from "../scripts/audit-ehub-adl-listings.mjs";

const records=ehubAdlTargets();
const productPage=(rec,main)=>
  ('<!doctype html><html><nav>Skladem Přídat do košíku (sidebar product)</nav>'+
   '<h1>'+rec.title+'</h1>'+
   '<section class="product-detail">Náš produkt '+main+'</section>'+
   '<h2>Související produkty</h2>'+
   '<aside>Alternativní výrobek Skladem Přidat do košíku</aside></html>').padEnd(500," ");

test("exact four existing eHUB product pages, no tracker URL or test checkout",()=>{
  assert.deepEqual(records.map(x=>x.sku),
    ["15-050101","15-050102","15-050103","15-050105"]);
  assert.equal(records.length,4);
  assert.equal(new Set(records.map(x=>x.url)).size,4);
  assert.equal(new Set(records.map(x=>x.id)).size,4);
  assert.ok(records.every(x=>x.url.startsWith("https://www.rehavita.cz/")&&
    !x.url.includes("?")&&!x.url.includes("#")&&x.checkedAt==="2026-10-07"));
});

test("known product title + own seller stock label is observation only",()=>{
  for(const r of records){
    const available=classifyEhubAdlHtml(productPage(r,
      "Skladem Nabízíme vám produkt. Přidat do košíku"),r);
    assert.equal(available.state,"seller_displays_available");
    assert.equal(available.exactManufacturerSkuVerified,false);
    assert.equal(available.productionOfferChanged,false);
    const unavailable=classifyEhubAdlHtml(productPage(r,
      "Není skladem. Přidat do košíku"),r);
    assert.equal(unavailable.state,"seller_displays_unavailable");
    const conflicting=classifyEhubAdlHtml(productPage(r,
      "Není skladem. Skladem Přidat do košíku"),r);
    assert.equal(conflicting.state,"unverifiable");
    assert.equal(conflicting.reason,"contradictory_merchant_stock_labels");
    const sidebar=classifyEhubAdlHtml(productPage(r,
      "Zde není uvedena dostupnost"),r);
    assert.equal(sidebar.state,"stock_label_unverifiable",
      "Stock from unrelated nav/aside must not confirm this item");
    const badH1=classifyEhubAdlHtml(productPage(r,"Skladem Přidat do košíku")
      .replace("<h1>"+r.title+"</h1>","<h1>Jiný produkt</h1>"),r);
    assert.equal(badH1.state,"unverifiable");
    const duplicate=classifyEhubAdlHtml(productPage(r,"Skladem Přidat do košíku")
      .replace("<h1>"+r.title+"</h1>",("<h1>"+r.title+"</h1>").repeat(2)),r);
    assert.equal(duplicate.state,"unverifiable");
    const missingBoundary=classifyEhubAdlHtml(productPage(r,
      "Skladem Přidat do košíku").replace("<h2>Související produkty</h2>",
      "<h2>Doporučení</h2>"),r);
    assert.equal(missingBoundary.state,"unverifiable");
  }
});

test("cautious response guard rejects redirects and merchant access blocks",()=>{
  const r=records[0],html=productPage(r,"Skladem Přidat do košíku");
  assert.equal(classifyEhubAdlResponse({status:200,url:r.url,html},r).state,
    "seller_displays_available");
  for(const bad of [
    {status:302,url:r.url,html},
    {status:200,url:r.url+"?affiliate=unsafe",html},
    {status:403,url:r.url,html},
    {status:429,url:r.url,html}
  ]){
    assert.equal(classifyEhubAdlResponse(bad,r).state,"unverifiable");
  }
});

test("audit performs 4 canonical GETs, logs only safe counters, never refreshes dates",async()=>{
  const seen=[];
  const fake=async(url,opts)=>{
    seen.push({url,opts});
    const r=records.find(x=>x.url===url);
    const body=r.sku==="15-050101"?"Skladem Přidat do košíku":
      r.sku==="15-050102"?"Není skladem": "Nabídka bez ověření";
    return {status:200,url,headers:{get:k=>k==="content-type"?
      "text/html; charset=utf-8":null},
      text:async()=>productPage(r,body)};
  };
  const result=await auditEhubAdlListings(fake);
  assert.equal(result.checked_count,4);
  assert.equal(result.seller_displays_available,1);
  assert.equal(result.seller_displays_unavailable,1);
  assert.equal(result.needs_review,2);
  assert.equal(result.supplier_ref_verified,0);
  assert.equal(result.offer_dates_refreshed,0);
  assert.equal(result.affiliate_tracking_requests,0);
  assert.equal(result.wordpress_writes,0);
  assert.equal(result.production_offer_changes,0);
  assert.ok(seen.every(c=>c.opts.method==="GET"&&c.opts.redirect==="error"&&
    c.opts.cache==="no-store"&&!c.url.includes("?")));
  assert.deepEqual(seen.map(x=>x.url),records.map(x=>x.url));
  const serialized=JSON.stringify(result);
  for(const r of records){
    assert.ok(!serialized.includes(r.url));
    assert.ok(!serialized.includes(r.sku));
    assert.ok(!serialized.includes(r.title));
  }
  assert.doesNotMatch(serialized,/affiliateUrl|Bearer|password|token=|private=/i);
  const blocked=await auditEhubAdlListings(async url=>({
    status:403,url,headers:{get:()=>null},text:async()=>{throw Error("no");}
  }));
  assert.equal(blocked.needs_review,4);
  assert.equal(blocked.seller_displays_available,0);
});

test("no possible seller response authorizes product suitability or payment",async()=>{
  const report=await auditEhubAdlListings(async url=>{
    const r=records.find(x=>x.url===url);
    return {status:200,url,headers:{get:k=>k==="content-type"?"text/html":null},
      text:async()=>productPage(r,"Skladem Přidat do košíku")};
  });
  assert.equal(report.seller_displays_available,4);
  assert.equal(report.offer_dates_refreshed,0);
  assert.equal(report.production_offer_changes,0);
  assert.equal(report.results.every(r=>r.productionOfferChanged===false),true);
  assert.equal(report.results.every(r=>r.exactManufacturerSkuVerified===false),true);
});
