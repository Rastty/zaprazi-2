import test from "node:test";
import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";
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
      ?'<section id="ceny"><p class="zp-stale-evidence">Starší ceny, ověřte u půjčovny</p>'+
        '<dl>'+["historicky 12 Kč / den","historicky 360 Kč","historicky 1 000 Kč",
          "historicky 10 Kč / den","historicky 300 Kč",
          "ověřit u půjčovny (starší příklad: 1 000 Kč)",
          "historicky 250 Kč","historicky 600 Kč","historicky 1 000 Kč"]
          .map(v=>'<dd>'+v+'</dd>').join("")+'</dl></section>'+
        '<section><p>Přepočet není k dispozici</p><p>historicky 360 Kč</p>'+
        '<p>Historické příklady, nikoli aktuální nabídka</p></section>'
      :'<section><form id="zp-walker-rental-budget"></form></section>');
  const labels=["Nejužší průchod","Místo pro otočení","Výška madel",
    "Prahy a podlaha","Brzdy a sedátko","Nosnost a návod","Složení a převoz"];
  const measuring='<section><p>Kontrolní seznam pro rodinu</p>'+ 
    '<h2 id="zp-home-checklist-title">Co si napsat na papír?</h2>'+
    link("/prahy-pro-choditko-a-vozik/#mereni-prahu")+
    '<div class="zp-check-grid" role="list" aria-labelledby="zp-home-checklist-title">'+labels.map((label,i)=>
      '<div role="listitem"><span>'+String(i+1).padStart(2,"0")+'</span><strong>'+label+
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
  assert.throws(()=>assertMobility185UX(broken,"2026-11-06"),/Seven visible home checks|Prahy a podlaha/);
  const replacedTopic=fixtures();
  replacedTopic.measuring=replacedTopic.measuring.replace(
    "<strong>Nosnost a návod</strong>","<strong>Jiný opakovaný bod</strong>");
  assert.throws(()=>assertMobility185UX(replacedTopic,"2026-11-06"),
    /Missing live home checklist topic: Nosnost a návod/);
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
test("0.8.185: home checklist exposes a named seven-item list",()=>{
  const missingList=fixtures();
  missingList.measuring=missingList.measuring.replace('role="list"','role="group"');
  assert.throws(()=>assertMobility185UX(missingList,"2026-11-06"),
    /named list to assistive technology/);
  const missingItem=fixtures();
  missingItem.measuring=missingItem.measuring.replace('role="listitem"','role="presentation"');
  assert.throws(()=>assertMobility185UX(missingItem,"2026-11-06"),
    /Seven visible home checks must be in sequence/);
  const missingLabel=fixtures();
  missingLabel.measuring=missingLabel.measuring.replace('id="zp-home-checklist-title"','id="other-title"');
  assert.throws(()=>assertMobility185UX(missingLabel,"2026-11-06"),
    /accessible heading/);
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

test("0.8.185: all nine expired provider prices and deposits must be visibly historical",()=>{
  const currentRate=fixtures(true);
  currentRate.rental=currentRate.rental.replace("<dd>historicky 300 Kč</dd>","<dd>300 Kč</dd>");
  assert.throws(()=>assertMobility185UX(currentRate,"2026-11-07"),
    /appears current instead of historical/);
  const missingRate=fixtures(true);
  missingRate.rental=missingRate.rental.replace("<dd>historicky 250 Kč</dd>","");
  assert.throws(()=>assertMobility185UX(missingRate,"2026-11-07"),
    /Expected all nine displayed rental rates/);
  const missingWarning=fixtures(true);
  missingWarning.rental=missingWarning.rental.replace('class="zp-stale-evidence"','class="zp-note"');
  assert.throws(()=>assertMobility185UX(missingWarning,"2026-11-07"),
    /visible stale-evidence warning/);
});

test("0.8.185: rendered PHP templates satisfy postdeploy acceptance before and after expiry",()=>{
  const root=fileURLToPath(new URL("../",import.meta.url));
  const render=(template,date)=>{
    const php=[
      'function current_time($format) { return getenv("ZP_TEST_DATE"); }',
      'function get_header() {}',
      'function get_footer() {}',
      'function home_url($path = "") { return "https://zaprazi.cz" . $path; }',
      'function esc_url($url) { return htmlspecialchars($url, ENT_QUOTES, "UTF-8"); }',
      'include "'+template+'";'
    ].join("\n");
    return execFileSync("php",["-r",php],{
      cwd:root,env:{...process.env,ZP_TEST_DATE:date},encoding:"utf8"
    });
  };
  for(const date of ["2026-11-06","2026-11-07"]){
    const pages={
      rental:render("page-pujceni-choditka.php",date),
      measuring:render("page-co-zmerit-pred-vyberem-choditka.php",date)
    };
    assert.equal(assertMobility185UX(pages,date).home_checks,7);
  }
});
