import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const smoke=readFileSync(new URL("./production-advisor-smoke.mjs",import.meta.url),"utf8");
test("postdeploy specialist QA evaluates collections with $$eval (not $eval)",()=>{
  assert.match(smoke,/const sections=await page\.\$\$eval\("\["\+spec\.fieldName\+"\]",nodes=>/);
  assert.match(smoke,/const locked=await page\.\$\$eval\(spec\.result\+" \.zp-fit-locked-offers",/);
  assert.doesNotMatch(smoke,/const sections=await page\.\$eval\(/);
  assert.doesNotMatch(smoke,/const locked=await page\.\$eval\(/);
  assert.match(smoke,/if \(releaseAtLeast\("0\.8\.105"\)\)/);
});
