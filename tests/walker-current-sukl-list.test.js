import test from "node:test";
import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const renderAt = date => {
  const php = [
    'function current_time($format) { return getenv("ZP_TEST_DATE"); }',
    'function get_header() {}',
    'function get_footer() {}',
    'function home_url($path = "") { return "https://zaprazi.cz" . $path; }',
    'function esc_url($url) { return htmlspecialchars($url, ENT_QUOTES, "UTF-8"); }',
    'include "page-choditko-na-pojistovnu.php";'
  ].join("\n");
  return execFileSync("php", ["-r",php],{
    cwd:fileURLToPath(new URL("../",import.meta.url)),
    env:{...process.env,ZP_TEST_DATE:date},
    encoding:"utf8"
  });
};

test("November 5005963 amount is verified in final SÚKL PDF, not a generic publication",()=>{
  const october=renderAt("2026-10-31");
  const november=renderAt("2026-11-10");
  assert.match(october,/Úhrada v aktuálním říjnovém seznamu/);
  assert.doesNotMatch(october,/Úhrada v aktuálním listopadovém seznamu/);
  assert.match(november,/Úhrada v aktuálním listopadovém seznamu/);
  assert.match(november,/Listopad 2026: úhrada 3 408 Kč/);
  assert.match(november,/konkrétní řádek ověřen 10\. 11\./);
  assert.match(november,/5005963 · IDEAL ROLLATOR 3061982 · úhrada 3 408 Kč/);
  assert.match(november,/strana 10 z 92/);
  assert.match(november,/sukl313250\/2026/);
  assert.match(november,/ZPSCAU_20261101\.pdf/);
  assert.match(november,/26V01973@SUKLAA\/26D0TU21@SUKLAA/);
  assert.doesNotMatch(november,/nemáme jednotlivý záznam kódu 5005963 pro listopad ověřený/);
  assert.doesNotMatch(november,/Historická úhrada v říjnovém seznamu/);
  assert.match(november,/Úhrada není automatický nárok/);
});

test("December expires the November amount and points to the current official index",()=>{
  const december=renderAt("2026-12-01");
  const january=renderAt("2027-01-05");
  for(const html of [december,january]){
    assert.doesNotMatch(html,/Úhrada v aktuálním listopadovém seznamu/);
    assert.doesNotMatch(html,/Listopad 2026: úhrada 3 408 Kč/);
    assert.match(html,/Historická úhrada v listopadovém seznamu/);
    assert.match(html,/Poslední ověřený záznam už není aktuální/);
    assert.match(html,/Po 30\. 11\. 2026 ji nepovažujte za současný údaj/);
    assert.match(html,/úřední desku SÚKL — Seznamy ZP/);
    assert.match(html,/href="https:\/\/eud\.sukl\.gov\.cz\/pub\/deska\/40000001\/athena\/\?kategorie_id=11"/);
    assert.doesNotMatch(html,/Listopad 2026 — konkrétní řádek ověřen 10\. 11\./);
  }
});

test("new source handoff never invents individual reimbursement or bypasses the Mobility decision",()=>{
  for(const date of ["2026-10-31","2026-11-10","2026-12-01","2027-01-05"]){
    const html=renderAt(date);
    assert.match(html,/Ověřit vhodný typ v poradci/);
    assert.match(html,/Porovnat typy chodítek/);
    assert.match(html,/Úhrada není automatický nárok/);
    assert.match(html,/kód 5005963/);
    assert.match(html,/neprokazuje individuální nárok, konečný doplatek ani vhodnost/);
    assert.doesNotMatch(html,/data-zp-merchant-link|data-zp-offer|localStorage|sessionStorage|<form\b/i);
  }
});
