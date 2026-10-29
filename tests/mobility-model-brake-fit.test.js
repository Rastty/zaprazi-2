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
  assert.match(roll, /data-zp-fit-required="load,width,height,brakes"/);
  assert.match(roll, /Potvrzeno 0 z 4 kontrol/);
  // The new measurement guide is safe to open, but the product offer itself
  // must still occur only once and only inside the hidden model-fit gate.
  assert.equal(roll.match(/href="https:\/\/example\.test\/offer"/g)?.length, 1);
  assert.ok(roll.includes('class="zp-fit-locked-offers" hidden>'+offer+'</div>'));
  assert.ok(roll.includes('href="/co-zmerit-pred-vyberem-choditka/#co-zmerit"'));
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
    const checks = keys.map(key => ({ kind: key, checked: false,
      getAttribute(name) { assert.equal(name, "data-zp-mobility-fit-confirm"); return key; }
    }));
    const offers = { hidden: true };
    const progress = { textContent: "" };
    const gate = {
      getAttribute(name) { assert.equal(name, "data-zp-fit-required"); return keys.join(","); },
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


test("damaged or duplicate model-fit checkboxes never unlock a merchant offer", () => {
  let listener;
  installMobilityProductFitGate({addEventListener(type, handler) {
    assert.equal(type, "change"); listener = handler;
  }});
  const required = ["load", "width", "height", "brakes"];
  const checks = required.map(key => ({
    checked: true, key,
    getAttribute(name) {
      assert.equal(name, "data-zp-mobility-fit-confirm"); return this.key;
    }
  }));
  const offers = {hidden: true};
  const gate = {
    getAttribute(name) {
      assert.equal(name, "data-zp-fit-required"); return required.join(",");
    },
    querySelectorAll() { return checks; },
    querySelector(selector) {
      return selector === ".zp-fit-locked-offers" ? offers : {textContent: ""};
    }
  };
  const fire = () => listener({target: {
    matches: () => true, closest: () => gate
  }});
  fire(); assert.equal(offers.hidden, false, "Intact checklist can unlock");
  checks.pop(); fire();
  assert.equal(offers.hidden, true, "Missing brakes must re-lock");
  checks.push({...checks[0]}); fire();
  assert.equal(offers.hidden, true, "Duplicate load must not replace brakes");
  checks[3] = {
    checked: true, getAttribute: () => "brakes"
  };
  fire(); assert.equal(offers.hidden, false, "Restoring all exact checks unlocks");
  gate.getAttribute = () => null; fire();
  assert.equal(offers.hidden, true, "Missing required-check metadata fails closed");
});
