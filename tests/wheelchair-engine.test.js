import test from "node:test";
import assert from "node:assert/strict";
import { recommendWheelchair } from "../src/wheelchair/engine.js";

test("companion branch returns Basic after fit gates pass", () => {
  const result = recommendWheelchair({
    propulsion: "companion",
    transferAbility: "steadying",
    seatFit: "yes",
    widthFit: "yes",
    loadFit: "yes",
    duration: "long_term"
  });

  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p4384"]);
  assert.ok(result.acquisition.some((item) => item.id === "check_insurer"));
});

test("self-propelled branch returns lightweight manual chair", () => {
  const result = recommendWheelchair({
    propulsion: "self_manual",
    wheelType: "pneumatic",
    seatWidthVariant: "48",
    transferAbility: "independent",
    manualControlSafe: "yes",
    seatFit: "yes",
    widthFit: "yes",
    loadFit: "yes"
  });

  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p3641"]);
  assert.match(result.recommendations[0].reason, /pohánět rukama/i);
});

test("mixed manual branch uses the same dual-use chair", () => {
  const result = recommendWheelchair({
    propulsion: "mixed_manual",
    wheelType: "tubeless",
    seatWidthVariant: "51",
    transferAbility: "steadying",
    manualControlSafe: "yes",
    seatFit: "yes",
    widthFit: "yes",
    loadFit: "yes"
  });

  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p3641"]);
  assert.match(result.recommendations[0].reason, /střídat/i);
});

test("manual propulsion requires practical steering and stopping safety", () => {
  for (const propulsion of ["self_manual", "mixed_manual"]) {
    const unknown = recommendWheelchair({
      propulsion,
      transferAbility: "independent",
      manualControlSafe: "unknown",
      seatFit: "yes",
      widthFit: "yes",
      loadFit: "yes"
    });
    assert.equal(unknown.status, "needs_more_info");
    assert.ok(unknown.missing.includes("manualControlSafe"));
    assert.deepEqual(unknown.recommendations, []);

    const unsafe = recommendWheelchair({
      propulsion,
      transferAbility: "independent",
      manualControlSafe: "no",
      seatFit: "yes",
      widthFit: "yes",
      loadFit: "yes"
    });
    assert.equal(unsafe.status, "professional_check");
    assert.deepEqual(unsafe.recommendations, []);
  }
});

test("powered branch requires practical joystick safety", () => {
  const result = recommendWheelchair({
    propulsion: "powered",
    transferAbility: "independent",
    seatFit: "yes",
    widthFit: "yes",
    loadFit: "yes",
    joystickSafe: "unknown",
    chargingReady: "yes"
  });

  assert.equal(result.status, "needs_more_info");
  assert.ok(result.missing.includes("joystickSafe"));
  assert.deepEqual(result.recommendations, []);
});

test("powered branch requires charging setup", () => {
  const result = recommendWheelchair({
    propulsion: "powered",
    transferAbility: "independent",
    seatFit: "yes",
    widthFit: "yes",
    loadFit: "yes",
    joystickSafe: "yes",
    chargingReady: "unknown"
  });

  assert.equal(result.status, "needs_more_info");
  assert.ok(result.missing.includes("chargingReady"));
});

test("powered branch returns exact electric chair after all gates pass", () => {
  const result = recommendWheelchair({
    propulsion: "powered",
    transferAbility: "independent",
    seatFit: "yes",
    widthFit: "yes",
    loadFit: "yes",
    joystickSafe: "yes",
    chargingReady: "yes",
    duration: "long_term"
  });

  assert.equal(result.status, "candidate");
  assert.deepEqual(result.recommendations[0].productCandidateIds, ["unizdrav-p2961"]);
  assert.match(result.recommendations[0].parameters.join(" "), /62 kg/);
  assert.match(result.recommendations[0].parameters.join(" "), /86,5 cm/);
});

test("physical assistance transfer remains professional-check only", () => {
  const result = recommendWheelchair({
    propulsion: "companion",
    transferAbility: "person_assist",
    seatFit: "yes",
    widthFit: "yes",
    loadFit: "yes"
  });

  assert.equal(result.status, "professional_check");
  assert.deepEqual(result.recommendations, []);
});

test("unknown load fit returns no exact product without asking raw weight", () => {
  const result = recommendWheelchair({
    propulsion: "self_manual",
    wheelType: "pneumatic",
    seatWidthVariant: "48",
    transferAbility: "independent",
    manualControlSafe: "yes",
    seatFit: "yes",
    widthFit: "yes",
    loadFit: "unknown"
  });

  assert.equal(result.status, "needs_more_info");
  assert.deepEqual(result.recommendations, []);
  assert.match(result.nextStep, /Přesnou hmotnost/i);
});

test("failed seat fit returns no exact product", () => {
  const result = recommendWheelchair({
    propulsion: "companion",
    transferAbility: "independent",
    seatFit: "no",
    widthFit: "yes",
    loadFit: "yes"
  });

  assert.equal(result.status, "needs_more_info");
  assert.deepEqual(result.recommendations, []);
});

test("short-term acquisition leads with rental", () => {
  const result = recommendWheelchair({
    propulsion: "companion",
    transferAbility: "independent",
    seatFit: "yes",
    widthFit: "yes",
    loadFit: "yes",
    duration: "short_term"
  });

  assert.equal(result.acquisition[0].id, "rent_first");
});


test("P3641 requires exact wheel type and separately confirmed variant capacity",()=>{
  for(const propulsion of ["self_manual","mixed_manual"]){
    const input={propulsion,transferAbility:"independent",manualControlSafe:"yes",seatFit:"yes",widthFit:"yes",loadFit:"yes",seatWidthVariant:"48"};
    for(const wheelType of ["unknown",undefined]){
      const result=recommendWheelchair({...input,...(wheelType?{wheelType}:{})});
      assert.equal(result.status,"needs_more_info");
      assert.deepEqual(result.recommendations,[]);
      assert.deepEqual(result.missing,["wheelType"]);
    }
    const pneumatic=recommendWheelchair({...input,wheelType:"pneumatic"});
    assert.equal(pneumatic.status,"candidate");
    assert.match(pneumatic.recommendations[0].parameters.join(" "),/pneumatická kola – 125 kg/);
    const tubeless=recommendWheelchair({...input,wheelType:"tubeless"});
    assert.equal(tubeless.status,"candidate");
    assert.match(tubeless.recommendations[0].parameters.join(" "),/bezdušová kola – 136 kg/);
    assert.equal(recommendWheelchair({...input,wheelType:"wrong"}).status,"invalid_input");
  }
  assert.equal(recommendWheelchair({propulsion:"companion",transferAbility:"independent",seatFit:"yes",widthFit:"yes",loadFit:"yes"}).status,"candidate");
});
test("P3641 must identify the 48cm/51cm seat variant before accepting generic fit approvals", () => {
  const base = { propulsion: "self_manual", transferAbility: "independent",
    manualControlSafe: "yes", wheelType: "pneumatic",
    seatFit: "yes", widthFit: "yes", loadFit: "yes" };
  for (const variant of [undefined, "unknown"]) {
    const answer = recommendWheelchair({ ...base, ...(variant ? { seatWidthVariant: variant } : {}) });
    assert.equal(answer.status, "needs_more_info");
    assert.deepEqual(answer.recommendations, []);
    assert.deepEqual(answer.missing, ["seatWidthVariant"]);
  }
  const small = recommendWheelchair({ ...base, seatWidthVariant: "48" });
  const large = recommendWheelchair({ ...base, seatWidthVariant: "51" });
  assert.equal(small.status, "candidate");
  assert.equal(large.status, "candidate");
  assert.match(small.recommendations[0].parameters.join(" "), /sed 48 cm.*celková šířka 68 cm/);
  assert.match(large.recommendations[0].parameters.join(" "), /sed 51 cm.*celková šířka 70 cm/);
  assert.match(small.nextStep, /68 cm/);
  assert.match(large.nextStep, /70 cm/);
  assert.equal(recommendWheelchair({ ...base, seatWidthVariant: "47" }).status, "invalid_input");
  assert.equal(recommendWheelchair({ ...base, seatWidthVariant: "48", seatFit: "unknown" }).status, "needs_more_info");
  assert.equal(recommendWheelchair({ ...base, seatWidthVariant: "51", widthFit: "no" }).status, "needs_more_info");
  assert.equal(recommendWheelchair({ propulsion: "companion", transferAbility: "independent", seatFit: "yes", widthFit: "yes", loadFit: "yes" }).status, "candidate");
});
