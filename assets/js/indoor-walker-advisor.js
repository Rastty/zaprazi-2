// ZP_RELEASE_0_8_143
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

  // Product-selection questions only make sense for stable support.
  // On every branch change, erase hidden confirmations and preferences.
  let previousGateValue=null;
  const updateProductQuestions=()=>{
    const steady=form.querySelector('input[name="supportNeed"]:checked')?.value==="steady";
    const gateValue=steady
      ? form.querySelector('input[name="canLiftWalker"]:checked')?.value??null
      : null;
    const detailsAllowed=steady&&(gateValue==="yes"||gateValue==="no");
    const gateChanged=previousGateValue!==gateValue;
    form.querySelectorAll("[data-zp-indoor-condition]").forEach(section=>{
      const isGateQuestion=!!section.querySelector('input[name="canLiftWalker"]');
      const show=steady&&(isGateQuestion||detailsAllowed);
      section.hidden=!show;
      // A new support or gate answer must not reuse confirmations for another route.
      if(!show||(gateChanged&&!isGateQuestion)){
        section.querySelectorAll('input[type="radio"],input[type="checkbox"]').forEach(input=>{input.checked=false;});
        section.classList.remove("is-error");
        section.removeAttribute("aria-invalid");
      }
    });
    previousGateValue=gateValue;
  };
  updateProductQuestions();

  let builderStarted=false;
  form.addEventListener("change",(event)=>{
    if(["supportNeed","canLiftWalker"].includes(event.target?.name)) updateProductQuestions();
    const group=event.target?.closest?.("[data-zp-indoor-required]");
    if(group&&val(group.dataset.zpIndoorRequired)){
      group.classList.remove("is-error");
      group.removeAttribute("aria-invalid");
    }
    // After an invalid submission, keep the message in sync with unresolved fields.
    const remaining=requiredGroups().filter(item=>item.classList.contains("is-error"));
    if(!remaining.length){errors.hidden=true;errors.textContent="";}
    else errors.textContent=remaining.length===1
      ?"Doplňte prosím zvýrazněnou otázku."
      :`Doplňte prosím ${remaining.length} zvýrazněné otázky.`;
    if(!builderStarted){builderStarted=true;track("builder_start");}
  });
  const val=(n,f=null)=>form.querySelector(`input[name="${n}"]:checked`)?.value??f;
  // Required questions must be visible, marked and keyboard-focusable on error.
  const requiredGroups=()=>[...form.querySelectorAll("[data-zp-indoor-required]")]
    .filter(group=>!group.hidden&&!group.closest("[hidden]"));
  const validate=()=>{
    const missing=[];
    requiredGroups().forEach(group=>{
      const invalid=!val(group.dataset.zpIndoorRequired);
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
    return `<article class="zp-product-card"><h4>${esc(p.name)}</h4><ul class="zp-facts"><li>výška: ${esc(p.facts.heightCm)} cm</li><li>šířka: ${esc(p.facts.widthCm)} cm</li><li>hmotnost: ${esc(p.facts.weightKg)} kg</li><li>nosnost: ${esc(p.facts.maxUserWeightKg)} kg</li></ul>${allow?renderMobilityProductFitGate(`<div class="zp-offer"><small class="zp-affiliate-policy">Výběr produktu se neřídí výší provize.</small><strong>${esc(offer.merchantName)}</strong><a class="zp-link-btn" data-zp-indoor-merchant-link="1" href="${esc(url)}" target="_blank" rel="${affiliateUrl?"noopener nofollow sponsored":"noopener nofollow"}">${affiliateUrl?"Zobrazit cenu a dostupnost":"Zobrazit produkt a dostupnost"}</a></div>`,{requireBrakeFit:p.solutionFamily==="rollator",requireTransportFit:!!form.querySelector('input[name="transportNeed"]:checked')}):""}</article>`;
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

    const freeGuide=(out.status==="outside_current_slice"||(out.status==="needs_more_info"&&out.missing?.includes("supportNeed")))
      ? '<p class="zp-disclaimer">Pokud jde spíš o lehkou oporu nebo si nejste jistí typem pomůcky, začněte bez nákupu: <a class="zp-text-link" href="/bezpecny-byt-pro-seniora/">Projít bezpečnost trasy doma</a>.</p>' : "";
    // The next action belongs to the actual unanswered or blocked question.
    const blockedReason = out.status==="outside_current_slice"
      ? "Lehká opora nemusí vyžadovat chodítko. Nejprve prověřte bezpečnost chůze doma a případnou pomůcku konzultujte s odborníkem."
      : out.status==="professional_check"
        ? "Pokud při chůzi běžně pomáhá druhá osoba, konkrétní chodítko nevybírejte pouze online. Nejdřív ověřte vhodnou podporu s odborníkem."
        : out.missing?.includes("supportNeed")
          ? "Nejdřív zjistěte, jakou oporu člověk potřebuje. Bez této informace nelze bezpečně vybrat typ chodítka."
          : "Nejdřív ověřte, zda člověk zvládne při každém kroku nadzvednout celé chodítko. Podle toho se liší vhodný typ konstrukce.";
    const next = getMobilityNextSteps(out);
    const nextMarkup = next.canCompareAcquisition
      ? '<section class="zp-acquisition-summary"><h3>Jak chodítko získat</h3><p>Než výrobek koupíte, porovnejte také půjčení a možnost úhrady.</p><div>' + next.items.map(item => '<article><h4>' + esc(item.label) + '</h4><p>' + esc(item.reason) + '</p><a class="zp-link-btn" href="' + esc(item.href) + '">' + esc(item.action) + '</a></article>').join("") + '</div></section>'
      : '<section class="zp-acquisition-summary"><h3>Jak bezpečně pokračovat</h3><p>' + esc(blockedReason) + '</p><button type="button" class="zp-link-btn" data-zp-edit-answers="1">Upravit odpovědi</button></section>';
    result.innerHTML=`<h2>${esc(out.headline)}</h2><p>${esc(out.nextStep)}</p>${products.length?`<div class="zp-product-grid">${products.map(p=>render(p,out.status==="candidate")).join("")}</div>`:""}${out.disclaimer?`<p class="zp-disclaimer">${esc(out.disclaimer)}</p>`:""}${freeGuide}${nextMarkup}`;
    result.querySelector("[data-zp-edit-answers]")?.addEventListener("click", () => {
      form.scrollIntoView({ block: "start" });
      const questionName=val("supportNeed")==="steady"?"canLiftWalker":"supportNeed";
      const selected=form.querySelector('input[name="'+questionName+'"]:checked');
      const target=selected||form.querySelector('input[name="'+questionName+'"]');
      if(target&&!target.closest("[hidden]")) target.focus();
    });
    result.querySelectorAll("[data-zp-indoor-merchant-link]").forEach((link)=>link.addEventListener("click",()=>{track("product_click");track("merchant_click");},{once:true}));
    track("builder_complete");
    if(out.status==="candidate"&&products.length) track("recommendation_view");
    result.hidden=false;result.focus();
  });
}
