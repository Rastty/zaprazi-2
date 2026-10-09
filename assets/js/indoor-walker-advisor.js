// ZP_RELEASE_0_8_72
import { recommendMobility } from "../../src/mobility/engine.js";
import { getMobilityProducts } from "../../src/mobility/catalog.js";
import { renderMobilityProductFitGate, installMobilityProductFitGate } from "../../src/mobility/offer-fit-gate.js";
import { getMobilityNextSteps } from "../../src/mobility/next-steps.js";

const form=document.querySelector("#zp-indoor-walker-advisor");
const result=document.querySelector("#zp-indoor-walker-result");
const submit=document.querySelector("#zp-indoor-walker-submit");
const errors=document.querySelector("#zp-indoor-walker-errors");
const runtime=window.ZaPraziRuntime||{affiliateMap:{}};
const affiliateMap=runtime.affiliateMap||{};
const esc=(v)=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
const track=(eventName)=>window.dispatchEvent(new CustomEvent("zaprazi:analytics",{detail:{event:eventName}}));

if(form&&result&&submit&&errors){

  // Never keep a purchase link tied to old answers on the page.
  form.addEventListener("change", () => {
    result.hidden = true;
    result.innerHTML = "";
  });

  installMobilityProductFitGate(result);

  let builderStarted=false;
  form.addEventListener("change",()=>{
    if(!builderStarted){builderStarted=true;track("builder_start");}
  });
  const val=(n,f=null)=>form.querySelector(`input[name="${n}"]:checked`)?.value??f;
  const validate=()=>{
    const missing=[...form.querySelectorAll("[data-zp-indoor-required]")].filter(g=>!val(g.dataset.zpIndoorRequired));
    if(!missing.length){errors.hidden=true;return true;}
    errors.textContent="Doplňte prosím zvýrazněné otázky.";errors.hidden=false;missing[0].focus();return false;
  };
  const render=(p,allow)=>{
    const offer=p.offers?.[0]; if(!offer) return "";
    const configured=offer.affiliateKey?affiliateMap[offer.affiliateKey]:null;
    const affiliateUrl=typeof configured==="string"&&configured.startsWith("https://")?configured:null;
    const url=affiliateUrl||offer.url;
    return `<article class="zp-product-card"><h4>${esc(p.name)}</h4><ul class="zp-facts"><li>výška: ${esc(p.facts.heightCm)} cm</li><li>šířka: ${esc(p.facts.widthCm)} cm</li><li>hmotnost: ${esc(p.facts.weightKg)} kg</li><li>nosnost: ${esc(p.facts.maxUserWeightKg)} kg</li></ul>${allow?renderMobilityProductFitGate(`<div class="zp-offer"><small class="zp-affiliate-policy">Výběr produktu se neřídí výší provize.</small><strong>${esc(offer.merchantName)}</strong><a class="zp-link-btn" data-zp-indoor-merchant-link="1" href="${esc(url)}" target="_blank" rel="${affiliateUrl?"noopener nofollow sponsored":"noopener nofollow"}">${affiliateUrl?"Zobrazit cenu a dostupnost":"Zobrazit produkt a dostupnost"}</a></div>`,{requireTransportFit:!!form.querySelector('input[name="transportNeed"]:checked')}):""}</article>`;
  };
  submit.addEventListener("click",()=>{
    if(!validate()) return;
    const out=recommendMobility({
      environment:"indoor",
      supportNeed:val("supportNeed","unknown"),
      canLiftWalker:val("canLiftWalker","unknown"),
      homeSpace:val("homeSpace","unknown"),
      transportNeed:!!form.querySelector('input[name="transportNeed"]:checked'),
      duration:val("duration","unknown")
    });
    const ids=out.recommendations.flatMap(r=>r.productCandidateIds??[]);
    const products=getMobilityProducts(ids);

    const next = getMobilityNextSteps(out);
    const nextMarkup = next.canCompareAcquisition
      ? '<section class="zp-acquisition-summary"><h3>Jak chodítko získat</h3><p>Než výrobek koupíte, porovnejte také půjčení a možnost úhrady.</p><div>' + next.items.map(item => '<article><h4>' + esc(item.label) + '</h4><p>' + esc(item.reason) + '</p><a class="zp-link-btn" href="' + esc(item.href) + '">' + esc(item.action) + '</a></article>').join("") + '</div></section>'
      : '<section class="zp-acquisition-summary"><h3>Jak bezpečně pokračovat</h3><p>Dokud nejsou splněné podmínky, nepřecházejte k nákupu konkrétní pomůcky.</p><button type="button" class="zp-link-btn" data-zp-edit-answers="1">Upravit odpovědi</button></section>';
    result.innerHTML=`<h2>${esc(out.headline)}</h2><p>${esc(out.nextStep)}</p>${products.length?`<div class="zp-product-grid">${products.map(p=>render(p,out.status==="candidate")).join("")}</div>`:""}${out.disclaimer?`<p class="zp-disclaimer">${esc(out.disclaimer)}</p>`:""}${nextMarkup}`;
    result.querySelector("[data-zp-edit-answers]")?.addEventListener("click", () => {
      form.scrollIntoView({ block: "start" });
      form.querySelector('input[name="supportNeed"]')?.focus();
    });
    result.querySelectorAll("[data-zp-indoor-merchant-link]").forEach((link)=>link.addEventListener("click",()=>{track("product_click");track("merchant_click");},{once:true}));
    track("builder_complete");
    if(out.status==="candidate"&&products.length) track("recommendation_view");
    result.hidden=false;result.focus();
  });
}
