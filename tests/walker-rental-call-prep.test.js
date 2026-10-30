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
