import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const workflow=read(".github/workflows/production-advisor-qa.yml");
const audit=read("scripts/audit-live-rollator-doorway-213.mjs");
const rollator=read("page-rollator-pro-seniory.php");
const hub=read("page-choditka-pro-seniory.php");
const insurance=read("page-choditko-na-pojistovnu.php");
const sitemap=read("src/seo/https-sitemaps.php");

test("Safe doorway caveat recognizes Czech imperative/case but never waives the warning",()=>{
  const section=rollator.split('<section id="rollator-uzke-dvere"')[1]?.split('<section id="rollator-se-sedatkem"')[0];
  assert.ok(section,"Canonical doorway answer must exist");
  const visible=section.replace(/<[^>]+>/g," ");
  // A real production page uses "Ověřte" in a sentence, not lower-case
  // "ověřte"; the previous exact-case check falsely rejected that wording.
  const isNoGuaranteedFit=text=>/nepotvrzuje/i.test(text)&&/ověř(?:te|it|ení)/i.test(text);
  assert.ok(isNoGuaranteedFit(visible),"Actual current safety warning must pass");
  for(const example of [
    "Katalogový rozměr nepotvrzuje průchod. Ověřte skutečný kus.",
    "Údaj nepotvrzuje bezpečnost. Je nutné ověřit rozměry.",
    "Údaj NEPOTVRZUJE bezpečnost a požadujeme ověření."
  ]) assert.ok(isNoGuaranteedFit(example));
  for(const example of [
    "Model se vždy vejde, bezpečný průchod je zaručen.",
    "Ověřte model, vždy projde.",
    "Katalog nepotvrzuje nic dalšího; objednat bez kontroly."
  ]) assert.equal(isNoGuaranteedFit(example),false,"Missing refusal or verification remains blocked");
  assert.ok(audit.includes("noGuaranteedFit:/nepotvrzuje/i.test(text)&&/ověř(?:te|it|ení)/i.test(text)"),
    "Browser checker must use the tested case-insensitive Czech safety clause");
});

test("0.8.213 Chrome acceptance is exact-release, production-only and read-only",()=>{
  assert.match(workflow,/scripts\/audit-live-rollator-doorway-213\.mjs/);
  assert.match(workflow,/tests\/audit-live-rollator-doorway-213\.test\.js/);
  assert.match(workflow,/if: github\.event_name != 'pull_request'\s+env:\s+CHROME_BIN:[^\n]+\s+run: node scripts\/audit-live-rollator-doorway-213\.mjs/);
  assert.match(audit,/GITHUB_EVENT_NAME==="pull_request"/);
  assert.match(audit,/SOURCE_THEME_RELEASE,"0\.8\.213"/);
  assert.match(audit,/EXPECTED_LIVE_RELEASE,SOURCE_THEME_RELEASE/);
  assert.match(audit,/request\.method\(\)==="GET"/);
  assert.match(audit,/u\.origin===ORIGIN/);
  assert.match(audit,/meta\[name="zaprazi-release"\]/);
  assert.match(audit,/meta\[name="zaprazi-integrity"\]/);
  assert.match(audit,/document\.querySelectorAll\("main h1"\)/);
  assert.match(audit,/ROLLATOR_DOORWAY_213_CHROME_PASS/);
  assert.match(audit,/public sitemap lastmod/);
  assert.match(audit,/thirdPartyRequestsSent:0/);
  assert.match(audit,/merchantClicks:0/);
  assert.doesNotMatch(audit,/page\.click\(|\.submit\(|method:\s*["']POST["']|fetch\([^)]*,\s*\{[^}]*method:/i);
  assert.ok(rollator.includes('id="rollator-uzke-dvere"'));
  assert.ok(hub.includes("/rollator-pro-seniory/#rollator-uzke-dvere"));
  assert.ok(insurance.includes("/rollator-pro-seniory/#rollator-uzke-dvere"));
  for(const slug of ["rollator-pro-seniory","choditka-pro-seniory","choditko-na-pojistovnu"])
    assert.ok(sitemap.includes("'"+slug+"' => '2026-11-10T00:00:00+00:00'"));
  const syntax=spawnSync(process.execPath,["--check","scripts/audit-live-rollator-doorway-213.mjs"],
    {encoding:"utf8"});
  assert.equal(syntax.status,0,syntax.stderr||"Invalid postdeploy rollator Chrome script");
});
