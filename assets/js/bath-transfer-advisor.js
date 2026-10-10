// ZP_RELEASE_0_8_97
import { recommendBathroom } from "../../src/bathroom/engine.js";
import { getBathroomProducts } from "../../src/bathroom/catalog.js";
import { renderBathroomAcquisition } from "../../src/bathroom/acquisition-view.js";
import { formatBathroomFacts } from "../../src/bathroom/product-facts-display.js";
import { installBathroomMicroStaging } from "../../src/bathroom/micro-staging.js";

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

  // Never keep a purchase link tied to old answers on the page.
  form.addEventListener("change", () => {
    result.hidden = true;
    result.innerHTML = "";
  });

  installBathroomMicroStaging({
    form, result, submit: submit, errors: errors,
    key: "bath-transfer", requiredAttr: "data-zp-bath-required",
    fitNames: ["bathFit","bathBenchFit","loadFit"], primaryNeed: "bath_transfer", alternativeIds: ["unizdrav-p2203"],
    conditionalFit: { bathBenchFit: value => value("bathFit") === "no" },
    dependentFitResets: { bathFit: ["loadFit"] }
  });

  const val=(n,f=null)=>form.querySelector(`input[name="${n}"]:checked`)?.value??f;
  const groups=()=>[...form.querySelectorAll("[data-zp-bath-required]")].filter((fieldset) => !fieldset.hidden && !fieldset.closest('[hidden]'));
  // Invalid required questions stay visible and keyboard-focusable, even on mobile.
  const validate=()=>{
    const missing=[];
    groups().forEach((group)=>{
      const invalid=!val(group.dataset.zpBathRequired);
      group.classList.toggle("is-error",invalid);
      if(invalid){
        group.setAttribute("aria-invalid","true");
        missing.push(group);
      }else{
        group.removeAttribute("aria-invalid");
      }
    });
    if(!missing.length){errors.hidden=true;errors.textContent="";return true;}
    errors.textContent=missing.length===1
      ?"Doplňte prosím zvýrazněnou otázku."
      :`Doplňte prosím ${missing.length} zvýrazněné otázky.`;
    errors.hidden=false;
    missing[0].setAttribute("tabindex","-1");
    missing[0].focus();
    return false;
  };
  const render=(p,allow)=>{
    const offer=p.offers?.[0]; if(!offer) return "";
    const configured=offer.affiliateKey?affiliateMap[offer.affiliateKey]:null;
    const affiliateUrl=typeof configured==="string"&&configured.startsWith("https://")?configured:null;
    const url=affiliateUrl||offer.url;
    const facts=formatBathroomFacts(p.facts).map(fact=>`<li>${esc(fact)}</li>`).join("");
    return `<article class="zp-product-card"><h4>${esc(p.name)}</h4><ul class="zp-facts">${facts}</ul><details><summary>Co ještě ověřit</summary><ul>${p.selectionNotes.map(n=>`<li>${esc(n)}</li>`).join("")}</ul></details>${allow?`<div class="zp-offer"><small class="zp-affiliate-policy">Výběr produktu se neřídí výší provize.</small><strong>${esc(offer.merchantName)}</strong><a class="zp-link-btn" data-zp-bath-merchant-link="1" href="${esc(url)}" target="_blank" rel="${affiliateUrl?"noopener nofollow sponsored":"noopener nofollow"}">${affiliateUrl?"Zobrazit cenu a dostupnost":"Zobrazit produkt a dostupnost"}</a></div>`:'<p class="zp-disclaimer">Nejdřív dokončete bezpečnostní a rozměrovou kontrolu.</p>'}</article>`;
  };
  form.addEventListener("change",(event)=>{
    const group=event.target?.closest?.("[data-zp-bath-required]");
    if(group&&val(group.dataset.zpBathRequired)){
      group.classList.remove("is-error");
      group.removeAttribute("aria-invalid");
    }
    // Hidden fit-stage questions cannot leave a stale validation error.
    const remaining=groups().filter(item=>item.classList.contains("is-error"));
    if(!remaining.length){errors.hidden=true;errors.textContent="";}
    else errors.textContent=remaining.length===1
      ?"Doplňte prosím zvýrazněnou otázku."
      :`Doplňte prosím ${remaining.length} zvýrazněné otázky.`;
    if(!started){started=true;track("builder_start");}
  });
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
    result.innerHTML=`<h2>${esc(out.headline)}</h2><p>${esc(out.nextStep)}</p>${out.recommendations.map(item=>`<section class="zp-why-recommendation"><h3>Proč právě toto řešení?</h3><p>${esc(item.reason)}</p></section>`).join("")}${renderBathroomAcquisition(out.status==="candidate"?out.acquisition:[],esc)}${products.length?`<section class="zp-product-section"><div class="zp-product-grid">${products.map(p=>render(p,out.status==="candidate")).join("")}</div></section>`:""}${out.disclaimer?`<p class="zp-disclaimer">${esc(out.disclaimer)}</p>`:""}`;
    result.querySelectorAll("[data-zp-bath-merchant-link]").forEach(a=>a.addEventListener("click",()=>{track("product_click");track("merchant_click");},{once:true}));
    result.hidden=false;result.focus();
  });
}
