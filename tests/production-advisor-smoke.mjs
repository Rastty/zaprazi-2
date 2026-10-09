import assert from "node:assert/strict";
import { accessSync, constants, readFileSync } from "node:fs";
import puppeteer from "puppeteer-core";

const base = process.env.ZP_LIVE_ORIGIN || "https://zaprazi.cz";
const sourceRelease = readFileSync(new URL("../style.css", import.meta.url), "utf8").match(/^Version:\s*([\d.]+)\s*$/m)?.[1];
const requiredVersion = process.env.ZP_RELEASE || sourceRelease;
assert.ok(requiredVersion, "Release missing in theme style.css");
const browserCandidates = [process.env.CHROME_BIN, "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium"].filter(Boolean);
const chrome = browserCandidates.find(path => {
  try { accessSync(path, constants.X_OK); return true; } catch { return false; }
});
assert.ok(chrome, "Chrome or Chromium executable unavailable");

const advisors = [
  ["/", "#zp-mobility-advisor", "#zp-mobility-result"],
  ["/koupelna-a-wc/", "#zp-bathroom-advisor", "#zp-bathroom-result"],
  ["/polohovaci-postel/", "#zp-bed-advisor", "#zp-bed-result"],
  ["/invalidni-vozik/", "#zp-wheelchair-advisor", "#zp-wheelchair-result"],
  ["/navrat-z-nemocnice/", "#zp-return-home-advisor", "#zp-return-home-result"],
  ["/sobestacnost/", "#zp-adl-advisor", "#zp-adl-result"],
  ["/obuv-pro-seniory/", "#zp-footwear-advisor", "#zp-footwear-result"],
  ["/nastavec-na-wc-pro-seniory/", "#zp-toilet-riser-advisor", "#zp-toilet-riser-result"],
  ["/sprchovaci-zidle-pro-seniory/", "#zp-shower-chair-advisor", "#zp-shower-chair-result"],
  ["/toaletni-zidle-pro-seniory/", "#zp-toilet-chair-advisor", "#zp-toilet-chair-result"],
  ["/madlo-k-wc-pro-seniory/", "#zp-toilet-support-advisor", "#zp-toilet-support-result"],
  ["/sedatko-do-vany-pro-seniory/", "#zp-bath-transfer-advisor", "#zp-bath-transfer-result"],
  ["/choditko-do-bytu-pro-seniory/", "#zp-indoor-walker-advisor", "#zp-indoor-walker-result"],
  ["/rollator-pro-seniory/", "#zp-rollator-advisor", "#zp-rollator-result"]
];

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
});

async function open(path) {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  page.setDefaultTimeout(12000);
  const response = await page.goto(base + path, { waitUntil: "networkidle2", timeout: 35000 });
  assert.equal(response?.status(), 200, "HTTP 200 expected: " + path);
  const release = await page.$eval('meta[name="zaprazi-release"]', el => el.content);
  assert.equal(release, requiredVersion, "Live version mismatch at " + path);
  return page;
}

async function choose(page, name, value) {
  const selector = 'input[name="' + name + '"][value="' + value + '"]';
  await page.$eval(selector, el => {
    if (el.closest("[hidden]")) throw new Error("Conditional input should be visible: " + el.name);
    el.click();
  });
}
async function click(page, selector) {
  await page.$eval(selector, el => el.click());
}
async function visible(page, selector) {
  return page.$eval(selector, el => !el.closest("[hidden]") && getComputedStyle(el).display !== "none");
}
async function count(page, selector) {
  return page.$$eval(selector, nodes => nodes.length);
}
async function checkPreviewNoCommerce(page, selector) {
  const state = await page.$eval(selector, root => ({
    offers: root.querySelectorAll(".zp-offer, [data-zp-merchant-link], [data-zp-bath-merchant-link], [data-zp-wheelchair-merchant-link], [data-zp-bed-merchant-link], [data-zp-support-merchant-link]").length,
    trackingLinks: [...root.querySelectorAll("a[href]")].map(a => a.href)
      .filter(url => /ehub\.cz\/system\/scripts\/click|awin1\.com\/cread|anrdoezrs\.net|tkqlhce\.com|jdoqocy\.com/.test(url))
  }));
  assert.equal(state.offers, 0, "Unverified preview contains a commercial offer");
  assert.deepEqual(state.trackingLinks, [], "Unverified preview contains a commission-tracking link");
}

async function checkNoMerchant(page, resultSelector) {
  assert.equal(await count(page, resultSelector + ' [data-zp-merchant-link], ' +
    resultSelector + ' [data-zp-bath-merchant-link], ' +
    resultSelector + ' [data-zp-wheelchair-merchant-link], ' +
    resultSelector + ' [data-zp-bed-merchant-link], ' +
    resultSelector + ' [data-zp-support-merchant-link]'), 0, "Offer escaped safety gate");
}

try {
  // Non-mutating production smoke on all 14 real advisor URLs (mobile viewport).
  for (const [path, formSelector, resultSelector] of advisors) {
    const page = await open(path);
    assert.ok(await page.$(formSelector), "Advisor missing: " + path);
    assert.ok(await page.$(resultSelector), "Result container missing: " + path);
    assert.equal(await visible(page, resultSelector), false, "Result should be initially hidden: " + path);
    await checkNoMerchant(page, resultSelector);
    await page.$eval(formSelector, root => {
      const button = root.querySelector('button[id$="-submit"]');
      if (!button) throw new Error("Advisor submit button missing");
      button.click();
    });
    await checkNoMerchant(page, resultSelector);
    console.log("PASS boot and empty-answer safety", path, formSelector);
    await page.close();
  }

  // Mobility: model-specific load/width/height checkboxes must hide actual
  // offers, then all checks unlock only this card; changing an answer resets it.
  {
    const page = await open("/");
    await choose(page, "environment", "indoor");
    await choose(page, "supportNeed", "steady");
    await choose(page, "canLiftWalker", "yes");
    await click(page, "#zp-mobility-submit");
    assert.ok(await count(page, "#zp-mobility-result .zp-mobility-fit-gate") > 0,
      "Mobility candidate should have a model-fit gate");
    assert.equal(await visible(page, "#zp-mobility-result .zp-fit-locked-offers"), false);
    await page.$$eval("#zp-mobility-result .zp-mobility-fit-gate:first-of-type [data-zp-mobility-fit-confirm]",
      nodes => nodes.forEach(el => el.click()));
    const unlocked = await page.$$eval("#zp-mobility-result .zp-fit-locked-offers",
      nodes => nodes.some(el => !el.hidden));
    assert.equal(unlocked, true, "Mobility offer must unlock after all relevant checks");
    await choose(page, "supportNeed", "light");
    assert.equal(await visible(page, "#zp-mobility-result"), false, "Changed answer must hide previous result");
    await checkNoMerchant(page, "#zp-mobility-result");
    console.log("PASS mobility model fit and stale-link invalidation");
    await page.close();
  }

  // Bathroom/WC: stage 1 is an unverified product preview only.
  // Unknown model-specific WC fit fails closed; confirmed model fit may unlock.
  {
    const page = await open("/koupelna-a-wc/");
    await choose(page, "primaryNeed", "raise_toilet");
    await choose(page, "transferAbility", "independent");
    await click(page, "#zp-bathroom-submit");
    assert.equal(await visible(page, "#zp-bathroom-preview"), true);
    assert.equal(await visible(page, "#zp-bathroom-fit-stage"), true);
    await checkPreviewNoCommerce(page, "#zp-bathroom-preview");
    await choose(page, "loadFit", "yes");
    await choose(page, "toiletFit", "unknown");
    await choose(page, "feetFlatAtRaisedHeight", "yes");
    await click(page, "#zp-bathroom-submit");
    await checkNoMerchant(page, "#zp-bathroom-result");
    await choose(page, "toiletFit", "yes");
    await click(page, "#zp-bathroom-submit");
    assert.ok(await count(page, "#zp-bathroom-result [data-zp-bath-merchant-link]") > 0,
      "Completed bathroom fit should present eligible offer");
    await choose(page, "primaryNeed", "shower_seated");
    assert.equal(await visible(page, "#zp-bathroom-result"), false, "Old bathroom offer must disappear");
    await checkNoMerchant(page, "#zp-bathroom-result");
    console.log("PASS bathroom preview, fail-closed and reset");
    await page.close();
  }

  // Manual wheelchair: ability to start, steer, stop and brake is a
  // safety prerequisite even before an unverified model preview.
  {
    const page = await open("/invalidni-vozik/");
    await choose(page, "propulsion", "self_manual");
    await choose(page, "transferAbility", "independent");
    await choose(page, "manualControlSafe", "unknown");
    await click(page, "#zp-wheelchair-submit");
    assert.equal(await visible(page, "#zp-wheelchair-preview"), false);
    await checkNoMerchant(page, "#zp-wheelchair-result");
    await choose(page, "manualControlSafe", "yes");
    await click(page, "#zp-wheelchair-submit");
    assert.equal(await visible(page, "#zp-wheelchair-preview"), true);
    await checkPreviewNoCommerce(page, "#zp-wheelchair-preview");
    await choose(page, "seatFit", "yes");
    await choose(page, "widthFit", "yes");
    await choose(page, "loadFit", "yes");
    await click(page, "#zp-wheelchair-submit");
    assert.ok(await count(page, "#zp-wheelchair-result [data-zp-wheelchair-merchant-link]") > 0,
      "Manual wheelchair verified branch needs a specific offer");
    await choose(page, "manualControlSafe", "no");
    assert.equal(await visible(page, "#zp-wheelchair-result"), false);
    await checkNoMerchant(page, "#zp-wheelchair-result");
    console.log("PASS wheelchair manual controls, preview and fit");
    await page.close();
  }

  // Bed: no merchant before load/room fit; safe completed variant can unlock.
  {
    const page = await open("/polohovaci-postel/");
    await choose(page, "primaryNeed", "home_positioning");
    await choose(page, "transferAbility", "independent");
    await click(page, "#zp-bed-submit");
    assert.equal(await visible(page, "#zp-bed-preview"), true);
    await checkPreviewNoCommerce(page, "#zp-bed-preview");
    await choose(page, "loadFit", "unknown");
    await choose(page, "spaceFit", "yes");
    await click(page, "#zp-bed-submit");
    await checkNoMerchant(page, "#zp-bed-result");
    await choose(page, "loadFit", "yes");
    await click(page, "#zp-bed-submit");
    assert.ok(await count(page, "#zp-bed-result [data-zp-bed-merchant-link]") > 0,
      "Verified bed should lead to eligible product offer");
    console.log("PASS adjustable bed staged verification");
    await page.close();
  }

  // Separate WC support / frame: unverified frame mounting dimensions cannot
  // unlock the precise P2015 product; confirmed fit with adequate load can.
  {
    const page = await open("/madlo-k-wc-pro-seniory/");
    await choose(page, "transferAbility", "independent");
    await choose(page, "wallFixing", "unverified");
    await click(page, "#zp-toilet-support-submit");
    assert.equal(await visible(page, "#zp-toilet-support-preview"), true);
    await checkPreviewNoCommerce(page, "#zp-toilet-support-preview");
    await choose(page, "loadFit", "yes");
    await choose(page, "supportFrameFit", "unknown");
    await click(page, "#zp-toilet-support-submit");
    await checkNoMerchant(page, "#zp-toilet-support-result");
    await choose(page, "supportFrameFit", "yes");
    await click(page, "#zp-toilet-support-submit");
    assert.ok(await count(page, "#zp-toilet-support-result [data-zp-support-merchant-link]") > 0,
      "Verified frame fit is required before WC support product link");
    console.log("PASS WC support frame-specific fit");
    await page.close();
  }

  console.log("SUCCESS: 14 advisor entry and no-answer safety checks plus 5 high-value safety/funnel scenarios passed");
} finally {
  await browser.close();
}
