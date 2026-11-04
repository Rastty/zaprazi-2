import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

test("all-page optional analytics adapter is loaded in the footer, with config directly before it",()=>{
  const php=read("functions.php");
  const block=php.match(/wp_enqueue_script\(\s*'zaprazi-analytics-consent',[\s\S]*?assets\/js\/analytics-consent\.js'[\s\S]*?\n  \);/g)??[];
  assert.equal(block.length,1);
  assert.match(block[0],/\n\s+true \/\/ Nonessential opt-in adapter after the HTML and consent controls\n  \);$/);
  assert.ok(!block[0].includes("\n    false\n"));
  const enqueue=php.indexOf(block[0]);
  const inline=php.indexOf("wp_add_inline_script(\n    'zaprazi-analytics-consent'");
  assert.ok(inline>enqueue,"The config is still attached to enqueued consent script");
  const config=php.slice(inline,php.indexOf("\n  );",inline)+5);
  assert.match(config,/'before'\s*\)/,"Config must execute before the adapter even in footer");
  assert.match(config,/zaprazi_analytics_consent_v1/);
  assert.match(config,/G-WM86QVXVST/);
});
test("consent UI exists before wp_footer(), and adapter starts safely before or after DOMContentLoaded",()=>{
  const footer=read("footer.php");
  const adapter=read("assets/js/analytics-consent.js");
  const wpFooter=footer.indexOf("wp_footer()");
  assert.ok(footer.indexOf('id="zp-analytics-consent"')<wpFooter);
  assert.ok(footer.indexOf('id="zp-analytics-allow"')<wpFooter);
  assert.ok(footer.indexOf('id="zp-analytics-deny"')<wpFooter);
  assert.ok(footer.indexOf('id="zp-analytics-settings"')<wpFooter);
  assert.match(adapter,/document\.readyState === "loading"/);
  assert.match(adapter,/document\.addEventListener\("DOMContentLoaded", initUi/);
  assert.match(adapter,/}\s*else\s*{\s*initUi\(\);/);
  assert.match(adapter,/state !== "granted"/);
  assert.match(adapter,/if \(state === "unknown"\)\s*{\s*showBanner/);
  assert.match(adapter,/clearGaCookies\(\)/);
  assert.match(adapter,/allow_google_signals: false/);
  assert.match(adapter,/allow_ad_personalization_signals: false/);
  assert.doesNotMatch(adapter,/gtag\("event",\s*(?:.*?),\s*{/);
});
test("advisors cannot require analytics to load; code still exposes consent-independent mobility logic",()=>{
  const fn=read("functions.php");
  const adapter=fn.indexOf("'zaprazi-analytics-consent'");
  const mobility=fn.indexOf("'zaprazi-mobility-advisor'");
  assert.ok(adapter!==-1);
  // Generic advisor events are handled through window and are harmless without
  // the listener. Advisor itself is not a hard dependency of the GA4 adapter.
  const advisor=read("assets/js/mobility-advisor.js");
  assert.match(advisor,/zaprazi:analytics/);
  assert.ok(!/window\.gtag\(/.test(advisor));
  const deps=fn.slice(mobility,mobility+1000);
  assert.ok(!/array\(\s*'zaprazi-analytics-consent'\s*\)/.test(deps),
    "Advisor must not wait for analytics permission");
});
test("exact 0.8.195 production Chrome smoke is mandatory after deploy",()=>{
  const workflow=read(".github/workflows/production-advisor-qa.yml");
  const script=read("scripts/audit-live-consent-footer-195.mjs");
  assert.match(workflow,/node scripts\/audit-live-consent-footer-195\.mjs/);
  assert.match(script,/SOURCE_THEME_RELEASE!=="0\.8\.195"/);
  assert.match(script,/EXPECTED_LIVE_RELEASE,"0\.8\.195"/);
  assert.match(script,/GITHUB_EVENT_NAME==="pull_request"/);
  assert.match(script,/"#zp-analytics-deny"/);
  assert.match(script,/page\.click\("main \.zp-hero a\.zp-btn"\)/);
  assert.match(script,/"#poradce #zp-mobility-advisor"/);
  assert.doesNotMatch(script,/method:\s*["']POST["']|window\.gtag\("event"/);
  const parsed=spawnSync(process.execPath,["--check","scripts/audit-live-consent-footer-195.mjs"],
    {encoding:"utf8"});
  assert.equal(parsed.status,0,"Invalid read-only browser test: "+parsed.stderr);
});
