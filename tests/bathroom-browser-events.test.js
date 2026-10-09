import test from "node:test";
import assert from "node:assert/strict";
import { installBathroomMicroStaging } from "../src/bathroom/micro-staging.js";
import { recommendBathroom } from "../src/bathroom/engine.js";

// Minimal DOM event harness: exercises actual capture-click / change behavior
// of the shared Browser Advisor staging helper, without third-party packages.
function setup(initialTransfer = "independent") {
  const groups = new Map(), radios = new Map(), events = {}, listeners = [];
  let finalInvocations = 0;
  const stage = {
    hidden: true,
    querySelectorAll(selector) {
      assert.equal(selector, 'input[type="radio"]');
      return [...radios.values()].filter(r => r.fieldset.parent === stage);
    },
    appendChild(group) { group.parent = this; }
  };
  const preview = { hidden: true, innerHTML: "", focused: 0, focus() { this.focused++; } };
  const result = { hidden: true, innerHTML: "", focus() {} };
  const errors = { hidden: true, textContent: "" };
  const submit = {
    textContent: "1. Ukázat možný výrobek",
    addEventListener(type, fn, capture = false) {
      assert.equal(type, "click");
      listeners.push({ fn, capture });
    },
    click() {
      const e = { stopped: false, preventDefault() {}, stopImmediatePropagation() { this.stopped = true; } };
      for (const { fn } of [...listeners].sort((a,b)=>Number(b.capture)-Number(a.capture))) {
        if (e.stopped) break;
        fn(e);
      }
      return e.stopped;
    }
  };
  const fields = ["transferAbility", "toiletFit", "feetFlatAtRaisedHeight", "loadFit"];
  for (const name of fields) {
    const fieldset = {
      name,
      parent: null,
      getAttribute(attr) { return attr === "data-zp-toilet-required" ? name : null; },
      classList: { toggle() {} },
      closest(selector) { return selector === "[hidden]" && this.parent?.hidden ? stage : null; },
      focus() {}
    };
    const radio = { name, checked: false, fieldset, closest(selector) {
      return selector === "fieldset" ? fieldset : selector === "#zp-toilet-riser-fit-stage" && fieldset.parent === stage ? stage : null;
    }};
    groups.set(name, fieldset);
    radios.set(name, radio);
  }
  radios.get("transferAbility").value = initialTransfer;
  radios.get("transferAbility").checked = true;
  const form = {
    addEventListener(type, fn) { (events[type] ||= []).push(fn); },
    querySelector(selector) {
      const match = selector.match(/^input\[name="([^"]+)"\](?::checked)?$/);
      if (!match) return null;
      const radio = radios.get(match[1]);
      return selector.endsWith(":checked") && !radio?.checked ? null : radio || null;
    },
    querySelectorAll(selector) {
      assert.equal(selector, "[data-zp-toilet-required]");
      return [...groups.values()];
    },
    change(name, value) {
      const radio = radios.get(name);
      radio.checked = true;
      radio.value = value;
      for (const fn of events.change || []) fn({ target: radio });
    }
  };
  const oldDoc = globalThis.document;
  globalThis.document = { querySelector(selector) {
    return { "#zp-toilet-riser-preview":preview, "#zp-toilet-riser-fit-stage":stage }[selector] || null;
  }};
  try {
    const ready = installBathroomMicroStaging({
      form, result, submit, errors, key: "toilet-riser",
      requiredAttr:"data-zp-toilet-required",
      fitNames:["toiletFit","feetFlatAtRaisedHeight","loadFit"],
      primaryNeed:"raise_toilet"
    });
    assert.equal(ready, true);
  } finally {
    globalThis.document = oldDoc;
  }
  submit.addEventListener("click",()=>{
    finalInvocations++;
    const out = recommendBathroom({
      primaryNeed:"raise_toilet",
      transferAbility:radios.get("transferAbility").value,
      loadFit:radios.get("loadFit").checked ? radios.get("loadFit").value : "unknown",
      toiletFit:radios.get("toiletFit").checked ? radios.get("toiletFit").value : "unknown",
      feetFlatAtRaisedHeight:radios.get("feetFlatAtRaisedHeight").checked ? radios.get("feetFlatAtRaisedHeight").value : "unknown"
    });
    result.innerHTML = out.status==="candidate" ? "<a href='merchant.example'>Merchant</a>" : "<p>Do not buy yet.</p>";
  });
  return { groups, radios, form, stage, preview, result, errors, submit, get finalInvocations() {return finalInvocations;} };
}

test("a visitor must see an identifiable product before checking its measurements", () => {
  const h=setup();
  assert.equal(h.stage.hidden,true);
  assert.equal(h.groups.get("loadFit").parent,h.stage);
  assert.equal(h.submit.click(),true, "first click intercepts final recommendation");
  assert.equal(h.finalInvocations,0);
  assert.equal(h.stage.hidden,false);
  assert.equal(h.preview.hidden,false);
  assert.match(h.preview.innerHTML,/UNIZDRAV.*P2868/i);
  assert.match(h.preview.innerHTML,/nosnost|Maximální/);
  assert.doesNotMatch(h.preview.innerHTML,/href=|affiliate|data-zp-.*merchant-link/);
  assert.equal(h.submit.textContent,"2. Vyhodnotit parametry");
});

test("step two with unknown or no answers never renders merchant, all yes may", () => {
  const h=setup();
  h.submit.click();
  assert.equal(h.submit.click(),false);
  assert.equal(h.finalInvocations,1);
  assert.doesNotMatch(h.result.innerHTML,/href=/);
  for (const [name,val] of [["toiletFit","yes"],["feetFlatAtRaisedHeight","yes"],["loadFit","no"]]) h.form.change(name,val);
  h.submit.click();
  assert.doesNotMatch(h.result.innerHTML,/href=/, "known inadequate capacity must never unlock offer");
  h.form.change("loadFit","yes");
  h.submit.click();
  assert.match(h.result.innerHTML,/href=/, "all explicitly verified facts may unlock offer");
});

test("changing a situation answer invalidates the previous model and confirmations", () => {
  const h=setup();
  h.submit.click();
  for(const name of ["toiletFit","feetFlatAtRaisedHeight","loadFit"]) h.form.change(name,"yes");
  h.form.change("transferAbility","independent");
  assert.equal(h.stage.hidden,true);
  assert.equal(h.preview.hidden,true);
  assert.equal(h.submit.textContent,"1. Ukázat možný výrobek");
  assert.ok(["toiletFit","feetFlatAtRaisedHeight","loadFit"].every(name=>!h.radios.get(name).checked));
  assert.equal(h.submit.click(),true);
  assert.equal(h.finalInvocations,0);
  assert.equal(h.stage.hidden,false);
});

test("assisted transfers cannot expose preliminary products or retailer offers",()=>{
  const h=setup("person_assist");
  assert.equal(h.submit.click(),true);
  assert.equal(h.preview.hidden,true);
  assert.equal(h.stage.hidden,true);
  assert.equal(h.result.hidden,false);
  assert.doesNotMatch(h.result.innerHTML,/href=/);
  assert.equal(h.finalInvocations,0);
});
