import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("reported v0.8.116 deployment requires exact production readback",()=>{
  const smoke=read("tests/production-advisor-smoke.mjs");
  const css=read("style.css");
  assert.match(css,/^Version:\s*0\.8\.\d+\s*$/m);
  assert.ok(smoke.includes('if (sourceRelease === "0.8.116") {'));
  assert.ok(smoke.includes("0.8.116 reported deployed but live WordPress release differs"));
  assert.ok(smoke.includes("assert.equal(readiness.release, sourceRelease,"));
  assert.ok(smoke.includes('assert.equal(readiness.integrity, "ok"'));
  assert.ok(smoke.includes('assert.equal(readiness.configured_total, readiness.slot_total'));
  assert.ok(smoke.includes('releaseAtLeast("0.8.116")'));
  assert.ok(smoke.includes("Guide anchor failed to navigate"));
});
