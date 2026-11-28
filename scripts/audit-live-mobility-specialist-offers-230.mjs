#!/usr/bin/env node
/**
 * Exact-release, read-only Chrome QA for the two specialist Mobility Advisors.
 * Browser-side comparison keeps publisher affiliate destinations out of logs.
 * Never opens merchant URLs or sends form answers to a server.
 */
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { SOURCE_THEME_RELEASE } from "./lib/live-release.mjs";
import { MOBILITY_PRODUCTS } from "../src/mobility/catalog.js";
import { EVIDENCE_FRESHNESS_DAYS, evidenceFreshness } from "../src/evidence/freshness.js";

const ORIGIN = "https://zaprazi.cz";
export const SPECIALISTS = Object.freeze([
  { id: "indoor", path: "/choditko-do-bytu-pro-seniory/",
    form: "zp-indoor-walker-advisor", result: "zp-indoor-walker-result",
    submit: "zp-indoor-walker-submit", link: "data-zp-indoor-merchant-link",
    gateAnswer: "canLiftWalker", gateValue: "no",
    productId: "besco-wa21", required: ["load", "width", "height"] },
  { id: "rollator", path: "/rollator-pro-seniory/",
    form: "zp-rollator-advisor", result: "zp-rollator-result",
    submit: "zp-rollator-submit", link: "data-zp-rollator-merchant-link",
    gateAnswer: "handBrakes", gateValue: "yes",
    productId: "meyra-ideal-3061982", required: ["load", "width", "height", "brakes"] }
]);

export function assertSpecialistOffer(observed, spec, phase, shouldBeStale) {
  assert.equal(observed.cardCount, 1, `${spec.id}: exactly one product card`);
  assert.equal(observed.modelMatches, true, `${spec.id}: incorrect product identity`);
  assert.deepEqual(observed.required, spec.required,
    `${spec.id}: exact model-fit controls missing or weakened`);
  assert.deepEqual(observed.actual, spec.required,
    `${spec.id}: fit checkboxes corrupted or reordered`);
  assert.equal(observed.affiliateCount, 1, `${spec.id}: exact affiliate CTA missing`);
  assert.equal(observed.runtimeMatches, true, `${spec.id}: affiliate slot mismatch`);
  assert.equal(observed.safeAffiliate, true, `${spec.id}: unsafe outbound link attributes`);
  assert.equal(observed.disclosure, true, `${spec.id}: visible partner disclosure missing`);
  assert.equal(observed.suitabilityPolicy, true, `${spec.id}: commission-independence missing`);
  assert.equal(observed.merchantNote, true, `${spec.id}: purchase/insurer note missing`);
  assert.equal(observed.staleWarning, shouldBeStale,
    `${spec.id}: offer freshness warning inconsistent with source evidence`);
  assert.equal(observed.unlocked, phase === "complete",
    `${spec.id}: merchant offer opened before all model checks`);
}

async function observe(page, spec) {
  const model = MOBILITY_PRODUCTS.find(p => p.id === spec.productId);
  assert.ok(model?.offers?.[0]?.affiliateKey, "Verified source affiliate model required");
  return page.evaluate(({ resultId, attr, name, key }) => {
    const root = document.getElementById(resultId);
    const cards = [...root?.querySelectorAll(".zp-product-card") || []];
    const card = cards[0];
    const gate = card?.querySelector(".zp-mobility-fit-gate");
    const offer = gate?.querySelector(".zp-fit-locked-offers");
    const links = [...offer?.querySelectorAll(`a[${attr}]`) || []];
    const link = links[0];
    const rel = (link?.getAttribute("rel") || "").split(/\s+/);
    const configured = window.ZaPraziRuntime?.affiliateMap?.[key];
    return {
      cardCount: cards.length,
      modelMatches: Boolean(card?.querySelector("h4")?.textContent.includes(name)),
      required: gate?.getAttribute("data-zp-fit-required")?.split(",") || [],
      actual: [...gate?.querySelectorAll("[data-zp-mobility-fit-confirm]") || []]
        .map(el => el.getAttribute("data-zp-mobility-fit-confirm")),
      affiliateCount: links.length,
      runtimeMatches: Boolean(link && typeof configured === "string" &&
        configured.startsWith("https://") && link.getAttribute("href") === configured),
      safeAffiliate: Boolean(link && link.getAttribute("target") === "_blank" &&
        ["noopener", "nofollow", "sponsored"].every(token => rel.includes(token))),
      disclosure: Boolean(offer?.querySelector(".zp-affiliate-label")?.textContent
        .includes("Partnerský odkaz")),
      suitabilityPolicy: Boolean(offer?.querySelector(".zp-affiliate-policy")?.textContent
        .includes("neřídí výší provize")),
      merchantNote: Boolean(offer?.querySelector(".zp-offer > p")?.textContent
        .match(/(?:plně hrazen|úhrad|pojišťovn)/i)),
      staleWarning: Boolean(offer?.querySelector(".zp-stale-evidence")?.textContent
        .includes("Nabídka nebyla v posledních 30 dnech znovu ověřena")),
      unlocked: Boolean(offer && !offer.hidden)
    };
  }, { resultId: spec.result, attr: spec.link, name: model.name,
    key: model.offers[0].affiliateKey });
}

async function select(page, name, value) {
  await page.$eval(`input[name="${name}"][value="${value}"]`, el => {
    if (el.closest("[hidden]")) throw new Error("HIDDEN_REQUIRED_QUESTION");
    el.click();
  });
}

export async function auditLiveMobilitySpecialists() {
  const puppeteer = (await import("puppeteer-core")).default;
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BIN || "/usr/bin/google-chrome",
    headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"]
  });
  let nonGet = 0, merchantRequests = 0;
  const checked = [];
  try {
    for (const spec of SPECIALISTS) {
      const page = await browser.newPage();
      try {
        await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
        page.setDefaultTimeout(15000);
        await page.setRequestInterception(true);
        page.on("request", request => {
          let allowed = false;
          try {
            const u = new URL(request.url());
            allowed = u.origin === ORIGIN && request.method() === "GET" &&
              !u.username && !u.password && !u.hash &&
              [...u.searchParams.keys()].every(key => key === "ver");
            if (!allowed && /(?:dpbolvw|ehub|lekarna|rehabilitacni|cj\.com)/i.test(u.hostname))
              merchantRequests++;
          } catch {}
          if (request.method() !== "GET") nonGet++;
          void (allowed ? request.continue() : request.abort("blockedbyclient")).catch(() => {});
        });
        const response = await page.goto(ORIGIN + spec.path,
          { waitUntil: "networkidle2", timeout: 35000 });
        assert.equal(response?.status(), 200, `${spec.id}: HTTP 200 required`);
        assert.equal(page.url(), ORIGIN + spec.path, `${spec.id}: no redirect or query`);
        const meta = await page.evaluate(() => ({
          release: document.querySelector('meta[name="zaprazi-release"]')?.content,
          integrity: document.querySelector('meta[name="zaprazi-integrity"]')?.content
        }));
        assert.equal(meta.release, SOURCE_THEME_RELEASE, `${spec.id}: exact deployed release`);
        assert.equal(meta.integrity, "ok", `${spec.id}: complete deployment integrity`);

        await select(page, "supportNeed", "steady");
        await select(page, spec.gateAnswer, spec.gateValue);
        await page.$eval(`#${spec.submit}`, el => el.click());
        await page.waitForSelector(`#${spec.result}:not([hidden]) .zp-mobility-fit-gate`);
        const model = MOBILITY_PRODUCTS.find(p => p.id === spec.productId);
        const shouldBeStale = evidenceFreshness(model.offers[0].checkedAt,
          EVIDENCE_FRESHNESS_DAYS.merchantOffer).status !== "fresh";
        assertSpecialistOffer(await observe(page, spec), spec, "locked", shouldBeStale);

        // With one unresolved exact-model check, the offer must still be hidden.
        await page.evaluate(resultId => {
          const checks = [...document.querySelectorAll(`#${resultId} [data-zp-mobility-fit-confirm]`)];
          for (const check of checks.slice(0, -1)) check.click();
        }, spec.result);
        assertSpecialistOffer(await observe(page, spec), spec, "locked", shouldBeStale);
        await page.$eval(`#${spec.result}`, root => {
          const checks = [...root.querySelectorAll("[data-zp-mobility-fit-confirm]")];
          checks.at(-1).click();
        });
        assertSpecialistOffer(await observe(page, spec), spec, "complete", shouldBeStale);

        // Changing any questionnaire answer must revoke the old merchant CTA.
        await select(page, "supportNeed", "light");
        const cleared = await page.$eval(`#${spec.result}`, root => ({
          hidden: root.hidden, offers: root.querySelectorAll("a[data-zp-indoor-merchant-link],a[data-zp-rollator-merchant-link]").length,
          text: root.textContent.trim().length
        }));
        assert.deepEqual(cleared, { hidden: true, offers: 0, text: 0 },
          `${spec.id}: stale recommendation survived answer change`);
        assert.equal(new URL(page.url()).search, "", `${spec.id}: private answers in URL`);
        checked.push(spec.id);
      } finally { await page.close(); }
    }
    assert.equal(nonGet, 0, "Browser attempted non-GET network action");
    assert.equal(merchantRequests, 0, "Browser attempted merchant/tracking request");
    return { release: SOURCE_THEME_RELEASE, specialists: checked, nonGet, merchantRequests };
  } finally { await browser.close(); }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  auditLiveMobilitySpecialists().then(result => {
    console.log("MOBILITY_SPECIALIST_230_CHROME_PASS " + JSON.stringify(result));
  }).catch(error => {
    console.error("MOBILITY_SPECIALIST_230_CHROME_FAILED " + String(error.message)
      .replace(/https?:\/\/\S+/g, "[redacted]"));
    process.exitCode = 1;
  });
}
