// ZP_RELEASE_0_8_122
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

  // Hide model-specific questions outside the stable-support branch.
  // Old model answers must never be reused after the situation changes.
  let previousGateValue=null;
  const updateProductQuestions=()=>{
    const steady=form.querySelector('input[name="supportNeed"]:checked')?.value==="steady";
    const gateValue=steady
      ? form.querySelector('input[name="handBrakes"]:checked')?.value??null
      : null;
    const detailsAllowed=steady&&(gateValue==="yes");
    const gateChanged=previousGateValue!==gateValue;
    form.querySelectorAll("[data-zp-roll-condition]").forEach(section=>{
      const isGateQuestion=!!section.querySelector('input[name="handBrakes"]');
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
    if(["supportNeed","handBrakes"].includes(event.target?.name)) updateProductQuestions();
    const group=event.target?.closest?.("[data-zp-roll-required]");
    if(group&&val(group.dataset.zpRollRequired)){
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
  const requiredGroups=()=>[...form.querySelectorAll("[data-zp-roll-required]")]
    .filter(group=>!group.hidden&&!group.closest("[hidden]"));
  const validate=()=>{
    const missing=[];
    requiredGroups().forEach(group=>{
      const invalid=!val(group.dataset.zpRollRequired);
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
    return `<article class="zp-product-card"><h4>${esc(p.name)}</h4><ul class="zp-facts"><li>výška: ${esc(p.facts.heightCm)} cm</li><li>šířka: ${esc(p.facts.widthCm)} cm</li><li>nosnost: ${esc(p.facts.maxUserWeightKg)} kg</li></ul>${allow?renderMobilityProductFitGate(`<div class="zp-offer"><small class="zp-affiliate-policy">Výběr produktu se neřídí výší provize.</small><strong>${esc(offer.merchantName)}</strong><a class="zp-link-btn" data-zp-rollator-merchant-link="1" href="${esc(url)}" target="_blank" rel="${affiliateUrl?"noopener nofollow sponsored":"noopener nofollow"}">${affiliateUrl?"Zobrazit cenu a dostupnost":"Zobrazit produkt a dostupnost"}</a></div>`,{requireBrakeFit:p.solutionFamily==="rollator",requireSeatFit:!!form.querySelector('input[name="seatNeeded"]:checked'),requireTransportFit:!!form.querySelector('input[name="transportNeed"]:checked')}):""}</article>`;
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

    const freeGuide=(out.status==="outside_current_slice"||(out.status==="needs_more_info"&&out.missing?.includes("supportNeed")))
      ? '<p class="zp-disclaimer">U lehké nebo nejasné potřeby opory začněte bez nákupu: <a class="zp-text-link" href="/bezpecny-byt-pro-seniora/">Projít kontrolu bezpečné domácnosti</a>.</p>'
      : "";
    // Explain the *actual* reason this branch did not select a product.
    // Light support is not evidence of a brake problem or physical assistance.
    const blockedReason = out.status==="outside_current_slice"
      ? "Lehká opora sama o sobě není důvodem k výběru rollátoru. Nejdřív ověřte, jaký druh opory člověk skutečně potřebuje."
      : out.status==="professional_check"
        ? "Pokud při chůzi běžně pomáhá další osoba, nejprve ověřte vhodný způsob pohybu s odborníkem. Rollátor nevybírejte jen podle ceny."
        : out.missing?.includes("supportNeed")
          ? "Nejdřív upřesněte, kolik opory člověk potřebuje. Dokud to není jasné, konkrétní model nevybíráme."
          : val("handBrakes")==="no"
            ? "Pokud člověk ruční brzdy bezpečně nezvládá, brzděný rollátor není vhodné vybírat bez odborného posouzení jiné možnosti."
            : "Nejdřív ověřte, že člověk bezpečně zvládá používat a zajistit brzdy. Bez tohoto potvrzení konkrétní rollátor nevybíráme.";
    const next = getMobilityNextSteps(out);
    const nextMarkup = next.canCompareAcquisition
      ? '<section class="zp-acquisition-summary"><h3>Jak rollátor získat</h3><p>Než výrobek koupíte, porovnejte také půjčení a možnost úhrady.</p><div>' + next.items.map(item => '<article><h4>' + esc(item.label) + '</h4><p>' + esc(item.reason) + '</p><a class="zp-link-btn" href="' + esc(item.href) + '">' + esc(item.action) + '</a></article>').join("") + '</div></section>'
      : '<section class="zp-acquisition-summary"><h3>Jak bezpečně pokračovat</h3><p>' + esc(blockedReason) + '</p><button type="button" class="zp-link-btn" data-zp-edit-answers="1">Upravit odpovědi</button></section>';
    result.innerHTML=`<h2>${esc(out.headline)}</h2><p>${esc(out.nextStep)}</p>${products.length?`<div class="zp-product-grid">${products.map(p=>render(p,out.status==="candidate")).join("")}</div>`:""}${out.status==="candidate"?'<p><a class="zp-text-link" href="/choditko-na-pojistovnu/">Prověřit cestu přes pojišťovnu</a></p>':""}${out.disclaimer?`<p class="zp-disclaimer">${esc(out.disclaimer)}</p>`:""}${freeGuide}${nextMarkup}`;
    result.querySelector("[data-zp-edit-answers]")?.addEventListener("click", () => {
      form.scrollIntoView({ block: "start" });
      const questionName=val("supportNeed")==="steady"?"handBrakes":"supportNeed";
      const selected=form.querySelector('input[name="'+questionName+'"]:checked');
      const target=selected||form.querySelector('input[name="'+questionName+'"]');
      if(target&&!target.closest("[hidden]")) target.focus();
    });
    result.querySelectorAll("[data-zp-rollator-merchant-link]").forEach((link)=>link.addEventListener("click",()=>{track("product_click");track("merchant_click");},{once:true}));
    track("builder_complete");
    if(out.status==="candidate"&&products.length) track("recommendation_view");
    result.hidden=false;result.focus();
  });
}
