import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

test("retired archive canary keeps a lower bound without blocking legitimate new pages",()=>{
  const source=readFileSync(new URL("../scripts/legacy-5448-predeploy.mjs",import.meta.url),"utf8");
  assert.match(source,/Number\.isInteger\(pageCount\)/);
  assert.match(source,/pageCount<53/);
  assert.doesNotMatch(source,/pageCount!==53|pageCount===53/);
  assert.match(source,/ready\.integrity!=="ok"/);
  assert.match(source,/ready\.configured_total!==25/);
  assert.match(source,/JSON\.stringify\(\{pageCount,release:ready\.release,integrity:ready\.integrity,configured:ready\.configured_total\}\)/);
});
