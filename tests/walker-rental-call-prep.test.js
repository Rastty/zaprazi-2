import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("rental page offers a reachable six-point call preparation without inventing prices",()=>{
  const page=read("page-pujceni-choditka.php");
  assert.match(page,/href="#otazky-pujcovna">Připravit telefonát do půjčovny/);
  assert.match(page,/Šest věcí, které ověřte u půjčovny/);
  assert.doesNotMatch(page,/Pět věcí, které ověřte u půjčovny/);
  const start=page.indexOf('<div id="otazky-pujcovna"');
  const end=page.indexOf("</section>",start);
  assert.ok(start>0&&end>start,"Call prep must be inside the existing rental section");
  const section=page.slice(start,end);
  assert.match(section,/aria-labelledby="otazky-pujcovna-nadpis"/);
  assert.match(section,/id="otazky-pujcovna-nadpis"/);
  assert.match(section,/<ol class="zp-checklist">/);
  assert.equal((section.match(/<li>/g)||[]).length,4,"Four short questions must be independently readable");
  for(const heading of ["Typ a dostupnost","Technická kontrola","Celkové náklady","Předání a zaučení"])
    assert.ok(section.includes(heading),"Missing scannable call question: "+heading);
  assert.match(section,/Nic nevyplňujete ani neodesíláte/);
  for(const phrase of ["konkrétního, bezpečně vybraného typu","rozměry, nosnost, nastavení",
    "celková cena","minimálního účtování, kauce, dopravy a vrácení",
    "kdo pomůcku při předání nastaví","Telefonát ani dostupnost modelu nepotvrzují"]){
    assert.ok(section.toLowerCase().includes(phrase.toLowerCase()),"Missing call-prep safeguard: "+phrase);
  }
  assert.ok(section.includes("home_url( '/co-zmerit-pred-vyberem-choditka/#co-zmerit' )"));
  assert.ok(section.includes("home_url( '/#poradce' )"));
  assert.match(read("page-co-zmerit-pred-vyberem-choditka.php"),/id="co-zmerit"/);
  assert.match(read("front-page.php"),/id="poradce"/);
  assert.doesNotMatch(section,/<form|<input|data-zp-offer|data-zp-merchant-link|affiliateMap|localStorage|sessionStorage|fetch\s*\(/i);
});

test("call preparation reuses existing light-on-dark accessible card style",()=>{
  const page=read("page-pujceni-choditka.php");
  assert.match(page,/id="otazky-pujcovna" class="zp-system-empty zp-acquire-checklist"/);
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
  assert.match(prices,/href="#otazky-pujcovna">Připravit čtyři otázky pro půjčovnu/);
  assert.match(page,/id="otazky-pujcovna"/);
  const faq=page.slice(page.indexOf('Rychlá orientace před půjčením.'),page.indexOf('Zdroje cen'));
  assert.equal((faq.match(/if \( ! \$zp_rental_is_fresh \) :/g)||[]).length,2,
    "Both price and deposit FAQs must mark expired evidence");
  assert.equal((faq.match(/Historické příklady, nikoli aktuální nabídka/g)||[]).length,2);
  assert.match(faq,/Ceny a dostupnost ověřte před objednáním/);
  assert.doesNotMatch(prices,/<form|data-zp-offer|data-zp-merchant-link|affiliateMap|localStorage|sessionStorage/i);
});
