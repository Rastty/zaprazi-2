import test from "node:test";
import assert from "node:assert/strict";
import {ehubAdlTargets} from "../scripts/audit-ehub-adl-listings.mjs";
import {
  EHUB_CATEGORY_URL,shoptetProductCards,classifyEhubCategory,
  classifyEhubCategoryResponse,auditEhubCategory
} from "../scripts/audit-ehub-adl-category.mjs";

const items=ehubAdlTargets();
const product=(item,{stock="Skladem",sku=item.sku,url=item.url}={})=>
  '<div class="p" data-micro="product" data-micro-identifier="public-'+item.id+'">'+
  '<div class="p-in"><a href="'+url+'" data-micro="url"><span data-micro="name">'+item.title+'</span></a>'+
  '<div class="p-in-in"><span class="sku">'+sku+'</span><span class="availability">'+stock+
  '</span></div></div></div>';
const category=cards=>('<!doctype html><html><head><title>Pomůcky pro soběstačnost</title></head>'+
  '<body><nav>Skladem 15-050105 Jiný produkt</nav><h1>Pomůcky pro soběstačnost</h1>'+
  '<section class="products">'+cards.join("")+'</section>'+
  '<footer>Skladem 15-050101 15-050102 15-050103 15-050105</footer></body></html>')
  .padEnd(600," ");

test("documented Shoptet div.p product marker and bounded nested cards",()=>{
  const html=category(items.map(i=>product(i)));
  const parsed=shoptetProductCards(html);
  assert.equal(parsed.valid,true);
  assert.equal(parsed.cards.length,4);
  assert.equal(parsed.cards.filter(x=>x.includes("15-050101")).length,1);
  assert.deepEqual(classifyEhubCategory(html).map(x=>x.state),
    Array(4).fill("seller_displays_available"));
});

test("seller SKU+canonical link does not authorize product fit, manufacturer REF or eHUB payout",()=>{
  const rows=classifyEhubCategory(category(items.map(i=>product(i))));
  assert.equal(rows.filter(r=>r.exactSellerSkuObserved).length,4);
  assert.ok(rows.every(r=>r.productionOfferChanged===false&&
    r.exactManufacturerSkuVerified===false&&r.publisherDeeplinkVerified===false));
  assert.ok(rows.every(r=>!Object.keys(r).some(k=>/price|url|html|commission|date/i.test(k))));
});

test("two legitimate cards of the same product must agree on seller stock",()=>{
  const same=classifyEhubCategory(category([
    ...items.map(i=>product(i)),product(items[0])
  ]));
  assert.equal(same[0].state,"seller_displays_available");
  const conflict=classifyEhubCategory(category([
    ...items.map(i=>product(i)),product(items[0],{stock:"Není skladem"})
  ]));
  assert.equal(conflict[0].state,"unverifiable");
  assert.equal(conflict[0].reason,"conflicting_category_stock_labels");
  assert.equal(classifyEhubCategory(category([
    ...items.map(i=>product(i)),product(items[0]),product(items[0]),product(items[0])
  ]))[0].state,"unverifiable");
});

test("navigation, footer, adjacent product and SKU-only without exact link never prove stock",()=>{
  const wrong=category(items.map((i,n)=>product(i,{
    sku:n===0?"15-050100":i.sku,stock:n===1?"":"Skladem"
  })));
  const rows=classifyEhubCategory(wrong);
  assert.equal(rows[0].state,"unverifiable");
  assert.equal(rows[0].reason,"seller_sku_missing_or_mismatch");
  assert.equal(rows[1].state,"stock_label_unverifiable");
  assert.equal(rows[2].state,"seller_displays_available");
  const differentDomain=classifyEhubCategory(category(items.map((i,n)=>
    product(i,{url:n===0?"https://external.example/item/":i.url}))));
  assert.equal(differentDomain[0].state,"unverifiable");
  const swappedSku=classifyEhubCategory(category(items.map((i,n)=>
    product(i,{sku:n===0?items[1].sku:i.sku}))));
  assert.equal(swappedSku[0].state,"unverifiable");
});

test("negative and contradictory stock labels, missing cards and malformed HTML fail closed",()=>{
  const rows=classifyEhubCategory(category(items.map((i,n)=>
    product(i,{stock:n===0?"Není skladem. Skladem":n===1?"Vyprodáno":"Skladem"}))));
  assert.equal(rows[0].state,"unverifiable");
  assert.equal(rows[1].state,"seller_displays_unavailable");
  assert.equal(classifyEhubCategory("<html>nic</html>")
    .every(r=>r.state==="unverifiable"),true);
  assert.equal(shoptetProductCards(" ".repeat(1500001)).valid,false);
});

test("one public canonical GET, no merchant click, tracker, checkout, refresh or visitor data",async()=>{
  const seen=[],html=category(items.map(i=>product(i)));
  const fetcher=async(url,options)=>{
    seen.push({url,options});
    return {status:200,url,headers:{get:k=>k==="content-type"?"text/html; charset=utf-8":null},
      text:async()=>html};
  };
  const r=await auditEhubCategory(fetcher);
  assert.equal(seen.length,1);
  assert.equal(seen[0].url,EHUB_CATEGORY_URL);
  assert.equal(seen[0].options.method,"GET");
  assert.equal(seen[0].options.redirect,"error");
  assert.equal(seen[0].options.cache,"no-store");
  assert.equal(r.exact_seller_sku_observed,4);
  assert.equal(r.seller_displays_available,4);
  assert.equal(r.publisher_deeplinks_verified,0);
  assert.equal(r.offer_dates_refreshed,0);
  assert.equal(r.wordpress_writes,0);
  assert.equal(r.production_offer_changes,0);
  const serialized=JSON.stringify(r);
  for(const i of items){
    assert.ok(!serialized.includes(i.url));
    assert.ok(!serialized.includes(i.title));
  }
  assert.doesNotMatch(serialized,/https?:\/\/|password|affiliateUrl|token=/i);
  assert.deepEqual(classifyEhubCategoryResponse({status:302,url:EHUB_CATEGORY_URL,html})
    .map(x=>x.state),Array(4).fill("unverifiable"));
  assert.deepEqual(classifyEhubCategoryResponse({status:200,url:EHUB_CATEGORY_URL+"?a=1",html})
    .map(x=>x.state),Array(4).fill("unverifiable"));
  const denied=await auditEhubCategory(async url=>({
    status:403,url,headers:{get:()=>null},text:async()=>{throw Error("unexpected read")}
  }));
  assert.equal(denied.needs_review,4);
});
