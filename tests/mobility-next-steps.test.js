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
    "/pujceni-choditka/#rozpocet-pujceni-choditka", "/choditko-na-pojistovnu/"
  ]);
  assert.match(next.items[0].label, /půjčení/);
  assert.match(next.items[0].action, /půjčovné/);
  assert.ok(next.items.every(item => !item.href.includes("?")), "Advice must never put answers in URLs");
});

test("long-term candidate preserves the actual engine acquisition ordering", () => {
  const result = recommendMobility({
    environment: "both", supportNeed: "steady", handBrakes: "yes", duration: "long_term"
  });
  assert.equal(result.status, "candidate");
  const next = getMobilityNextSteps(result);
  assert.equal(next.canCompareAcquisition, true);
  assert.deepEqual(next.items.map(x => x.href), [
    "/pujceni-choditka/#rozpocet-pujceni-choditka", "/choditko-na-pojistovnu/"
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

test("main Homepage Advisor uses the same safe acquisition paths as specialist Advisors", () => {
  const app = fs.readFileSync(new URL("../assets/js/mobility-advisor.js", import.meta.url), "utf8");
  assert.match(app, /import \{ getMobilityNextSteps \}/);
  assert.match(app, /const next = getMobilityNextSteps\(output\)/);
  assert.match(app, /const acquisition = next\.items\.length/);
  assert.match(app, /escapeHtml\(item\.href\)/);
  assert.match(app, /escapeHtml\(item\.action\)/);
  assert.match(app, /renderMobilityProductFitGate/);
  assert.match(app, /installMobilityProductFitGate/);
  assert.doesNotMatch(app, /localStorage|sendBeacon|new URLSearchParams/);
});

test("main Homepage Advisor acquisition paths remain blocked for unsafe or undecided input", () => {
  for (const input of [
    { environment: "outdoor", supportNeed: "steady", handBrakes: "unknown" },
    { environment: "outdoor", supportNeed: "steady", handBrakes: "no" },
    { environment: "indoor", supportNeed: "steady", canLiftWalker: "unknown" },
    { environment: "both", supportNeed: "person_assist" },
    { environment: "indoor", supportNeed: "unknown" },
    { environment: "indoor", supportNeed: "light" }
  ]) {
    const result = recommendMobility(input);
    assert.notEqual(result.status, "candidate");
    assert.deepEqual(getMobilityNextSteps(result).items, []);
  }
});

test("unknown duration offers both independent acquisition checks across safe walker families", () => {
  for (const input of [
    { environment: "indoor", supportNeed: "steady", canLiftWalker: "yes", duration: "unknown" },
    { environment: "both", supportNeed: "steady", handBrakes: "yes", duration: "unknown" }
  ]) {
    const result = recommendMobility(input);
    assert.equal(result.status, "candidate");
    assert.deepEqual(result.acquisition.map(item => item.id), ["compare_acquisition", "check_reimbursement"]);
    const next = getMobilityNextSteps(result);
    assert.equal(next.canCompareAcquisition, true);
    assert.deepEqual(next.items.map(item => item.href), [
      "/pujceni-choditka/#rozpocet-pujceni-choditka",
      "/choditko-na-pojistovnu/"
    ]);
    assert.ok(next.items.every(item => !item.href.includes("?")));
  }
});

test("rollator candidate renders one insurer route from the shared whitelist only", () => {
  const script = fs.readFileSync(new URL("../assets/js/rollator-advisor.js", import.meta.url), "utf8");
  assert.match(script, /getMobilityNextSteps\(out\)/);
  assert.match(script, /next\.items\.map\(item/);
  assert.doesNotMatch(script, /\$\{out\.status==="candidate"\?.*\/choditko-na-pojistovnu\//,
    "Obsolete independent insurer CTA would duplicate the whitelisted acquisition link");
  const result = recommendMobility({
    environment: "both", supportNeed: "steady", handBrakes: "yes", duration: "unknown"
  });
  assert.equal(result.status, "candidate");
  assert.deepEqual(getMobilityNextSteps(result).items.filter(x=>x.href==="/choditko-na-pojistovnu/").map(x=>x.id),
    ["check_reimbursement"]);
});
