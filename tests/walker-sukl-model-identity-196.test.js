import test from "node:test";
import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";
const root=fileURLToPath(new URL("../",import.meta.url));
const render=date=>execFileSync("php",["-r",[
  'function current_time($format) { return getenv("ZP_TEST_DATE"); }',
  'function get_header() {}',
  'function get_footer() {}',
  'function home_url($path = "") { return "https://zaprazi.cz" . $path; }',
  'function esc_url($url) { return htmlspecialchars($url, ENT_QUOTES, "UTF-8"); }',
  'include "page-choditko-na-pojistovnu.php";'
].join("\n")],{cwd:root,env:{...process.env,ZP_TEST_DATE:date},encoding:"utf8"});

test("November: manufacturer shared reimbursement code must NOT imply one product identity",()=>{
  const html=render("2026-11-04");
  assert.match(html,/Stejný kód ZP ještě neurčuje přesnou variantu chodítka/);
  assert.match(html,/IDEAL ROLLATOR 3061982/);
  assert.match(html,/ROLLATOR 2 3061982-R/);
  assert.match(html,/07-5005963/);
  assert.match(html,/Samotný kód z pojišťovny tedy nestačí/);
  assert.match(html,/přesné označení vydávaného modelu/);
  assert.match(html,/rozměry nedoplňujte odhadem/);
  assert.match(html,/https:\/\/www\.meyra\.cz\/ctyrkolove-choditko-rollator\.html/);
  assert.match(html,/https:\/\/www\.meyra\.cz\/ctyrkolove-choditko-rollator2\.html/);
  assert.match(html,/kontrola 4\. 11\. 2026/);
  assert.match(html,/Stačí kód SÚKL 5005963 k výběru přesného rollátoru/);
  assert.match(html,/href="#zp-identita-choditka-nadpis"/);
  assert.match(html,/href="#zp-overit-mesicni-seznam"/);
  assert.match(html,/href="https:\/\/zaprazi\.cz\/#poradce"/);
  assert.doesNotMatch(html,/Kód 5005963 jednoznačně určuje výrobek|oba modely mají totožnou úhradu/);
  assert.doesNotMatch(html,/data-zp-merchant-link|data-zp-offer|<form\b|localStorage|sessionStorage/i);
});
test("reimbursement month and older SÚKL amount stay protected in all calendar states",()=>{
  const october=render("2026-10-31"),november=render("2026-11-04"),december=render("2026-12-01");
  assert.match(october,/Úhrada v aktuálním říjnovém seznamu/);
  for(const html of [november,december]){
    assert.match(html,/Historická úhrada v říjnovém seznamu/);
    assert.doesNotMatch(html,/Úhrada v aktuálním říjnovém seznamu/);
    assert.match(html,/neprokazuje individuální nárok/);
    assert.match(html,/ani že je lze zaměnit/);
  }
  assert.match(november,/Listopadový seznam už SÚKL zveřejnil/);
  assert.doesNotMatch(december,/Listopadový seznam už SÚKL zveřejnil/);
});
