import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
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
