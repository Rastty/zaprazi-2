import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const workflow=read(".github/workflows/production-advisor-qa.yml");
const audit=read("scripts/audit-live-care-workday-212.mjs");
const source=read("page-jak-vybrat-pecovatelskou-sluzbu.php");

test("0.8.212 care page is accepted by exact-source Chrome only after deploy",()=>{
  assert.match(workflow,/scripts\/audit-live-care-workday-212\.mjs/);
  assert.match(workflow,/tests\/audit-live-care-workday-212\.test\.js/);
  assert.match(workflow,/if: github\.event_name != 'pull_request'\s+env:\s+CHROME_BIN:[^\n]+\s+run: node scripts\/audit-live-care-workday-212\.mjs/);
  assert.match(audit,/GITHUB_EVENT_NAME==="pull_request"/);
  assert.match(audit,/SOURCE_THEME_RELEASE,"0\.8\.212"/);
  assert.match(audit,/EXPECTED_LIVE_RELEASE,SOURCE_THEME_RELEASE/);
  assert.match(audit,/request\.method\(\)==="GET"/);
  assert.match(audit,/target\.origin===ORIGIN/);
  assert.match(audit,/meta\[name="zaprazi-integrity"\]/);
  assert.match(audit,/meta\[name="zaprazi-release"\]/);
  assert.match(audit,/canonical/);
  assert.match(audit,/care\.schedule,4/);
  assert.match(audit,/care\.cards,5/);
  assert.match(audit,/hospital-to-care contextual link/);
  assert.match(audit,/externalRequestsSent:0/);
  assert.match(audit,/affiliateClicks:0/);
  assert.doesNotMatch(audit,/page\.click\(|\.submit\(|method:\s*["']POST["']|fetch\([^)]*,\s*\{[^}]*method:/i);
  assert.ok(source.includes('id="pece-o-rodice-pri-praci"'));
  const syntax=spawnSync(process.execPath,["--check","scripts/audit-live-care-workday-212.mjs"],
    {encoding:"utf8"});
  assert.equal(syntax.status,0,syntax.stderr||"Invalid care Chrome script");
});
