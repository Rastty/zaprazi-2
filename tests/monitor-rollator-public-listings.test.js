import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  monitoredRollatorListings,classifyRollatorListingHtml,classifyRollatorResponse,
  assessRollatorLifecycle,auditRollatorPublicListings
} from "../scripts/monitor-rollator-public-listings.mjs";

const data=JSON.parse(readFileSync(
  new URL("../data/mobility-rollator-supply-review-20261121.json",import.meta.url),"utf8"));
const records=monitoredRollatorListings(data);
const find=id=>records.find(r=>r.id===id);
function html(r,own){
  // Suggestion stock before H1 and unrelated SKU stock after product description
  // must NEVER make a missing or discontinued target look purchasable.
  return (
    '<html><body><nav>Related P2879 Skladem >10ks Do košíku</nav>'+
    '<h1>'+r.title+'</h1><div>Kód: '+r.sku+'</div>'+
    '<div class="product-main">'+own+'</div>'+
    '<div>Popis produktu</div>'+
    '<aside><h2>Nejprodávanější produkty</h2>Kód: P5559 Skladem >10ks Do košíku</aside>'+
    '</body></html>'
  ).padEnd(550," ");
}
const stock="Skladem >10ks 2 470 Kč Můžete mít 24.11 Do košíku";
const retired="Vážený zákazníku, je nám líto, ale toto zboží už bylo vyřazeno z naší nabídky.";
const goodBody=r=>r.id==="unizdrav-p3774"?retired:stock;

test("all three exact same-origin publisher-free SKU targets and expected lifecycles",()=>{
  assert.deepEqual(records.map(x=>x.id),
    ["unizdrav-p2879","unizdrav-p3774","unizdrav-p5559"]);
  assert.deepEqual(records.map(x=>x.sku),["P2879","P3774","P5559"]);
  assert.ok(records.every(x=>x.url.startsWith("https://unizdrav.cz/zbozi/")&&
    !x.url.includes("?")&&!x.url.includes("#")));
  assert.equal(find("unizdrav-p3774").expectedLifecycle,"retired");
  for(const id of ["unizdrav-p2879","unizdrav-p5559"])
    assert.equal(find(id).expectedLifecycle,"seller_listing_observed");
});

test("retired exact product always wins over stock in website sidebar",()=>{
  const r=find("unizdrav-p3774");
  const retiredPage=html(r,retired);
  const observed=classifyRollatorListingHtml(retiredPage,r);
  assert.equal(observed.observation,"retired");
  assert.equal(assessRollatorLifecycle(observed,r).status,"matched_seller_lifecycle");
  // Wrong product title, wrong exact code or seller reviving old code
  // all require manual review, not auto replacement with P5559.
  for(const bad of [
    retiredPage.replace(r.title,"Pojízdné chodítko s nafukovacími koly MEGO 2"),
    retiredPage.replace("Kód: P3774","Kód: P5559"),
    retiredPage.replace(retired,""),
    retiredPage.replace(retired,stock)
  ]){
    const result=assessRollatorLifecycle(classifyRollatorListingHtml(bad,r),r);
    assert.equal(result.status,"needs_review");
    assert.equal(result.production_eligible,false);
  }
});

test("seller-listed SKU never implies measured stock, affiliate eligibility or manual",()=>{
  for(const id of ["unizdrav-p2879","unizdrav-p5559"]){
    const r=find(id),page=html(r,stock);
    const outcome=classifyRollatorListingHtml(page,r);
    assert.equal(outcome.observation,"seller_displays_available");
    const assessed=assessRollatorLifecycle(outcome,r);
    assert.equal(assessed.status,"matched_seller_lifecycle");
    assert.equal(assessed.production_eligible,false);
    assert.match(assessed.reason,/seller_product_page_stock_label_only/);
    assert.equal(classifyRollatorListingHtml(html(r,"Popis stránky bez vlastní dostupnosti"),r).observation,"unverifiable");
    assert.equal(classifyRollatorListingHtml(page.replace(r.title,"Other walker"),r).observation,"unverifiable");
    assert.equal(classifyRollatorListingHtml(page.replace("Kód: "+r.sku,"Kód: P3774"),r).observation,"unverifiable");
  }
});

test("publisher-free public GET-only monitor never follows redirects or treats blocked host as stock",async()=>{
  const seen=[];
  const fake=async(url,opts)=>{
    seen.push({url,opts});
    const r=records.find(x=>x.url===url);
    return {
      url,status:200,
      headers:{get:key=>key==="content-type"?"text/html":null},
      text:async()=>html(r,goodBody(r))
    };
  };
  const report=await auditRollatorPublicListings(fake,data);
  assert.equal(report.checked_count,3);
  assert.equal(report.matched,3);
  assert.equal(report.needs_review,0);
  assert.equal(report.active_product_offers_changed,0);
  assert.ok(report.results.every(x=>x.production_eligible===false));
  assert.deepEqual(seen.map(x=>x.url),records.map(x=>x.url));
  assert.ok(seen.every(x=>x.opts.method==="GET"&&x.opts.redirect==="error"&&
    x.opts.cache==="no-store"&&!x.url.includes("?")));
  const blocked=await auditRollatorPublicListings(async(url)=>({
    url,status:403,headers:{get:()=>null},text:async()=>{throw new Error("not allowed");}
  }),data);
  assert.equal(blocked.matched,0);
  assert.equal(blocked.needs_review,3);
  assert.ok(blocked.results.every(x=>x.observation==="unverifiable"));
  assert.equal(classifyRollatorResponse({status:200,url:"https://evil.example/redirect",
    html:html(find("unizdrav-p2879"),stock)},find("unizdrav-p2879")).observation,"unverifiable");
  assert.equal(classifyRollatorResponse({status:302,url:find("unizdrav-p2879").url,
    html:html(find("unizdrav-p2879"),stock)},find("unizdrav-p2879")).observation,"unverifiable");
});

test("unknown state never silently becomes a safe buy/rent/affiliate CTA",()=>{
  for(const r of records){
    for(const bad of [
      "", "<html><h1>"+r.title+"</h1>skladem</html>",
      html(r,"Skladem >10ks"),
      html(r,"Do košíku"),
      html(r,"Skladem >10ks Do košíku").replace("<h1>","<h2>").replace("</h1>","</h2>")
    ]){
      const observed=classifyRollatorListingHtml(bad,r);
      assert.notEqual(observed.observation,"seller_displays_available");
      const result=assessRollatorLifecycle(observed,r);
      assert.equal(result.production_eligible,false);
    }
  }
});
