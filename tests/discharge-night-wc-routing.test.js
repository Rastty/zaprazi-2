import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = path => readFileSync(new URL("../"+path, import.meta.url), "utf8");
const hospital=read("page-otazky-pred-propustenim-z-nemocnice.php");
const returnHome=read("page-navrat-z-nemocnice.php");
const night=read("page-nocni-cesta-z-postele-na-wc.php");
const chair=read("page-toaletni-zidle-pro-seniory.php");

test("pre-discharge checklist routes a first-night WC need to existing help, not a merchant",()=>{
  const start=hospital.indexOf('id="wc-prvni-noc"');
  const end=hospital.indexOf("</article>",start);
  assert.ok(start>0 && end>start,"Dedicated first-night WC anchor is missing");
  const section=hospital.slice(start,end);
  assert.match(section,/Noční cesta z postele na WC/);
  assert.match(section,/bezpečně vstát, projít k toaletě/);
  assert.match(section,/fyzické zvedání|nejistý/);
  assert.match(section,/Samotná toaletní židle neřeší nebezpečný přesun/);
  for(const path of ["/nocni-cesta-z-postele-na-wc/#nocni-audit","/toaletni-zidle-pro-seniory/#poradce-toaletni-zidle"]){
    assert.ok(section.includes("home_url( '"+path+"' )"),"Missing safe onward route "+path);
  }
  assert.doesNotMatch(section,/href="https?:\/\/|merchant-link|affiliate|data-zp-offer|ePoukaz.*hradí/i);
  assert.equal((hospital.match(/id="wc-prvni-noc"/g)||[]).length,1,"Duplicate jump target");
  assert.equal((hospital.match(/<h1[ >]/g)||[]).length,1,"Editorial page must have one H1");
});

test("care journey closes the reciprocal loop with the pre-discharge first-night checklist",()=>{
  const link="/otazky-pred-propustenim-z-nemocnice/#wc-prvni-noc";
  assert.ok(returnHome.includes("home_url( '"+link+"' )"),"Return-home journey lacks hospital handoff");
  assert.ok(night.includes("home_url( '"+link+"' )"),"Unsafe night route lacks hospital handoff");
  assert.match(night,/Pokud návrat domů teprve plánujete/);
  assert.match(returnHome,/Ještě před propuštěním vyjasněte hlavně noční přesun/);
  assert.ok(night.includes('id="nocni-audit"'),"Linked night-route checklist missing");
  assert.ok(chair.includes('id="poradce-toaletni-zidle"'),"Linked chair advisor missing");
  assert.doesNotMatch(hospital,/id="zp-return-home-advisor"|affiliateMap|<form\b/i);
});