import assert from "node:assert/strict";
import { accessSync, constants, readFileSync } from "node:fs";
import puppeteer from "puppeteer-core";

const base = process.env.ZP_LIVE_ORIGIN || "https://zaprazi.cz";
const sourceRelease = readFileSync(new URL("../style.css", import.meta.url), "utf8").match(/^Version:\s*([\d.]+)\s*$/m)?.[1];
const requiredVersion = process.env.ZP_RELEASE || sourceRelease;
assert.ok(requiredVersion, "Release missing in theme style.css");
const releaseAtLeast = (minimum) => {
  const current = requiredVersion.split(".").map(Number);
  const target = minimum.split(".").map(Number);
  return current.some((n, i) => n !== target[i] && current.slice(0,i).every((x,j)=>x===target[j]) && n > target[i])
    || current.every((n,i)=>n===target[i]);
};
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

// Read-only affiliate readiness: configured slots are necessary, but not
// proof of an actual tracked conversion. Never follow merchant click links.
const readinessResponse = await fetch(base + "/wp-json/zaprazi/v1/affiliate-readiness", {
  headers: { Accept: "application/json" }
});
assert.equal(readinessResponse.status, 200, "Public affiliate readiness endpoint unavailable");
const readiness = await readinessResponse.json();
assert.equal(readiness.release, requiredVersion, "Readiness version differs from deploy");
assert.equal(readiness.integrity, "ok", "Deployment integrity is partial");
assert.ok(readiness.slot_total >= 25, "An expected affiliate slot was removed");
assert.equal(readiness.configured_total, readiness.slot_total, "Not all affiliate slots are configured");
for (const [name, group] of Object.entries(readiness.groups || {})) {
  assert.equal(group.configured, group.total, "Affiliate group incomplete: " + name);
  assert.deepEqual(group.missing, [], "Affiliate group missing targets: " + name);
}
console.log("PASS affiliate readiness:", readiness.configured_total, "/", readiness.slot_total);

const approvedRedirectHosts = new Set([
  "kqzyfj.com", "dpbolvw.net", "anrdoezrs.net",
  "tkqlhce.com", "jdoqocy.com", "ehub.cz"
]);
async function assertAffiliateOffers(page, selector) {
  const links = await page.$$eval(selector, nodes =>
    nodes.map(node => ({
      href: node.getAttribute("href"),
      rel: node.getAttribute("rel") || "",
      visible: !node.closest("[hidden]")
    }))
  );
  assert.ok(links.some(link => link.visible), "Expected at least one unlocked merchant offer");
  for (const link of links) {
    const url = new URL(link.href, base);
    assert.equal(url.protocol, "https:", "Merchant link must use HTTPS");
    assert.ok(approvedRedirectHosts.has(url.hostname.toLowerCase().replace(/^www\./, "")),
      "Merchant link bypasses reviewed affiliate network: " + url.hostname);
    assert.ok(!/(?:undefined|null)(?:$|[?&#])/i.test(link.href), "Unresolved merchant URL");
    assert.ok(!/(?:answer|diagnos|weight|supportNeed|transferAbility|health)=/i.test(url.search),
      "Merchant URL appears to expose user answers");
    for (const token of ["noopener", "nofollow", "sponsored"]) {
      assert.ok(link.rel.split(/\s+/).includes(token), "Affiliate link missing rel=" + token);
    }
  }
}

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
    // Accessibility sanity audit on each real 390px page (not jsdom):
    // prevent sideways scrolling and input controls without a readable name.
    const mobileA11y = await page.evaluate(selector => {
      const root = document.querySelector(selector);
      const unlabeledInputs = [...root.querySelectorAll('input[type="radio"], input[type="checkbox"]')]
        .filter(el => !el.labels?.length && !el.closest("label") &&
          !el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby"))
        .map(el => el.name || el.outerHTML.slice(0, 90));
      const unnamedGroups = [...root.querySelectorAll("fieldset")]
        .filter(group => !group.querySelector("legend")?.textContent?.trim())
        .map(group => group.className || group.outerHTML.slice(0, 90));
      const overflowPx = Math.round(document.documentElement.scrollWidth - window.innerWidth);
      return { unlabeledInputs, unnamedGroups, overflowPx };
    }, formSelector);
    assert.deepEqual(mobileA11y.unlabeledInputs, [], "Unnamed answer control: " + path);
    assert.deepEqual(mobileA11y.unnamedGroups, [], "Question without legend: " + path);
    assert.ok(mobileA11y.overflowPx <= 2,
      "Horizontal mobile overflow " + mobileA11y.overflowPx + "px: " + path);

    assert.equal(await visible(page, resultSelector), false, "Result should be initially hidden: " + path);
    await checkNoMerchant(page, resultSelector);
    await page.$eval(formSelector, root => {
      const button = root.querySelector('button[id$="-submit"]');
      if (!button) throw new Error("Advisor submit button missing");
      button.click();
    });
    await checkNoMerchant(page, resultSelector);
    console.log("PASS boot, mobile layout, labeled controls and empty-answer safety", path, formSelector);
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
    await assertAffiliateOffers(page, "#zp-mobility-result [data-zp-merchant-link]");
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
    await choose(page, "duration", "long_term");
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
    await assertAffiliateOffers(page, "#zp-bathroom-result [data-zp-bath-merchant-link]");
    // 0.8.69: actionable acquisition must be shared by main Bathroom Advisor.
    const acquisition = await page.$eval("#zp-bathroom-result .zp-acquisition-summary", el => el.textContent);
    assert.match(acquisition, /Porovnat koupi a případné půjčení/);
    assert.match(acquisition, /Jak ověřit půjčení ve svém okolí/);
    assert.match(acquisition, /Telefonicky ověřte dostupnost konkrétního typu/);
    assert.match(acquisition, /Půjčovny jsou místní služby/);
    assert.match(acquisition, /Zdroj VZP/);
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
    await choose(page, "seatWidthVariant", "48");
    await choose(page, "seatFit", "yes");
    await choose(page, "widthFit", "yes");
    await choose(page, "loadFit", "yes");
    await choose(page, "wheelType", "unknown");
    await click(page, "#zp-wheelchair-submit");
    await checkNoMerchant(page, "#zp-wheelchair-result");
    await choose(page, "wheelType", "pneumatic");
    assert.equal(await page.$eval('input[name="loadFit"]:checked',el=>el.value).catch(()=>null),null,
      "Wheel variant selection invalidates earlier generic load confirmation");
    await choose(page, "loadFit", "yes");
    await choose(page, "brakeFit", "unknown");
    await click(page, "#zp-wheelchair-submit");
    await checkNoMerchant(page, "#zp-wheelchair-result");
    await choose(page, "brakeFit", "yes");
    await click(page, "#zp-wheelchair-submit");
    assert.ok(await count(page, "#zp-wheelchair-result [data-zp-wheelchair-merchant-link]") > 0,
      "Manual wheelchair verified branch needs a specific offer");
    await assertAffiliateOffers(page, "#zp-wheelchair-result [data-zp-wheelchair-merchant-link]");
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
    await assertAffiliateOffers(page, "#zp-bed-result [data-zp-bed-merchant-link]");
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
    await assertAffiliateOffers(page, "#zp-toilet-support-result [data-zp-support-merchant-link]");
    const acquisition = await page.$eval("#zp-toilet-support-result .zp-acquisition-summary", el => el.textContent);
    assert.match(acquisition, /Jak ověřit půjčení ve svém okolí/);
    assert.match(acquisition, /Zdroj VZP/);
    console.log("PASS WC support frame-specific fit and shared acquisition");
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
    await choose(page, "duration", "short_term");
    await click(page, submit);
    assert.equal(await visible(page, preview), true, "Micro preview absent: " + scenario.slug);
    await checkPreviewNoCommerce(page, preview);
    for (const [name, value] of scenario.model) await choose(page, name, value);
    await click(page, submit);
    assert.equal(await count(page, offer), 0, "Unverified model showed a merchant: " + scenario.slug);
    await choose(page, ...scenario.fix);
    if (scenario.slug === "bath-transfer") {
      // Selecting a concrete 100 kg construction invalidates a stale loadFit
      // even if the earlier stage already confirmed another capacity.
      assert.equal(await page.$eval('input[name="loadFit"]:checked', el => el.value).catch(() => null),
        null, "Switching a bath construction must clear its previous load approval");
      await click(page, submit);
      assert.equal(await count(page, offer), 0, "Unconfirmed new capacity exposed a bath merchant");
      await choose(page, "loadFit", "yes");
    }
    await click(page, submit);
    assert.ok(await count(page, offer) > 0, "Verified model had no purchase path: " + scenario.slug);
    await assertAffiliateOffers(page, offer);
    // 0.8.69: each narrow Bathroom journey explains real local rental checks.
    const acquisition = await page.$eval(result+" .zp-acquisition-summary", el => el.textContent);
    assert.match(acquisition, /Porovnat půjčení a koupi/, scenario.slug);
    assert.match(acquisition, /Jak ověřit půjčení ve svém okolí/, scenario.slug);
    assert.match(acquisition, /cenu za týden nebo měsíc, kauci/, scenario.slug);
    assert.match(acquisition, /Půjčovny jsou místní služby/, scenario.slug);
    assert.match(acquisition, /Aktuální seznam SÚKL/, scenario.slug);
    const explanations=await page.evaluate(selector => [...document.querySelectorAll(selector)].map(n=>({
      heading:n.querySelector("h3")?.textContent.trim(),reason:n.querySelector("p")?.textContent.trim()
    })), result+" .zp-why-recommendation");
    assert.equal(explanations.length,1,"Each completed micro Advisor must explain its chosen solution");
    assert.equal(explanations[0].heading,"Proč právě toto řešení?");
    assert.ok(explanations[0].reason?.length>28,"Missing substantial reason for "+scenario.slug);
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
    if (requiredVersion !== "0.8.71") {
      await checkNoMerchant(page, "#zp-adl-result");
      assert.equal(await visible(page,"#zp-adl-product-fit"),true,
        "ADL initial candidate must ask for practical model-specific fit");
      await choose(page,"productFit","yes");
      await click(page,"#zp-adl-submit");
    }
    assert.ok(await count(page, "#zp-adl-result [data-zp-adl-merchant-link]") > 0,
      "Self-care straightforward gripping case should offer an evidenced product after verification");
    await assertAffiliateOffers(page, "#zp-adl-result [data-zp-adl-merchant-link]");
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
    await assertAffiliateOffers(page, "#zp-footwear-result [data-zp-footwear-merchant-link]");
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
    await assertAffiliateOffers(page, "#zp-indoor-walker-result [data-zp-indoor-merchant-link]");
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
    await assertAffiliateOffers(page, "#zp-rollator-result [data-zp-rollator-merchant-link]");
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
    await assertAffiliateOffers(page, offer);
    const wallReason=await page.$eval("#zp-toilet-support-result .zp-why-recommendation p",el=>el.textContent);
    assert.match(wallReason,/Nástěnné kotvení/,"Wall-mounted rail explanation must cite verified fixing");
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
    const frameReason=await page.$eval("#zp-toilet-support-result .zp-why-recommendation p",el=>el.textContent);
    assert.match(frameReason,/toaletního rámu/,"Free-standing support explanation must describe the real construction");
    assert.notEqual(frameReason,wallReason,"Different physical products must have different explanations");
    console.log("PASS 0.8.67 adaptive WC support: construction-specific why, fit and merchant gate");
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
    await assertAffiliateOffers(page, offer);
    await choose(page, "bathFit", "no");
    assert.equal(await count(page, offer), 0, "Previous seat offer must disappear after fit change");
    assert.equal(await visible(page, bench), true, "Seat incompatible: bench measurements must appear");
    assert.equal(await page.$eval(fit + ' input[name="loadFit"]:checked', el => el.value).catch(() => null),
      null, "100 kg seat confirmation must not carry over to 110 kg bench");
    const staleBench = await page.$eval(bench, node => node.checked);
    assert.equal(staleBench, false, "Bench fit must not be silently confirmed");
    await choose(page, "bathBenchFit", "yes");
    await click(page, button);
    assert.equal(await count(page, offer), 0, "110 kg bench must remain blocked without fresh load confirmation");
    await choose(page, "loadFit", "yes");
    await click(page, button);
    assert.ok(await count(page, offer) > 0, "Bench capacity confirmation should unlock its own offer");
    await assertAffiliateOffers(page, offer);
    await choose(page, "bathFit", "yes");
    assert.equal(await visible(page, bench), false, "Returning to normal seat must hide bench check");
    assert.equal(await page.$eval(bench, node => node.checked), false, "Hidden bench answer must clear");
    assert.equal(await page.$eval(fit + ' input[name="loadFit"]:checked', el => el.value).catch(() => null),
      null, "110 kg bench confirmation must never approve the 100 kg seat");
    assert.equal(await count(page, offer), 0, "Previous bench link must be invalidated");
    await click(page, button);
    assert.equal(await count(page, offer), 0, "Seat must remain locked until its own 100 kg capacity is verified");
    await choose(page, "loadFit", "yes");
    await click(page, button);
    assert.ok(await count(page, offer) > 0, "New 100 kg seat confirmation unlocks its own offer");
    await choose(page, "bathFit", "no");
    assert.equal(await page.$eval(fit + ' input[name="loadFit"]:checked', el => el.value).catch(() => null),
      null, "Switching back to bench clears the 100 kg approval again");
    assert.equal(await count(page, offer), 0, "No merchant survives another construction change");
    console.log("PASS 0.8.65 bath seat/bench: different load limits always require new confirmation");
    await page.close();
  }

  // Real DOM + mobile QA of 0.8.66 Czech product facts in BOTH preview and result.
  // A machine-readable catalog key would confuse the caregiver at purchase time.
  for (const spec of [
    {path:"/madlo-k-wc-pro-seniory/", slug:"toilet-support", situation:[["transferAbility","independent"],["wallFixing","unverified"]],
     fits:[["supportFrameFit","yes"],["loadFit","yes"]], expected:["Maximální nosnost: 100 kg","Šířka: 53–63 cm"]},
    {path:"/sedatko-do-vany-pro-seniory/", slug:"bath-transfer", situation:[["transferAbility","independent"],["bathTransferIndependent","yes"]],
     fits:[["bathFit","yes"],["loadFit","yes"]], expected:["Maximální nosnost: 100 kg","Vnitřní šířka vany: 41–65 cm"]}
  ]) {
    const page=await open(spec.path);
    for (const [name,value] of spec.situation) await choose(page,name,value);
    await click(page,"#zp-"+spec.slug+"-submit");
    const preview="#zp-"+spec.slug+"-preview";
    const final="#zp-"+spec.slug+"-result";
    assert.equal(await visible(page,preview),true,"Missing Czech preview on "+spec.slug);
    const previewText=await page.$eval(preview,node=>node.textContent);
    for(const expected of spec.expected) assert.ok(previewText.includes(expected),"Preview missing "+expected);
    assert.ok(!/maxUserWeightKg|totalWidthCm|bathInnerWidthCm|fixingHoleSpacingCm/.test(previewText),
      "Technical database keys exposed in "+spec.slug+" preview");
    await checkPreviewNoCommerce(page,preview);
    for(const [name,value] of spec.fits) await choose(page,name,value);
    await click(page,"#zp-"+spec.slug+"-submit");
    assert.equal(await visible(page,final),true,"Missing verified result "+spec.slug);
    const resultText=await page.$eval(final,node=>node.textContent);
    for(const expected of spec.expected) assert.ok(resultText.includes(expected),"Result missing "+expected);
    assert.ok(!/maxUserWeightKg|totalWidthCm|bathInnerWidthCm|fixingHoleSpacingCm/.test(resultText),
      "Technical database keys exposed in "+spec.slug+" result");
    await assertAffiliateOffers(page,final+" a[rel~=sponsored]");
    console.log("PASS 0.8.66 Czech product facts in preview + final result: "+spec.slug);
    await page.close();
  }

  // New 0.8.70-only safety regression. PRs target the currently deployed
  // version; after deployment, workflow_dispatch must execute these paths.
  if (requiredVersion !== "0.8.69") {
    for (const branch of [
      {need:"robust_high_load", model:"P4707"},
      {need:"advanced_in_bed_care", model:"P4044"}
    ]) {
      const page = await open("/polohovaci-postel/");
      await choose(page,"primaryNeed",branch.need);
      await choose(page,"transferAbility","independent");
      await click(page,"#zp-bed-submit");
      const preview="#zp-bed-preview", result="#zp-bed-result";
      assert.equal(await visible(page,preview),true,"Bed preview must be available: "+branch.need);
      assert.match(await page.$eval(preview,el=>el.textContent),new RegExp(branch.model));
      await checkPreviewNoCommerce(page,preview);
      assert.equal(await visible(page,'#zp-bed-fit-stage [name="userCapacityVerified"]'),true,
        "Independent patient capacity confirmation must appear: "+branch.need);
      await choose(page,"loadFit","yes");
      await choose(page,"spaceFit","yes");
      await choose(page,"userCapacityVerified","unknown");
      await click(page,"#zp-bed-submit");
      await checkNoMerchant(page,result);
      const blocked=await page.$eval(result,el=>el.textContent);
      assert.match(blocked,/hmotnosti uživatele|hmotnost samotného uživatele/i);
      await choose(page,"userCapacityVerified","no");
      await click(page,"#zp-bed-submit");
      await checkNoMerchant(page,result);
      await choose(page,"userCapacityVerified","yes");
      await click(page,"#zp-bed-submit");
      assert.ok(await count(page,result+' [data-zp-bed-merchant-link]')>0,
        "Explicit verified patient capacity must enable eligible bed offer: "+branch.need);
      await assertAffiliateOffers(page,result+' [data-zp-bed-merchant-link]');
      await choose(page,"primaryNeed","home_positioning");
      assert.equal(await visible(page,result),false,"Changed bed branch must clear stale purchase links");
      await checkNoMerchant(page,result);
      await click(page,"#zp-bed-submit");
      assert.equal(await visible(page,'#zp-bed-fit-stage [name="userCapacityVerified"]'),false,
        "CLASSIC must not require a second patient limit confirmation");
      await choose(page,"loadFit","yes");
      await choose(page,"spaceFit","yes");
      await click(page,"#zp-bed-submit");
      assert.ok(await count(page,result+' [data-zp-bed-merchant-link]')>0,
        "Explicitly sourced CLASSIC patient limit should retain purchase path");
      console.log("PASS 0.8.70 bed separate patient-weight limit, no bypass and branch reset: "+branch.need);
      await page.close();
    }
  }

  // After 0.8.71 deploy: P3641 (125 kg pneumatic / 136 kg tubeless)
  // must never share one generic capacity approval across constructions.
  if (releaseAtLeast("0.8.71")) {
    const page = await open("/invalidni-vozik/");
    await choose(page,"propulsion","self_manual");
    await choose(page,"transferAbility","independent");
    await choose(page,"manualControlSafe","yes");
    await click(page,"#zp-wheelchair-submit");
    await checkPreviewNoCommerce(page,"#zp-wheelchair-preview");
    assert.equal(await visible(page,'#zp-wheelchair-fit-stage [name="wheelType"]'),true);
    await choose(page,"seatWidthVariant","48");
    await choose(page,"seatFit","yes");
    await choose(page,"widthFit","yes");
    await choose(page,"wheelType","unknown");
    await choose(page,"loadFit","yes");
    await click(page,"#zp-wheelchair-submit");
    await checkNoMerchant(page,"#zp-wheelchair-result");
    await choose(page,"wheelType","pneumatic");
    assert.equal(await page.$eval('input[name="loadFit"]:checked',el=>el.value).catch(()=>null),null);
    await choose(page,"loadFit","yes");
    await choose(page,"brakeFit","yes");
    await click(page,"#zp-wheelchair-submit");
    const result="#zp-wheelchair-result";
    assert.match(await page.$eval(result,el=>el.textContent),/pneumatická kola – 125 kg/);
    await assertAffiliateOffers(page,result+' [data-zp-wheelchair-merchant-link]');
    await choose(page,"wheelType","tubeless");
    assert.equal(await page.$eval('input[name="loadFit"]:checked',el=>el.value).catch(()=>null),null);
    await checkNoMerchant(page,result);
    await click(page,"#zp-wheelchair-submit");
    assert.equal(await visible(page,"#zp-wheelchair-errors"),true);
    await choose(page,"loadFit","yes");
    await choose(page,"brakeFit","yes");
    await click(page,"#zp-wheelchair-submit");
    assert.match(await page.$eval(result,el=>el.textContent),/bezdušová kola – 136 kg/);
    await assertAffiliateOffers(page,result+' [data-zp-wheelchair-merchant-link]');
    await choose(page,"propulsion","companion");
    await checkNoMerchant(page,result);
    await click(page,"#zp-wheelchair-submit");
    assert.equal(await visible(page,'#zp-wheelchair-fit-stage [name="wheelType"]'),false,
      "Basic companion wheelchair must not ask about P3641 wheels");
    await choose(page,"seatFit","yes");
    await choose(page,"widthFit","yes");
    await choose(page,"loadFit","yes");
    await choose(page,"brakeFit","yes");
    await click(page,"#zp-wheelchair-submit");
    assert.ok(await count(page,result+' [data-zp-wheelchair-merchant-link]')>0,
      "Basic companion purchase path should remain available with verified fit");
    console.log("PASS 0.8.71 wheelchair P3641 variant-specific capacity, no bypass and reset");
    await page.close();
  }

  // After 0.8.98: powered P2961 model can be previewed, but checkout
  // requires confirmed real-world slopes, thresholds and surface.
  if (releaseAtLeast("0.8.98")) {
    const page = await open("/invalidni-vozik/");
    const result = "#zp-wheelchair-result";
    const offer = result + " [data-zp-wheelchair-merchant-link]";
    await choose(page, "propulsion", "powered");
    await choose(page, "transferAbility", "independent");
    await choose(page, "joystickSafe", "yes");
    await choose(page, "chargingReady", "yes");
    await click(page, "#zp-wheelchair-submit");
    assert.equal(await visible(page, "#zp-wheelchair-preview"), true);
    assert.match(await page.$eval("#zp-wheelchair-preview", el => el.textContent), /P2961/);
    await checkPreviewNoCommerce(page, "#zp-wheelchair-preview");
    assert.equal(await visible(page, '#zp-wheelchair-fit-stage [name="routeFit"]'), true,
      "Powered P2961 needs its own route-fit check");
    assert.equal(await visible(page, '#zp-wheelchair-fit-stage [name="brakeFit"]'), false,
      "Powered P2961 must not ask about mechanical parking brakes");
    for (const name of ["seatFit","widthFit","loadFit"]) await choose(page, name, "yes");
    await click(page, "#zp-wheelchair-submit");
    assert.equal(await visible(page, "#zp-wheelchair-errors"), true,
      "Missing route answer must be highlighted");
    await checkNoMerchant(page, result);
    for (const answer of ["unknown", "no"]) {
      await choose(page, "routeFit", answer);
      await click(page, "#zp-wheelchair-submit");
      await checkNoMerchant(page, result);
    }
    await choose(page, "routeFit", "yes");
    await click(page, "#zp-wheelchair-submit");
    await assertAffiliateOffers(page, offer);
    await choose(page, "routeFit", "no");
    assert.equal(await visible(page, result), false, "Changed route must revoke previous offer");
    await checkNoMerchant(page, result);
    await click(page, "#zp-wheelchair-submit");
    await checkNoMerchant(page, result);
    console.log("PASS 0.8.98 powered P2961 route fit, affiliate lock and answer revocation");
    await page.close();
  }

  // After release 0.8.72: every ADL product has real-world fit verification
  // before an outbound offer; switching the user's task invalidates the result.
  if (releaseAtLeast("0.8.72")) {
    for (const scenario of [
      {task:"drink",problem:"grip_or_spill",other:[]},
      {task:"stabilize_container",problem:"container_moves",other:[["stableSurface","yes"]]},
      {task:"one_hand_meal",problem:"one_hand_setup",other:[["oneHandUse","yes"]]},
      {task:"open_packaging",problem:"grip_or_twist",other:[]}
    ]) {
      const page=await open("/sobestacnost/");
      const result="#zp-adl-result",merchant=result+" [data-zp-adl-merchant-link]";
      await choose(page,"task",scenario.task);
      await choose(page,"mainProblem",scenario.problem);
      for(const [name,value] of scenario.other) await choose(page,name,value);
      await click(page,"#zp-adl-submit");
      assert.equal(await visible(page,"#zp-adl-product-fit"),true,scenario.task+" fit checklist missing");
      assert.ok((await page.$eval("#zp-adl-product-fit-checks",el=>el.textContent)).length>45,
        "Real candidate fit checks must be readable");
      await checkNoMerchant(page,result);
      for (const answer of ["unknown","no"]) {
        await choose(page,"productFit",answer);
        await click(page,"#zp-adl-submit");
        await checkNoMerchant(page,result);
      }
      await choose(page,"productFit","yes");
      await click(page,"#zp-adl-submit");
      await assertAffiliateOffers(page,merchant);
      await choose(page,"task","other");
      assert.equal(await visible(page,result),false,"ADL task change must invalidate old result");
      await checkNoMerchant(page,result);
      assert.equal(await visible(page,"#zp-adl-product-fit"),false,
        "ADL task change must clear the verification step");
      console.log("PASS ADL fit confirmation and stale-CTA invalidation:",scenario.task);
      await page.close();
    }
  }

  // SEO 0.8.73: informative page must be genuinely published and discoverable,
  // with source material, two-way internal links and zero purchase-gate bypass.
  if (releaseAtLeast("0.8.73")) {
    const path="/otazky-pred-propustenim-z-nemocnice/";
    const page=await open(path);
    const seo=await page.evaluate(() => ({
      title:document.title,
      description:document.querySelector('meta[name="description"]')?.content || "",
      canonical:document.querySelector('link[rel="canonical"]')?.href || "",
      headings:[...document.querySelectorAll("main h1")].map(e=>e.textContent.trim()),
      official:[...document.querySelectorAll("main a[href]")].filter(a=>
        ["nzip.cz", "www.nzip.cz", "vzp.cz", "www.vzp.cz"].includes(a.hostname.toLowerCase())).length,
      internal:[...document.querySelectorAll("main a[href]")].map(a=>a.getAttribute("href"))
        .filter(Boolean),
      overflow:document.documentElement.scrollWidth-window.innerWidth
    }));
    assert.equal(seo.headings.length,1,"Discharge questions must have one H1");
    assert.match(seo.headings[0],/Na co se zeptat v nemocnici před propuštěním domů/);
    assert.match(seo.title,/Na co se zeptat před propuštěním z nemocnice/);
    assert.match(seo.description,/propouštěcí zpráva|domácí péče/);
    assert.equal(new URL(seo.canonical).pathname,path,"Discharge article canonical must be self-reference");
    assert.ok(seo.official>=4,"Discharge questions need official evidence links");
    assert.ok(seo.internal.some(h=>h.includes("/navrat-z-nemocnice/")),"No link to first-night Advisor");
    assert.ok(seo.overflow<=2,"Mobile overflow on discharge article");
    assert.equal(await count(page,"main [data-zp-merchant-link], main [data-zp-adl-merchant-link], main .zp-offer"),0,
      "Informational page may not bypass purchase gates");
    await page.close();
    for(const back of ["/navrat-z-nemocnice/","/bezpecny-byt-pro-seniora/"]){
      const hub=await open(back);
      assert.ok(await count(hub,'a[href*="/otazky-pred-propustenim-z-nemocnice/"]')>0,
        "Missing reciprocal internal link on "+back);
      await hub.close();
    }
    console.log("PASS 0.8.73 noncommercial discharge article, SEO metadata, sources and cluster links");
  }

  console.log("SUCCESS: 14 live Advisor forms + updated mechanical brakes/variants and 0.8.98 powered route-fit verification");
} finally {
  await browser.close();
}
