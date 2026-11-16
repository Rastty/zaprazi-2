import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {getBathroomProducts} from "../src/bathroom/catalog.js";
import {renderBathroomProductEvidence,renderBathroomOfferFreshness} from "../src/bathroom/source-transparency.js";

const escapeHtml=value=>String(value??"")
  .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
  .replaceAll('"',"&quot;").replaceAll("'","&#039;");

test("WC support and bath-transfer cards disclose every source and checked date",()=>{
  const ids=["unizdrav-p2015","unizdrav-p2131","besco-bs008","unizdrav-p2203"];
  const products=getBathroomProducts(ids);
  assert.equal(products.length,ids.length);
  for(const product of products){
    const html=renderBathroomProductEvidence(product,escapeHtml);
    assert.match(html,/Odkud máme parametry výrobku/);
    assert.match(html,/Zdroje byly zkontrolovány/);
    assert.match(html,/7\. 10\. 2026/);
    assert.equal((html.match(/<li>/g)||[]).length,product.evidence.length);
    assert.equal((html.match(/<a href=/g)||[]).length,
      product.evidence.filter(item=>!item.type.includes("merchant_product_page")).length);
    assert.doesNotMatch(html,/<a[^>]+href="https:\/\/(?:unizdrav\.cz|www\.rehabilitacnipomucky\.cz)\//);
  }
});

test("Untrusted evidence cannot become script or merchant shortcut",()=>{
  const html=renderBathroomProductEvidence({
    evidence:[
      {type:"merchant_product_page",url:"https://example.test/offer",checkedAt:"2026-10-07"},
      {type:"independent_bathing_guidance",url:"javascript:alert(1)",checkedAt:"2026-02-31"},
      {type:"manufacturer_manual",url:"https://example.com/<img src=x>",checkedAt:"invalid"},
      {type:'<script>alert(1)</script>',url:"https://example.test/manual",checkedAt:"2026-10-07"}
    ]
  },escapeHtml);
  assert.equal((html.match(/<a href=/g)||[]).length,1);
  assert.doesNotMatch(html,/href="javascript:|<script>|<img/);
  assert.match(html,/datum nezjištěno/);
  assert.doesNotMatch(html,/href="https:\/\/example\.test\/(offer|manual)"/);
});

test("Specialist UI cards include the helper and affiliate disclosure without altering candidate gating",()=>{
  for(const key of ["toilet-support","bath-transfer"]){
    const src=readFileSync(new URL("../assets/js/"+key+"-advisor.js",import.meta.url),"utf8");
    assert.match(src,/import \{ renderBathroomProductEvidence(?:, renderBathroomOfferFreshness)? \} from/);
    assert.match(src,/renderBathroomProductEvidence\(p,esc\)/);
    assert.match(src,/zp-affiliate-label/);
    assert.match(src,/Partnerský odkaz/);
    assert.match(src,/out\.status==="candidate"/);
    assert.doesNotMatch(src,/new FormData|sendBeacon|localStorage/);
  }
});

test("Missing source data returns no panel and escaped content is mandatory",()=>{
  assert.equal(renderBathroomProductEvidence({evidence:[]},escapeHtml),"");
  assert.equal(renderBathroomProductEvidence({},escapeHtml),"");
  assert.throws(()=>renderBathroomProductEvidence({evidence:[{type:"test"}]},null));
});

test("Merchant offer age is disclosed across every bathroom Advisor without disabling its link",()=>{
  const now=new Date("2026-11-16T12:00:00Z");
  const expired=renderBathroomOfferFreshness({checkedAt:"2026-10-07"},escapeHtml,now);
  assert.match(expired,/data-zp-bath-offer-freshness="stale"/);
  assert.match(expired,/7\. 10\. 2026/);
  assert.match(expired,/cenu a dostupnost přímo u prodejce/);
  assert.doesNotMatch(expired,/<a\b|skladem|proplacen/);
  assert.equal(renderBathroomOfferFreshness({checkedAt:"2026-11-16"},escapeHtml,now),"");
  assert.match(renderBathroomOfferFreshness({checkedAt:"invalid"},escapeHtml,now),/data-zp-bath-offer-freshness="unknown"/);
  assert.match(renderBathroomOfferFreshness({checkedAt:'<script>alert(1)</script>'},escapeHtml,now),/není spolehlivě doloženo/);
  assert.throws(()=>renderBathroomOfferFreshness({},null,now),/escaping/);
  for(const key of ["bathroom","toilet-riser","toilet-chair","shower-chair","toilet-support","bath-transfer"]){
    const src=readFileSync(new URL("../assets/js/"+key+"-advisor.js",import.meta.url),"utf8");
    assert.match(src,/renderBathroomOfferFreshness\(/,key+" must show merchant freshness near offer");
    assert.match(src,/data-zp-[a-z-]+-merchant-link/,key+" must preserve gated outbound links");
  }
});
