import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

const pages=[
  ["page-nocni-cesta-z-postele-na-wc.php","night-wc"],
  ["page-otazky-pred-propustenim-z-nemocnice.php","hospital-discharge"],
  ["page-co-zmerit-pred-vyberem-choditka.php","walker-measurements"]
];

test("blank printable worksheets never duplicate live article content onscreen",()=>{
  const css=read("style.css");
  assert.match(css,/\.zp-paper-checklist\{display:none\}/);
  assert.match(css,/body\.zp-paper-print-mode \.zp-paper-checklist\s*\{/);
  assert.match(css,/display:block!important/);
  assert.match(css,/body\.zp-paper-print-mode main > :not\(\.zp-paper-checklist\)/);
  for(const [path,id] of pages){
    const page=read(path);
    assert.ok(page.includes('data-zp-paper-checklist="'+id+'"'));
    assert.ok(page.includes('data-zp-paper-print hidden'));
    assert.match(page,/<h1\b/);
  }
});

test("family checklists can be discovered from relevant editorial entry points",()=>{
  const home=read("front-page.php");
  assert.match(home,/Sedm otázek s pracovním listem k vytisknutí/);
  assert.match(home,/Sedm kontrol s pracovním listem k vytisknutí/);
  assert.match(home,/Otevřít sedm měření a prázdný tiskový seznam/);
  for(const slug of ["otazky-pred-propustenim-z-nemocnice",
    "nocni-cesta-z-postele-na-wc","co-zmerit-pred-vyberem-choditka"])
    assert.ok(home.includes("home_url( '/"+slug+"/' )"),"Missing actual destination "+slug);
  assert.match(read("page-bezpecny-byt-pro-seniora.php"),/Sedmibodový návod a seznam k vytisknutí/);
  assert.match(read("page-navrat-z-nemocnice.php"),/Sedm otázek k vytištění před propuštěním/);
  assert.match(read("page-choditka-pro-seniory.php"),/Sedm měření a tiskový seznam před výběrem/);
  for(const path of ["front-page.php","page-bezpecny-byt-pro-seniora.php","page-navrat-z-nemocnice.php","page-choditka-pro-seniory.php"])
    assert.equal((read(path).match(/<h1\b/g)||[]).length,1,"No extra heading "+path);
});
