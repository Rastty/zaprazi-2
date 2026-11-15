import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=f=>readFileSync(new URL("../"+f,import.meta.url),"utf8");
const mobility=read("page-choditka-pro-seniory.php");
test("support comparison is one coherent safety-first section on canonical walking page",()=>{
  const start=mobility.indexOf('id="hul-nebo-choditko"');
  const end=mobility.indexOf('<section class="zp-section zp-section-soft">',start+1);
  assert.ok(start>0&&end>start,"Comparison section must remain complete after quick decision");
  const section=mobility.slice(start,end);
  assert.match(section,/aria-labelledby="hul-nebo-choditko-nadpis"/);
  for(const word of ["Vycházková hůl","Francouzská berle","Čtyřbodové nebo dvoukolové chodítko","Čtyřkolový rollátor","volejte 155","půjčení","ePoukaz","NHS","VZP","MPSV"])
   assert.ok(section.includes(word),"Missing safety/comparison info "+word);
  assert.doesNotMatch(section,/data-zp-merchant-link|affiliateKey|data-zp-affiliate-target|<form|wp_redirect/);
  assert.ok(!section.includes("automatically eligible"),"No fabricated reimbursement");
});
test("fast type decision is directly below the hero, before long educational comparison",()=>{
  const heroEnd=mobility.indexOf('</section>');
  const quickDecision=mobility.indexOf('id="vyber-typu"');
  const comparison=mobility.indexOf('id="hul-nebo-choditko"');
  assert.ok(heroEnd>0&&heroEnd<quickDecision&&quickDecision<comparison);
  assert.equal((mobility.slice(heroEnd,quickDecision).match(/<section\b/g)||[]).length,1,
    "Only the quick-decision section may open immediately after the hero");
  const decision=mobility.slice(quickDecision,comparison);
  for(const path of ["/choditko-do-bytu-pro-seniory/#poradce-choditko-byt", "/rollator-pro-seniory/#poradce-rollator", "/#poradce"])
    assert.ok(decision.includes(path),"Missing actionable advisor path: "+path);
  assert.match(decision,/class="zp-link-btn"/);
  assert.match(decision,/bezpečn|fyzická pomoc/i);
  assert.doesNotMatch(decision,/data-zp-merchant-link|affiliateKey|data-zp-affiliate-target|<form\b/i);
  assert.equal((mobility.match(/id="vyber-typu"/g)||[]).length,1,"Exactly one jump anchor");
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
