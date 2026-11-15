import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { MOBILITY_PRODUCTS, getMobilityProducts } from "../src/mobility/catalog.js";

const byId = (id) => MOBILITY_PRODUCTS.find((product) => product.id === id);

test("all three production models expose concrete, user-actionable conflicting specifications", () => {
  const wa17 = byId("besco-wa17");
  const wa21 = byId("besco-wa21");
  const meyra = byId("meyra-ideal-3061982");

  assert.match(wa17.specDiscrepancyNotice, /2,3 kg.*2,2 kg.*ověřte hmotnost/s);
  assert.match(wa21.specDiscrepancyNotice, /2,8 kg.*2,7 kg.*ověřte hmotnost/s);
  assert.match(meyra.specDiscrepancyNotice, /61,5 cm.*79–97 cm.*59 cm.*79–99 cm.*ověřte přesné/s);
  assert.equal(meyra.facts.widthCm, 61.5, "Keep the current manufacturer-width value rather than silently swapping manuals");
  assert.equal(meyra.facts.heightCm, "79–97");
  assert.ok(meyra.selectionNotes.every((note) => !note.includes("přesnou hodnotu nezobrazuje")),
    "Do not claim exact dimensions are hidden when they are visibly displayed");

  for (const product of getMobilityProducts([wa17.id, wa21.id, meyra.id])) {
    assert.ok(product.specDiscrepancyNotice.length > 80);
    assert.ok(product.offers.length > 0, "Keep the existing fit-gated route to each merchant");
  }
  assert.deepEqual(getMobilityProducts(["besco-wa78"]), [], "Conflicting OEM identity stays excluded");
});

test("MEYRA exposes both official manual variants beside the current product page", () => {
  const evidence = byId("meyra-ideal-3061982").evidence;
  assert.deepEqual(evidence.map((item) => item.type), [
    "manufacturer_manual", "manufacturer_older_manual", "manufacturer_product_page"
  ]);
  assert.ok(evidence[0].url.endsWith("/navod-k-pouziti-ideal-rollator.pdf"));
  assert.ok(evidence[1].url.endsWith("/Navod-k-pouziti-rollator-3061982.pdf"));
  assert.ok(evidence.every((item) => item.url.startsWith("https://")));
});

test("the homepage advisor shows discrepancies without a collapsed click, before model-fit offers", () => {
  const script = readFileSync(new URL("../assets/js/mobility-advisor.js", import.meta.url), "utf8");
  const cardStart = script.indexOf('<h4>${escapeHtml(product.name)}</h4>');
  const facts = script.indexOf('class="zp-facts"', cardStart);
  const notice = script.indexOf('data-zp-spec-discrepancy="1"', cardStart);
  const details = script.indexOf('<details>', cardStart);
  const sources = script.indexOf('renderSources(product.evidence', cardStart);
  const fitGate = script.indexOf('renderMobilityProductFitGate(renderOffers', cardStart);

  assert.ok(cardStart >= 0 && facts > cardStart && notice > facts && details > notice);
  assert.ok(sources > details && fitGate > sources,
    "The warning must precede the collapsed notes, cited sources and protected merchant offers");
  assert.ok(script.includes('escapeHtml(product.specDiscrepancyNotice)'),
    "Merchant/evidence notes must be HTML escaped");
  assert.ok(script.includes('manufacturer_older_manual: "Starší návod výrobce'),
    "Readers should recognize the old manual in the source list");
});

test("both specialized mobility advisors expose the same warning before their gated merchant links", () => {
  for (const path of ["indoor-walker-advisor.js", "rollator-advisor.js"]) {
    const script = readFileSync(new URL(`../assets/js/${path}`, import.meta.url), "utf8");
    const render = script.indexOf("const render=(p,allow)=>");
    const warning = script.indexOf('data-zp-spec-discrepancy="1"', render);
    const gate = script.indexOf("renderMobilityProductFitGate(", warning);
    assert.ok(render >= 0 && warning > render && gate > warning,
      `${path}: visible warning must precede merchant fit-gate markup`);
    assert.ok(script.includes("esc(p.specDiscrepancyNotice)"),
      `${path}: warning text must be escaped`);
    assert.match(script.slice(warning, gate), /\$\{specWarning\}/,
      `${path}: show warning in the product card before the fit gate`);
  }
});
