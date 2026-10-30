import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("ePoukaz waiting path has a real anchor and practical safe alternatives",()=>{
  const page=read("page-choditko-na-pojistovnu.php");
  assert.match(page,/href="#kdyz-cekate-na-epoukaz"/);
  assert.match(page,/id="kdyz-cekate-na-epoukaz"[^>]*aria-labelledby="cekani-na-epoukaz-nadpis"/);
  assert.match(page,/id="cekani-na-epoukaz-nadpis"/);
  const section=page.slice(page.indexOf('id="kdyz-cekate-na-epoukaz"'),page.indexOf('Konkrétní příklad',page.indexOf('id="kdyz-cekate-na-epoukaz"')));
  assert.match(section,/nejdřív se poraďte s ošetřujícím lékařem/);
  assert.match(section,/Půjčení je samostatná cesta, nikoli příslib úhrady/);
  assert.match(section,/předem zakoupené chodítko nelze automaticky zpětně proplatit/i);
  assert.ok(section.includes("home_url( '/pujceni-choditka/' )"));
  assert.ok(section.includes("home_url( '/co-zmerit-pred-vyberem-choditka/#co-zmerit' )"));
  assert.match(read("page-pujceni-choditka.php"),/get_header\(\)/);
  assert.match(read("page-co-zmerit-pred-vyberem-choditka.php"),/id="co-zmerit"/);
  assert.doesNotMatch(section,/data-zp-merchant-link|data-zp-offer|affiliateMap|localStorage|sessionStorage|fetch\(/i);
});

test("waiting guidance retains official source and never promises entitlement or price",()=>{
  const page=read("page-choditko-na-pojistovnu.php");
  const section=page.slice(page.indexOf('id="kdyz-cekate-na-epoukaz"'),page.indexOf('Konkrétní příklad',page.indexOf('id="kdyz-cekate-na-epoukaz"')));
  assert.match(section,/Zápraží nemůže potvrdit nárok ani termín výdeje/);
  assert.match(section,/https:\/\/www\.vzp\.cz\/o-nas\/tiskove-centrum\/otazky-tydne\/proplaceni-choditka/);
  assert.doesNotMatch(section,/\b\d[\d\s]*Kč\b|automaticky hrazené|zaručený termín/i);
});
