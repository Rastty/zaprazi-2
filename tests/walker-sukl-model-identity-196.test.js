import test from "node:test";
import assert from "node:assert/strict";
import {execFileSync,spawnSync} from "node:child_process";
import {readFileSync} from "node:fs";
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
  assert.doesNotMatch(html,/Kód 5005963 jednoznačně určuje výrobek|oba modely mají zaručeně totožnou úhradu/);
  assert.match(html,/Nejde o potvrzení, že oba modely mají totožnou úhradu/);
  assert.doesNotMatch(html,/data-zp-merchant-link|data-zp-offer|<form\b|localStorage|sessionStorage/i);
});
test("October, November and December amount labels preserve model identity and monthly validity",()=>{
  const october=render("2026-10-31"),november=render("2026-11-10"),december=render("2026-12-01");
  assert.match(october,/Úhrada v aktuálním říjnovém seznamu/);
  assert.match(november,/Úhrada v aktuálním listopadovém seznamu/);
  assert.match(november,/Listopad 2026: úhrada 3 408 Kč/);
  assert.match(november,/ZPSCAU_20261101\.pdf/);
  assert.match(december,/Historická úhrada v listopadovém seznamu/);
  assert.match(december,/Poslední ověřený záznam už není aktuální/);
  assert.doesNotMatch(december,/Úhrada v aktuálním listopadovém seznamu/);
  for(const html of [october,november,december]){
    assert.match(html,/neprokazuje individuální nárok/);
    assert.match(html,/či že je lze zaměnit/);
    assert.match(html,/ROLLATOR 2 3061982-R/);
    assert.match(html,/IDEAL ROLLATOR 3061982/);
  }
});

test("0.8.196 Chrome QA is registered as postdeploy-only and never sends visitor answers",()=>{
  const workflow=readFileSync(new URL("../.github/workflows/production-advisor-qa.yml",import.meta.url),"utf8");
  const script=readFileSync(new URL("../scripts/audit-live-insurance-model-identity-196.mjs",import.meta.url),"utf8");
  assert.match(workflow,/scripts\/audit-live-insurance-model-identity-196\.mjs/);
  assert.match(workflow,/tests\/walker-sukl-model-identity-196\.test\.js/);
  assert.match(workflow,/if: github\.event_name != 'pull_request'\s+env:\s+CHROME_BIN:[^\n]+\s+run: node scripts\/audit-live-insurance-model-identity-196\.mjs/);
  assert.match(script,/SOURCE_THEME_RELEASE!=="0\.8\.196"/);
  assert.match(script,/EXPECTED_LIVE_RELEASE,"0\.8\.196"/);
  assert.match(script,/GITHUB_EVENT_NAME==="pull_request"/);
  assert.match(script,/merchantAttempts,0/);
  assert.match(script,/nonGetRequests,0/);
  assert.doesNotMatch(script,/method:\s*["']POST["']|req\.method\(\)==="POST"/);
  const parsed=spawnSync(process.execPath,["--check","scripts/audit-live-insurance-model-identity-196.mjs"],
    {cwd:root,encoding:"utf8"});
  assert.equal(parsed.status,0,"Syntax invalid: "+parsed.stderr);
});
