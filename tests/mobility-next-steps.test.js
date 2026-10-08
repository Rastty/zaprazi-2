import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { recommendMobility } from "../src/mobility/engine.js";
import { getMobilityNextSteps } from "../src/mobility/next-steps.js";

test("safe indoor candidate offers both rental and insurer guidance, respecting engine order", () => {
  const result = recommendMobility({
    environment: "indoor", supportNeed: "steady", canLiftWalker: "yes", duration: "short_term"
  });
  assert.equal(result.status, "candidate");
  const next = getMobilityNextSteps(result);
  assert.equal(next.canCompareAcquisition, true);
  assert.deepEqual(next.items.map(x => x.href), [
    "/pujceni-choditka/", "/choditko-na-pojistovnu/"
  ]);
  assert.match(next.items[0].label, /půjčení/);
});

test("long-term candidate preserves the actual engine acquisition ordering", () => {
  const result = recommendMobility({
    environment: "both", supportNeed: "steady", handBrakes: "yes", duration: "long_term"
  });
  assert.equal(result.status, "candidate");
  const next = getMobilityNextSteps(result);
  assert.equal(next.canCompareAcquisition, true);
  assert.deepEqual(next.items.map(x => x.href), [
    "/pujceni-choditka/", "/choditko-na-pojistovnu/"
  ]);
});

test("missing brake, person assist, and lighter needs never expose acquisition links", () => {
  const cases = [
    { environment: "both", supportNeed: "steady", handBrakes: "no" },
    { environment: "indoor", supportNeed: "person_assist", canLiftWalker: "yes" },
    { environment: "indoor", supportNeed: "light", canLiftWalker: "yes" },
    { environment: "indoor", supportNeed: "steady", canLiftWalker: "unknown" }
  ];
  for (const input of cases) {
    const result = recommendMobility(input);
    assert.notEqual(result.status, "candidate");
    assert.deepEqual(getMobilityNextSteps(result), { canCompareAcquisition: false, items: [] });
  }
});

test("unknown upstream acquisition IDs cannot create outgoing URLs", () => {
  const next = getMobilityNextSteps({
    status: "candidate",
    acquisition: [{ id: "unapproved", href: "https://unsafe.example/", label: "x" }]
  });
  assert.deepEqual(next, { canCompareAcquisition: true, items: [] });
});

test("both standalone journeys show safety-gated next steps and a way to edit answers", () => {
  for (const name of ["indoor-walker-advisor.js", "rollator-advisor.js"]) {
    const script = fs.readFileSync(new URL("../assets/js/" + name, import.meta.url), "utf8");
    assert.match(script, /getMobilityNextSteps\(out\)/);
    assert.match(script, /next\.canCompareAcquisition/);
    assert.match(script, /data-zp-edit-answers/);
    assert.match(script, /\$\{nextMarkup\}/);
    assert.match(script, /form\.scrollIntoView/);
    assert.doesNotMatch(script, /sendBeacon|localStorage|fetch\(/);
  }
});
