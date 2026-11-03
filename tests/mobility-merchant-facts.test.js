import test from "node:test";
import assert from "node:assert/strict";
import {monitoredOffers,reviewMerchantHtml,classifyMerchantResponse,auditMobilityMerchantFacts} from "../scripts/audit-mobility-merchant-facts.mjs";

const [wa17,wa21]=monitoredOffers();
function fixture(name,sku,general,specific){
  return "<html><head><title>Product</title></head><body><h1>"+name+"</h1>"+
    "<div>Kód: "+sku+"</div><table><tr><th>Hmotnost:</th><td>"+
    general+" kg</td></tr><tr><th>Hmotnost chodítka:</th><td>"+
    specific+" kg</td></tr></table></body></html>";
}
test("only production-approved, exact non-affiliate SKU pages are monitored",()=>{
 assert.deepEqual([wa17.id,wa21.id],["besco-wa17","besco-wa21"]);
 assert.ok(wa17.url.startsWith("https://www.rehabilitacnipomucky.cz/"));
 assert.ok(wa21.url.startsWith("https://www.rehabilitacnipomucky.cz/"));
 assert.ok(monitoredOffers().every(x=>x.checkedAt==="2026-10-06"));
 const products=[{
  id:"besco-wa17",productionEligible:true,identityStatus:"verified",
  facts:{weightKg:2.3},offers:[{
    affiliateKey:"rehabilitacni-pomucky-cz:besco-wa17",
    affiliateUrl:null,merchantId:"rehabilitacni-pomucky-cz",
    checkedAt:"2026-10-06",
    url:"https://www.rehabilitacnipomucky.cz/besco-ctyrbodove-choditko-skladaci/?aff=secret"
  }]
 },{...wa21,id:"besco-wa21",productionEligible:false,offers:[]}];
 assert.throws(()=>monitoredOffers(products),/Unsafe\/noncanonical/);
});
test("two merchant weight fields with differing values trigger review, never silent overwrite",()=>{
 const conflicted=fixture("Besco Dvoukolové chodítko skládací","WA21","2.7","2,8");
 const result=reviewMerchantHtml(conflicted,wa21);
 assert.equal(result.status,"review_required");
 assert.deepEqual(result.reasons,["merchant_weight_fields_conflict"]);
 assert.equal(result.weightCatalogKg,2.8);
 assert.equal(result.weightGeneralKg,2.7);
 assert.equal(result.weightSpecificKg,2.8);
 const consistent=reviewMerchantHtml(fixture("Besco Čtyřbodové chodítko skládací","WA17","2,3","2.3"),wa17);
 assert.equal(consistent.status,"consistent_visible_evidence");
});
test("wrong SKU, missing specific weight, redirects and blocking are not treated as verified",()=>{
 const wrong=reviewMerchantHtml(fixture("Besco Dvoukolové chodítko skládací","WA17","2.8","2.8"),wa21);
 assert.ok(wrong.reasons.includes("product_identity_unverified"));
 const missing=reviewMerchantHtml("<h1>Besco Dvoukolové chodítko skládací</h1><div>Kód: WA21</div>",wa21);
 assert.ok(missing.reasons.includes("specific_weight_not_matching_catalog"));
 assert.equal(classifyMerchantResponse({status:301,url:wa21.url,html:""},wa21).status,"review_required");
 assert.equal(classifyMerchantResponse({status:403,url:wa21.url,html:""},wa21).status,"unverifiable");
 assert.equal(classifyMerchantResponse({status:200,url:"https://example.org/",html:"x".repeat(600)},wa21).status,"review_required");
});
test("the network monitor performs only two exact public GETs without following redirects",async()=>{
 const seen=[];
 const fake=async(url,options)=>{
   seen.push({url,options});
   const record=url===wa17.url?wa17:wa21;
   const html=fixture(record.id==="besco-wa17"?"Besco Čtyřbodové chodítko skládací":"Besco Dvoukolové chodítko skládací",record.sku,String(record.weightKg),String(record.weightKg)).padEnd(550," ");
   return {status:200,url,headers:{get(key){return key==="content-type"?"text/html":null;}},async text(){return html;}};
 };
 const report=await auditMobilityMerchantFacts(fake);
 assert.equal(report.results.length,2);
 assert.ok(report.results.every(r=>r.status==="consistent_visible_evidence"));
 assert.equal(seen.length,2);
 assert.ok(seen.every(x=>x.options.method==="GET"&&x.options.redirect==="manual"&&!x.url.includes("?")));
});
