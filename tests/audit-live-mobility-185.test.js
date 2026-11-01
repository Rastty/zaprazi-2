import test from "node:test";
import assert from "node:assert/strict";
import {assertMobility185UX} from "../scripts/audit-live-mobility-acquisition-184.mjs";

// These are only controlled DOM fixtures. The actual production acceptance
// fetches both published pages after authorized WordPress deployment.
const link=path=>'<a href="https://zaprazi.cz'+path+'">Pokračovat</a>';
function fixtures(expired=false){
  const questions=["Typ a dostupnost","Technická kontrola","Celkové náklady",
    "Předání a zaučení","Vrácení a závady"];
  const rental='<section><div id="zp-otazky-pujcovna" role="region" tabindex="-1" aria-labelledby="otazky-pujcovna-nadpis">'+
    '<ol class="zp-checklist">'+questions.map(q=>'<li>'+q+'</li>').join("")+'</ol>'+
    '<p>Neberte automaticky jiný typ; pomůcku k převozu nepoužívejte.</p>'+
    link("/co-zmerit-pred-vyberem-choditka/#co-zmerit")+link("/#poradce")+
    '</div></section>'+
    (expired
      ?'<section><p>Přepočet není k dispozici</p><p>historicky 360 Kč</p>'+
        '<p>Historické příklady, nikoli aktuální nabídka</p></section>'
      :'<section><form id="zp-walker-rental-budget"></form></section>');
  const labels=["Nejužší průchod","Místo pro otočení","Výška madel",
    "Prahy a podlaha","Brzdy a sedátko","Nosnost a návod","Složení a převoz"];
  const measuring='<section><p>Kontrolní seznam pro rodinu</p>'+
    link("/prahy-pro-choditko-a-vozik/#mereni-prahu")+
    '<div class="zp-check-grid">'+labels.map((label,i)=>
      '<div><span>'+String(i+1).padStart(2,"0")+'</span><strong>'+label+
      '</strong><p>mokrá místa</p></div>').join("")+'</div></section>'+
    '<section><p>Teď zvolte správnou cestu</p></section>';
  return {rental,measuring};
}

test("0.8.185: real rendered UX acceptance covers both sides of price expiry",()=>{
  assert.deepEqual(assertMobility185UX(fixtures(false),"2026-11-06"),{
    rental_call_questions:5,home_checks:7,rental_prices:"within_review_window"
  });
  assert.deepEqual(assertMobility185UX(fixtures(true),"2026-11-07"),{
    rental_call_questions:5,home_checks:7,rental_prices:"expired_fail_closed"
  });
});
test("0.8.185: missing or spoofed rental call questions fail closed",()=>{
  const missing=fixtures();
  missing.rental=missing.rental.replace("<li>Vrácení a závady</li>","");
  assert.throws(()=>assertMobility185UX(missing,"2026-11-06"),/five rental call questions/);
  const comment=fixtures();
  comment.rental=comment.rental.replace('id="zp-otazky-pujcovna"',
    'data-id="zp-otazky-pujcovna"');
  assert.throws(()=>assertMobility185UX(comment,"2026-11-06"),/anchor not deployed/);
  const bypass=fixtures();
  bypass.rental=bypass.rental.replace("</div></section>",
    '<a data-zp-merchant-link href="https://merchant.example/">Buy</a></div></section>');
  assert.throws(()=>assertMobility185UX(bypass,"2026-11-06"),/must not collect answers/);
});
test("0.8.185: missing threshold guidance or a home check blocks release",()=>{
  const broken=fixtures();
  broken.measuring=broken.measuring.replace("<strong>Prahy a podlaha</strong>","");
  assert.throws(()=>assertMobility185UX(broken,"2026-11-06"),/Prahy a podlaha/);
  const linkMissing=fixtures();
  linkMissing.measuring=linkMissing.measuring.replace(
    link("/prahy-pro-choditko-a-vozik/#mereni-prahu"),"");
  assert.throws(()=>assertMobility185UX(linkMissing,"2026-11-06"),
    /Missing safe threshold measuring guidance link/);
  const form=fixtures();
  form.measuring=form.measuring.replace("Teď zvolte správnou cestu",
    '<input name="medical" />Teď zvolte správnou cestu');
  // An input outside the checklist is not in scope; inject inside instead.
  form.measuring=form.measuring.replace("mokrá místa","<input name='health'>mokrá místa");
  assert.throws(()=>assertMobility185UX(form,"2026-11-06"),/must not collect private answers/);
});
test("0.8.185: stale calculator or misleading current-rate CTA blocks postdeploy acceptance",()=>{
  const stale=fixtures(true);
  stale.rental+='<form id="zp-walker-rental-budget"></form>';
  assert.throws(()=>assertMobility185UX(stale,"2026-11-07"),/Expired rental calculator/);
  const staleAttr=fixtures(true);
  staleAttr.rental+='<span data-monthly-price="360"></span>';
  assert.throws(()=>assertMobility185UX(staleAttr,"2026-11-07"),/Expired rates/);
  const currentCTA=fixtures(true);
  currentCTA.rental+='<button>Spočítat orientační půjčovné</button>';
  assert.throws(()=>assertMobility185UX(currentCTA,"2026-11-07"),/Expired rental CTA/);
});
