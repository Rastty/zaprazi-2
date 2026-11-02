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

test("October verified figures expire, with November pointing to the published ZP list only", () => {
  const october=renderAt("2026-10-31");
  const november=renderAt("2026-11-02");
  assert.match(october,/Úhrada v aktuálním říjnovém seznamu/);
  assert.doesNotMatch(october,/Listopadový seznam už SÚKL zveřejnil/);
  assert.match(november,/Historická úhrada v říjnovém seznamu/);
  assert.doesNotMatch(november,/Úhrada v aktuálním říjnovém seznamu/);
  assert.match(november,/Listopadový seznam už SÚKL zveřejnil/);
  assert.match(november,/sukl313250\/2026/);
  assert.match(november,/href="https:\/\/eud\.sukl\.gov\.cz\/pub\/deska\/40000001\/athena\/26V01973@SUKLAA"/);
  assert.match(november,/nemáme jednotlivý záznam kódu 5005963 pro listopad ověřený/);
  assert.match(november,/historický údaj z října 2026, nikoli potvrzená úhrada pro dnešek/);
});

test("December and later never present November list as newly current",()=>{
  const december=renderAt("2026-12-01");
  assert.doesNotMatch(december,/Listopadový seznam už SÚKL zveřejnil/);
  assert.doesNotMatch(december,/Otevřít oficiální listopadový seznam/);
  assert.match(december,/vyberte seznam hrazených prostředků na poukaz platný pro daný měsíc/);
  assert.match(december,/href="https:\/\/eud\.sukl\.gov\.cz\/pub\/deska\/40000001\/athena\/\?kategorie_id=11"/);
  assert.match(december,/Historická úhrada v říjnovém seznamu/);
  assert.doesNotMatch(december,/Úhrada v aktuálním říjnovém seznamu/);
});

test("new source handoff never invents individual reimbursement or bypasses the Mobility decision",()=>{
  for(const date of ["2026-10-31","2026-11-02","2026-12-01"]){
    const html=renderAt(date);
    assert.match(html,/Nejdřív vybrat vhodný typ/);
    assert.match(html,/Úhrada není automatický nárok/);
    assert.match(html,/kód 5005963/);
    assert.match(html,/neprokazuje individuální nárok, konečný doplatek ani vhodnost/);
    assert.doesNotMatch(html,/data-zp-merchant-link|data-zp-offer|localStorage|sessionStorage|<form\b/i);
  }
});
