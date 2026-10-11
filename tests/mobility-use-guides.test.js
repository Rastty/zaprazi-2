import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const inPage=read("page-choditko-do-bytu-pro-seniory.php");
const outPage=read("page-rollator-pro-seniory.php");

test("two Mobility specialists keep separate safety intent, without new questionnaire or bypass",()=>{
 for(const page of [inPage,outPage]){
  assert.equal((page.match(/<h1\b/g)||[]).length,1);
  assert.equal((page.match(/<main\b/g)||[]).length,1);
  assert.equal((page.match(/<\/main>/g)||[]).length,1);
  assert.equal((page.match(/data-zp-editorial-guide=/g)||[]).length,1);
  assert.match(page,/\/co-zmerit-pred-vyberem-choditka\/#co-zmerit/);
  assert.match(page, /Zdroje ověřeny 11\. 10\. 2026/);
  assert.doesNotMatch(page,/href="https:\/\/(?:ehub|awin|cj|impact)\b/i);
  assert.doesNotMatch(page,/máte nárok na úhradu|klinicky ověřeno/i);
 }
 assert.match(inPage,/data-zp-editorial-guide="indoor-walker"/);
 assert.match(inPage,/role="form"/);
 assert.match(inPage,/id="zp-indoor-walker-advisor"/);
 assert.match(inPage,/name="canLiftWalker"/);
 assert.match(inPage,/Vstávání a usedání u křesla/);
 assert.match(inPage,/Gumové koncovky a upevnění/);
 assert.match(inPage,/South Tees Hospitals NHS/);
 assert.match(outPage,/data-zp-editorial-guide="rollator"/);
 assert.match(outPage,/id="zp-rollator-advisor"/);
 assert.match(outPage,/name="handBrakes"/);
 assert.match(outPage,/provozní i jako parkovací brzda|Rozdíl mezi zpomalením a parkovací brzdou/);
 assert.match(outPage,/modelu MEYRA Ideal Rollator 3061982/);
 assert.match(outPage,/rovný povrch/);
 assert.match(outPage,/Návod|návod výrobce k modelu 3061982/);
 assert.ok(!inPage.includes("data-zp-editorial-guide=\"rollator\""));
 assert.ok(!outPage.includes("data-zp-editorial-guide=\"indoor-walker\""));
});

test("editorial guidance may not pretend to unlock a merchant offer",()=>{
 for(const page of [inPage,outPage]){
  const text=page.match(/<section id="bezpecne-pouziti-[\s\S]*?(?=\n  <section class="zp-section">)/)?.[0];
  assert.ok(text,"New editorial section must be self-contained");
  assert.doesNotMatch(text,/data-zp-merchant-link|zp-offer|data-zp-affiliate|product_click|merchant_click/);
  assert.match(text,/nejde o odbornou individuální revizi|bez doložené individuální odborné revize/);
  assert.match(text,/target="_blank" rel="noopener"/);
 }
});

test("existing editable mobility source paths have not been altered",()=>{
 const run=read("assets/js/indoor-walker-advisor.js");
 const roll=read("assets/js/rollator-advisor.js");
 assert.match(run,/recommendMobility/);
 assert.match(roll,/recommendMobility/);
 assert.match(roll,/handBrakes/);
});
