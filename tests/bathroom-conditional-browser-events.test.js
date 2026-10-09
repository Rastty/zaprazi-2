import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

import { recommendBathroom } from "../src/bathroom/engine.js";
import { getBathroomProducts } from "../src/bathroom/catalog.js";
import { renderBathroomAcquisition } from "../src/bathroom/acquisition-view.js";
import { formatBathroomFacts } from "../src/bathroom/product-facts-display.js";

// Exercise each actual advisor's final click handler, not just a source regex.
// The two-stage preview has already succeeded; conditional fit fieldsets may
// legitimately be hidden when a different physical construction was chosen.
function runFinalStep(kind, choices, hiddenNames = []) {
  const attr = kind === "bath-transfer" ? "zpBathRequired" : "zpSupportRequired";
  const dashAttr = kind === "bath-transfer" ? "data-zp-bath-required" : "data-zp-support-required";
  const required = kind === "bath-transfer"
    ? ["transferAbility", "bathTransferIndependent", "bathFit", "bathBenchFit", "loadFit"]
    : ["transferAbility", "wallFixing", "loadFit", "supportFrameFit"];
  const hidden = new Set(hiddenNames);
  const fields = required.map(name => ({
    hidden: hidden.has(name),
    dataset: { [attr]: name },
    classList: { toggle() {} },
    closest(selector) {
      return selector === "[hidden]" && this.hidden ? this : null;
    },
    focus() { throw Error("Cannot focus hidden or missing fieldset: " + name); }
  }));
  const form = {
    addEventListener() {},
    querySelector(selector) {
      const name = /^input\[name="([^"]+)"\]:checked$/.exec(selector)?.[1];
      return name && Object.hasOwn(choices, name) ? { value: choices[name] } : null;
    },
    querySelectorAll(selector) {
      assert.equal(selector, "[" + dashAttr + "]");
      return fields;
    }
  };
  const result = {
    hidden: true, innerHTML: "",
    querySelectorAll() { return []; },
    focus() {}
  };
  const errors = { hidden: true, textContent: "" };
  const handlers = [];
  const submit = {
    addEventListener(event, fn) {
      assert.equal(event, "click");
      handlers.push(fn);
    }
  };
  const lookup = new Map([
    ["#zp-" + kind + "-advisor", form],
    ["#zp-" + kind + "-result", result],
    ["#zp-" + kind + "-submit", submit],
    ["#zp-" + kind + "-errors", errors]
  ]);
  const events = [];
  const filename = "assets/js/" + kind + "-advisor.js";
  const source = fs.readFileSync(new URL("../" + filename, import.meta.url), "utf8")
    .replace(/^import .*;\s*$/gm, "");

  vm.runInNewContext(source, {
    document: { querySelector(id) { return lookup.get(id) ?? null; } },
    window: {
      ZaPraziRuntime: { affiliateMap: {} },
      dispatchEvent(event) { events.push(event.detail.event); }
    },
    CustomEvent: class { constructor(_type, init) { this.detail = init.detail; } },
    recommendBathroom, getBathroomProducts, renderBathroomAcquisition,
    formatBathroomFacts,
    installBathroomMicroStaging() { return true; }
  }, { filename, timeout: 1500 });

  assert.equal(handlers.length, 1, kind + " final click handler installed");
  handlers[0]();
  return { result, errors, fields, events };
}

test("bath rim-mounted seat does not require hidden alternative bench size", () => {
  const out = runFinalStep("bath-transfer", {
    transferAbility: "independent",
    bathTransferIndependent: "yes",
    bathFit: "yes",
    loadFit: "yes"
  }, ["bathBenchFit"]);
  assert.equal(out.errors.hidden, true);
  assert.equal(out.result.hidden, false);
  assert.match(out.result.innerHTML, /BESCO BS008|BS008/);
  assert.match(out.result.innerHTML, /data-zp-bath-merchant-link/);
});

test("bath bench branch still requires its own visible fit confirmation", () => {
  const base = {
    transferAbility: "independent",
    bathTransferIndependent: "yes",
    bathFit: "no",
    loadFit: "yes"
  };
  const blocked = runFinalStep("bath-transfer", base);
  assert.equal(blocked.errors.hidden, false);
  assert.equal(blocked.result.hidden, true);

  const verified = runFinalStep("bath-transfer", {
    ...base, bathBenchFit: "yes"
  });
  assert.equal(verified.errors.hidden, true);
  assert.match(verified.result.innerHTML, /P2203/);
  assert.match(verified.result.innerHTML, /data-zp-bath-merchant-link/);
});

test("verified wall-mounted WC rail does not require hidden floor-frame fit", () => {
  const out = runFinalStep("toilet-support", {
    transferAbility: "steadying",
    wallFixing: "verified",
    loadFit: "yes"
  }, ["supportFrameFit"]);
  assert.equal(out.errors.hidden, true);
  assert.equal(out.result.hidden, false);
  assert.match(out.result.innerHTML, /P2131/);
  assert.match(out.result.innerHTML, /data-zp-support-merchant-link/);
});

test("WC floor support requires fit if wall cannot be safely verified", () => {
  const base = {
    transferAbility: "steadying",
    wallFixing: "unverified",
    loadFit: "yes"
  };
  const blocked = runFinalStep("toilet-support", base);
  assert.equal(blocked.errors.hidden, false);
  assert.equal(blocked.result.hidden, true);

  const verified = runFinalStep("toilet-support", {
    ...base, supportFrameFit: "yes"
  });
  assert.equal(verified.errors.hidden, true);
  assert.match(verified.result.innerHTML, /P2015/);
});

test("all five micro advisors ignore hidden required questions but retain visible safety gates", () => {
  for (const name of [
    "bath-transfer", "toilet-support", "toilet-riser", "shower-chair", "toilet-chair"
  ]) {
    const app = fs.readFileSync(new URL("../assets/js/" + name + "-advisor.js", import.meta.url), "utf8");
    assert.match(app, /\.filter\(\(fieldset\) => !fieldset\.hidden && !fieldset\.closest\('\[hidden\]'\)\)/);
    assert.match(app, /if\s*\(!validate\(\)\)\s*return/);
  }
});
