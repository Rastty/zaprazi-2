import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const pages=[
  ["page-nocni-cesta-z-postele-na-wc.php","night-wc","Noční cesta z postele na WC"],
  ["page-otazky-pred-propustenim-z-nemocnice.php","hospital-discharge","Otázky před propuštěním z nemocnice"],
  ["page-co-zmerit-pred-vyberem-choditka.php","walker-measurements","Před výběrem chodítka"]
];

test("three evidence-based family checklists are printable without data entry",()=>{
  for (const [path,id,title] of pages) {
    const s=read(path);
    assert.ok(s.includes('data-zp-paper-checklist="'+id+'"'));
    assert.ok(s.includes(title));
    assert.equal((s.match(/data-zp-paper-print\b/g)||[]).length,1);
    assert.equal((s.match(/zp-paper-note-line\b/g)||[]).length,14);
    const block=s.slice(s.indexOf('data-zp-paper-checklist="'+id+'"'));
    assert.equal((block.match(/<li>/g)||[]).length,7);
    assert.match(s,/<button type="button"[^>]*data-zp-paper-print hidden>/);
    assert.match(block,/Nic nezadáváte do webu a nic se neodesílá/);
    assert.match(block,/zp-disclaimer/);
    assert.equal((s.match(/<h1\b/g)||[]).length,1);
    assert.equal((s.match(/<main\b/g)||[]).length,1);
    assert.doesNotMatch(block,/<input\b|<textarea\b|<form\b|data-zp-merchant-link|zp-offer\b/);
  }
});

test("paper print is explicit user gesture, local-only and keeps existing footwear printing",()=>{
  const js=read("assets/js/family-checklist-print.js");
  const css=read("style.css"),fn=read("functions.php");
  assert.match(js,/data-zp-paper-print/);
  assert.match(js,/button\.hidden = false/);
  assert.match(js,/addEventListener\("click"/);
  assert.match(js,/window\.print\(\)/);
  assert.match(js,/addEventListener\("afterprint"/);
  assert.match(css,/body\.zp-paper-print-mode main > :not\(\.zp-paper-checklist\)/);
  assert.match(css,/body\.zp-paper-print-mode > :not\(main\)/);
  assert.match(fn,/function zaprazi_2_family_checklist_print_asset\(\)/);
  assert.match(fn,/assets\/js\/family-checklist-print\.js/);
  assert.match(fn,/assets\/js\/footwear-measurement-print\.js/);
  for(const slug of ["nocni-cesta-z-postele-na-wc","otazky-pred-propustenim-z-nemocnice","co-zmerit-pred-vyberem-choditka"])
    assert.ok(fn.includes("'"+slug+"'"));
  for(const forbidden of [/\bfetch\s*\(/, /\bXMLHttpRequest\b/, /navigator\.sendBeacon/,
    /\blocalStorage\b/, /\bsessionStorage\b/, /\bdocument\.cookie\b/, /\bFormData\b/,
    /\blocation\.(search|hash|href)/, /zaprazi:analytics|affiliateMap|merchant_click/i])
    assert.doesNotMatch(js,forbidden);
  assert.match(js,/ZP_RELEASE_0_8_118/);
});
