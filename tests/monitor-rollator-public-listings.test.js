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
  assert.equal(report.seller_unavailable,0);
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

test("a missing product-to-related-content boundary fails closed despite stock in recommendations",()=>{
  const r=find("unizdrav-p2879");
  const malformed=html(r,"No current SKU stock")
    .replace("Popis produktu","<div>Details moved to another template</div>");
  const observed=classifyRollatorListingHtml(malformed,r);
  assert.equal(observed.observation,"unverifiable");
  assert.equal(observed.reason,"product_scope_boundary_missing");
  assert.equal(assessRollatorLifecycle(observed,r).status,"needs_review");
});

test("seller promotional badges are allowed only around the exact current SKU heading",()=>{
  const stock="Skladem >10ks Do košíku";
  for(const id of ["unizdrav-p2879","unizdrav-p5559"]){
    const record=find(id),page=html(record,stock);
    for(const badge of ["top zboží","novinka","akce","tip na dárek"]){
      const before=page.replace("<h1>"+record.title+"</h1>",
        "<h1><span>"+badge+"</span> "+record.title+"</h1>");
      const after=page.replace("<h1>"+record.title+"</h1>",
        "<h1>"+record.title+" <small>"+badge+"</small></h1>");
      assert.equal(classifyRollatorListingHtml(before,record).observation,"seller_displays_available");
      assert.equal(classifyRollatorListingHtml(after,record).observation,"seller_displays_available");
    }
    for(const invalid of [
      page.replace(record.title,record.title+" III"),
      page.replace(record.title,"A completely different brand rollator"),
      page.replace(record.title,"MEGO 2 P3774"),
      page.replace("<h1>",'<h1><span>affiliate</span>'),
      page.replace("<h1>",'<h1><span>new product variant</span>')
    ])assert.equal(classifyRollatorListingHtml(invalid,record).observation,"unverifiable");
  }
});

test("responsive duplicate H1 names pass only for exact same SKU title, never another model",()=>{
  for(const record of records){
    const own=record.id==="unizdrav-p3774"?retired:stock;
    const base=html(record,own);
    const original="<h1>"+record.title+"</h1>";
    for(const copies of [2,3]){
      const repeat=base.replace(original,original.repeat(copies));
      assert.equal(classifyRollatorListingHtml(repeat,record).observation,
        record.id==="unizdrav-p3774"?"retired":"seller_displays_available");
    }
    for(const invalid of [
      base.replace(original,original.repeat(4)),
      base.replace(original,original+"<h1>Different, unrelated SKU</h1>"),
      base.replace(original,original+"<h1>"+record.title+" new version</h1>"),
      base.replace(original,original.replace(record.title,record.title+" P5559"))
    ]) assert.equal(classifyRollatorListingHtml(invalid,record).observation,"unverifiable");
  }
});

test("exact seller not-in-stock and in-transit labels are visible review blockers, never offers",()=>{
  for(const id of ["unizdrav-p2879","unizdrav-p5559"]){
    const r=find(id);
    for(const label of [
      "Zboží je na cestě",
      "Zboží na cestě",
      "Momentálně není skladem",
      "Není skladem",
      "Dočasně nedostupné",
      "Vyprodáno"
    ]){
      const response=classifyRollatorListingHtml(html(r,
        label+" 2 470 Kč Pro bližší informace kontaktujte prodejce."),r);
      assert.equal(response.observation,"seller_displays_unavailable",label);
      assert.equal(response.reason,"seller_product_page_unavailable_label_only");
      const assessed=assessRollatorLifecycle(response,r);
      assert.equal(assessed.status,"needs_review");
      assert.equal(assessed.production_eligible,false);
      assert.equal(assessed.expected_observation,"seller_displays_available");
    }
  }
});

test("contradictory labels and unrelated sidebar stock never imply availability",()=>{
  const r=find("unizdrav-p2879");
  for(const label of ["Zboží je na cestě", "Není skladem", "Vyprodáno"]){
    const conflict=classifyRollatorListingHtml(html(r,
      label+" Skladem >10ks Do košíku"),r);
    assert.equal(conflict.observation,"unverifiable");
    assert.equal(conflict.reason,"contradictory_seller_availability_labels");
  }
  const sellerUnavailable=classifyRollatorListingHtml(
    html(r,"Zboží je na cestě. Do košíku je v doporučených položkách."),r);
  assert.equal(sellerUnavailable.observation,"seller_displays_unavailable");
  for(const bad of [
    html(r,"Skladem >10ks Do košíku").replace("<h1>"+r.title+"</h1>","<h1>Jiné chodítko</h1>"),
    html(r,"Skladem >10ks Do košíku").replace("Kód: "+r.sku,"Kód: P5559"),
    html(r,"Zboží je na cestě").replace("Popis produktu","Neznámá hranice produktů")
  ])assert.equal(classifyRollatorListingHtml(bad,r).observation,"unverifiable");
});

test("public readonly seller audit surfaces unavailable SKU count, not synthetic stock",async()=>{
  const fake=async url=>{
    const r=records.find(item=>item.url===url);
    const body=r.id==="unizdrav-p2879"?"Zboží je na cestě":
      r.id==="unizdrav-p3774"?retired:stock;
    return {url,status:200,headers:{get:key=>key==="content-type"?"text/html":null},
      text:async()=>html(r,body)};
  };
  const result=await auditRollatorPublicListings(fake,data);
  assert.equal(result.seller_unavailable,1);
  assert.equal(result.needs_review,1);
  assert.equal(result.matched,2);
  assert.equal(result.active_product_offers_changed,0);
  assert.ok(result.results.every(item=>item.production_eligible===false));
  assert.equal(result.results.find(item=>item.id==="unizdrav-p2879").observation,
    "seller_displays_unavailable");
});

test("H1 failures report only bounded count-only shape, never merchant text",()=>{
  const r=find("unizdrav-p2879");
  const page=html(r,stock);
  const exactHeading="<h1>"+r.title+"</h1>";
  const extra=page.replace(exactHeading,exactHeading+"<h1>Unrelated overlay title</h1>");
  const result=classifyRollatorListingHtml(extra,r);
  assert.equal(result.observation,"unverifiable");
  assert.equal(result.reason,"foreign_h1_inside_product_summary");
  assert.deepEqual(result.heading_shape,{
    h1_count_bounded:2,exact_h1_count:1,contains_expected_title_count:1
  });
  const banner=page.replace(exactHeading,
    "<h1>New cosmetic label — "+r.title+"</h1>");
  const cosmetic=classifyRollatorListingHtml(banner,r);
  assert.equal(cosmetic.reason,"exact_product_h1_missing");
  assert.deepEqual(cosmetic.heading_shape,{
    h1_count_bounded:1,exact_h1_count:0,contains_expected_title_count:1
  });
  const unknown=classifyRollatorListingHtml(page.replace(r.title,
    "Untrusted unrelated product"),r);
  assert.deepEqual(unknown.heading_shape,{
    h1_count_bounded:1,exact_h1_count:0,contains_expected_title_count:0
  });
  const excessive=classifyRollatorListingHtml(
    page.replace(exactHeading,exactHeading.repeat(10)),r);
  assert.equal(excessive.reason,"exact_product_h1_count_mismatch");
  assert.equal(excessive.heading_shape.h1_count_bounded,4);
  const output=assessRollatorLifecycle(result,r);
  assert.equal(output.production_eligible,false);
  assert.deepEqual(output.heading_shape,result.heading_shape);
  for(const secret of [r.title,r.url,"Unrelated overlay title","New cosmetic label"]){
    assert.ok(!JSON.stringify(output).includes(secret),
      "Never log heading content, retailer URL or product title");
  }
});

test("correct current H1 and retired product never expose unnecessary diagnostics",()=>{
  for(const r of records){
    const live=classifyRollatorListingHtml(html(r,goodBody(r)),r);
    assert.ok(!("heading_shape" in live));
    assert.ok(!("heading_shape" in assessRollatorLifecycle(live,r)));
  }
});

test("live-observed extra site-shell H1 before exact SKU is not a fake product mismatch",()=>{
  for(const r of records){
    const own=goodBody(r);
    const main="<h1>"+r.title+"</h1>";
    const extra="<h1>Sitewide help header unrelated to product</h1>";
    const page=html(r,own);
    const shellBefore=classifyRollatorListingHtml(
      page.replace(main,extra+main),r);
    assert.equal(shellBefore.observation,
      r.id==="unizdrav-p3774"?"retired":"seller_displays_available");
    assert.equal(assessRollatorLifecycle(shellBefore,r).production_eligible,false);
    const shellAfter=classifyRollatorListingHtml(
      page.replace(main,main+extra),r);
    assert.equal(shellAfter.observation,"unverifiable",
      "Foreign heading after verified product still blocked");
    assert.equal(shellAfter.reason,"foreign_h1_inside_product_summary");
    const fakeSku=classifyRollatorListingHtml(
      page.replace(main,extra+main).replace("Kód: "+r.sku,"Kód: P9999"),r);
    assert.equal(fakeSku.observation,"unverifiable",
      "An exact title plus another SKU is not the merchant product");
    assert.equal(fakeSku.reason,"exact_product_sku_missing");
    const noExact=classifyRollatorListingHtml(
      page.replace(main,extra),r);
    assert.equal(noExact.observation,"unverifiable");
    const tooMany=classifyRollatorListingHtml(
      page.replace(main,extra.repeat(4)+main),r);
    assert.equal(tooMany.reason,"exact_product_h1_count_mismatch");
  }
});

test("an unavailable product with a shell H1 remains unavailable, not a sale",()=>{
  const r=find("unizdrav-p2879"),page=html(r,"Zboží je na cestě");
  const main="<h1>"+r.title+"</h1>";
  const observation=classifyRollatorListingHtml(page.replace(main,
    "<h1>Sitewide helper</h1>"+main),r);
  assert.equal(observation.observation,"seller_displays_unavailable");
  const result=assessRollatorLifecycle(observation,r);
  assert.equal(result.production_eligible,false);
  assert.equal(result.status,"needs_review");
});

test("extra H1 after product-description boundary cannot contaminate exact SKU stock",()=>{
  for(const r of records){
    const label=goodBody(r);
    const base=html(r,label);
    const extra=base.replace(
      "<div>Popis produktu</div>",
      "<div>Popis produktu</div><h1>Related other product</h1>");
    const observation=classifyRollatorListingHtml(extra,r);
    assert.equal(observation.observation,
      r.id==="unizdrav-p3774"?"retired":"seller_displays_available");
    assert.equal(assessRollatorLifecycle(observation,r).production_eligible,false);

    // Nearby related-product stock must NEVER rescue an unverified primary SKU.
    if(r.id!=="unizdrav-p3774"){
      const unknown=html(r,"Primary SKU stock is not stated").replace(
        "<div>Popis produktu</div>",
        "<div>Popis produktu</div><h1>Related SKU</h1> Skladem >10ks Do košíku");
      assert.equal(classifyRollatorListingHtml(unknown,r).observation,"unverifiable");
    }
  }
});

test("foreign H1 inside exact SKU summary is rejected despite a valid seller label",()=>{
  const r=find("unizdrav-p2879");
  const page=html(r,stock).replace("Kód: "+r.sku,
    "<h1>Wrong product heading</h1>Kód: "+r.sku);
  const finding=classifyRollatorListingHtml(page,r);
  assert.equal(finding.observation,"unverifiable");
  assert.equal(finding.reason,"foreign_h1_inside_product_summary");
  assert.equal(assessRollatorLifecycle(finding,r).production_eligible,false);
});
