import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { recommendMobility } from "../src/mobility/engine.js";
import { getMobilityNextSteps, getMobilitySafeRecovery } from "../src/mobility/next-steps.js";
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
  const focusActions = { focused: null, scrolled: false };
  const form = {
    addEventListener(type, callback) { (handlers[type] ||= []).push(callback); },
    scrollIntoView() { focusActions.scrolled = true; },
    querySelector(selector) {
      if (selector === ".zp-fieldset.is-error") return null;
      const match = selector.match(/^input\[name="([^"]+)"\](?::checked)?$/);
      if (!match) throw Error("Unknown form selector: " + selector);
      const name = match[1];
      const value = state[name];
      const checked = value === true || (typeof value === "string" && value !== "");
      if (!checked && selector.endsWith(":checked")) return null;
      return { name, value: checked ? (value === true ? "on" : value) : "",
        checked, closest() { return null; }, focus() { focusActions.focused = name; } };
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
    recommendMobility, getMobilityNextSteps, getMobilitySafeRecovery, getMobilityProducts,
    renderMobilityProductFitGate, installMobilityProductFitGate,
    canLinkEvidence, getRentalGuidance, getReimbursementGuidance,
    EVIDENCE_FRESHNESS_DAYS, evidenceFreshness
  };
  const file = "assets/js/mobility-advisor.js";
  const script = fs.readFileSync(new URL("../" + file, import.meta.url), "utf8")
    .replace(/^import .*;\s*$/gm, "");
  vm.runInNewContext(script, globals, { filename: file, timeout: 1500 });
  return { form, result, submitButton, errorBox, state, focusActions,
    editAnswers() { const onClick = handlers['result:click']?.at(-1); assert.ok(onClick);
      onClick({target: {closest(selector) {return selector === '[data-zp-edit-answers]' ? {} : null;}}}); } };
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
  assert.match(html, /<div class="zp-fit-locked-offers" hidden>[\s\S]*?data-zp-mobility-rental-link="1"/);
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
  assert.match(h.result.innerHTML, /Ruční brzdy nelze bezpečně ovládat/);
  assert.doesNotMatch(h.result.innerHTML, /zp-fit-locked-offers|data-zp-merchant-link|data-zp-mobility-rental-link|www.rehakomp.cz/);
});

test("safe Homepage Mobility offer is accompanied only by non-commercial acquisition links", () => {
  const h = createMobility({duration:"short_term"});
  h.submitButton.click();
  const html = h.result.innerHTML;
  assert.match(html, /href="\/pujceni-choditka\/#rozpocet-pujceni-choditka"/);
  assert.match(html, /href="\/choditko-na-pojistovnu\/"/);
  assert.match(html, /zp-fit-locked-offers" hidden/);
  assert.match(html, /potvrzením vhodnosti či nároku/);
  assert.equal(html.split(RENTAL_URL).length-1,1,
    "Existing model-specific rental provider stays behind its individual fit gate");
});

test("blocked Homepage Mobility journey has no acquisition navigation", () => {
  const h = createMobility({handBrakes:"no",seatNeeded:true});
  h.submitButton.click();
  assert.doesNotMatch(h.result.innerHTML, /zp-acquisition-summary|href="\/pujceni-choditka\/|href="\/choditko-na-pojistovnu\//);
});

test("blocked Homepage result offers a keyboard-safe return to the relevant question", () => {
  for (const spec of [
    {state:{environment:"indoor",supportNeed:"unknown"},focus:"supportNeed"},
    {state:{environment:"both",supportNeed:"person_assist"},focus:"supportNeed"},
    {state:{environment:"indoor",supportNeed:"steady",seatNeeded:false,canLiftWalker:"unknown"},focus:"canLiftWalker"},
    {state:{environment:"outdoor",supportNeed:"steady",seatNeeded:false,handBrakes:"no"},focus:"handBrakes"}
  ]) {
    const h = createMobility(spec.state);
    h.submitButton.click();
    assert.match(h.result.innerHTML, /data-zp-edit-answers="1"/);
    assert.doesNotMatch(h.result.innerHTML, /zp-fit-locked-offers|data-zp-merchant-link="1"/);
    h.editAnswers();
    assert.equal(h.focusActions.focused, spec.focus);
    assert.equal(h.focusActions.scrolled, true);
  }
});

test("Homepage candidate never confuses a completed recommendation with a blocked retry", () => {
  const h = createMobility({environment:"indoor",supportNeed:"steady",canLiftWalker:"yes",seatNeeded:false});
  h.submitButton.click();
  assert.match(h.result.innerHTML, /Ověřené výrobky k porovnání/);
  assert.doesNotMatch(h.result.innerHTML, /data-zp-edit-answers="1"/);
});

test("known unsafe brakes explain a blocking result without false missing-answer label", () => {
  const h = createMobility({handBrakes:"no",seatNeeded:true,duration:"short_term"});
  h.submitButton.click();
  assert.match(h.result.innerHTML, /Bezpečnostní omezení: je potřeba jiné řešení/);
  assert.match(h.result.innerHTML, /brzděný rollátor teď nevybírejte/);
  assert.doesNotMatch(h.result.innerHTML, /Ještě potřebujeme jednu informaci/);
  assert.doesNotMatch(h.result.innerHTML, /zp-fit-locked-offers|data-zp-merchant-link/);
  assert.doesNotMatch(h.result.innerHTML, /href="\/choditko-na-pojistovnu\//);
});
