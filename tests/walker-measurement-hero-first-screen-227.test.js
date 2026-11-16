import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const page=read("page-co-zmerit-pred-vyberem-choditka.php");
const css=read("style.css");

test("measurement SERP entry offers seven practical controls and safe choices before long copy",()=>{
  assert.match(page,/<main id="main-content" class="zp-measure-page" tabindex="-1">/);
  assert.equal((page.match(/<h1\b/g)||[]).length,1);
  const hero=page.match(/<section class="zp-hero">([\s\S]*?)<\/section>/)?.[1];
  assert.ok(hero,"Hero must stay independently discoverable");
  assert.match(hero,/class="zp-wrap zp-measure-hero-layout"/);
  assert.match(hero,/class="zp-measure-hero-card" aria-labelledby="zp-measure-hero-list-title"/);
  assert.match(hero,/id="zp-measure-hero-list-title"/);
  const primary=hero.indexOf('<a class="zp-btn" href="#co-zmerit">Projít 7 kroků</a>');
  const advisor=hero.indexOf('data-zp-journey="advisor"');
  const list=hero.indexOf('<ol class="zp-measure-hero-list">');
  assert.ok(primary>=0&&advisor>primary&&list>advisor,
    "Direct seven-step and safe Advisor links must be available before the checklist");
  assert.equal((hero.match(/<li>/g)||[]).length,7);
  for(const label of ["Typ opory a trasa","Výška madel","Dveře a místo k otočení",
    "Podlaha a prahy","Brzdy a sedátko","Nosnost a nastavení","Skládání a převoz"])
    assert.ok(hero.includes(label),"Missing first-screen control: "+label);
  assert.match(hero,/fyzická pomoc další osoby/);
  assert.match(hero,/nejprve řešte s odborníkem/);
  assert.doesNotMatch(hero,/data-zp-merchant-link|data-zp-offer|affiliateMap|<form\b|<input\b/);
});

test("measurement first screen preserves print discovery, downstream anchors and privacy",()=>{
  const hero=page.match(/<section class="zp-hero">([\s\S]*?)<\/section>/)?.[1]??"";
  assert.match(hero,/data-zp-paper-print hidden>Vytisknout seznam pro rodinu/);
  assert.equal((page.match(/data-zp-paper-print hidden/g)||[]).length,1);
  assert.match(hero,/home_url\( '\/#poradce' \)/);
  assert.match(hero,/home_url\( '\/choditka-pro-seniory\/#hul-nebo-choditko' \)/);
  assert.match(hero,/home_url\( '\/rollator-pro-seniory\/#rollator-se-sedatkem' \)/);
  assert.match(hero,/bez ukládání rozměrů či osobních údajů/);
  assert.equal((page.match(/id="co-zmerit"/g)||[]).length,1);
  assert.match(page,/data-zp-paper-checklist="walker-measurements"/);
  assert.match(page,/id="co-po-mereni"/);
});

test("measurement mobile hero replaces globally oversized heading only on this page",()=>{
  assert.match(css,/\.zp-measure-page \.zp-hero\{padding:36px 0 40px\}/);
  assert.match(css,/\.zp-measure-hero-layout\{display:grid;grid-template-columns:minmax\(0,\.94fr\) minmax\(0,1\.06fr\)/);
  assert.match(css,/\.zp-measure-hero-layout h1\{font-size:clamp\(2\.45rem,3\.8vw,3\.6rem\);[^}]*max-width:none/);
  assert.match(css,/@media\(max-width:860px\)\{[\s\S]*?\.zp-measure-hero-layout\{grid-template-columns:1fr/);
  assert.match(css,/@media\(max-width:480px\)\{\.zp-measure-hero-list\{grid-template-columns:1fr/);
  assert.match(css,/\.zp-measure-hero-intro \.zp-hero-actions \.zp-text-link\{[^}]*min-height:44px/);
  assert.match(css,/\.zp-measure-hero-more \.zp-text-link,\.zp-measure-hero-more \.zp-link-btn\{[^}]*min-height:44px/);
});
