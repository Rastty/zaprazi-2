import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("0.8.112 reported deployment requires exact live release even under PR override", () => {
  const smoke = read("tests/production-advisor-smoke.mjs");
  const workflow = read(".github/workflows/production-advisor-qa.yml");
  assert.match(smoke, /if \(sourceRelease === "0\.8\.112"\) \{/);
  assert.match(smoke, /assert\.equal\(readiness\.release, sourceRelease,/);
  assert.match(smoke, /readiness\.integrity, "ok"/);
  assert.match(smoke, /readiness\.configured_total, readiness\.slot_total/);
  assert.match(smoke, /releaseAtLeast\("0\.8\.112"\)/);
  assert.match(workflow, /pull_request:/);
  assert.match(workflow, /tests\/production-advisor-smoke\.mjs/);
});
