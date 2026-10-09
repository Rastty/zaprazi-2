import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { recommendMobility } from "../src/mobility/engine.js";
import { getMobilityProducts } from "../src/mobility/catalog.js";
import { renderMobilityProductFitGate, installMobilityProductFitGate } from "../src/mobility/offer-fit-gate.js";
import { canLinkEvidence } from "../src/decision/evidence-links.js";
import { getRentalGuidance, getReimbursementGuidance, MOBILITY_ACQUISITION } from "../src/mobility/acquisition.js";
import { EVIDENCE_FRESHNESS_DAYS, evidenceFreshness } from "../src/evidence/freshness.js";

const RENTAL_URL = MOBILITY_ACQUISITION["meyra-ideal-3061982"].rental.url;

function createMobility(overrides = {}) {
  const state = {
    environment: "both",
    supportNeed: "steady",
    handBrakes: "yes",
    canLiftWalker: "unknown",
    duration: "short_term",
    seatNeeded: true,
    transportNeed: false,
    tightSpace: false,
    ...overrides
  };
  const handlers = {};
  const form = {
    addEventListener(type, callback) { (handlers[type] ||= []).push(callback); },
    querySelector(selector) {
      if (selector === ".zp-fieldset.is-error") return null;
      const match = selector.match(/^input\\[name="([^"]+)"\\]:checked$/);
      if (!match) throw Error("Unknown form selector: " + selector);
      const name = match[1];
      const value = state[name];
      return value === true || (typeof value === "string" && value !== "")
        ? { name, value: value === true ? "on" : value, checked: true }
        : null;
    },
    querySelectorAll(selector) {
      if (selector === "[data-zp-conditional]") return [];
      if (selector === "[data-zp-required-group]") return [];
      throw Error("Unknown form query: " + selector);
    }
  };
  const result = {
    hidden: true, innerHTML: "",
    addEventListener(type, callback) { (handlers["result:" + type] ||= []).push(callback); },
    querySelectorAll() { return []; },
    focus() {}
  };
  const submitButton = { onClick: null, addEventListener(type, cb) {
    assert.equal(type, "click"); this.onClick = cb;
  }, click() { assert.ok(this.onClick); this.onClick(); } };
  const errorBox = { hidden: true, textContent: "" };
  const globals = {
    document: { querySelector(selector) {
      return ({
        "#zp-mobility-advisor": form,
        "#zp-mobility-result": result,
        "#zp-mobility-submit": submitButton,
        "#zp-advisor-errors": errorBox
      })[selector] || null;
    }},
    window: { ZaPraziRuntime: { affiliateMap: {} }, dispatchEvent() {} },
    CustomEvent: class { constructor(type, options) { this.detail = options.detail; } },
    recommendMobility, getMobilityProducts,
    renderMobilityProductFitGate, installMobilityProductFitGate,
    canLinkEvidence, getRentalGuidance, getReimbursementGuidance,
    EVIDENCE_FRESHNESS_DAYS, evidenceFreshness
  };
  const file = "assets/js/mobility-advisor.js";
  const script = fs.readFileSync(new URL("../" + file, import.meta.url), "utf8")
    .replace(/^import .*;\\s*$/gm, "");
  vm.runInNewContext(script, globals, { filename: file, timeout: 1500 });
  return { form, result, submitButton, errorBox, state };
}

test("exact rollator rental URL is present only in the hidden model-fit-gated acquisition section", () => {
  const h = createMobility({ duration: "short_term", seatNeeded: true, transportNeed: true });
  h.submitButton.click();
  assert.equal(h.errorBox.hidden, true);
  assert.equal(h.result.hidden, false);
  const html = h.result.innerHTML;
  assert.match(html, /MEYRA Ideal Rollator/);
  assert.match(html, /zp-fit-locked-offers" hidden/);
  assert.match(html, /data-zp-mobility-rental-link="1"/);
  assert.match(html, /data-zp-merchant-link="1"/);
  assert.match(html, /data-zp-mobility-fit-confirm="seat"/);
  assert.match(html, /data-zp-mobility-fit-confirm="transport"/);
  assert.equal(html.split(RENTAL_URL).length - 1, 1, "there must not be a second ungated rental URL");
  assert.match(html, /<div class="zp-fit-locked-offers" hidden>[\\s\\S]*?data-zp-mobility-rental-link="1"/);
  const acquisition = html.split('<section class="zp-acquisition-evidence">')[1];
  assert.ok(acquisition, "still provide rental and SÚKL acquisition information");
  assert.match(acquisition, /RehaKomp/);
  assert.match(acquisition, /Odkaz na půjčení konkrétního modelu/);
  assert.doesNotMatch(acquisition, /data-zp-mobility-rental-link|Prověřit půjčení|href="https:\/\/www.rehakomp.cz/);
  assert.match(acquisition, /Otevřít oficiální záznam SÚKL/);
});

test("long-term rollator journey never shows an obsolete short-term rental CTA", () => {
  const h = createMobility({ duration: "long_term", seatNeeded: false });
  h.submitButton.click();
  assert.match(h.result.innerHTML, /MEYRA Ideal Rollator/);
  assert.doesNotMatch(h.result.innerHTML, /data-zp-mobility-rental-link/);
  assert.doesNotMatch(h.result.innerHTML, /href="https:\/\/www.rehakomp.cz/);
});

test("unsafe brake handling blocks model, purchase and rental routes", () => {
  const h = createMobility({ handBrakes: "no", seatNeeded: true });
  h.submitButton.click();
  assert.match(h.result.innerHTML, /bezpečné ovládání brzd/);
  assert.doesNotMatch(h.result.innerHTML, /zp-fit-locked-offers|data-zp-merchant-link|data-zp-mobility-rental-link|www.rehakomp.cz/);
});
