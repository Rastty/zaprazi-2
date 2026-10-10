import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { renderMobilityProductFitGate, installMobilityProductFitGate } from "../src/mobility/offer-fit-gate.js";

const read = path => fs.readFileSync(new URL("../" + path, import.meta.url), "utf8");
const checkKinds = html => [...html.matchAll(/data-zp-mobility-fit-confirm="([^"]+)"/g)].map(m => m[1]);

test("model-specific rollator brakes are mandatory for purchase and rental link gates", () => {
  const offer = '<a href="https://example.test/offer">Nabídka</a>';
  const simple = renderMobilityProductFitGate(offer);
  const roll = renderMobilityProductFitGate(offer, { requireBrakeFit: true });
  assert.deepEqual(checkKinds(simple), ["load", "width", "height"]);
  assert.deepEqual(checkKinds(roll), ["load", "width", "height", "brakes"]);
  assert.match(roll, /Ruční brzdy tohoto konkrétního rollátoru/);
  assert.match(roll, /zastavení i bezpečně zajistit/);
  assert.match(roll, /class="zp-fit-locked-offers" hidden/);
  assert.match(roll, /Potvrzeno 0 z 4 kontrol/);
  assert.equal(roll.match(/href=/g)?.length, 1, "offer remains only inside hidden gate");
  const extra = renderMobilityProductFitGate(offer, {
    requireBrakeFit: true, requireSeatFit: true, requireTransportFit: true
  });
  assert.deepEqual(checkKinds(extra), ["load", "width", "height", "brakes", "seat", "transport"]);
  assert.match(extra, /Potvrzeno 0 z 6 kontrol/);
});

test("all three mobility renderers use the exact product family for brake validation", () => {
  const main = read("assets/js/mobility-advisor.js");
  const indoor = read("assets/js/indoor-walker-advisor.js");
  const rollator = read("assets/js/rollator-advisor.js");
  assert.ok(main.includes('requireBrakeFit: product.solutionFamily === "rollator"'));
  assert.ok(indoor.includes('requireBrakeFit:p.solutionFamily==="rollator"'));
  assert.ok(rollator.includes('requireBrakeFit:p.solutionFamily==="rollator"'));
  assert.ok(main.includes('renderRentalOffers(product.id, duration)'));
  for (const app of [main, indoor, rollator]) {
    assert.match(app, /installMobilityProductFitGate\(/);
    assert.doesNotMatch(app, /localStorage|sessionStorage|sendBeacon|FormData/);
  }
});

test("brake confirmation is isolated to the given rollator and withdrawing it re-locks all its offers", () => {
  const events = [];
  const root = { addEventListener(type, handler) { assert.equal(type, "change"); events.push(handler); } };
  installMobilityProductFitGate(root);
  assert.equal(events.length, 1);
  const buildGate = (num) => {
    const keys = ["load", "width", "height", "brakes"];
    const checks = keys.map(key => ({ kind: key, checked: false }));
    const offers = { hidden: true };
    const progress = { textContent: "" };
    const gate = {
      querySelectorAll(selector) { assert.equal(selector, '[data-zp-mobility-fit-confirm]'); return checks; },
      querySelector(selector) {
        if(selector === ".zp-fit-locked-offers") return offers;
        if(selector === "[data-zp-fit-progress]") return progress;
        throw Error(selector);
      }
    };
    const fire = (key, value) => {
      const check = checks.find(c => c.kind === key);
      check.checked = value;
      events[0]({ target: {
        matches(selector) { return selector === '[data-zp-mobility-fit-confirm]'; },
        closest(selector) { assert.equal(selector, ".zp-mobility-fit-gate"); return gate; }
      }});
    };
    return { num, checks, offers, progress, fire };
  };
  const a = buildGate("A"), b = buildGate("B");
  for(const key of ["load","width","height"]) a.fire(key,true);
  assert.equal(a.offers.hidden,true,"three dimensions must not bypass rollator brakes");
  assert.match(a.progress.textContent,/3 z 4/);
  for(const key of ["load","width","height","brakes"]) b.fire(key,true);
  assert.equal(b.offers.hidden,false);
  assert.equal(a.offers.hidden,true,"approval for another model must not unlock first");
  a.fire("brakes",true);
  assert.equal(a.offers.hidden,false);
  a.fire("brakes",false);
  assert.equal(a.offers.hidden,true,"revoked confirmation must immediately re-lock merchant/rental links");
  assert.match(a.progress.textContent,/3 z 4/);
});
