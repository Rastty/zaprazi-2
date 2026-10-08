// ZP_RELEASE_0_8_50
import { recommendBathroom } from "../../src/bathroom/engine.js";
import { getBathroomProducts } from "../../src/bathroom/catalog.js";

const form=document.querySelector("#zp-bath-transfer-advisor");
const result=document.querySelector("#zp-bath-transfer-result");
const submit=document.querySelector("#zp-bath-transfer-submit");
const errors=document.querySelector("#zp-bath-transfer-errors");
const runtime=window.ZaPraziRuntime||{affiliateMap:{}};
const affiliateMap=runtime.affiliateMap||{};
let started=false;

const track=(event)=>window.dispatchEvent(new CustomEvent("zaprazi:analytics",{detail:{event}}));
const esc=(v)=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");

if(form&&result&&submit&&errors){
  const val=(n,f=null)=>form.querySelector(`input[name="${n}"]:checked`)?.value??f;
  const groups=()=>[...form.querySelectorAll("[data-zp-bath-required]")];
  const validate=()=>{
    const missing=groups().filter((g)=>!val(g.dataset.zpBathRequired));
    groups().forEach((g)=>g.classList.toggle("is-error",!val(g.dataset.zpBathRequired)));
    if(!missing.length){errors.hidden=true;errors.textContent="";return true;}
    errors.textContent="Doplňte prosím všechny zvýrazněné otázky.";errors.hidden=false;missing[0].focus();return false;
  };
  const render=(p,allow)=>{
    const offer=p.offers?.[0]; if(!offer) return "";
    const configured=offer.affiliateKey?affiliateMap[offer.affiliateKey]:null;
    const affiliateUrl=typeof configured==="string"&&configured.startsWith("https://")?configured:null;
    const url=affiliateUrl||offer.url;
    const facts=Object.entries(p.facts||{}).map(([k,v])=>`<li>${esc(k)}: ${esc(Array.isArray(v)?v.join(", "):v)}</li>`).join("");
    return `<article class="zp-product-card"><h4>${esc(p.name)}</h4><ul class="zp-facts">${facts}</ul><details><summary>Co ještě ověřit</summary><ul>${p.selectionNotes.map(n=>`<li>${esc(n)}</li>`).join("")}</ul></details>${allow?`<div class="zp-offer"><small class="zp-affiliate-policy">Výběr produktu se neřídí výší provize.</small><strong>${esc(offer.merchantName)}</strong><a class="zp-link-btn" data-zp-bath-merchant-link="1" href="${esc(url)}" target="_blank" rel="${affiliateUrl?"noopener nofollow sponsored":"noopener nofollow"}">${affiliateUrl?"Zobrazit cenu a dostupnost":"Zobrazit produkt a dostupnost"}</a></div>`:'<p class="zp-disclaimer">Nejdřív dokončete bezpečnostní a rozměrovou kontrolu.</p>'}</article>`;
  };
  form.addEventListener("change",()=>{if(!started){started=true;track("builder_start");}});
  submit.addEventListener("click",()=>{
    if(!validate()) return;
    const out=recommendBathroom({
      primaryNeed:"bath_transfer",
      transferAbility:val("transferAbility","unknown"),
      bathTransferIndependent:val("bathTransferIndependent","unknown"),
      bathFit:val("bathFit","unknown"),
      bathBenchFit:val("bathBenchFit","unknown"),
      loadFit:val("loadFit","unknown"),
      duration:val("duration","unknown")
    });
    const ids=out.recommendations.flatMap(x=>x.productCandidateIds??[]);
    const products=getBathroomProducts(ids);
    if(!["needs_more_info","invalid_input"].includes(out.status)) track("builder_complete");
    if(products.length) track("recommendation_view");
    result.innerHTML=`<h2>${esc(out.headline)}</h2><p>${esc(out.nextStep)}</p>${products.length?`<section class="zp-product-section"><div class="zp-product-grid">${products.map(p=>render(p,out.status==="candidate")).join("")}</div></section>`:""}${out.status==="candidate"?'<p><a class="zp-text-link" href="/pomucky-do-koupelny-na-pojistovnu/">Prověřit také cestu přes pojišťovnu</a></p>':""}${out.disclaimer?`<p class="zp-disclaimer">${esc(out.disclaimer)}</p>`:""}`;
    result.querySelectorAll("[data-zp-bath-merchant-link]").forEach(a=>a.addEventListener("click",()=>{track("product_click");track("merchant_click");},{once:true}));
    result.hidden=false;result.focus();
  });
}
