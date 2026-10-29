import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("release source and WordPress constant stay aligned", () => {
  const stylesheet = read("style.css");
  const functions = read("functions.php");
  const cssRelease = stylesheet.match(/^Version:\s*(\d+\.\d+\.\d+)\s*$/m)?.[1];
  const phpRelease = functions.match(/define\(\s*'ZAPRAZI_RELEASE'\s*,\s*'(\d+\.\d+\.\d+)'\s*\)/)?.[1];
  assert.ok(cssRelease, "Missing theme version");
  assert.equal(phpRelease, cssRelease, "PHP release differs from WordPress stylesheet");
});

test("deploy runbook cannot silently require a stale release", () => {
  const runbook = read("docs/NEXT_DEPLOY_SMOKE.md");
  const deployment = read("docs/DEPLOYMENT.md");
  assert.doesNotMatch(runbook, /\b(?:v)?0\.8\.\d+\b/, "Runbook includes a hard-coded historical version");
  for (const marker of [
    "style.css", "functions.php", "main", "dev", "Pull + Deploy",
    "zaprazi-release", "zaprazi-integrity", "affiliate-readiness",
    "configured_total=slot_total", "14 poradců", "Run workflow",
    "production-advisor-smoke.mjs"
  ]) assert.ok(runbook.includes(marker), "Deploy runbook lost required control: " + marker);
  assert.match(runbook, /predeploy/i, "Do not conflate predeploy checks with live acceptance");
  assert.match(runbook, /až po deployi/i, "Postdeploy QA must run after deployment");
  assert.match(runbook, /integrity=partial/, "Runbook must document stop condition");
  assert.match(deployment, /public/, "Repo visibility should be stated from verified GitHub metadata");
  assert.doesNotMatch(deployment, /repo is currently private/i);
});

test("manual production QA enforces source version rather than predeploy live version", () => {
  const workflow = read(".github/workflows/production-advisor-qa.yml");
  const smoke = read("tests/production-advisor-smoke.mjs");
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /github\.event_name.*pull_request/);
  assert.match(workflow, /export ZP_RELEASE="\$LIVE_VERSION"/);
  assert.match(workflow, /node tests\/production-advisor-smoke\.mjs/);
  assert.match(smoke, /const requiredVersion = process\.env\.ZP_RELEASE \|\| sourceRelease;/);
  assert.match(smoke, /assert\.equal\(readiness\.release, requiredVersion/);
});

test("WP release integrity pins exact Mobility safety files, not just reusable release markers", () => {
  const php = read("functions.php");
  assert.ok(php.includes("$critical_git_blobs = array_merge( $bathroom_git_blobs"));
  assert.ok(php.includes("array_keys( $critical_git_blobs )"));
  assert.ok(php.includes("isset( $critical_git_blobs[ $relative_path ] )"));
  for (const path of ["src/mobility/engine.js", "src/mobility/offer-fit-gate.js"]) {
    const bytes = Buffer.from(read(path), "utf8");
    const actual = createHash("sha1")
      .update(Buffer.from("blob " + bytes.length + "\0", "utf8"))
      .update(bytes).digest("hex");
    assert.ok(php.includes("\'" + path + "\' => \'" + actual + "\'"),
      "Missing or stale exact Git blob for " + path);
  }
});
