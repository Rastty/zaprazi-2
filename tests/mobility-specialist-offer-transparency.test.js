import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { recommendMobility } from "../src/mobility/engine.js";
import { getMobilityProducts } from "../src/mobility/catalog.js";
import { renderMobilityProductFitGate, installMobilityProductFitGate } from "../src/mobility/offer-fit-gate.js";
import { getMobilityNextSteps, getMobilitySafeRecovery } from "../src/mobility/next-steps.js";
import { EVIDENCE_FRESHNESS_DAYS, evidenceFreshness } from "../src/evidence/freshness.js";

function renderSpecialist(advisor, affiliate = true) {
  const indoor = advisor === "indoor-walker";
  const state = indoor
    ? { supportNeed: "steady", canLiftWalker: "no", duration: "unknown" }
    : { supportNeed: "steady", handBrakes: "yes", duration: "unknown" };
  const key = indoor
    ? "rehabilitacni-pomucky-cz:besco-wa21"
    : "lekarna-cz:meyra-ideal-3061982";
  const url = "https://www.dpbolvw.net/click-test-fixture";
  const form = {
    addEventListener() {},
    querySelector(selector) {
      const name = selector.match(/input\[name="([^"]+)"\]/)?.[1];
      if (!name || !state[name]) return null;
      return { value: state[name] };
    },
    querySelectorAll() { return []; }
  };
  const result = {
    hidden: true,
    innerHTML: "",
    addEventListener() {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    focus() {}
  };
  const submit = {
    clickHandler: null,
    addEventListener(type, handler) {
      assert.equal(type, "click");
      this.clickHandler = handler;
    }
  };
  const document = {
    querySelector(selector) {
      return {
        [`#zp-${advisor}-advisor`]: form,
        [`#zp-${advisor}-result`]: result,
        [`#zp-${advisor}-submit`]: submit,
        [`#zp-${advisor}-errors`]: { hidden: true, textContent: "" }
      }[selector] || null;
    }
  };
  const source = fs.readFileSync(new URL(`../assets/js/${advisor}-advisor.js`, import.meta.url), "utf8")
    .replace(/^import .*;\s*$/gm, "");
  vm.runInNewContext(source, {
    document,
    window: { ZaPraziRuntime: { affiliateMap: affiliate ? { [key]: url } : {} }, dispatchEvent() {} },
    CustomEvent: class {},
    recommendMobility, getMobilityProducts, renderMobilityProductFitGate,
    installMobilityProductFitGate, getMobilityNextSteps, getMobilitySafeRecovery,
    EVIDENCE_FRESHNESS_DAYS,
    evidenceFreshness:(checkedAt,days)=>evidenceFreshness(checkedAt,days,new Date("2026-11-19T12:00:00Z"))
  }, { timeout: 1500, filename: `${advisor}-advisor.js` });
  assert.ok(submit.clickHandler);
  submit.clickHandler();
  assert.equal(result.hidden, false);
  return { html: result.innerHTML, url };
}

for (const advisor of ["indoor-walker", "rollator"]) {
  test(`${advisor}: approved affiliate gets visible disclosure and honest merchant freshness inside the fit gate`, () => {
    const { html, url } = renderSpecialist(advisor);
    const locked = html.split('<div class="zp-fit-locked-offers" hidden>')[1];
    assert.ok(locked, "Retailer must remain behind the model-specific fit gate");
    assert.match(locked, /Partnerský odkaz/);
    assert.match(locked, /rel="noopener nofollow sponsored"/);
    assert.ok(locked.includes(url), "Exact configured affiliate destination is retained");
    if (advisor === "indoor-walker") {
      assert.doesNotMatch(locked, /Nabídka nebyla v posledních 30 dnech znovu ověřena/,
        "Rechecked WA21 must not be presented as stale in a fixed November snapshot");
    } else {
      assert.match(locked, /Nabídka nebyla v posledních 30 dnech znovu ověřena/,
        "Unresolved MEYRA offer must still disclose stale merchant evidence");
    }
    assert.match(locked, /Obchod uvádí|Lékárna.cz uvádí/,
      "Important direct-payment and insurance qualification remains visible");
  });

  test(`${advisor}: no configured affiliate remains a direct, non-sponsored merchant link`, () => {
    const { html } = renderSpecialist(advisor, false);
    const locked = html.split('<div class="zp-fit-locked-offers" hidden>')[1];
    assert.ok(locked);
    assert.doesNotMatch(locked, /Partnerský odkaz|rel="noopener nofollow sponsored"/);
    assert.match(locked, /Zobrazit produkt a dostupnost/);
    if (advisor === "indoor-walker") {
      assert.doesNotMatch(locked, /Nabídka nebyla v posledních 30 dnech znovu ověřena/);
    } else {
      assert.match(locked, /Nabídka nebyla v posledních 30 dnech znovu ověřena/);
    }
  });
}
