import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const smoke = readFileSync(new URL("./production-advisor-smoke.mjs", import.meta.url), "utf8");

test("all 14 production Advisors check full URL privacy after keyboard submit and practical answer", () => {
  const rows = [...smoke.matchAll(/^\s*\["\/[^"]*",\s*"#zp-[a-z-]+-advisor",\s*"#zp-[a-z-]+-result"\],?$/gm)];
  assert.equal(rows.length, 14, "Expected 14 production Advisor entry points");
  const start = smoke.indexOf("for (const [path, formSelector, resultSelector] of advisors)");
  const end = smoke.indexOf("// Mobility: model-specific", start);
  assert.ok(start >= 0 && end > start, "All-Advisor browser smoke loop missing");
  const loop = smoke.slice(start, end);
  assert.match(loop, /const originalUrl = page\.url\(\)/);
  assert.match(loop, /await page\.keyboard\.press\("Enter"\)/);
  assert.match(loop, /assert\.equal\(page\.url\(\), originalUrl,[\s\S]*?Empty-answer submit/);
  assert.match(loop, /root\.querySelectorAll\('input\[type="radio"\]'\)/);
  assert.match(loop, /radio\.click\(\)/);
  assert.match(loop, /assert\.equal\(selectedFirstAnswer, true/);
  assert.match(loop, /assert\.equal\(page\.url\(\), originalUrl,[\s\S]*?Changing Advisor answer/);
  assert.match(loop, /await checkNoMerchant\(page, resultSelector\)/);
  assert.doesNotMatch(loop, /new URL\(page\.url\(\)\)\.pathname/,
    "Pathname-only assertions cannot detect leaked query/fragment answers");
});
