// ZP_RELEASE_0_8_87
import { recommendBathroom } from "../../src/bathroom/engine.js";
import { getBathroomProducts } from "../../src/bathroom/catalog.js";
import { renderBathroomAcquisition } from "../../src/bathroom/acquisition-view.js";
import { formatBathroomFacts } from "../../src/bathroom/product-facts-display.js";
import { installBathroomMicroStaging } from "../../src/bathroom/micro-staging.js";

const form=document.querySelector("#zp-toilet-support-advisor");
const result=document.querySelector("#zp-toilet-support-result");
const submit=document.querySelector("#zp-toilet-support-submit");
const errors=document.querySelector("#zp-toilet-support-errors");
const runtime=window.ZaPraziRuntime||{affiliateMap:{}};
const affiliateMap=runtime.affiliateMap||{};
let started=false;

const track=(event)=>window.dispatchEvent(new CustomEvent("zaprazi:analytics",{detail:{event}}));
const esc=(v)=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");

if(form&&result&&submit&&errors){

  // Never keep a purchase link tied to old answers on the page.
  form.addEventListener("change", () => {
    result.hidden = true;
    result.innerHTML = "";
  });

  installBathroomMicroStaging({
    form, result, submit: submit, errors: errors,
    key: "toilet-support", requiredAttr: "data-zp-support-required",
    fitNames: ["loadFit","supportFrameFit"], primaryNeed: "toilet_support",
    conditionalFit: { supportFrameFit: value => value("wallFixing") !== "verified" }
  });

  const val=(n,f=null)=>form.querySelector(`input[name="${n}"]:checked`)?.value??f;
  const groups=()=>[...form.querySelectorAll("[data-zp-support-required]")].filter((fieldset) => !fieldset.hidden && !fieldset.closest('[hidden]'));
  const validate=()=>{
    const missing=groups().filter((g)=>!val(g.dataset.zpSupportRequired));
    groups().forEach((g)=>g.classList.toggle("is-error",!val(g.dataset.zpSupportRequired)));
    if(!missing.length){errors.hidden=true;errors.textContent="";return true;}
    errors.textContent="Doplňte prosím všechny zvýrazněné otázky.";
    errors.hidden=false;missing[0].focus();return false;
  };
  const render=(p,allow)=>{
    const offer=p.offers?.[0]; if(!offer) return "";
    const configured=offer.affiliateKey?affiliateMap[offer.affiliateKey]:null;
    const affiliateUrl=typeof configured==="string"&&configured.startsWith("https://")?configured:null;
    const url=affiliateUrl||offer.url;
    const facts=formatBathroomFacts(p.facts).map(fact=>`<li>${esc(fact)}</li>`).join("");
    return `<article class="zp-product-card"><h4>${esc(p.name)}</h4><ul class="zp-facts">${facts}</ul><details><summary>Co ještě ověřit</summary><ul>${p.selectionNotes.map(n=>`<li>${esc(n)}</li>`).join("")}</ul></details>${allow?`<div class="zp-offer"><small class="zp-affiliate-policy">Výběr produktu se neřídí výší provize.</small><strong>${esc(offer.merchantName)}</strong><a class="zp-link-btn" data-zp-support-merchant-link="1" href="${esc(url)}" target="_blank" rel="${affiliateUrl?"noopener nofollow sponsored":"noopener nofollow"}">${affiliateUrl?"Zobrazit cenu a dostupnost":"Zobrazit produkt a dostupnost"}</a></div>`:'<p class="zp-disclaimer">Nejdřív dokončete bezpečnostní kontrolu.</p>'}</article>`;
  };
  form.addEventListener("change",()=>{if(!started){started=true;track("builder_start");}});
  submit.addEventListener("click",()=>{
    if(!validate()) return;
    const out=recommendBathroom({
      primaryNeed:"toilet_support",
      transferAbility:val("transferAbility","unknown"),
      loadFit:val("loadFit","unknown"),
      wallFixing:val("wallFixing","unknown"),
      supportFrameFit:val("supportFrameFit","unknown"),
      duration:val("duration","unknown")
    });
    const ids=out.recommendations.flatMap(x=>x.productCandidateIds??[]);
    const products=getBathroomProducts(ids);
    if(!["needs_more_info","invalid_input"].includes(out.status)) track("builder_complete");
    if(products.length) track("recommendation_view");
    result.innerHTML=`<h2>${esc(out.headline)}</h2><p>${esc(out.nextStep)}</p>${out.recommendations.map(item=>`<section class="zp-why-recommendation"><h3>Proč právě toto řešení?</h3><p>${esc(item.reason)}</p></section>`).join("")}${renderBathroomAcquisition(out.status==="candidate"?out.acquisition:[],esc)}${products.length?`<section class="zp-product-section"><div class="zp-product-grid">${products.map(p=>render(p,out.status==="candidate")).join("")}</div></section>`:""}${out.disclaimer?`<p class="zp-disclaimer">${esc(out.disclaimer)}</p>`:""}`;
    result.querySelectorAll("[data-zp-support-merchant-link]").forEach(a=>a.addEventListener("click",()=>{track("product_click");track("merchant_click");},{once:true}));
    result.hidden=false;result.focus();
  });
}
