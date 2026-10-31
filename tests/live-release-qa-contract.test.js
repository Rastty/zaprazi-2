import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {parseThemeRelease,EXPECTED_LIVE_RELEASE} from "../scripts/lib/live-release.mjs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const scripts=[
 "scripts/audit-live-night-wc-navigation.mjs",
 "scripts/audit-live-walker-hub.mjs",
 "scripts/audit-live-wheelchair-doorway.mjs",
 "scripts/audit-live-bed-cost.mjs",
 "scripts/audit-live-legacy-canary-dom.mjs",
 "scripts/audit-live-legacy-5448-dom.mjs",
 "scripts/audit-live-bathroom-measurements.mjs"
];
test("live acceptance expects checked-out WordPress theme release rather than live self-report",()=>{
 const css=read("style.css");
 assert.equal(EXPECTED_LIVE_RELEASE,css.match(/^Version:\s*(\d+\.\d+\.\d+)$/m)[1]);
 assert.equal(parseThemeRelease("/*\nVersion: 1.2.3\n*/"),"1.2.3");
 for(const s of ["Version: next","Version: 1.2.3-beta","Theme without version"])
  assert.throws(()=>parseThemeRelease(s),/Missing or malformed/);
});
test("live acceptance scripts all derive the expected version and keep their safety checks",()=>{
 for(const path of scripts){
  const js=read(path);
  assert.match(js,/import \{ EXPECTED_LIVE_RELEASE \} from "\.\/lib\/live-release\.mjs"/);
  assert.match(js,/EXPECTED_LIVE_RELEASE/);
  assert.doesNotMatch(js,/(?:version|expectedVersion)\s*(?:=|!==|===)\s*["']\d+\.\d+\.\d+["']/,
    "Hardcoded expected release in "+path);
 }
 const helper=read("scripts/lib/live-release.mjs");
 assert.doesNotMatch(helper,/\bfetch\s*\(|wp-json|https?:\/\//);
 for(const path of scripts.slice(0,4))
  assert.match(read(path),/readiness\.release|ready\.release|readyResponse/,
   "Live version comparison missing in "+path);
});

test("PR predeploy override is explicit and never weakens manually dispatched QA",()=>{
 const helper=new URL("../scripts/lib/live-release.mjs",import.meta.url).href;
 const cmd="import {EXPECTED_LIVE_RELEASE} from "+JSON.stringify(helper)+
   "; process.stdout.write(EXPECTED_LIVE_RELEASE);";
 const probe=(event,override)=>execFileSync(process.execPath,["--input-type=module","-e",cmd],{
   env:{...process.env,GITHUB_EVENT_NAME:event,ZP_RELEASE:override},
   encoding:"utf8"
 }).trim();
 assert.equal(probe("pull_request","0.8.149"),"0.8.149",
   "A PR may audit the actual earlier deployed release");
 assert.equal(probe("workflow_dispatch","0.8.149"),EXPECTED_LIVE_RELEASE,
   "Manual postdeploy QA must enforce the source release despite override");
 assert.equal(probe("push","0.8.149"),EXPECTED_LIVE_RELEASE,
   "A push must not bypass source-release checks");
 const workflow=read(".github/workflows/production-advisor-qa.yml");
 assert.match(workflow,/echo "ZP_RELEASE=\$LIVE_VERSION" >> "\$GITHUB_ENV"/);
});

test("scheduled read-only Chrome QA covers all 14 Advisors and enforces deployed release",()=>{
 const workflow=read(".github/workflows/production-advisor-qa.yml");
 const smoke=read("tests/production-advisor-smoke.mjs");
 assert.match(workflow,/schedule:\s*(?:#[^\n]*\n\s*)*- cron: "43 3 \* \* \*"/,
   "Daily production browser check must remain scheduled");
 assert.match(workflow,/permissions:\s*\n\s*contents: read/,
   "Scheduled browser QA needs read-only repository permissions");
 assert.ok(workflow.includes('if [ "${{ github.event_name }}" = "pull_request" ]; then'),
   "Only PRs may override the required source release with the live predeploy version");
 assert.match(workflow,/run: node tests\/production-advisor-smoke\.mjs/,
   "Schedule must execute the real Chromium safety and accessibility smoke");
 const advisorRows=[...smoke.matchAll(/^\s*\["\/[^"]*",\s*"#zp-[a-z-]+-advisor",\s*"#zp-[a-z-]+-result"\],?$/gm)];
 assert.equal(advisorRows.length,14,"Chrome QA must cover all 14 Advisor families");
 assert.match(smoke,/for \(const \[path, formSelector, resultSelector\] of advisors\)/,
   "Every Advisor must be opened and inspected in a real browser");
 assert.match(smoke,/await page\.keyboard\.press\("Enter"\)/,
   "Keyboard submission must be exercised in the browser");
 assert.match(smoke,/await checkNoMerchant\(page, resultSelector\)/,
   "Incomplete answers must not expose merchant links");
});

// A green daily browser smoke must not silently skip the strict acquisition gate.
test("scheduled and manual production QA enforce strict Mobility acquisition acceptance",()=>{
 const workflow=read(".github/workflows/production-advisor-qa.yml");
 assert.match(workflow,/if: github\.event_name != 'pull_request'\s*\n\s*run: node scripts\/audit-live-mobility-acquisition-184\.mjs/,
  "Only PR predeploy may skip strict source-release Mobility acceptance");
 assert.doesNotMatch(workflow,/if: github\.event_name == 'workflow_dispatch'\s*\n\s*run: node scripts\/audit-live-mobility-acquisition-184\.mjs/,
  "Scheduled production QA must not silently skip strict Mobility acceptance");
});
