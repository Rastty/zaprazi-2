import test from "node:test";
import assert from "node:assert/strict";
import {recommendMobility} from "../src/mobility/engine.js";
import {verifyMobilityInvariants, withPrivateCanary}
  from "../scripts/lib/mobility-property-invariants.mjs";

const input = {
  environment: "indoor", supportNeed: "steady", canLiftWalker: "no",
  handBrakes: "unknown", seatNeeded: false, duration: "long_term"
};

test("Mobility fixed-vector candidate meets reusable fail-closed invariants", () => {
  const payload = withPrivateCanary(input);
  assert.doesNotThrow(() => verifyMobilityInvariants(payload, recommendMobility(payload)));
});

test("No offers when a decisive safety answer is missing", () => {
  const payload = withPrivateCanary({...input, canLiftWalker: "unknown"});
  assert.doesNotThrow(() => verifyMobilityInvariants(payload, recommendMobility(payload)));
});

test("Invariant rejects a fabricated offer or weakened fit condition", () => {
  const bad = recommendMobility(input);
  bad.recommendations[0].productCandidateIds = ["besco-wa17"];
  assert.throws(() => verifyMobilityInvariants(input, bad), /Cannot lift walker/);
});

test("Invariant rejects an unresolved input that leaks a CTA or private payload", () => {
  const payload = withPrivateCanary({...input, supportNeed: "unknown"});
  const bad = recommendMobility(payload);
  bad.acquisition = [{id: "buy_now"}];
  assert.throws(() => verifyMobilityInvariants(payload, bad), /No acquisition CTA/);
  const leaked = recommendMobility(input);
  leaked.debug = payload.privateNote;
  assert.throws(() => verifyMobilityInvariants(payload, leaked), /canary leaked/);
});
