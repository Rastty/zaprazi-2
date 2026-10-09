import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resetBathroomLoadFitOnBathVariantChange } from "../src/bathroom/variant-fit.js";

function createMockForm() {
  const inputs = [
    { value: "yes", checked: true },
    { value: "no", checked: false },
    { value: "unknown", checked: false }
  ];
  const group = {
    classList: { removed: [], remove(name) { this.removed.push(name); } },
    removedAttributes: [],
    removeAttribute(name) { this.removedAttributes.push(name); },
    querySelectorAll(selector) {
      assert.equal(selector, 'input[type="radio"]');
      return inputs;
    }
  };
  return {
    inputs, group,
    form: {
      querySelector(selector) {
        assert.equal(selector, '[data-zp-bath-required="loadFit"]');
        return group;
      }
    }
  };
}

test("switching 110 kg bench to 100 kg bath seat revokes previous load confirmation", () => {
  const { inputs, group, form } = createMockForm();
  assert.equal(resetBathroomLoadFitOnBathVariantChange(form, "bathFit"), true);
  assert.ok(inputs.every(input => !input.checked));
  assert.ok(group.classList.removed.includes("is-error"));
  assert.ok(group.removedAttributes.includes("aria-invalid"));
});

test("switching 100 kg bath seat to 110 kg bench also revokes load confirmation", () => {
  const { inputs, form } = createMockForm();
  inputs[0].checked = false;
  inputs[1].checked = true;
  assert.equal(resetBathroomLoadFitOnBathVariantChange(form, "bathFit"), true);
  assert.ok(inputs.every(input => !input.checked));
});

test("unrelated question does not discard the current load confirmation", () => {
  const { inputs, form } = createMockForm();
  assert.equal(resetBathroomLoadFitOnBathVariantChange(form, "duration"), false);
  assert.equal(inputs[0].checked, true);
});

test("missing load-capacity group fails closed instead of ignoring a changed variant", () => {
  assert.throws(
    () => resetBathroomLoadFitOnBathVariantChange({ querySelector: () => null }, "bathFit"),
    /mandatory Bathroom load-fit gate/
  );
});

test("main Bathroom Advisor asks bath variant before capacity and calls invalidation on change", () => {
  const app = readFileSync(new URL("../assets/js/bathroom-advisor.js", import.meta.url), "utf8");
  const fitSequence = app.match(/const fitNames = \[([^\]]+)\]/);
  assert.ok(fitSequence);
  assert.ok(fitSequence[1].indexOf('"bathFit"') < fitSequence[1].indexOf('"loadFit"'));
  assert.ok(fitSequence[1].indexOf('"bathBenchFit"') < fitSequence[1].indexOf('"loadFit"'));
  assert.match(app, /resetBathroomLoadFitOnBathVariantChange\(form, event\.target\?\.name\)/);
});
