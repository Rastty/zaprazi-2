/**
 * Exact-source 0.8.191 postdeploy Chrome acceptance: indoor walker to threshold guide.
 * Read-only: no form submissions, merchant clicks, analytics or answer payloads.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import { SOURCE_THEME_RELEASE, EXPECTED_LIVE_RELEASE } from "./lib/live-release.mjs";

if (process.env.GITHUB_EVENT_NAME === "pull_request") {
  throw new Error("0.8.191 exact-source Chrome acceptance is postdeploy-only");
}
if (SOURCE_THEME_RELEASE !== "0.8.191") {
  console.log("NOT_APPLICABLE: threshold handoff acceptance is for 0.8.191");
  process.exit(0);
}
assert.equal(EXPECTED_LIVE_RELEASE, "0.8.191");

const origin = "https://zaprazi.cz";
const target = origin + "/prahy-pro-choditko-a-vozik/#mereni-prahu";
const readinessUrl = origin + "/wp-json/zaprazi/v1/affiliate-readiness";
const response = await fetch(readinessUrl, {
  redirect: "error",
  headers: { Accept: "application/json" },
  signal: AbortSignal.timeout(25000)
});
assert.equal(response.status, 200, "Live readiness must return HTTP 200");
assert.equal(response.url, readinessUrl, "Readiness must not be redirected");
const ready = await response.json();
assert.equal(ready.release, "0.8.191", "0.8.191 is not deployed yet");
assert.equal(ready.integrity, "ok", "Partial production theme");
assert.equal(ready.configured_total, 25, "Missing affiliate configuration");
assert.equal(ready.slot_total, 25, "Affiliate slot inventory changed");

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_BIN || "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"]
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.setRequestInterception(true);
  page.on("request", request => {
    // Only public same-origin GET: no trackers, posts or merchant destinations.
    if (request.method() !== "GET" || new URL(request.url()).origin !== origin) {
      return request.abort();
    }
    return request.continue();
  });

  const fromResponse = await page.goto(origin + "/choditko-do-bytu-pro-seniory/", {
    waitUntil: "domcontentloaded", timeout: 30000
  });
  assert.equal(fromResponse.status(), 200, "Indoor walker article unavailable");
  const from = await page.evaluate(expected => {
    const section = document.getElementById("zp-pruchod-choditko-byt");
    const anchors = [...(section?.querySelectorAll("a[href]") || [])];
    const matching = anchors.filter(a => a.href === expected);
    const link = matching[0];
    const advisor = anchors.some(a =>
      a.hash === "#poradce-choditko-byt" && a.origin === location.origin
    );
    return {
      release: document.querySelector('meta[name="zaprazi-release"]')?.content,
      integrity: document.querySelector('meta[name="zaprazi-integrity"]')?.content,
      h1: document.querySelectorAll("main h1").length,
      section: Boolean(section),
      matches: matching.length,
      linkText: link?.textContent?.trim() || "",
      linkVisible: Boolean(link && link.getClientRects().length &&
        getComputedStyle(link).visibility !== "hidden"),
      isCommerce: Boolean(section?.querySelector(
        "[data-zp-merchant-link], [data-zp-affiliate-target], [data-zp-offer], form"
      )),
      advisor,
      warning: Boolean(section?.textContent?.includes(
        "Ze samotného čísla to bezpečně určit nelze"
      ))
    };
  }, target);
  assert.equal(from.release, "0.8.191", "Stale article template");
  assert.equal(from.integrity, "ok");
  assert.equal(from.h1, 1);
  assert.equal(from.section, true);
  assert.equal(from.matches, 1, "Require exactly one exact threshold handoff");
  assert.match(from.linkText, /Změřit a bezpečně řešit vysoký práh/);
  assert.equal(from.linkVisible, true, "Handoff must be visible");
  assert.equal(from.isCommerce, false, "Guide handoff must not be a merchant CTA");
  assert.equal(from.advisor, true, "Do not replace safe Advisor entry");
  assert.equal(from.warning, true, "Keep the no-false-clearance warning");

  const [toResponse] = await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 30000 }),
    page.click('#zp-pruchod-choditko-byt a[href*="/prahy-pro-choditko-a-vozik/"]')
  ]);
  assert.equal(toResponse.status(), 200, "Threshold guide unavailable");
  assert.equal(page.url(), target, "Handoff changed or leaked URL parameters");
  const to = await page.evaluate(() => {
    const section = document.getElementById("mereni-prahu");
    const reverse = [...document.querySelectorAll("a[href]")].some(a =>
      a.origin === location.origin &&
      a.pathname === "/choditko-do-bytu-pro-seniory/" &&
      a.hash === "#poradce-choditko-byt"
    );
    return {
      release: document.querySelector('meta[name="zaprazi-release"]')?.content,
      integrity: document.querySelector('meta[name="zaprazi-integrity"]')?.content,
      h1: document.querySelectorAll("main h1").length,
      anchor: Boolean(section),
      visible: Boolean(section && section.getClientRects().length &&
        getComputedStyle(section).visibility !== "hidden"),
      checks: section?.querySelectorAll(".zp-check-grid > div").length || 0,
      bothSides: Boolean(section?.textContent?.includes("Výška z obou stran")),
      warning: Boolean(section?.textContent?.includes("Neprovádějte rizikové zkoušky")),
      reverse
    };
  });
  assert.equal(to.release, "0.8.191", "Stale threshold guide");
  assert.equal(to.integrity, "ok");
  assert.equal(to.h1, 1);
  assert.equal(to.anchor, true, "Missing target fragment");
  assert.equal(to.visible, true, "Target must be visible");
  assert.equal(to.checks, 7, "Seven practical threshold checks missing");
  assert.equal(to.bothSides, true);
  assert.equal(to.warning, true);
  assert.equal(to.reverse, true, "Missing safe reciprocal Advisor route");
  console.log("PASS_0_8_191_THRESHOLD_HANDOFF", JSON.stringify({
    release: to.release, link: "/choditko-do-bytu-pro-seniory/ -> /prahy-pro-choditko-a-vozik/#mereni-prahu",
    checks: to.checks, reciprocalAdvisor: true, merchantClicks: 0, personalAnswers: 0
  }));
} finally {
  await browser.close();
}
