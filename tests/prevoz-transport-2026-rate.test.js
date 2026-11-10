import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {execFileSync} from "node:child_process";

const template=readFileSync(new URL("../page-prevoz-seniora-k-lekari.php",import.meta.url),"utf8");
const official="https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/prispevek-na-dopravu-taxi-sluzbou";
const eligibility="https://www.vzp.cz/o-nas/nejcasteji-resite/otazka/mam-narok-na-proplaceni-dopravy-k-lekari";

test("GSC-supported transport landing answers the actual insurance intent immediately",()=>{
  const first=template.slice(template.indexOf('<section class="zp-hero">'),template.indexOf('<section id="urgentni-situace-prevoz"'));
  assert.ok(first.includes('id="rychla-odpoved-prevoz"'),"Direct first-screen answer required");
  assert.match(first,/Rychlá odpověď:/);
  assert.match(first,/zdravotní stav neumožňuje běžnou cestu/);
  assert.match(first,/Příkaz ke zdravotnímu transportu/);
  assert.match(first,/Samotný věk, chybějící auto nebo špatné spojení nárok nezakládají/);
  assert.match(first,/Cestu tam a případnou cestu zpět posuzují lékaři samostatně/);
  assert.ok(first.includes('href="#kdo-vystavuje-prikaz"'));
  assert.ok(first.includes(eligibility),"Up-front answer links to primary source");
  assert.ok(template.includes('id="kdo-vystavuje-prikaz"'));
  assert.equal((template.match(/<h1>/g)||[]).length,1);
  assert.doesNotMatch(first,/<form\b|<input\b|data-zp-merchant-link|data-zp-offer/i);
});

test("2026-only 7.98 CZK/km rate has official source, eligibility and no automatic entitlement",()=>{
  assert.equal((template.match(/7,98 Kč\/km/g)||[]).length,1);
  assert.ok(template.includes(official),"Exact source is VZP, not a merchant or affiliate");
  assert.match(template,/předem musí být zdravotní indikace a souhlas lékaře/i);
  assert.match(template,/soukromým vozidlem řízeným jinou osobou/);
  assert.match(template,/jen uznatelná cesta s pacientem/);
  assert.match(template,/ne libovolné kilometry rodiny/);
  assert.match(template,/2026-12-31/);
  assert.match(template,/Historická sazba 2026 již není aktuální/);
  assert.match(template,/Zde ji proto neuvádíme/);
  assert.match(template,/ověřeno 10\. 11\. 2026/);
  assert.doesNotMatch(template,/automaticky proplatí|každý senior má nárok|zaručený příspěvek/i);
});

test("Year-end PHP gate expires VZP 2026 rate instead of silently suggesting a future one",()=>{
  const assignment=template.match(/\$zp_prevoz_2026_rate_current\s*=\s*([^;]+);/);
  assert.ok(assignment,"Year-bounded live PHP gate missing");
  assert.match(assignment[1],/\$zp_prevoz_date\s*>=\s*'2026-01-01'/);
  assert.match(assignment[1],/\$zp_prevoz_date\s*<=\s*'2026-12-31'/);
  assert.match(template,/<\?php if \( \$zp_prevoz_2026_rate_current \) : \?>/);
  assert.match(template,/<\?php else : \?>[\s\S]*?Historická sazba 2026 již není aktuální/);
  assert.match(template,/<\?php endif; \?>/);
  const values=[
    ["2025-12-31",false],["2026-01-01",true],
    ["2026-11-10",true],["2026-12-31",true],["2027-01-01",false]
  ];
  for(const [date,expected] of values){
    const code="$zp_prevoz_date="+JSON.stringify(date)+"; $zp_prevoz_2026_rate_current="+assignment[1]+"; echo $zp_prevoz_2026_rate_current?'yes':'no';";
    const actual=execFileSync("php",["-r",code],{encoding:"utf8"});
    assert.equal(actual,expected?"yes":"no","Incorrect eligibility date "+date);
  }
});

test("No new indexable route, tracked answer or affiliate override was introduced",()=>{
  assert.match(template,/Template Name: Zápraží — Převoz seniora k lékaři/);
  assert.ok(template.includes('href="#vyber-dopravy"'));
  assert.ok(template.includes('id="vozik-a-schody"'));
  assert.ok(template.includes('id="kontrolni-seznam-prevoz"'));
  assert.ok(template.includes("get_header();"));
  assert.ok(template.includes("get_footer();"));
  assert.ok(!/name="(?:rodne_cislo|diagnoza|health_answer)"/.test(template));
});
