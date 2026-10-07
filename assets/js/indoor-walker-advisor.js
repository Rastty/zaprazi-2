// ZP_RELEASE_0_8_38
import { recommendMobility } from "../../src/mobility/engine.js";
import { getMobilityProducts } from "../../src/mobility/catalog.js";

const form=document.querySelector("#zp-indoor-walker-advisor");
const result=document.querySelector("#zp-indoor-walker-result");
const submit=document.querySelector("#zp-indoor-walker-submit");
const errors=document.querySelector("#zp-indoor-walker-errors");
const runtime=window.ZaPraziRuntime||{affiliateMap:{}};
const affiliateMap=runtime.affiliateMap||{};
const esc=(v)=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");

if(form&&result&&submit&&errors){
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
    return `<article class="zp-product-card"><h4>${esc(p.name)}</h4><ul class="zp-facts"><li>výška: ${esc(p.facts.heightCm)} cm</li><li>šířka: ${esc(p.facts.widthCm)} cm</li><li>hmotnost: ${esc(p.facts.weightKg)} kg</li><li>nosnost: ${esc(p.facts.maxUserWeightKg)} kg</li></ul>${allow?`<div class="zp-offer"><strong>${esc(offer.merchantName)}</strong><a class="zp-link-btn" href="${esc(url)}" target="_blank" rel="${affiliateUrl?"noopener nofollow sponsored":"noopener nofollow"}">${affiliateUrl?"Přejít k obchodníkovi":"Zobrazit produkt u obchodníka"}</a></div>`:""}</article>`;
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
    result.innerHTML=`<h2>${esc(out.headline)}</h2><p>${esc(out.nextStep)}</p>${products.length?`<div class="zp-product-grid">${products.map(p=>render(p,out.status==="candidate")).join("")}</div>`:""}${out.disclaimer?`<p class="zp-disclaimer">${esc(out.disclaimer)}</p>`:""}`;
    result.hidden=false;result.focus();
  });
}
