import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

// Exercise the real shared stage-one change and submit listeners.
// Fields moved into the hidden fit stage must NEVER be requested prematurely.
function setup() {
  const answers = new Map();
  const listeners = { change: [], click: [] };
  const radioNames = ["transferAbility", "wallFixing", "loadFit", "supportFrameFit"];
  const fields = new Map(radioNames.map(name => {
    const group = {
      name, hidden: false, parent: null, attrs: {},
      classList: {
        values: new Set(),
        toggle(key, enabled) { enabled ? this.values.add(key) : this.values.delete(key); },
        remove(key) { this.values.delete(key); },
        contains(key) { return this.values.has(key); }
      },
      getAttribute(key) { return key === "data-zp-support-required" ? name : null; },
      setAttribute(key, value) { this.attrs[key] = value; },
      removeAttribute(key) { delete this.attrs[key]; },
      closest(key) { return key === "[hidden]" && (this.hidden || this.parent?.hidden) ? (this.hidden ? this : this.parent) : null; },
      querySelectorAll(key) { assert.equal(key, 'input[type="radio"]'); return this.radios; },
      focus() { this.focused = true; }
    };
    group.radios = ["yes", "no", "verified", "unverified", "independent"].map(value => ({
      name, value, checked: false,
      closest(key) { return key === "fieldset" ? group : (key === "#zp-toilet-support-fit-stage" && group.parent === fitStage ? fitStage : null); }
    }));
    return [name, group];
  }));
  const fitStage = {
    hidden: true, children: [],
    appendChild(group) { group.parent = this; this.children.push(group); },
    querySelectorAll(key) { assert.equal(key, 'input[type="radio"]'); return this.children.flatMap(group => group.radios); }
  };
  const preview = { hidden: true, innerHTML: "", focus() { this.focused = true; } };
  const result = { hidden: true, innerHTML: "", focus() { this.focused = true; } };
  const errors = { hidden: true, textContent: "" };
  const submit = {
    textContent: "1. Ukázat možný výrobek",
    addEventListener(name, fn) { assert.equal(name, "click"); listeners.click.push(fn); }
  };
  const form = {
    addEventListener(name, fn) { assert.equal(name, "change"); listeners.change.push(fn); },
    querySelector(selector) {
      const match = /^input\[name="([^"]+)"\](:checked)?$/.exec(selector);
      if (!match) throw Error("Unexpected selector " + selector);
      const radios = fields.get(match[1])?.radios || [];
      return match[2] ? radios.find(radio => radio.checked) ?? null : radios[0] ?? null;
    },
    querySelectorAll(selector) {
      assert.equal(selector, "[data-zp-support-required]");
      return [...fields.values()];
    }
  };
  const nodes = {
    "#zp-toilet-support-preview": preview,
    "#zp-toilet-support-fit-stage": fitStage
  };
  const source = fs.readFileSync(new URL("../src/bathroom/micro-staging.js", import.meta.url), "utf8")
    .replace(/^import .*;\s*$/gm, "").replace(/^export\s+/gm, "");
  // Inject the imported preview/catalogue functions into an isolated browser-like context.
  const realm = {
    document: { querySelector(sel) { return nodes[sel] || null; } },
    previewBathroomCandidates() { return { status:"unverified_preview", productCandidateIds:["test-chair"] }; },
    getBathroomProducts() { return [{ id:"test-chair", name:"Kontrolní výrobek", facts:{}, selectionNotes:[], evidence:[] }]; },
    formatBathroomFacts() { return []; }
  };
  vm.runInNewContext(source + "\n;globalThis._install=installBathroomMicroStaging;", realm, { filename:"micro-staging.js", timeout:1500 });
  assert.equal(realm._install({
    form, result, submit, errors,
    key:"toilet-support", requiredAttr:"data-zp-support-required",
    fitNames:["loadFit", "supportFrameFit"], primaryNeed:"toilet_support",
    conditionalFit:{ supportFrameFit: value => value("wallFixing") !== "verified" }
  }), true);
  const choose = (name, value) => {
    for(const radio of fields.get(name).radios) radio.checked = radio.value === value;
    const chosen = fields.get(name).radios.find(radio => radio.value === value);
    assert.ok(chosen);
    for(const cb of listeners.change) cb({ target:chosen });
  };
  const submitStep = () => {
    let stopped = false;
    const event = { preventDefault(){}, stopImmediatePropagation(){ stopped = true; } };
    for(const cb of listeners.click) cb(event);
    assert.equal(stopped, true);
  };
  return { choose, submitStep, fields, fitStage, preview, result, errors, submit };
}

test("five-advisor shared stage-one validation updates as missing answers are provided", () => {
  const s = setup();
  s.choose("transferAbility","independent");
  assert.equal(s.errors.hidden, true, "no error before first submit");

  s.submitStep();
  assert.equal(s.errors.hidden, false);
  assert.match(s.errors.textContent, /jednu|zvýrazněnou otázku/);
  const missing = s.fields.get("wallFixing");
  assert.equal(missing.attrs["aria-invalid"],"true");
  assert.equal(missing.attrs.tabindex,"-1");
  assert.equal(missing.focused,true);
  assert.equal(missing.classList.contains("is-error"),true);
  assert.equal(s.fields.get("loadFit").attrs["aria-invalid"],undefined,"hidden fit check not yet requested");

  s.choose("wallFixing","verified");
  assert.equal(s.errors.hidden,true,"answered initial question clears alert instantly");
  assert.equal(s.errors.textContent,"");
  assert.equal(missing.attrs["aria-invalid"],undefined);
  assert.equal(missing.classList.contains("is-error"),false);

  s.submitStep();
  assert.equal(s.preview.hidden,false);
  assert.equal(s.fitStage.hidden,false);
  assert.equal(s.result.hidden,true);
  assert.doesNotMatch(s.preview.innerHTML,/href=|merchant-link|affiliateMap/);
  s.choose("loadFit","yes");
  assert.equal(s.fields.get("loadFit").radios.some(r=>r.checked),true);

  s.choose("wallFixing","unverified");
  assert.equal(s.fitStage.hidden,true,"situation changes must invalidate previous product fit");
  assert.equal(s.preview.hidden,true);
  assert.equal(s.fields.get("loadFit").radios.some(r=>r.checked),false,"old load confirmation must be erased");
  assert.equal(s.submit.textContent,"1. Ukázat možný výrobek");
  assert.equal(s.errors.hidden,true);
});
