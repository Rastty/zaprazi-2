import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  SPECIALISTS, assertSpecialistOffer
} from "../scripts/audit-live-mobility-specialist-offers-230.mjs";

function goodSnapshot(spec, phase = "locked", stale = true) {
  return {
    cardCount: 1, modelMatches: true,
    required: [...spec.required], actual: [...spec.required],
    affiliateCount: 1, runtimeMatches: true, safeAffiliate: true,
    disclosure: true, suitabilityPolicy: true, merchantNote: true,
    staleWarning: stale, unlocked: phase === "complete"
  };
}

for (const spec of SPECIALISTS) {
  test(`${spec.id}: model-specific merchant offer remains locked until exact checks`, () => {
    const locked = goodSnapshot(spec);
    assert.doesNotThrow(() => assertSpecialistOffer(locked, spec, "locked", true));
    assert.throws(() => assertSpecialistOffer({ ...locked, unlocked: true }, spec, "locked", true),
      /opened before all model checks/);
    assert.doesNotThrow(() => assertSpecialistOffer(goodSnapshot(spec, "complete"), spec, "complete", true));
    assert.throws(() => assertSpecialistOffer(locked, spec, "complete", true),
      /opened before all model checks/);
  });

  test(`${spec.id}: disclosure, routing and dated evidence cannot disappear`, () => {
    for (const [name, error] of [
      ["runtimeMatches", /affiliate slot mismatch/],
      ["safeAffiliate", /unsafe outbound/],
      ["disclosure", /partner disclosure/],
      ["suitabilityPolicy", /commission-independence/],
      ["merchantNote", /purchase\/insurer note/],
      ["staleWarning", /freshness warning/]
    ]) {
      const damaged = { ...goodSnapshot(spec), [name]: false };
      assert.throws(() => assertSpecialistOffer(damaged, spec, "locked", true), error);
    }
    assert.doesNotThrow(() => assertSpecialistOffer(goodSnapshot(spec, "locked", false),
      spec, "locked", false), "A newly rechecked offer may correctly lack a stale warning");
  });

  test(`${spec.id}: exact model-fit structure may not be truncated or reordered`, () => {
    const damaged = goodSnapshot(spec);
    damaged.actual.pop();
    assert.throws(() => assertSpecialistOffer(damaged, spec, "locked", true), /fit checkboxes/);
    const reordered = goodSnapshot(spec);
    reordered.required.reverse();
    assert.throws(() => assertSpecialistOffer(reordered, spec, "locked", true), /model-fit controls/);
  });
}

test("production-only Chrome gate is wired; no WordPress or merchant write actions", () => {
  const workflow = readFileSync(new URL("../.github/workflows/production-advisor-qa.yml", import.meta.url), "utf8");
  assert.match(workflow, /scripts\/audit-live-mobility-specialist-offers-230\.mjs/);
  assert.match(workflow, /name: Check specialist Mobility offer disclosure and fit gates[\s\S]*?if: github\.event_name != 'pull_request'/);
  const script = readFileSync(new URL("../scripts/audit-live-mobility-specialist-offers-230.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(script, /request\.post\(|fetch\([^)]*method\s*:\s*["']POST|(?:\.click|goto)\([^)]*merchant/i);
});
