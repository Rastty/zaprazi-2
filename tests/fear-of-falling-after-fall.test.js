import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const fall=read("page-senior-spadl-doma.php");
test("fear-of-falling section is an accessible post-fall decision path, not a new medical advisor",()=>{
 assert.match(fall,/id="strach-z-chuze-po-padu"/);
 assert.match(fall,/Senior se po pádu bojí znovu chodit/);
 assert.match(fall,/Nenuťte člověka k chůzi, zvedání ani cvičení/);
 assert.match(fall,/fyzioterapeutem či ergoterapeutem/);
 assert.match(fall,/NICE NG249 \(2025\)/);
 assert.match(fall,/https:\/\/www\.nice\.org\.uk\/guidance\/ng249\/chapter\/recommendations/);
 assert.doesNotMatch(fall.slice(fall.indexOf('id="strach-z-chuze-po-padu"'),fall.indexOf('id="dalsi-krok-pad"')),/data-zp-merchant-link|affiliateKey|data-zp-affiliate-target|<form/);
});
test("three relevant sources provide contextual non-merchant entry to fear guide",()=>{
 for(const path of ["front-page.php","page-bezpecny-byt-pro-seniora.php","page-senior-odmita-choditko.php"]){
  assert.ok(read(path).includes("home_url( '/senior-spadl-doma/#strach-z-chuze-po-padu' )"),"Missing context link "+path);
 }
});
