import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("rental call preparation can be printed without forms, network or storage",()=>{
  const page=read("page-pujceni-choditka.php");
  assert.match(page, /href="#zp-otazky-pujcovna">Připravit telefonát do půjčovny/);
  assert.match(page, /data-zp-paper-print hidden>Vytisknout otázky pro půjčovnu/);
  const start=page.indexOf('<section class="zp-section zp-paper-checklist" data-zp-paper-checklist="walker-rental-call"');
  const end=page.indexOf("</main>",start);
  assert.ok(start>0&&end>start,"Printable worksheet must be inside main");
  const sheet=page.slice(start,end);
  const questions=sheet.match(/<ol class="zp-paper-questions">([\s\S]*?)<\/ol>/)?.[1];
  assert.ok(questions,"Printable worksheet must use the shared print style");
  assert.equal((questions.match(/<li>/g)||[]).length,5);
  for(const topic of ["typ chodítka","rozměry, nosnost, brzdy","celková cena",
    "pomůcku nastaví","vrácení kauce"]){
    assert.ok(questions.toLowerCase().includes(topic),"Missing printable question: "+topic);
  }
  assert.match(sheet,/Vadné brzdy, koncovky nebo nestabilní pomůcku nepoužívejte/);
  assert.match(sheet,/Sedátko rollátoru neopravňuje k převozu/);
  assert.doesNotMatch(sheet,/<form\b|<input\b|<textarea\b|data-zp-merchant-link|data-monthly-price|localStorage|sessionStorage|fetch\s*\(/i);
});

test("existing print helper is enabled for rental page only and remains privacy-safe",()=>{
  const fn=read("functions.php");
  const start=fn.indexOf("function zaprazi_2_family_checklist_print_asset()");
  const end=fn.indexOf("add_action( 'wp_enqueue_scripts', 'zaprazi_2_family_checklist_print_asset', 20 );",start);
  assert.ok(start>0&&end>start);
  const enqueue=fn.slice(start,end);
  assert.match(enqueue,/'pujceni-choditka'/);
  assert.match(enqueue,/assets\/js\/family-checklist-print\.js/);
  const js=read("assets/js/family-checklist-print.js");
  assert.match(js,/\[data-zp-paper-print\]/);
  assert.match(js,/\[data-zp-paper-checklist\]/);
  assert.match(js,/window\.print\(\)/);
  assert.doesNotMatch(js,/fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|navigator\.sendBeacon|dataLayer|gtag\s*\(/);
  const css=read("style.css");
  assert.match(css,/\.zp-paper-checklist\{display:none\}/);
  assert.match(css,/body\.zp-paper-print-mode main > :not\(\.zp-paper-checklist\)\{display:none!important\}/);
  assert.match(css,/\[hidden\]\{display:none!important\}/);
});
