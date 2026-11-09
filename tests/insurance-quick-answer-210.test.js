import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const html=readFileSync(new URL("../page-choditko-na-pojistovnu.php",import.meta.url),"utf8");
const heroStart=html.indexOf('<section class="zp-hero">');
const hero=html.slice(heroStart,html.indexOf("</section>",heroStart));

test("Insurance search landing answers before a user needs to read the full guide",()=>{
  assert.match(hero,/Rychlá odpověď:/);
  assert.match(hero,/Některá chodítka mohou být hrazena/);
  assert.match(hero,/Nestačí koupit chodítko v e-shopu a poslat účtenku pojišťovně/);
  assert.match(hero,/href="#rychla-cesta-na-epoukaz"/);
  assert.match(hero,/href="#zp-overit-mesicni-seznam"/);
  for(const id of ["rychla-cesta-na-epoukaz","zp-overit-mesicni-seznam"])
    assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1);
  assert.match(html,/Pokud člověk padá, potřebuje fyzickou pomoc nebo nedokáže bezpečně brzdit/);
});

test("Both official SÚKL FAQ links use the verified working URL",()=>{
  const expected="https://sukl.gov.cz/faq/jaka-jsou-pravidla-pro-predepisovani-a-vydej-zdravotnickych-prostredku-od-1-1-2026/";
  const links=[...html.matchAll(/href="(https:\/\/sukl\.gov\.cz\/faq\/[^"]+)"/g)].map(m=>m[1]);
  assert.ok(links.length>=2);
  assert.ok(links.every(link=>link===expected));
});
