import test from "node:test";
import assert from "node:assert/strict";
import {
  meyraPublicEvidenceTargets,parsePublicMeyraEvidence,
  classifyMeyraPublicResponse,auditMeyraIdentity
} from "../scripts/audit-meyra-public-identity.mjs";

const [manufacturer,retailer]=meyraPublicEvidenceTargets();
const html=(kind,sku="3061982",width="61,5",handles="79 - 97")=>
  "<html><head><title>Public product</title></head><body><h1>"+
  (kind==="manufacturer"?"IDEAL ROLLATOR Čtyřkolové chodítko":"MEYRA Ideal rollator čtyřkolové chodítko")+
  "</h1><p>Kód "+sku+"</p><table><tr><td>Šířka (cm)</td><td>"+width+
  "</td></tr><tr><td>Výška madel (cm)</td><td>"+handles+
  "</td></tr></table></body></html>".padEnd(350," ");

test("public manufacturer + exact non-affiliate merchant sources only",()=>{
  assert.deepEqual([manufacturer.kind,retailer.kind],["manufacturer","retailer"]);
  assert.equal(manufacturer.url,"https://www.meyra.cz/ctyrkolove-choditko-rollator.html");
  assert.equal(retailer.url,"https://www.lekarna.cz/meyra-ideal-rollator-ctyrkolove-choditko/");
  for(const item of [manufacturer,retailer]){
    const u=new URL(item.url);
    assert.equal(u.protocol,"https:");assert.equal(u.search,"");assert.equal(u.hash,"");
  }
});
test("official MEYRA model 3061982 matching published manufacturer facts is consistent",()=>{
  const r=parsePublicMeyraEvidence(html("manufacturer"),"manufacturer");
  assert.equal(r.status,"matching_public_facts");
  assert.equal(r.model,"3061982");
  assert.equal(r.widthCm,61.5);
  assert.deepEqual(r.handleRangeCm,[79,97]);
});
test("merchant own stock code and narrower width do not prove exact manufacturer SKU",()=>{
  const r=parsePublicMeyraEvidence(html("retailer","473021","59","79–99"),"retailer");
  assert.equal(r.status,"review_required");
  assert.deepEqual(r.reasons,[
    "exact_manufacturer_model_not_on_page",
    "manufacturer_width_differs",
    "manufacturer_handle_range_differs"
  ]);
  assert.equal(r.model,null);
});
test("matching name alone does not silently assert dimensions, item code or fit",()=>{
  const r=parsePublicMeyraEvidence("<h1>MEYRA Ideal rollator čtyřkolové chodítko</h1>","retailer");
  assert.ok(r.reasons.includes("exact_manufacturer_model_not_on_page"));
  assert.ok(r.reasons.includes("fit_dimensions_not_readable"));
  const wrong=parsePublicMeyraEvidence(html("manufacturer","3061983"),"manufacturer");
  assert.equal(wrong.status,"review_required");
});
test("403 is unknown rather than a dead product; redirect never accepted as SKU",()=>{
  assert.deepEqual(classifyMeyraPublicResponse({status:403,url:retailer.url,html:""},retailer),{
    kind:"retailer",status:"unverifiable",reasons:["blocked_by_public_merchant"]
  });
  assert.equal(classifyMeyraPublicResponse({status:301,url:retailer.url,html:""},retailer).status,"review_required");
  assert.equal(classifyMeyraPublicResponse({status:200,url:"https://third-party.example/",html:html("retailer")},retailer).status,"review_required");
});
test("monitor performs only two bounded public GETs, no redirects, affiliate or answer params",async()=>{
  const seen=[];
  const fetcher=async(url,options)=>{
    seen.push({url,options});
    const kind=url===manufacturer.url?"manufacturer":"retailer";
    const page=html(kind,kind==="manufacturer"?"3061982":"473021",
      kind==="manufacturer"?"61,5":"59",kind==="manufacturer"?"79 - 97":"79 - 99");
    return {status:200,url,headers:{get:n=>n==="content-type"?"text/html":null},
      async text(){return page;}};
  };
  const result=await auditMeyraIdentity(fetcher);
  assert.equal(seen.length,2);
  assert.deepEqual(result.results.map(x=>x.status),["matching_public_facts","review_required"]);
  assert.ok(seen.every(x=>x.options.method==="GET"&&x.options.redirect==="manual"&&
    !x.url.includes("?")&&!x.url.includes("affiliate")));
  assert.ok(!JSON.stringify(result).includes("html"));
});
