/**
 * Read-only WCAG 2.2 A/AA Chrome check of the P0 Mobility journey.
 * Five synthetic UI states x mobile/desktop; never clicks a merchant, sends
 * questionnaire data, exports DOM snippets or follows third-party requests.
 * Incomplete axe rules remain visible uncertainty, not certified compliance.
 */
import assert from "node:assert/strict";
import {accessSync, constants, readFileSync, writeFileSync} from "node:fs";
import {createRequire} from "node:module";
import puppeteer from "puppeteer-core";
import {AXE_TAGS, countViolations} from "./lib/axe-audit-summary.mjs";
import {MOBILITY_VIEWPORTS, summarizeMobilityAxe, shouldFailMobilityAxe}
  from "./lib/mobility-axe-summary.mjs";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const origin = "https://zaprazi.cz";
const chrome = [process.env.CHROME_BIN, "/usr/bin/google-chrome", "/usr/bin/chromium"]
  .filter(Boolean).find(path => {try {accessSync(path, constants.X_OK); return true;} catch {return false;}});
assert.ok(chrome, "Real Chrome required for live axe audit");

const readinessResponse = await fetch(origin + "/wp-json/zaprazi/v1/affiliate-readiness",
  {signal: AbortSignal.timeout(25000)});
assert.equal(readinessResponse.status, 200, "Missing production readiness endpoint");
const readiness = await readinessResponse.json();
assert.equal(readiness.integrity, "ok", "Production integrity must be complete");
assert.equal(readiness.slot_total, 25, "Expected all 25 configured publisher slots");
assert.match(readiness.release, /^0\.8\.\d+$/, "Unexpected production release format");

const browser = await puppeteer.launch({executablePath: chrome, headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]});
const scans = [];
let nonGetAttempts = 0, blockedExternal = 0, pageErrors = 0;
let keyboardChecks = 0;

try {
  for (const viewport of MOBILITY_VIEWPORTS) {
    const page = await browser.newPage();
    try {
      await page.setViewport(viewport === "mobile"
        ? {width: 390, height: 844, deviceScaleFactor: 1}
        : {width: 1366, height: 900, deviceScaleFactor: 1});
      page.setDefaultTimeout(16000);
      await page.setRequestInterception(true);
      page.on("request", request => {
        let allowed = false;
        try {
          const url = new URL(request.url());
          allowed = request.method() === "GET" &&
            (url.origin === origin || url.protocol === "data:" || url.protocol === "about:") &&
            ![...url.searchParams.keys()].some(key =>
              /^(answer|answers|health|diagnosis|patient|supportneed|handbrakes|canliftwalker)$/i.test(key));
        } catch {}
        if (request.method() !== "GET") nonGetAttempts++;
        if (!allowed) blockedExternal++;
        void (allowed ? request.continue() : request.abort("blockedbyclient")).catch(() => {});
      });
      page.on("pageerror", () => pageErrors++);
      const response = await page.goto(origin + "/", {waitUntil: "networkidle2", timeout: 45000});
      assert.equal(response?.status(), 200, "Home Advisor page unavailable");
      const meta = await page.evaluate(() => ({
        release: document.querySelector('meta[name="zaprazi-release"]')?.content,
        integrity: document.querySelector('meta[name="zaprazi-integrity"]')?.content,
        canonical: document.querySelector('link[rel="canonical"]')?.href
      }));
      assert.equal(meta.release, readiness.release, "Inconsistent WordPress release");
      assert.equal(meta.integrity, "ok", "Partial WordPress release");
      assert.equal(meta.canonical, origin + "/", "Unexpected homepage canonical");
      assert.ok(await page.$("#zp-mobility-submit"), "Missing P0 Mobility Advisor");
      if (await page.$("#zp-analytics-deny")) {
        await page.$eval("#zp-analytics-deny", element => element.click());
      }
      await page.addScriptTag({content: axeSource});

      const capture = async state => {
        const result = await page.evaluate(async tags => {
          const axe = await window.axe.run(document, {runOnly: {type: "tag", values: tags}});
          const narrow = items => items.map(({id, impact, nodes}) =>
            ({id, impact, nodeCount: nodes.length}));
          return {violations: narrow(axe.violations), incomplete: narrow(axe.incomplete)};
        }, AXE_TAGS);
        const summary = summarizeMobilityAxe({viewport, state, result});
        scans.push(summary);
        console.log("MOBILITY_AXE", viewport, state,
          "violations=" + summary.violations.length,
          "incomplete=" + summary.incomplete.length);
      };
      const choose = (name, value) => page.$eval(
        `input[name="${name}"][value="${value}"]`, element => {
          if (element.closest("[hidden]")) throw new Error("Hidden synthetic input");
          element.click();
        });
      const submit = () => page.$eval("#zp-mobility-submit", button => button.click());

      const focusedControl = () => page.evaluate(() => {
        const element = document.activeElement;
        const style = getComputedStyle(element);
        return {
          name: element?.getAttribute("name"),
          fitCheck: element?.hasAttribute("data-zp-mobility-fit-confirm"),
          visible: element?.matches(":focus-visible"),
          outlineWidth: Number.parseFloat(style.outlineWidth),
          outlineStyle: style.outlineStyle
        };
      });
      const assertVisibleFocus = (focus, description) => {
        assert.equal(focus.visible, true, `${description} has no visible keyboard focus`);
        assert.notEqual(focus.outlineStyle, "none", `${description} has no focus outline`);
        assert.ok(focus.outlineWidth >= 3, `${description} focus outline is too thin`);
        keyboardChecks++;
      };

      // Real Tab navigation, not element.focus(): one radio per native group.
      let environmentFocus;
      for (let step = 0; step < 70; step++) {
        await page.keyboard.press("Tab");
        environmentFocus = await focusedControl();
        if (environmentFocus.name === "environment") break;
      }
      assert.equal(environmentFocus?.name, "environment", "Mobility radio group unreachable by Tab");
      assertVisibleFocus(environmentFocus, "Environment radio");
      await page.keyboard.press("Tab");
      const supportFocus = await focusedControl();
      assert.equal(supportFocus.name, "supportNeed", "Tab did not reach support need group");
      assertVisibleFocus(supportFocus, "Support need radio");
      await page.keyboard.press("Shift+Tab");
      assert.equal((await focusedControl()).name, "environment", "Shift+Tab skipped environment group");
      keyboardChecks++;

      await capture("entry");
      await submit();
      await capture("incomplete");

      // BESCO WA21: indoor stable support, but cannot repeatedly lift a fixed frame.
      await choose("environment", "indoor");
      await choose("supportNeed", "steady");
      await choose("canLiftWalker", "no");
      await submit();
      await page.waitForSelector("#zp-mobility-result:not([hidden]) .zp-product-card");
      const locked = await page.evaluate(() => {
        const root = document.querySelector("#zp-mobility-result");
        const cards = [...root.querySelectorAll(".zp-product-card")];
        const links = [...root.querySelectorAll("[data-zp-merchant-link]")];
        return {cards: cards.length, model: cards[0]?.querySelector("h4")?.textContent.includes("BESCO WA21"),
          links: links.length, allLocked: links.every(link => Boolean(link.closest("[hidden]"))),
          checks: cards[0]?.querySelectorAll("[data-zp-mobility-fit-confirm]").length};
      });
      assert.equal(locked.cards, 1, "Expected one safe candidate model");
      assert.equal(locked.model, true, "Incorrect candidate identity");
      assert.ok(locked.links >= 1 && locked.allLocked, "Merchant offered before fit confirmation");
      assert.ok(locked.checks >= 3, "Missing fit confirmations");
      await capture("candidate_locked");

      // The product-fit controls must be reachable without a pointer. A single
      // Space-confirmed checkbox must never unlock the merchant link.
      await page.$eval("#zp-mobility-submit", button => button.focus());
      let fitFocus;
      for (let step = 0; step < 35; step++) {
        await page.keyboard.press("Tab");
        fitFocus = await focusedControl();
        if (fitFocus.fitCheck) break;
      }
      assert.equal(fitFocus?.fitCheck, true, "Product-fit confirmations unreachable by Tab");
      assertVisibleFocus(fitFocus, "Product-fit confirmation");
      await page.keyboard.press("Space");
      const partial = await page.evaluate(() => ({
        selected: [...document.querySelectorAll(
          "#zp-mobility-result [data-zp-mobility-fit-confirm]")].filter(input => input.checked).length,
        allMerchantLinksLocked: [...document.querySelectorAll(
          "#zp-mobility-result [data-zp-merchant-link]")].every(link => Boolean(link.closest("[hidden]")))
      }));
      assert.deepEqual(partial, {selected: 1, allMerchantLinksLocked: true},
        "A partial keyboard fit confirmation unlocked the merchant route");
      keyboardChecks++;
      await page.keyboard.press("Space");
      assert.equal(await page.$eval(
        "#zp-mobility-result [data-zp-mobility-fit-confirm]", input => input.checked), false,
      "Keyboard fit confirmation could not be reset");
      keyboardChecks++;

      await page.$$eval("#zp-mobility-result .zp-product-card [data-zp-mobility-fit-confirm]",
        controls => controls.forEach(control => control.click()));
      await page.waitForFunction(() => [...document.querySelectorAll(
        "#zp-mobility-result [data-zp-merchant-link]")].some(link => !link.closest("[hidden]")));
      await capture("candidate_unlocked");

      // Changed safety input must clear the previous merchant route entirely.
      await choose("supportNeed", "person_assist");
      assert.equal(await page.$eval("#zp-mobility-result", el => el.hidden), true,
        "Old product visible after safety input edit");
      await submit();
      await page.waitForSelector("#zp-mobility-result:not([hidden])");
      const blocked = await page.evaluate(() => ({
        cards: document.querySelectorAll("#zp-mobility-result .zp-product-card").length,
        links: document.querySelectorAll("#zp-mobility-result [data-zp-merchant-link]").length,
        search: location.search
      }));
      assert.deepEqual(blocked, {cards: 0, links: 0, search: ""},
        "Professional-check state must not retain offer or private URL data");
      await capture("professional_check");
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}

assert.equal(nonGetAttempts, 0, "Read-only audit attempted non-GET request");
assert.equal(pageErrors, 0, "Live page JavaScript errors");
const enforce = process.env.ZP_MOBILITY_A11Y_ENFORCE === "1";
const report = {
  kind: "mobility-observational-baseline-not-certification",
  release: readiness.release,
  wcagTags: AXE_TAGS,
  expectedScans: 10,
  actualScans: scans.length,
  keyboardChecks,
  violationRuleOccurrences: countViolations(scans),
  scans,
  blockedExternalRequests: blockedExternal,
  outboundMerchantClicks: 0,
  submittedAnswers: 0
};
if (process.env.ZP_MOBILITY_A11Y_RESULT_FILE) {
  writeFileSync(process.env.ZP_MOBILITY_A11Y_RESULT_FILE, JSON.stringify(report, null, 2) + "\n");
}
console.log("ZP_MOBILITY_AXE_BASELINE", JSON.stringify({
  release: report.release, scans: report.actualScans,
  keyboardChecks: report.keyboardChecks,
  violationRuleOccurrences: report.violationRuleOccurrences,
  blockedExternalRequests: report.blockedExternalRequests,
  enforce, outboundMerchantClicks: 0, submittedAnswers: 0
}));
if (shouldFailMobilityAxe({scans, enforce})) process.exitCode = 1;
