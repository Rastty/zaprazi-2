/**
 * Read-only WCAG 2.2 A/AA axe-core pilot for the deployed Bathroom hub and
 * five Advisors. This is an observational baseline, NOT an accessibility
 * certification or a production release gate until findings are remediated.
 * No site writes, external requests, analytics, merchant clicks or real data.
 */
import assert from "node:assert/strict";
import {accessSync, constants, readFileSync, writeFileSync} from "node:fs";
import {createRequire} from "node:module";
import puppeteer from "puppeteer-core";
import {AXE_TAGS, summarizeAxeRun, countViolations, shouldFailAudit}
  from "./lib/axe-audit-summary.mjs";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const origin = (process.env.ZP_LIVE_ORIGIN || "https://zaprazi.cz").replace(/\/$/, "");
assert.equal(new URL(origin).origin, origin, "Expected exact same-origin audit URL");
const chrome = [process.env.CHROME_BIN, "/usr/bin/google-chrome", "/usr/bin/chromium"]
  .filter(Boolean).find(path => {try {accessSync(path, constants.X_OK); return true;} catch {return false;}});
assert.ok(chrome, "Real Chrome/Chromium is required");

const advisors = [
  {slug: "nastavec-na-wc-pro-seniory", key: "toilet-riser",
    first: {transferAbility: "independent", duration: "long_term"},
    fit: {toiletFit: "yes", feetFlatAtRaisedHeight: "yes", loadFit: "yes"}},
  {slug: "sprchovaci-zidle-pro-seniory", key: "shower-chair",
    first: {transferAbility: "independent", floorStable: "yes", duration: "long_term"},
    fit: {spaceFit: "yes", loadFit: "yes"}},
  {slug: "toaletni-zidle-pro-seniory", key: "toilet-chair",
    first: {chairMode: "nearby", transferAbility: "independent", floorStable: "yes", duration: "long_term"},
    fit: {spaceFit: "yes", loadFit: "yes"}},
  {slug: "madlo-k-wc-pro-seniory", key: "toilet-support",
    first: {transferAbility: "steadying", wallFixing: "unverified", duration: "long_term"},
    fit: {supportFrameFit: "yes", loadFit: "yes"}},
  {slug: "sedatko-do-vany-pro-seniory", key: "bath-transfer",
    first: {transferAbility: "independent", bathTransferIndependent: "yes", duration: "long_term"},
    fit: {bathFit: "yes", loadFit: "yes"}},
  {slug: "koupelna-a-wc", key: "bathroom",
    first: {primaryNeed: "raise_toilet", transferAbility: "independent", duration: "long_term"},
    fit: {toiletFit: "yes", feetFlatAtRaisedHeight: "yes", loadFit: "yes"}}
];
const viewports = [
  {name: "mobile", width: 390, height: 844},
  {name: "desktop", width: 1366, height: 900}
];

const readinessResponse = await fetch(origin + "/wp-json/zaprazi/v1/affiliate-readiness",
  {signal: AbortSignal.timeout(25000)});
assert.equal(readinessResponse.status, 200, "Production readiness endpoint is unavailable");
const readiness = await readinessResponse.json();
assert.equal(readiness.integrity, "ok", "Production integrity gate failed");
assert.ok(readiness.slot_total >= 25, "Missing verified production offer configuration");

const browser = await puppeteer.launch({executablePath: chrome, headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-setuid-sandbox"]});
const scans = [], blockedWrites = [], pageErrors = [];
try {
  for (const spec of advisors) {
    for (const viewport of viewports) {
      const page = await browser.newPage();
      const path = "/" + spec.slug + "/";
      const root = "#zp-" + spec.key;
      const submit = root + "-submit";
      const stage = root + "-fit-stage";
      const resultSelector = root + "-result";
      try {
        await page.setViewport({width: viewport.width, height: viewport.height, deviceScaleFactor: 1});
        page.setDefaultTimeout(16000);
        await page.setRequestInterception(true);
        page.on("request", request => {
          const url = request.url();
          if (request.method() !== "GET") {
            blockedWrites.push({path, method: request.method()});
            return request.abort();
          }
          if (url.startsWith(origin + "/") || url.startsWith("data:") || url.startsWith("about:")) {
            return request.continue();
          }
          return request.abort();
        });
        page.on("pageerror", error => pageErrors.push({path, message: error.message.slice(0, 160)}));
        const response = await page.goto(origin + path, {waitUntil: "networkidle2", timeout: 45000});
        assert.equal(response?.status(), 200, path + " must be available");
        const meta = await page.evaluate(() => ({
          release: document.querySelector('meta[name="zaprazi-release"]')?.content,
          integrity: document.querySelector('meta[name="zaprazi-integrity"]')?.content,
          canonical: document.querySelector('link[rel="canonical"]')?.href
        }));
        assert.equal(meta.release, readiness.release, path + " release mismatch");
        assert.equal(meta.integrity, "ok", path + " integrity mismatch");
        assert.equal(meta.canonical, origin + path, path + " canonical mismatch");
        assert.ok(await page.$(submit), path + " Advisor submit missing");
        await page.addScriptTag({content: axeSource});

        const capture = async state => {
          const result = await page.evaluate(async tags => {
            const report = await window.axe.run(document, {runOnly: {type: "tag", values: tags}});
            // Never transfer DOM snippets, text, attributes or selectors out
            // of Chrome, including for findings classified as incomplete.
            const reduce = findings => findings.map(({id, impact, nodes}) => ({
              id, impact, nodeCount: nodes.length
            }));
            return {violations: reduce(report.violations), incomplete: reduce(report.incomplete)};
          }, AXE_TAGS);
          const summary = summarizeAxeRun({path, viewport: viewport.name, state, result});
          scans.push(summary);
          console.log("AXE", path, viewport.name, state,
            "violations=" + summary.violations.length,
            "incomplete=" + summary.incomplete.length);
        };
        const choose = async (name, value) => {
          const selector = 'input[name="' + name + '"][value="' + value + '"]';
          await page.$eval(selector, input => {
            if (input.closest("[hidden]")) throw new Error("Hidden test fixture field");
            input.click();
          });
        };
        const press = () => page.$eval(submit, button => button.click());
        const waitShown = selector => page.waitForFunction(
          sel => document.querySelector(sel)?.hidden === false, {timeout: 16000}, selector);

        await capture("entry");
        // Real incomplete submit: captures the visible focus/error state, but
        // never infers a user's missing answer from real visitor data.
        await press();
        await capture("incomplete");

        for (const [name, value] of Object.entries(spec.first)) await choose(name, value);
        await press();
        await waitShown(stage);
        for (const [name, value] of Object.entries(spec.fit)) await choose(name, value);
        await press();
        await waitShown(resultSelector);
        assert.equal(await page.$eval(resultSelector, el => el.hidden), false);
        await capture("verified");

        // No test answer may be put into a URL query or submitted over HTTP.
        assert.equal(await page.evaluate(() => location.search), "");
      } finally {
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}

assert.deepEqual(blockedWrites, [], "Unexpected non-GET form/analytics submission");
assert.deepEqual(pageErrors, [], "Unexpected live page JavaScript errors");
const result = {
  kind: "observational-baseline-not-certification",
  release: readiness.release,
  wcagTags: AXE_TAGS,
  expectedScans: 36,
  actualScans: scans.length,
  violationRuleOccurrences: countViolations(scans),
  scans,
  outboundMerchantClicks: 0,
  submittedAnswers: 0
};
if (process.env.ZP_A11Y_RESULT_FILE) {
  writeFileSync(process.env.ZP_A11Y_RESULT_FILE, JSON.stringify(result, null, 2) + "\n");
}
console.log("ZP_BATHROOM_AXE_BASELINE", JSON.stringify({
  release: result.release, scans: result.actualScans,
  violationRuleOccurrences: result.violationRuleOccurrences,
  enforce: process.env.ZP_A11Y_ENFORCE === "1", merchantClicks: 0, postedAnswers: 0
}));
if (shouldFailAudit({scans, enforce: process.env.ZP_A11Y_ENFORCE === "1"})) {
  process.exitCode = 1;
}
