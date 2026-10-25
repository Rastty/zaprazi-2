import assert from "node:assert/strict";
import {accessSync, constants} from "node:fs";
import puppeteer from "puppeteer-core";

// Live-only, read-only acceptance for problem-focused SEO entries.
// Never infer that a merged theme version was deployed. The REST value is the
// authoritative live gate; PR workflows may run against the previous release.
const origin = (process.env.ZP_LIVE_ORIGIN || "https://zaprazi.cz").replace(/\/$/, "");
const chrome = [process.env.CHROME_BIN, "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable", "/usr/bin/chromium"].filter(Boolean).find(path => {
  try { accessSync(path, constants.X_OK); return true; } catch { return false; }
});
assert.ok(chrome, "Browser executable unavailable");

const response = await fetch(origin + "/wp-json/zaprazi/v1/affiliate-readiness",
  {headers: {Accept: "application/json"}});
assert.equal(response.status, 200, "Live release readiness not available");
const readiness = await response.json();
assert.match(readiness.release || "", /^\d+\.\d+\.\d+$/, "Invalid live release");
assert.equal(readiness.integrity, "ok", "Theme deployment integrity is partial");

const atLeast = (version, minimum) => {
  const left = version.split(".").map(Number);
  const right = minimum.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if (left[i] !== right[i]) return left[i] > right[i];
  }
  return true;
};

const guides = [
  {
    release: "0.8.149",
    path: "/schody-pro-seniora-doma/",
    heading: /senior nezvládá schody/i,
    anchorIds: ["plan-schody", "situace-schody", "co-zmerit-schody", "prispevek-schody", "zdroje-schody"],
    checks: "#co-zmerit-schody .zp-decision-card",
    danger: /nezkoušejte riskantní přesun ani přenášení po schodech/i,
    source: "https://mpsv.gov.cz/prispevek-na-zvlastni-pomucku",
    parents: ["/bezpecny-byt-pro-seniora/", "/otazky-pred-propustenim-z-nemocnice/"],
    outbound: ["/invalidni-vozik/", "/projede-invalidni-vozik-dvermi/", "/otazky-pred-propustenim-z-nemocnice/"]
  },
  {
    release: "0.8.155",
    path: "/senior-nemuze-vstat-z-postele/",
    heading: /senior nemůže vstát z postele/i,
    anchorIds: ["co-delat-postel", "pomucky-k-posteli", "kontroly-postele", "co-dal-postel", "faq-postel-vstavani", "zdroje-postel-vstavani"],
    checks: "#kontroly-postele .zp-decision-card",
    danger: /bez odborného posouzení neurčuje konkrétní výrobek/i,
    source: "https://www.gov.uk/guidance/bed-rails-management-and-safe-use",
    parents: ["/", "/polohovaci-postel/", "/kompenzacni-pomucky-pro-seniory/", "/nocni-cesta-z-postele-na-wc/"],
    outbound: ["/polohovaci-postel/", "/polohovaci-postel-na-pojistovnu/", "/nocni-cesta-z-postele-na-wc/", "/navrat-z-nemocnice/", "/jak-vznika-doporuceni/"]
  },
  {
    release: "0.8.150",
    path: "/vstavani-z-kresla-pro-seniora/",
    heading: /senior nemůže vstát z křesla/i,
    anchorIds: ["jak-postupovat-kreslo", "porovnani-kresel", "mereni-kresla", "zpusob-porizeni-kresla", "zdroje-kreslo"],
    checks: "#mereni-kresla .zp-decision-card",
    danger: /nezkoušejte jej vytahovat za paže/i,
    source: "https://www.cuh.nhs.uk/patient-information/seating-and-ergonomics/",
    parents: ["/bezpecny-byt-pro-seniora/", "/kompenzacni-pomucky-pro-seniory/"],
    outbound: ["/bezpecny-byt-pro-seniora/", "/kompenzacni-pomucky-pro-seniory/", "/navrat-z-nemocnice/", "/jak-vznika-doporuceni/"]
  }
];

const browser = await puppeteer.launch({
  executablePath: chrome, headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
});
const open = async path => {
  const page = await browser.newPage();
  await page.setViewport({width: 390, height: 844, deviceScaleFactor: 1});
  page.setDefaultTimeout(12000);
  const res = await page.goto(origin + path, {waitUntil: "domcontentloaded", timeout: 35000});
  assert.equal(res?.status(), 200, "Guide or entry link is not HTTP 200: " + path);
  return page;
};

try {
  for (const guide of guides) {
    if (!atLeast(readiness.release, guide.release)) {
      console.log("NOT YET DEPLOYED: " + guide.path +
        " requires " + guide.release + "; live " + readiness.release);
      continue;
    }
    const page = await open(guide.path);
    const snapshot = await page.evaluate(spec => {
      const main = document.querySelector("main");
      const get = selector => document.querySelector(selector);
      const links = [...(main?.querySelectorAll("a[href]") || [])];
      return {
        version: get('meta[name="zaprazi-release"]')?.content,
        integrity: get('meta[name="zaprazi-integrity"]')?.content,
        title: document.title,
        description: get('meta[name="description"]')?.content || "",
        canonical: get('link[rel="canonical"]')?.href,
        robots: get('meta[name="robots"]')?.content || "",
        h1: [...(main?.querySelectorAll("h1") || [])].map(h => h.textContent.trim()),
        missingAnchors: spec.anchorIds.filter(id => !document.getElementById(id)),
        deadFragmentLinks: links.filter(a => a.hash &&
          a.origin === location.origin && a.pathname === location.pathname &&
          !document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a => a.href),
        checkCount: document.querySelectorAll(spec.checks).length,
        text: main?.innerText || "",
        sourcePresent: links.some(a => a.href === spec.source),
        prematureOffers: main?.querySelectorAll(".zp-offer, [data-zp-merchant-link], [data-zp-affiliate-target]").length || 0
      };
    }, guide);

    assert.equal(snapshot.version, readiness.release, "Page serves a different release: " + guide.path);
    assert.equal(snapshot.integrity, "ok", "Guide uses partial theme: " + guide.path);
    assert.equal(snapshot.h1.length, 1, "Guide must have exactly one main H1: " + guide.path);
    assert.match(snapshot.h1[0], guide.heading, "Wrong primary search intent: " + guide.path);
    assert.ok(snapshot.title.includes("Zápraží"), "Missing branded SEO title: " + guide.path);
    assert.ok(snapshot.description.length >= 70, "Missing useful meta description: " + guide.path);
    assert.equal(snapshot.canonical, origin + guide.path, "Guide must have HTTPS self canonical");
    assert.doesNotMatch(snapshot.robots, /noindex/i, "Guide must be indexable");
    assert.deepEqual(snapshot.missingAnchors, [], "Missing decision or source section: " + guide.path);
    assert.deepEqual(snapshot.deadFragmentLinks, [], "Broken within-page navigation: " + guide.path);
    assert.equal(snapshot.checkCount, 7, "Guide must render seven practical checks: " + guide.path);
    assert.match(snapshot.text, guide.danger, "Missing critical safety warning: " + guide.path);
    assert.equal(snapshot.sourcePresent, true, "Primary evidence link missing: " + guide.path);
    assert.equal(snapshot.prematureOffers, 0, "Ungated merchant offer in informational guide");

    await page.close();
    for (const parent of guide.parents) {
      const inbound = await open(parent);
      const linked = await inbound.evaluate(destination =>
        [...document.querySelectorAll("main a[href]")].some(a =>
          new URL(a.href).pathname === destination), guide.path);
      await inbound.close();
      assert.ok(linked, "Missing real inbound link from " + parent + " to " + guide.path);
    }
    for (const destination of guide.outbound) {
      const outbound = await open(destination);
      const canonical = await outbound.$eval('link[rel="canonical"]', node => node.href);
      assert.equal(canonical, origin + destination,
        "Related page must resolve with canonical HTTPS: " + destination);
      await outbound.close();
    }
    console.log("PASS " + guide.release + " live guide SEO, safety, 7 checks, inbound and resolved outbound links: " + guide.path);
  }
  console.log("PASS live problem-guide coverage at " + readiness.release);
} finally {
  await browser.close();
}
