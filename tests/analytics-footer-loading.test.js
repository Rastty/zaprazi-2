import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const php = fs.readFileSync(new URL("../functions.php", import.meta.url), "utf8");
const consent = fs.readFileSync(new URL("../assets/js/analytics-consent.js", import.meta.url), "utf8");

test("optional consent adapter runs from footer after initial HTML rather than blocking head", () => {
  assert.match(php, /wp_enqueue_script\(\s*'zaprazi-analytics-consent',[\s\S]*?'assets\/js\/analytics-consent\.js'[\s\S]*?true \/\/ Footer:/);
  assert.match(php, /wp_add_inline_script\(\s*'zaprazi-analytics-consent',[\s\S]*?'before'/);
});

test("late consent adapter works with ready DOM and stays opt-in", () => {
  assert.match(consent, /document\.readyState === "loading"/);
  assert.match(consent, /DOMContentLoaded/);
  assert.match(consent, /\} else \{\s*initUi\(\);/);
  assert.match(consent, /state !== "granted"/);
  assert.match(consent, /allowedEvents\.has\(eventName\)/);
  assert.doesNotMatch(consent, /supportNeed|diagnosis|transferAbility|weightKg/);
});
