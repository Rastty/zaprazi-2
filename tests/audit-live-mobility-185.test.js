import test from "node:test";
import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {assertMobility185UX,assertMobility185PrintAsset,assertMobility185PrintAssetLoaded} from "../scripts/audit-live-mobility-acquisition-184.mjs";

// These are only controlled DOM fixtures. The actual production acceptance
// fetches both published pages after authorized WordPress deployment.
const link=path=>'<a href="https://zaprazi.cz'+path+'">Pokračovat</a>';
function fixtures(expired=false){
  const questions=["Typ a dostupnost","Technická kontrola","Celkové náklady",
    "Předání a zaučení","Vrácení a závady"];
  const paperQuestions=[
    "1. Máte bezpečně vybraný typ chodítka a kdy bude dostupný?",
    "2. Mohu před převzetím ověřit rozměry, nosnost, nastavení, brzdy, koncovky a technický stav?",
    "3. Jaká je celková cena včetně kauce, dopravy, minimálního účtování a vrácení?",
    "4. Kdo pomůcku nastaví, předá návod ke konkrétnímu modelu a ukáže bezpečné použití?",
    "5. Kdy a jak vrátit pomůcku, za jakých podmínek dostanu zpět kauci a co dělat při závadě nebo poškození?"
  ];
  const rental='<section><div id="zp-otazky-pujcovna" role="region" tabindex="-1" aria-labelledby="otazky-pujcovna-nadpis">'+
    '<ol class="zp-checklist">'+questions.map(q=>'<li>'+q+'</li>').join("")+'</ol>'+
    '<p>Neberte automaticky jiný typ; pomůcku k převozu nepoužívejte.</p>'+
    link("/co-zmerit-pred-vyberem-choditka/#co-zmerit")+link("/#poradce")+
    '</div></section>'+
    '<button data-zp-paper-print hidden>Vytisknout otázky pro půjčovnu</button>'+
    '<section data-zp-paper-checklist="walker-rental-call">'+
    '<ol class="zp-paper-questions">'+paperQuestions.map(q=>'<li>'+q+'</li>').join("")+'</ol>'+
    '<p>Vadné brzdy, koncovky nebo nestabilní pomůcku nepoužívejte.</p>'+
    '</section>'+
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
test("0.8.185: missing or unsafe printable rental sheet fails postdeploy acceptance",()=>{
  const missing=fixtures();
  missing.rental=missing.rental.replace('data-zp-paper-checklist="walker-rental-call"',
    'data-zp-paper-checklist="other"');
  assert.throws(()=>assertMobility185UX(missing,"2026-11-06"),
    /Printable rental call worksheet not deployed/);
  const short=fixtures();
  short.rental=short.rental.replace(/(<section data-zp-paper-checklist="walker-rental-call">[\s\S]*?)<li>5\. Kdy a jak vrátit pomůcku[^<]*<\/li>/,
    "$1");
  assert.throws(()=>assertMobility185UX(short,"2026-11-06"),
    /Printable rental worksheet must include all five questions/);
  const lostReturn=fixtures();
  lostReturn.rental=lostReturn.rental.replace("Kdy a jak vrátit pomůcku",
    "Kdy dostanu kauci");
  assert.throws(()=>assertMobility185UX(lostReturn,"2026-11-06"),
    /Printable rental worksheet missing safety\/return detail/);
  const lostHandover=fixtures();
  lostHandover.rental=lostHandover.rental.replace("návod ke konkrétnímu modelu",
    "obecný návod");
  assert.throws(()=>assertMobility185UX(lostHandover,"2026-11-06"),
    /Printable rental worksheet missing safety\/return detail/);
  const unsafe=fixtures();
  unsafe.rental=unsafe.rental.replace('class="zp-paper-questions">',
    'class="zp-paper-questions"><input name="medical">');
  assert.throws(()=>assertMobility185UX(unsafe,"2026-11-06"),
    /must remain blank and offer-free/);
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

test("0.8.185: live rental print button requires the actual same-origin helper asset",()=>{
  const asset='<script defer src="https://zaprazi.cz/wp-content/themes/zaprazi-2/assets/js/family-checklist-print.js?ver=185"></script>';
  assert.deepEqual(assertMobility185PrintAsset(fixtures().rental+asset),
    {print_helper_script:"present"});
  for(const broken of [
    fixtures().rental,
    fixtures().rental+'<!-- '+asset+' -->',
    fixtures().rental+asset.replace("https://zaprazi.cz","https://other.example"),
    fixtures().rental+asset+asset
  ]){
    assert.throws(()=>assertMobility185PrintAsset(broken),
      /require one live print helper script/);
  }
});

test("0.8.185: published print helper must respond with current release JavaScript",async()=>{
  const asset='<script defer src="https://zaprazi.cz/wp-content/themes/zaprazi-2/assets/js/family-checklist-print.js?ver=185"></script>';
  const html=fixtures().rental+asset;
  const valid='// ZP_RELEASE_0_8_185\n'+
    'const button = document.querySelector("[data-zp-paper-print]");\n'+
    'button.addEventListener("click", () => window.print());\n';
  const stub=(status,body)=>async (url,options)=>{
    assert.equal(url,"https://zaprazi.cz/wp-content/themes/zaprazi-2/assets/js/family-checklist-print.js?ver=185");
    assert.equal(options.redirect,"manual");
    return {status,text:async()=>body};
  };
  assert.deepEqual(await assertMobility185PrintAssetLoaded(html,stub(200,valid)),
    {print_helper_response:"verified_185"});
  await assert.rejects(assertMobility185PrintAssetLoaded(html,stub(404,valid)),
    /not publicly reachable/);
  await assert.rejects(assertMobility185PrintAssetLoaded(html,stub(200,valid.replace("0_8_185","0_8_184"))),
    /stale or does not match/);
  await assert.rejects(assertMobility185PrintAssetLoaded(html,stub(200,valid.replace("data-zp-paper-print","other-selector"))),
    /lacks the printable button handler/);
  await assert.rejects(assertMobility185PrintAssetLoaded(html,stub(200,"")),
    /empty or unexpected content/);
});
