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


  // Five narrow Bathroom flows must preserve the shared two-step safety gate
  // and never expose a retailer until exact model fit is explicitly confirmed.
  const bathroomMicroCases = [
    {
      slug: "toilet-riser", path: "/nastavec-na-wc-pro-seniory/",
      initial: [["transferAbility", "independent"]],
      model: [["toiletFit", "unknown"], ["feetFlatAtRaisedHeight", "yes"], ["loadFit", "yes"]],
      fix: ["toiletFit", "yes"], offer: "data-zp-toilet-merchant-link"
    },
    {
      slug: "shower-chair", path: "/sprchovaci-zidle-pro-seniory/",
      initial: [["transferAbility", "independent"], ["floorStable", "yes"]],
      model: [["spaceFit", "unknown"], ["loadFit", "yes"]],
      fix: ["spaceFit", "yes"], offer: "data-zp-shower-merchant-link"
    },
    {
      slug: "toilet-chair", path: "/toaletni-zidle-pro-seniory/",
      initial: [["chairMode", "nearby"], ["transferAbility", "independent"], ["floorStable", "yes"]],
      model: [["spaceFit", "unknown"], ["loadFit", "yes"]],
      fix: ["spaceFit", "yes"], offer: "data-zp-chair-merchant-link"
    },
    {
      slug: "bath-transfer", path: "/sedatko-do-vany-pro-seniory/",
      initial: [["transferAbility", "independent"], ["bathTransferIndependent", "yes"]],
      model: [["bathFit", "unknown"], ["loadFit", "yes"]],
      fix: ["bathFit", "yes"], offer: "data-zp-bath-merchant-link"
    }
  ];

  for (const scenario of bathroomMicroCases) {
    const page = await open(scenario.path);
    const submit = "#zp-" + scenario.slug + "-submit";
    const preview = "#zp-" + scenario.slug + "-preview";
    const result = "#zp-" + scenario.slug + "-result";
    const offer = result + " [" + scenario.offer + "]";
    for (const [name, value] of scenario.initial) await choose(page, name, value);
    await click(page, submit);
    assert.equal(await visible(page, preview), true, "Micro preview absent: " + scenario.slug);
    await checkPreviewNoCommerce(page, preview);
    for (const [name, value] of scenario.model) await choose(page, name, value);
    await click(page, submit);
    assert.equal(await count(page, offer), 0, "Unverified model showed a merchant: " + scenario.slug);
    await choose(page, ...scenario.fix);
    await click(page, submit);
    assert.ok(await count(page, offer) > 0, "Verified model had no purchase path: " + scenario.slug);
    await choose(page, "transferAbility", "person_assist");
    assert.equal(await visible(page, result), false, "Stale micro offer: " + scenario.slug);
    assert.equal(await count(page, offer), 0, "Old micro merchant link survived: " + scenario.slug);
    console.log("PASS micro Bathroom stage, fit, merchant and reset", scenario.slug);
    await page.close();
  }

  // Daily self-care: a swallowing concern must not route to an aid/merchant,
  // but an uncomplicated gripping scenario can lead to verified UpCup.
  {
    const page = await open("/sobestacnost/");
    await choose(page, "task", "drink");
    await choose(page, "mainProblem", "swallowing_or_medical");
    await click(page, "#zp-adl-submit");
    assert.equal(await count(page, "#zp-adl-result [data-zp-adl-merchant-link]"), 0);
    await choose(page, "mainProblem", "grip_or_spill");
    await click(page, "#zp-adl-submit");
    assert.ok(await count(page, "#zp-adl-result [data-zp-adl-merchant-link]") > 0,
      "Self-care straightforward gripping case should offer an evidenced product");
    await choose(page, "mainProblem", "swallowing_or_medical");
    assert.equal(await visible(page, "#zp-adl-result"), false);
    assert.equal(await count(page, "#zp-adl-result [data-zp-adl-merchant-link]"), 0);
    console.log("PASS self-care medical block and practical product");
    await page.close();
  }

  // Footwear: a promising model is not purchase-ready while size and
  // Velcro operation are unknown. Real positive answers may unlock it.
  {
    const page = await open("/obuv-pro-seniory/");
    await choose(page, "openingNeed", "extra_wide_low");
    await choose(page, "toe", "closed_needed");
    await choose(page, "velcroUse", "unknown");
    await choose(page, "measuredFeet", "unknown");
    await click(page, "#zp-footwear-submit");
    assert.equal(await count(page, "#zp-footwear-result [data-zp-footwear-merchant-link]"), 0);
    await choose(page, "velcroUse", "yes");
    await choose(page, "measuredFeet", "yes");
    await click(page, "#zp-footwear-submit");
    assert.ok(await count(page, "#zp-footwear-result [data-zp-footwear-merchant-link]") > 0,
      "Measured, safely closable footwear should offer the matching model");
    await choose(page, "measuredFeet", "no");
    assert.equal(await visible(page, "#zp-footwear-result"), false);
    assert.equal(await count(page, "#zp-footwear-result [data-zp-footwear-merchant-link]"), 0);
    console.log("PASS footwear size and fastener safety");
    await page.close();
  }

  // Return from hospital provides an actionable, printable checklist,
  // not a purchase recommendation; any changed circumstance invalidates it.
  {
    const page = await open("/navrat-z-nemocnice/");
    for (const [name, value] of [
      ["timing", "within_week"], ["entranceReady", "yes"],
      ["transferAbility", "independent"], ["walking", "independent"],
      ["toiletReady", "yes"], ["bedReady", "yes"],
      ["bathroomReady", "yes"], ["homeCare", "not_needed"]
    ]) await choose(page, name, value);
    await click(page, "#zp-return-home-submit");
    assert.equal(await visible(page, "#zp-return-home-result"), true);
    assert.ok(await count(page, "#zp-return-home-print") > 0, "Family plan should be printable");
    assert.equal(await count(page, "#zp-return-home-result .zp-offer"), 0);
    await choose(page, "entranceReady", "no");
    assert.equal(await visible(page, "#zp-return-home-result"), false);
    await click(page, "#zp-return-home-submit");
    assert.ok(await count(page, "#zp-return-home-result .zp-critical-plan") > 0,
      "Unsafe entrance must be shown as a discharge blocker");
    console.log("PASS return-home action plan, blocker, and reset");
    await page.close();
  }

  // Indoor walker: a specific model's offer must remain hidden until all
  // three physical fit checkboxes are confirmed for that exact product.
  {
    const page = await open("/choditko-do-bytu-pro-seniory/");
    await choose(page, "supportNeed", "steady");
    await choose(page, "canLiftWalker", "yes");
    await click(page, "#zp-indoor-walker-submit");
    assert.ok(await count(page, "#zp-indoor-walker-result .zp-mobility-fit-gate") > 0);
    assert.equal(await visible(page, "#zp-indoor-walker-result .zp-fit-locked-offers"), false);
    await page.$$eval("#zp-indoor-walker-result .zp-mobility-fit-gate:first-of-type [data-zp-mobility-fit-confirm]",
      nodes => nodes.forEach(el => el.click()));
    const unlocked = await page.$$eval("#zp-indoor-walker-result .zp-fit-locked-offers",
      nodes => nodes.some(el => !el.hidden));
    assert.equal(unlocked, true, "Indoor walker offer did not unlock after model checks");
    await choose(page, "supportNeed", "person_assist");
    assert.equal(await visible(page, "#zp-indoor-walker-result"), false);
    assert.equal(await count(page, "#zp-indoor-walker-result [data-zp-indoor-merchant-link]"), 0);
    console.log("PASS indoor walker model fit and safety reset");
    await page.close();
  }

  // Rollator: brake control is a real prerequisite and seating adds a
  // model-specific fourth confirmation, not a merely decorative question.
  {
    const page = await open("/rollator-pro-seniory/");
    await choose(page, "supportNeed", "steady");
    await choose(page, "handBrakes", "unknown");
    await click(page, "#zp-rollator-submit");
    assert.equal(await count(page, "#zp-rollator-result .zp-mobility-fit-gate"), 0);
    await choose(page, "handBrakes", "yes");
    await click(page, 'input[name="seatNeeded"]');
    await click(page, "#zp-rollator-submit");
    const checks = await count(page, "#zp-rollator-result .zp-mobility-fit-gate [data-zp-mobility-fit-confirm]");
    assert.ok(checks >= 4, "Rollator seat check missing from the model-fit gate");
    assert.equal(await visible(page, "#zp-rollator-result .zp-fit-locked-offers"), false);
    await page.$$eval("#zp-rollator-result .zp-mobility-fit-gate:first-of-type [data-zp-mobility-fit-confirm]",
      nodes => nodes.forEach(el => el.click()));
    const unlocked = await page.$$eval("#zp-rollator-result .zp-fit-locked-offers",
      nodes => nodes.some(el => !el.hidden));
    assert.equal(unlocked, true, "Rollator offer remained locked after all model confirmations");
    await choose(page, "handBrakes", "no");
    assert.equal(await visible(page, "#zp-rollator-result"), false);
    assert.equal(await count(page, "#zp-rollator-result [data-zp-rollator-merchant-link]"), 0);
    console.log("PASS rollator brakes, seat, gated offer and reset");
    await page.close();
  }

  // Release 0.8.63 adaptive model-fit questions: show only the relevant
  // construction-specific measurement, but preserve fail-closed merchant gates.
  // This checks actual rendered state in production, not only rule-engine outputs.
  {
    const page = await open("/madlo-k-wc-pro-seniory/");
    const button = "#zp-toilet-support-submit";
    const preview = "#zp-toilet-support-preview";
    const fit = "#zp-toilet-support-fit-stage";
    const frame = fit + ' input[name="supportFrameFit"]';
    const load = fit + ' input[name="loadFit"]';
    const offer = "#zp-toilet-support-result [data-zp-support-merchant-link]";
    await choose(page, "transferAbility", "independent");
    await choose(page, "wallFixing", "verified");
    await click(page, button);
    assert.equal(await visible(page, preview), true);
    assert.equal(await visible(page, frame), false, "Wall rail must not ask for P2015 frame size");
    assert.equal(await visible(page, load), true, "Wall rail still requires load check");
    await choose(page, "loadFit", "yes");
    await click(page, button);
    assert.ok(await count(page, offer) > 0, "Verified wall rail should retain an offer");
    await choose(page, "wallFixing", "unverified");
    assert.equal(await visible(page, preview), false, "Mounting approach change must clear preview");
    assert.equal(await count(page, offer), 0, "Previous wall rail offer must be removed");
    await click(page, button);
    assert.equal(await visible(page, frame), true, "Unverified wall must ask for P2015 dimensions");
    const confirmed = await page.$eval(frame, node => node.checked);
    assert.equal(confirmed, false, "Old frame confirmation must not carry to new branch");
    await choose(page, "loadFit", "yes");
    await choose(page, "supportFrameFit", "unknown");
    await click(page, button);
    assert.equal(await count(page, offer), 0, "Unknown frame dimensions must block its offer");
    await choose(page, "supportFrameFit", "yes");
    await click(page, button);
    assert.ok(await count(page, offer) > 0, "Verified P2015 frame should retain an offer");
    console.log("PASS 0.8.63 adaptive WC support: wall rail / frame checks and merchant gate");
    await page.close();
  }

  {
    const page = await open("/sedatko-do-vany-pro-seniory/");
    const button = "#zp-bath-transfer-submit";
    const preview = "#zp-bath-transfer-preview";
    const fit = "#zp-bath-transfer-fit-stage";
    const seat = fit + ' input[name="bathFit"]';
    const bench = fit + ' input[name="bathBenchFit"]';
    const offer = "#zp-bath-transfer-result [data-zp-bath-merchant-link]";
    await choose(page, "transferAbility", "independent");
    await choose(page, "bathTransferIndependent", "yes");
    await click(page, button);
    assert.equal(await visible(page, preview), true);
    assert.equal(await visible(page, seat), true, "Standard bath seat must ask whether it fits");
    assert.equal(await visible(page, bench), false, "Unneeded transfer bench check must be hidden");
    await choose(page, "bathFit", "yes");
    await choose(page, "loadFit", "yes");
    await click(page, button);
    assert.ok(await count(page, offer) > 0, "Verified standard bath seat should retain an offer");
    await choose(page, "bathFit", "no");
    assert.equal(await count(page, offer), 0, "Previous seat offer must disappear after fit change");
    assert.equal(await visible(page, bench), true, "Seat incompatible: bench measurements must appear");
    const staleBench = await page.$eval(bench, node => node.checked);
    assert.equal(staleBench, false, "Bench fit must not be silently confirmed");
    await click(page, button);
    assert.equal(await count(page, offer), 0, "Unknown bench size must block merchant");
    await choose(page, "bathBenchFit", "yes");
    await click(page, button);
    assert.ok(await count(page, offer) > 0, "Verified transfer bench should retain an offer");
    await choose(page, "bathFit", "yes");
    assert.equal(await visible(page, bench), false, "Returning to normal seat must hide bench check");
    assert.equal(await page.$eval(bench, node => node.checked), false, "Hidden bench answer must clear");
    assert.equal(await count(page, offer), 0, "Previous bench link must be invalidated");
    console.log("PASS 0.8.63 adaptive bath transfer: branch switching and merchant gate");
    await page.close();
  }

  console.log("SUCCESS: 14 live Advisor forms + incomplete-answer safety + 14 interactive Advisor paths and 2 adaptive-fit branch scenarios");
} finally {
  await browser.close();
}
