import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const smoke = readFileSync(new URL("./production-advisor-smoke.mjs", import.meta.url), "utf8");

test("all 14 live Advisors must use actual keyboard Tab navigation to Submit", () => {
  const rows = [...smoke.matchAll(/^\s*\["\/[^"]*",\s*"#zp-[a-z-]+-advisor",\s*"#zp-[a-z-]+-result"\],?$/gm)];
  assert.equal(rows.length, 14);
  assert.match(smoke, /for \(const \[path, formSelector, resultSelector\] of advisors\)/);
  assert.match(smoke, /for \(let tab = 0; tab < 80; tab\+\+\)/);
  assert.match(smoke, /await page\.keyboard\.press\("Tab"\)/);
  assert.match(smoke, /document\.activeElement\?\.matches\(selector \+ ' button\[id\$="-submit"\]'/);
  assert.match(smoke, /document\.activeElement\?\.matches\(":focus-visible"\)/);
  assert.doesNotMatch(smoke, /root\.querySelector\('button\[id\$="-submit"\]'\)\.focus\(\)/);
  assert.match(smoke, /await page\.keyboard\.press\("Enter"\)/);
  assert.match(smoke, /await checkNoMerchant\(page, resultSelector\)/);
});
