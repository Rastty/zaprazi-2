import test from "node:test";
import assert from "node:assert/strict";
import { recommendBathroom } from "../src/bathroom/engine.js";

test("fails closed when main need is unknown", () => {
  const result = recommendBathroom({ primaryNeed: "unknown" });
  assert.equal(result.status, "needs_more_info");
  assert.deepEqual(result.recommendations, []);
});

test("requires transfer clarification before any exact product", () => {
  const result = recommendBathroom({ primaryNeed: "raise_toilet", loadFit: "yes" });
  assert.equal(result.status, "needs_more_info");
  assert.ok(result.missing.includes("transferAbility"));
});

test("routes physical-assistance transfer to professional check", () => {
  const result = recommendBathroom({
    primaryNeed: "shower_seated",
    transferAbility: "person_assist",
    loadFit: "yes",
    floorStable: "yes",
    spaceFit: "yes"
  });
  assert.equal(result.status, "professional_check");
  assert.deepEqual(result.recommendations, []);
});

test("raised toilet seat requires toilet fit", () => {
  const result = recommendBathroom({
    primaryNeed: "raise_toilet",
    transferAbility: "independent",
    loadFit: "yes",
    toiletFit: "unknown",
    feetFlatAtRaisedHeight: "yes"
  });
  assert.equal(result.status, "needs_more_info");
  assert.ok(result.missing.includes("toiletFit"));
});

test("raised toilet seat refuses unsafe foot support", () => {
  const result = recommendBathroom({
    primaryNeed: "raise_toilet",
    transferAbility: "independent",
    loadFit: "yes",
    toiletFit: "yes",
    feetFlatAtRaisedHeight: "no"
  });
  assert.equal(result.status, "needs_more_info");
  assert.deepEqual(result.recommendations, []);
});

test("returns WC raiser only after critical fit gates pass", () => {
  const result = recommendBathroom({
    primaryNeed: "raise_toilet",
    transferAbility: "independent",
    loadFit: "yes",
    toiletFit: "yes",
    feetFlatAtRaisedHeight: "yes"
  });
  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p2868"]);
});

test("unverified wall fixing does not return wall-mounted grab rail", () => {
  const result = recommendBathroom({
    primaryNeed: "toilet_support",
    transferAbility: "steadying",
    loadFit: "yes",
    wallFixing: "unverified"
  });
  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p2015"]);
});

test("verified wall fixing allows fixed rail comparison", () => {
  const result = recommendBathroom({
    primaryNeed: "toilet_support",
    transferAbility: "steadying",
    loadFit: "yes",
    wallFixing: "verified"
  });
  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p2131", "unizdrav-p2015"]);
});

test("static commode requires stable floor and space", () => {
  const result = recommendBathroom({
    primaryNeed: "toilet_nearby",
    transferAbility: "independent",
    loadFit: "yes",
    floorStable: "yes",
    spaceFit: "unknown"
  });
  assert.equal(result.status, "needs_more_info");
  assert.ok(result.missing.includes("spaceFit"));
});

test("returns static commode after fit gates pass", () => {
  const result = recommendBathroom({
    primaryNeed: "toilet_nearby",
    transferAbility: "steadying",
    loadFit: "yes",
    floorStable: "yes",
    spaceFit: "yes"
  });
  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p2807"]);
});

test("returns shower chair only after stable floor and space fit", () => {
  const result = recommendBathroom({
    primaryNeed: "shower_seated",
    transferAbility: "independent",
    loadFit: "yes",
    floorStable: "yes",
    spaceFit: "yes"
  });
  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p2062"]);
});

test("bath transfer asks for bath-specific transfer ability", () => {
  const result = recommendBathroom({
    primaryNeed: "bath_transfer",
    transferAbility: "independent",
    loadFit: "yes",
    bathTransferIndependent: "unknown",
    bathFit: "yes"
  });
  assert.equal(result.status, "needs_more_info");
  assert.ok(result.missing.includes("bathTransferIndependent"));
  assert.deepEqual(result.recommendations, []);
});

test("bath transfer fails closed when physical help is needed", () => {
  const result = recommendBathroom({
    primaryNeed: "bath_transfer",
    transferAbility: "independent",
    loadFit: "yes",
    bathTransferIndependent: "no",
    bathFit: "yes"
  });
  assert.equal(result.status, "professional_check");
  assert.deepEqual(result.recommendations, []);
});

test("bath transfer asks for transfer-bench fit when rim seat does not fit", () => {
  const result = recommendBathroom({
    primaryNeed: "bath_transfer",
    transferAbility: "independent",
    loadFit: "yes",
    bathTransferIndependent: "yes",
    bathFit: "no",
    bathBenchFit: "unknown"
  });
  assert.equal(result.status, "needs_more_info");
  assert.ok(result.missing.includes("bathBenchFit"));
  assert.deepEqual(result.recommendations, []);
});

test("bath transfer returns transfer bench when rim seat does not fit but bench placement does", () => {
  const result = recommendBathroom({
    primaryNeed: "bath_transfer",
    transferAbility: "independent",
    loadFit: "yes",
    bathTransferIndependent: "yes",
    bathFit: "no",
    bathBenchFit: "yes"
  });
  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p2203"]);
});

test("bath transfer returns no product when neither rim seat nor transfer bench fits", () => {
  const result = recommendBathroom({
    primaryNeed: "bath_transfer",
    transferAbility: "independent",
    loadFit: "yes",
    bathTransferIndependent: "yes",
    bathFit: "no",
    bathBenchFit: "no"
  });
  assert.equal(result.status, "needs_more_info");
  assert.deepEqual(result.recommendations, []);
});

test("bath transfer returns exact seat only after independent-transfer and fit gates pass", () => {
  const result = recommendBathroom({
    primaryNeed: "bath_transfer",
    transferAbility: "independent",
    loadFit: "yes",
    bathTransferIndependent: "yes",
    bathFit: "yes"
  });
  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["besco-bs008"]);
  assert.ok(result.acquisition.some((item) => item.id === "check_reimbursement_alternative"));
});

test("combined shower/toilet chair remains professional-check only", () => {
  const result = recommendBathroom({
    primaryNeed: "combined_shower_toilet",
    transferAbility: "steadying",
    loadFit: "yes",
    floorStable: "yes",
    spaceFit: "yes"
  });
  assert.equal(result.status, "professional_check");
  assert.deepEqual(result.recommendations, []);
});

test("output never echoes raw input payload", () => {
  const input = {
    primaryNeed: "toilet_support",
    transferAbility: "steadying",
    loadFit: "yes",
    wallFixing: "verified",
    duration: "short_term"
  };
  const result = recommendBathroom(input);
  assert.equal("input" in result, false);
  assert.equal("answers" in result, false);
});


test("candidate acquisition includes reimbursement-alternative check", () => {
  const result = recommendBathroom({
    primaryNeed: "shower_seated",
    transferAbility: "independent",
    loadFit: "yes",
    floorStable: "yes",
    spaceFit: "yes",
    duration: "long_term"
  });

  assert.equal(result.status, "candidate");
  const check = result.acquisition.find((item) => item.id === "check_reimbursement_alternative");
  assert.ok(check);
  assert.match(check.reason, /konkrétním prostředku/i);
  assert.match(check.reason, /není automaticky hrazený/i);
});

test("short-term acquisition keeps rental comparison plus reimbursement check", () => {
  const result = recommendBathroom({
    primaryNeed: "toilet_nearby",
    transferAbility: "independent",
    loadFit: "yes",
    floorStable: "yes",
    spaceFit: "yes",
    duration: "short_term"
  });

  assert.deepEqual(result.acquisition.map((item) => item.id), [
    "compare_rent_buy",
    "check_reimbursement_alternative"
  ]);
});

test("professional-check branches do not offer acquisition shortcuts", () => {
  const result = recommendBathroom({
    primaryNeed: "combined_shower_toilet",
    transferAbility: "steadying",
    loadFit: "yes"
  });

  assert.equal(result.status, "professional_check");
  assert.deepEqual(result.acquisition, []);
});


test("steadying low-WC transfer returns raised seat with arms after fit gates pass", () => {
  const result = recommendBathroom({
    primaryNeed: "raise_toilet",
    transferAbility: "steadying",
    loadFit: "yes",
    toiletFit: "yes",
    feetFlatAtRaisedHeight: "yes"
  });

  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["besco-bs15"]);
  assert.match(result.recommendations[0].label, /madly/i);
});

test("steadying low-WC transfer still fails closed on unknown toilet fit", () => {
  const result = recommendBathroom({
    primaryNeed: "raise_toilet",
    transferAbility: "steadying",
    loadFit: "yes",
    toiletFit: "unknown",
    feetFlatAtRaisedHeight: "yes"
  });

  assert.equal(result.status, "needs_more_info");
  assert.deepEqual(result.recommendations, []);
});

test("physical-assistance low-WC transfer remains professional-check only", () => {
  const result = recommendBathroom({
    primaryNeed: "raise_toilet",
    transferAbility: "person_assist",
    loadFit: "yes",
    toiletFit: "yes",
    feetFlatAtRaisedHeight: "yes"
  });

  assert.equal(result.status, "professional_check");
  assert.deepEqual(result.recommendations, []);
});


test("multifunction WC/shower branch requires stable floor", () => {
  const result = recommendBathroom({
    primaryNeed: "multifunction_toilet_shower",
    transferAbility: "independent",
    loadFit: "yes",
    floorStable: "unknown",
    spaceFit: "yes"
  });
  assert.equal(result.status, "needs_more_info");
  assert.ok(result.missing.includes("floorStable"));
});

test("multifunction WC/shower branch requires enough space", () => {
  const result = recommendBathroom({
    primaryNeed: "multifunction_toilet_shower",
    transferAbility: "steadying",
    loadFit: "yes",
    floorStable: "yes",
    spaceFit: "unknown"
  });
  assert.equal(result.status, "needs_more_info");
  assert.ok(result.missing.includes("spaceFit"));
});

test("multifunction WC/shower branch returns DMA EH-CMDA after safety gates pass", () => {
  const result = recommendBathroom({
    primaryNeed: "multifunction_toilet_shower",
    transferAbility: "steadying",
    loadFit: "yes",
    floorStable: "yes",
    spaceFit: "yes",
    duration: "long_term"
  });
  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["dma-eh-cmda"]);
  assert.ok(result.acquisition.some((item) => item.id === "check_reimbursement_alternative"));
  assert.match(result.disclaimer, /5019427/);
});

test("multifunction WC/shower branch stays closed for physical assistance", () => {
  const result = recommendBathroom({
    primaryNeed: "multifunction_toilet_shower",
    transferAbility: "person_assist",
    loadFit: "yes",
    floorStable: "yes",
    spaceFit: "yes"
  });
  assert.equal(result.status, "professional_check");
  assert.deepEqual(result.recommendations, []);
});
