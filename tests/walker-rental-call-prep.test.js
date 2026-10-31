import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("rental page offers a reachable six-point call preparation without inventing prices",()=>{
  const page=read("page-pujceni-choditka.php");
  assert.match(page,/href="#zp-otazky-pujcovna">Připravit telefonát do půjčovny/);
  assert.match(page,/Šest věcí, které ověřte u půjčovny/);
  assert.doesNotMatch(page,/Pět věcí, které ověřte u půjčovny/);
  const start=page.indexOf('<div id="zp-otazky-pujcovna"');
  const end=page.indexOf("</section>",start);
  assert.ok(start>0&&end>start,"Call prep must be inside the existing rental section");
  const section=page.slice(start,end);
  assert.match(section,/role="region" tabindex="-1" aria-labelledby="otazky-pujcovna-nadpis"/,
    "Hash target must be a named, programmatically focusable region for keyboard and screen-reader users");
  assert.match(read("style.css"),/\[id\^="zp-"\][^\n]*scroll-margin-top:/, "Anchor must use existing sticky-header offset");
  assert.match(section,/id="otazky-pujcovna-nadpis"/);
  assert.match(section,/<ol class="zp-checklist">/);
  assert.equal((section.match(/<li>/g)||[]).length,5,"Five short questions must be independently readable");
  for(const heading of ["Typ a dostupnost","Technická kontrola","Celkové náklady","Předání a zaučení","Vrácení a závady"])
    assert.ok(section.includes(heading),"Missing scannable call question: "+heading);
  assert.match(section,/Nic nevyplňujete ani neodesíláte/);
  for(const phrase of ["konkrétního, bezpečně vybraného typu","rozměry, nosnost, nastavení",
    "celková cena","minimálního účtování, kauce, dopravy a vrácení",
    "kdo pomůcku při předání nastaví","za jakých podmínek dostanu zpět kauci",
    "co mám dělat při závadě nebo poškození","Telefonát ani dostupnost modelu nepotvrzují"]){
    assert.ok(section.toLowerCase().includes(phrase.toLowerCase()),"Missing call-prep safeguard: "+phrase);
  }
  assert.match(section,/Pokud při převzetí nefungují brzdy, koncovky nebo je pomůcka nestabilní, nepoužívejte ji/);
  assert.match(section,/požádejte půjčovnu o nápravu/);
  assert.match(section,/předá návod ke konkrétnímu modelu/,
    "Rental handover must request manufacturer instructions for the exact model");
  assert.match(section,/sedátko samo o sobě neznamená, že na pomůcce smíte převážet sedící osobu/);
  assert.match(section,/výslovně dovoluje návod výrobce pro přesný model/);
  assert.match(section,/Pokud návod chybí nebo si nejste jistí, pomůcku k převozu nepoužívejte/);
  assert.ok(section.includes("home_url( '/co-zmerit-pred-vyberem-choditka/#co-zmerit' )"));
  assert.ok(section.includes("home_url( '/#poradce' )"));
  assert.match(read("page-co-zmerit-pred-vyberem-choditka.php"),/id="co-zmerit"/);
  assert.match(read("front-page.php"),/id="poradce"/);
  assert.doesNotMatch(section,/<form|<input|data-zp-offer|data-zp-merchant-link|affiliateMap|localStorage|sessionStorage|fetch\s*\(/i);
});

test("call preparation reuses existing light-on-dark accessible card style",()=>{
  const page=read("page-pujceni-choditka.php");
  assert.match(page,/id="zp-otazky-pujcovna" class="zp-system-empty zp-acquire-checklist"/);
  assert.match(read("style.css"),/\.zp-acquire-checklist\{[^}]*color:var\(--zp-ink\)/);
});

test("dated rental examples do not show historical deposits as current",()=>{
  const page=read("page-pujceni-choditka.php");
  assert.match(page,/\$zp_rental_fresh_through = '2026-11-06'/);
  assert.match(page,/\$zp_rental_today <= \$zp_rental_fresh_through/);
  assert.equal((page.match(/\$zp_rental_is_fresh \? '1 000 Kč' : 'historicky 1 000 Kč'/g)||[]).length,2,
    "Both fixed 1,000 Kč deposits must be marked historical after expiry");
  assert.match(page,/\$zp_rental_is_fresh \? 'typicky 1 000 Kč u ověřených půjčovních položek' : 'ověřit u půjčovny \(starší příklad: 1 000 Kč\)'/);
  assert.doesNotMatch(page,/<dd>1 000 Kč<\/dd>/);
  assert.match(page,/Přepočet není k dispozici/);
});


test("rental price entry and FAQ remain explicitly dated when price evidence expires",()=>{
  const page=read("page-pujceni-choditka.php");
  assert.match(page,/href="#ceny">Příklady cen \(ověřeno 6\. 10\. 2026\)/);
  assert.doesNotMatch(page,/href="#ceny">Aktuální příklady cen/);
  const prices=page.slice(page.indexOf('<section id="ceny"'),page.indexOf('<section id="rozpocet-pujceni-choditka"'));
  assert.match(prices,/href="#zp-otazky-pujcovna">Připravit pět otázek pro půjčovnu/);
  assert.match(page,/id="zp-otazky-pujcovna"/);
  const faq=page.slice(page.indexOf('Rychlá orientace před půjčením.'),page.indexOf('Zdroje cen'));
  assert.equal((faq.match(/if \( ! \$zp_rental_is_fresh \) :/g)||[]).length,2,
    "Both price and deposit FAQs must mark expired evidence");
  assert.equal((faq.match(/Historické příklady, nikoli aktuální nabídka/g)||[]).length,2);
  assert.match(faq,/Ceny a dostupnost ověřte před objednáním/);
  assert.doesNotMatch(prices,/<form|data-zp-offer|data-zp-merchant-link|affiliateMap|localStorage|sessionStorage/i);
});

test("expired source-price evidence and calculator CTA cannot imply a current offer",()=>{
  const page=read("page-pujceni-choditka.php");
  const hero=page.slice(page.indexOf('<section class="zp-hero">'),page.indexOf('<section class="zp-wrap">'));
  assert.match(hero,/\$zp_rental_is_fresh \? 'Spočítat orientační půjčovné' : 'Proč nyní nelze přepočítat starší ceny'/);
  assert.match(page,/if \( \$zp_rental_is_fresh \) :[\s\S]*?<form id="zp-walker-rental-budget"/);
  assert.match(page,/Přepočet není k dispozici/);
  const sources=page.slice(page.indexOf('<p class="zp-kicker">Zdroje cen</p>'));
  assert.equal((sources.match(/if \( ! \$zp_rental_is_fresh \) :/g)||[]).length,2,
    "Both provider source-price paragraphs must carry the same expiry gate as the rental cards");
  assert.equal((sources.match(/Historické příklady, nikoli aktuální nabídka/g)||[]).length,2);
  assert.match(sources,/Čtyřkolové venkovní chodítko 12 Kč\/den/);
  assert.match(sources,/Chodítko 250 Kč\/týden/);
  assert.doesNotMatch(sources,/<form|data-zp-offer|data-zp-merchant-link|affiliateMap|localStorage|sessionStorage/i);
});

test("no-stock rental fallback never treats a different walker as an interchangeable substitute",()=>{
  const page=read("page-pujceni-choditka.php");
  const start=page.indexOf('<h4 id="pujcovna-nema-typ">');
  const end=page.indexOf("</section>",start);
  assert.ok(start>0&&end>start,"Fallback must be visible after call-prep questions");
  const section=page.slice(start,end);
  assert.match(section,/Co když půjčovna nemá bezpečně vybraný typ/);
  assert.match(section,/Neberte automaticky jiný typ/);
  assert.match(section,/skladem nebo levnější/);
  for(const safety of ["znovu ověřit rozměry, nosnost, brzdy","termín dostupnosti správného typu","při nejistotě řešte vhodnost s odborníkem","samotné zapůjčení nepotvrzuje nárok na úhradu"])
    assert.ok(section.includes(safety),"Missing safety or acquisition fallback: "+safety);
  assert.ok(section.includes("home_url( '/choditka-pro-seniory/' )"),"Must return to the existing fit-selection journey");
  assert.ok(section.includes("home_url( '/choditko-na-pojistovnu/' )"),"Must link to the existing reimbursement guide");
  assert.doesNotMatch(section,/<form|<input|data-zp-offer|data-zp-merchant-link|affiliateMap|localStorage|sessionStorage|fetch\s*\(/i);
});

test("expired rental budget explains why calculator is unavailable before presenting historical prices",()=>{
  const page=read("page-pujceni-choditka.php");
  const start=page.indexOf('<section id="rozpocet-pujceni-choditka"');
  const end=page.indexOf('<section class="zp-section">',start);
  assert.ok(start>=0&&end>start,"Budget section must be present");
  const budget=page.slice(start,end);
  assert.match(budget,/\$zp_rental_is_fresh \? 'Kolik může stát půjčení na jeden, tři nebo šest měsíců\?' : 'Proč nyní nepřepočítáváme starší ceny půjčoven\?'/,
    "Heading must describe the disabled calculator when rates expire");
  assert.match(budget,/if \( \$zp_rental_is_fresh \) : \?>Porovnejte násobek ověřené měsíční sazby/);
  assert.match(budget,/else : \?>Starší měsíční sazby již nepřepočítáváme/);
  assert.match(budget,/Nejdřív ověřte aktuální cenu a dostupnost bezpečně vybraného typu přímo u půjčovny/);
  assert.match(budget,/Přepočet není k dispozici/);
  assert.match(budget,/if \( \$zp_rental_is_fresh \) :[\s\S]*?<form id="zp-walker-rental-budget"/);
});
