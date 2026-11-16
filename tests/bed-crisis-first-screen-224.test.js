import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const page=readFileSync(new URL("../page-senior-nemuze-vstat-z-postele.php",import.meta.url),"utf8");
const functions=readFileSync(new URL("../functions.php",import.meta.url),"utf8");

test("bed guide foregrounds actionable and emergency-safe response before browsing aids",()=>{
  const hero=page.match(/<section class="zp-hero">([\s\S]*?)<\/section>/)?.[1];
  assert.ok(hero);
  assert.match(hero,/<h1>Senior nemůže vstát z postele: co udělat a kdy volat pomoc\?<\/h1>/);
  assert.match(hero,/náhlé zhoršení od dlouhodobých obtíží/);
  assert.match(hero,/role="note"[\s\S]*?při akutním ohrožení volejte v ČR 155/);
  assert.match(hero,/<a class="zp-btn" href="#rozhodnuti-vstavani-postel">Co udělat teď podle situace<\/a>/);
  assert.ok(page.includes('id="rozhodnuti-vstavani-postel"'));
  assert.match(functions,/is_page\( 'senior-nemuze-vstat-z-postele' \) \) return 'Senior nemůže vstát z postele: co dělat bezpečně \| Zápraží'/);
});

test("explanatory cards are optional but accessible, all existing anchors and safety paths remain",()=>{
  const start=page.indexOf('id="co-delat-postel"');
  const end=page.indexOf('id="rozhodnuti-vstavani-postel"',start);
  assert.ok(start>0&&end>start);
  const explanation=page.slice(start,end);
  assert.match(explanation,/<details class="zp-fit-help zp-bed-decision-details">/);
  assert.match(explanation,/<summary>Potřebujete nejdřív rozlišit/);
  assert.equal((explanation.match(/<article class="zp-decision-card">/g)||[]).length,4);
  assert.ok(explanation.indexOf("</details>")>explanation.indexOf("<summary>"));
  const actions=page.slice(end,page.indexOf('id="presun-z-postele-na-vozik"',end));
  assert.equal((actions.match(/<article class="zp-decision-card">/g)||[]).length,4);
  assert.ok(actions.indexOf("Náhlé zhoršení")<actions.indexOf("Dlouhodobě nezvládá"));
  assert.match(actions,/155 či 112/);
  for(const id of ["co-delat-postel","rozhodnuti-vstavani-postel","kontroly-postele","pomucky-k-posteli"]){
    assert.equal((page.match(new RegExp('id="'+id+'"','g'))||[]).length,1,id);
  }
  assert.doesNotMatch(explanation+actions,/data-zp-merchant-link|data-zp-affiliate-target|affiliateMap|<form\b/i);
});
