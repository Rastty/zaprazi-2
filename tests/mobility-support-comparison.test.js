import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=f=>readFileSync(new URL("../"+f,import.meta.url),"utf8");
const mobility=read("page-choditka-pro-seniory.php");
test("support comparison is one coherent safety-first section on canonical walking page",()=>{
  const start=mobility.indexOf('id="hul-nebo-choditko"');
  const end=mobility.indexOf('id="vyber-typu"');
  assert.ok(start>0&&end>start,"Comparison must precede product-type navigation");
  const section=mobility.slice(start,end);
  assert.match(section,/aria-labelledby="hul-nebo-choditko-nadpis"/);
  for(const word of ["Vycházková hůl","Francouzská berle","Čtyřbodové nebo dvoukolové chodítko","Čtyřkolový rollátor","volejte 155","Půjčení","půjčení","ePoukaz","NHS","VZP","MPSV"])
   assert.ok(section.includes(word),"Missing safety/comparison info "+word);
  assert.doesNotMatch(section,/data-zp-merchant-link|affiliateKey|data-zp-affiliate-target|<form|wp_redirect/);
  assert.ok(!section.includes("automatically eligible"),"No fabricated reimbursement");
});
test("relevant guides offer focused contextual navigation, never bypass fit-gates",()=>{
 for(const path of ["page-kompenzacni-pomucky-pro-seniory.php","page-co-zmerit-pred-vyberem-choditka.php","page-senior-odmita-choditko.php"]){
   const html=read(path);
   assert.ok(html.includes("home_url( '/choditka-pro-seniory/#hul-nebo-choditko' )"),"Missing comparison inbound "+path);
 }
 assert.match(mobility,/href="#hul-nebo-choditko"/);
 assert.match(mobility,/Kdy už seniorovi nestačí hůl/);
 assert.equal((mobility.match(/<h1\b/g)||[]).length,1);
});
