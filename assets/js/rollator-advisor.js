// ZP_RELEASE_0_8_76
import { recommendMobility } from "../../src/mobility/engine.js";
import { getMobilityProducts } from "../../src/mobility/catalog.js";
import { renderMobilityProductFitGate, installMobilityProductFitGate } from "../../src/mobility/offer-fit-gate.js";
import { getMobilityNextSteps } from "../../src/mobility/next-steps.js";

const form=document.querySelector("#zp-rollator-advisor");
const result=document.querySelector("#zp-rollator-result");
const submit=document.querySelector("#zp-rollator-submit");
const errors=document.querySelector("#zp-rollator-errors");
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
    const missing=[...form.querySelectorAll("[data-zp-roll-required]")].filter(g=>!val(g.dataset.zpRollRequired));
    if(!missing.length){errors.hidden=true;return true;}
    errors.textContent="Doplňte prosím zvýrazněné otázky.";errors.hidden=false;missing[0].focus();return false;
  };
  const render=(p,allow)=>{
    const offer=p.offers?.[0]; if(!offer) return "";
    const configured=offer.affiliateKey?affiliateMap[offer.affiliateKey]:null;
    const affiliateUrl=typeof configured==="string"&&configured.startsWith("https://")?configured:null;
    const url=affiliateUrl||offer.url;
    return `<article class="zp-product-card"><h4>${esc(p.name)}</h4><ul class="zp-facts"><li>výška: ${esc(p.facts.heightCm)} cm</li><li>šířka: ${esc(p.facts.widthCm)} cm</li><li>nosnost: ${esc(p.facts.maxUserWeightKg)} kg</li></ul>${allow?renderMobilityProductFitGate(`<div class="zp-offer"><small class="zp-affiliate-policy">Výběr produktu se neřídí výší provize.</small><strong>${esc(offer.merchantName)}</strong><a class="zp-link-btn" data-zp-rollator-merchant-link="1" href="${esc(url)}" target="_blank" rel="${affiliateUrl?"noopener nofollow sponsored":"noopener nofollow"}">${affiliateUrl?"Zobrazit cenu a dostupnost":"Zobrazit produkt a dostupnost"}</a></div>`,{requireSeatFit:!!form.querySelector('input[name="seatNeeded"]:checked'),requireTransportFit:!!form.querySelector('input[name="transportNeed"]:checked')}):""}</article>`;
  };
  submit.addEventListener("click",()=>{
    if(!validate()) return;
    const out=recommendMobility({
      environment:"both",
      supportNeed:val("supportNeed","unknown"),
      handBrakes:val("handBrakes","unknown"),
      seatNeeded:!!form.querySelector('input[name="seatNeeded"]:checked'),
      transportNeed:!!form.querySelector('input[name="transportNeed"]:checked'),
      duration:val("duration","unknown")
    });
    const ids=out.recommendations.flatMap(r=>r.productCandidateIds??[]);
    const products=getMobilityProducts(ids);

    const next = getMobilityNextSteps(out);
    const nextMarkup = next.canCompareAcquisition
      ? '<section class="zp-acquisition-summary"><h3>Jak rollátor získat</h3><p>Než výrobek koupíte, porovnejte také půjčení a možnost úhrady.</p><div>' + next.items.map(item => '<article><h4>' + esc(item.label) + '</h4><p>' + esc(item.reason) + '</p><a class="zp-link-btn" href="' + esc(item.href) + '">' + esc(item.action) + '</a></article>').join("") + '</div></section>'
      : '<section class="zp-acquisition-summary"><h3>Jak bezpečně pokračovat</h3><p>Pokud nejde bezpečně ovládat brzdy nebo je potřebná fyzická pomoc, online výběr konkrétního rollátoru není vhodný.</p><button type="button" class="zp-link-btn" data-zp-edit-answers="1">Upravit odpovědi</button></section>';
    result.innerHTML=`<h2>${esc(out.headline)}</h2><p>${esc(out.nextStep)}</p>${products.length?`<div class="zp-product-grid">${products.map(p=>render(p,out.status==="candidate")).join("")}</div>`:""}${out.status==="candidate"?'<p><a class="zp-text-link" href="/choditko-na-pojistovnu/">Prověřit cestu přes pojišťovnu</a></p>':""}${out.disclaimer?`<p class="zp-disclaimer">${esc(out.disclaimer)}</p>`:""}${nextMarkup}`;
    result.querySelector("[data-zp-edit-answers]")?.addEventListener("click", () => {
      form.scrollIntoView({ block: "start" });
      form.querySelector('input[name="handBrakes"]')?.focus();
    });
    result.querySelectorAll("[data-zp-rollator-merchant-link]").forEach((link)=>link.addEventListener("click",()=>{track("product_click");track("merchant_click");},{once:true}));
    track("builder_complete");
    if(out.status==="candidate"&&products.length) track("recommendation_view");
    result.hidden=false;result.focus();
  });
}
