import test from "node:test";
import assert from "node:assert/strict";
import { buildReturnHomePlan } from "../src/return-home/engine.js";

test("safe basic home setup can return ready_basic", () => {
  const result = buildReturnHomePlan({
    timing: "later",
    entranceReady: "yes",
    transferAbility: "independent",
    walking: "independent",
    toiletReady: "yes",
    bathroomReady: "yes",
    bedReady: "yes",
    wheelchairReady: "yes",
    homeCare: "not_needed"
  });

  assert.equal(result.status, "ready_basic");
  assert.deepEqual(result.blockers, []);
  assert.deepEqual(result.routes, []);
});

test("unsafe entrance blocks shopping-first discharge plan", () => {
  const result = buildReturnHomePlan({
    timing: "today_or_tomorrow",
    entranceReady: "no",
    transferAbility: "independent",
    walking: "needs_support",
    toiletReady: "yes",
    bathroomReady: "yes",
    bedReady: "yes",
    wheelchairReady: "yes",
    homeCare: "not_needed"
  });

  assert.equal(result.status, "blocked_before_discharge");
  assert.ok(result.blockers.some((item) => item.id === "entrance_not_ready"));
  assert.match(result.nextStep, /Nezačínejte nákupem/i);
});

test("person-assisted transfer is a hard blocker even if equipment is ready", () => {
  const result = buildReturnHomePlan({
    timing: "within_week",
    entranceReady: "yes",
    transferAbility: "person_assist",
    walking: "wheelchair_or_no_walk",
    toiletReady: "yes",
    bathroomReady: "yes",
    bedReady: "yes",
    wheelchairReady: "yes",
    homeCare: "not_needed"
  });

  assert.equal(result.status, "blocked_before_discharge");
  assert.ok(result.blockers.some((item) => item.id === "assisted_transfer"));
  assert.ok(result.dischargeActions.some((item) => item.id === "transfer_plan"));
});

test("walking support routes to Mobility Advisor", () => {
  const result = buildReturnHomePlan({
    timing: "within_week",
    entranceReady: "yes",
    transferAbility: "steadying",
    walking: "needs_support",
    toiletReady: "yes",
    bathroomReady: "yes",
    bedReady: "yes",
    wheelchairReady: "yes",
    homeCare: "not_needed"
  });

  assert.equal(result.status, "action_plan");
  const mobility = result.routes.find((item) => item.id === "mobility");
  assert.ok(mobility);
  assert.equal(mobility.href, "/#poradce");
});

test("wheelchair need routes to wheelchair Advisor", () => {
  const result = buildReturnHomePlan({
    timing: "within_week",
    entranceReady: "yes",
    transferAbility: "independent",
    walking: "wheelchair_or_no_walk",
    toiletReady: "yes",
    bathroomReady: "yes",
    bedReady: "yes",
    wheelchairReady: "no",
    homeCare: "not_needed"
  });

  const wheelchair = result.routes.find((item) => item.id === "wheelchair");
  assert.ok(wheelchair);
  assert.equal(wheelchair.href, "/invalidni-vozik/#poradce-vozik");
});

test("unsafe WC and bed route to existing advisors", () => {
  const result = buildReturnHomePlan({
    timing: "today_or_tomorrow",
    entranceReady: "yes",
    transferAbility: "steadying",
    walking: "independent",
    toiletReady: "no",
    bathroomReady: "yes",
    bedReady: "no",
    wheelchairReady: "yes",
    homeCare: "not_needed"
  });

  assert.ok(result.routes.some((item) => item.id === "toilet" && item.href.includes("/koupelna-a-wc/")));
  assert.ok(result.routes.some((item) => item.id === "bed" && item.href.includes("/polohovaci-postel/")));
  assert.ok(result.priorities.some((item) => item.id === "first_night_only"));
});

test("needed but unarranged home care becomes a discharge action", () => {
  const result = buildReturnHomePlan({
    timing: "today_or_tomorrow",
    entranceReady: "yes",
    transferAbility: "independent",
    walking: "independent",
    toiletReady: "yes",
    bathroomReady: "yes",
    bedReady: "yes",
    wheelchairReady: "yes",
    homeCare: "needed_not_arranged"
  });

  assert.ok(result.dischargeActions.some((item) => item.id === "arrange_home_health"));
  assert.match(
    result.dischargeActions.find((item) => item.id === "arrange_home_health").reason,
    /14 dní/
  );
});

test("unknown home-care need tells family to ask the hospital team", () => {
  const result = buildReturnHomePlan({
    timing: "within_week",
    entranceReady: "yes",
    transferAbility: "independent",
    walking: "independent",
    toiletReady: "yes",
    bathroomReady: "yes",
    bedReady: "yes",
    wheelchairReady: "yes",
    homeCare: "unknown"
  });

  assert.ok(result.dischargeActions.some((item) => item.id === "ask_home_health"));
});

test("engine never collects diagnosis or raw body weight", () => {
  const source = buildReturnHomePlan.toString();
  assert.doesNotMatch(source, /diagnos|operation|wound|medication|weightKg|bodyWeight/i);
});


test("unprepared WC and bed must not sound like a ready-to-go discharge", () => {
  const result = buildReturnHomePlan({
    timing: "today_or_tomorrow",
    entranceReady: "yes",
    transferAbility: "independent",
    walking: "independent",
    toiletReady: "no",
    bathroomReady: "yes",
    bedReady: "no",
    homeCare: "not_needed"
  });

  assert.equal(result.status, "action_plan");
  assert.match(result.headline, /zbývá ověřit nebo zajistit/i);
  assert.match(result.nextStep, /není potvrzení bezpečného návratu/i);
  assert.ok(result.routes.some((item) => item.id === "toilet"));
  assert.ok(result.routes.some((item) => item.id === "bed"));
});

test("uncertain transfer, mobility or home-care arrangements never imply readiness", () => {
  const scenarios = [
    { transferAbility: "unknown" },
    { walking: "unknown" },
    { walking: "wheelchair_or_no_walk", wheelchairReady: "no" },
    { homeCare: "unknown" },
    { homeCare: "needed_not_arranged" }
  ];
  const known = {
    timing: "later",
    entranceReady: "yes",
    transferAbility: "independent",
    walking: "independent",
    toiletReady: "yes",
    bathroomReady: "yes",
    bedReady: "yes",
    homeCare: "not_needed"
  };
  for (const situation of scenarios) {
    const result = buildReturnHomePlan({ ...known, ...situation });
    assert.equal(result.status, "action_plan", JSON.stringify(situation));
    assert.match(result.headline, /zbývá ověřit nebo zajistit/i, JSON.stringify(situation));
    assert.match(result.nextStep, /nemocničním týmem ještě před odjezdem/i);
  }
});

test("ready_basic output does not falsely instruct the family to follow nonexistent priorities", () => {
  const result = buildReturnHomePlan({
    timing: "later",
    entranceReady: "yes",
    transferAbility: "independent",
    walking: "independent",
    toiletReady: "yes",
    bathroomReady: "yes",
    bedReady: "yes",
    homeCare: "not_needed"
  });
  assert.equal(result.status, "ready_basic");
  assert.equal(result.priorities.length, 0);
  assert.doesNotMatch(result.nextStep, /Postupujte od nejvyšší priority/i);
  assert.match(result.nextStep, /nikoli posouzení zdravotní způsobilosti/i);
});

test("steadying support is not automatically discharge-ready even with other checks confirmed", () => {
  const result = buildReturnHomePlan({
    timing: "today_or_tomorrow",
    entranceReady: "yes",
    transferAbility: "steadying",
    walking: "independent",
    toiletReady: "yes",
    bathroomReady: "yes",
    bedReady: "yes",
    homeCare: "not_needed"
  });

  assert.equal(result.status, "action_plan");
  assert.match(result.headline, /zbývá ověřit nebo zajistit/i);
  assert.match(result.nextStep, /není potvrzení bezpečného návratu/i);
  const support = result.dischargeActions.find((item) => item.id === "confirm_transfer_support");
  assert.ok(support, "available transfer support must be checked before departure");
  assert.match(support.reason, /skutečně dostupná/i);
  assert.deepEqual(result.routes, [], "support verification must not invent a shopping offer");
});

test("walking with support requires a concrete first-night availability check", () => {
  const result = buildReturnHomePlan({
    timing: "later",
    entranceReady: "yes",
    transferAbility: "independent",
    walking: "needs_support",
    toiletReady: "yes",
    bathroomReady: "yes",
    bedReady: "yes",
    homeCare: "not_needed"
  });

  assert.equal(result.status, "action_plan");
  assert.match(result.headline, /zbývá ověřit nebo zajistit/i);
  assert.match(result.nextStep, /nemocničním týmem ještě před odjezdem/i);
  assert.ok(result.dischargeActions.some((item) => item.id === "confirm_walking_support"));
  assert.ok(result.routes.some((item) => item.id === "mobility" && item.href === "/#poradce"));
  assert.ok(result.routes.every((item) => item.href.startsWith("/")), "routes stay internal to existing safety-gated advisors");
});

test("independent transfers and walking do not introduce false support requirements", () => {
  const result = buildReturnHomePlan({
    timing: "later",
    entranceReady: "yes",
    transferAbility: "independent",
    walking: "independent",
    toiletReady: "yes",
    bathroomReady: "yes",
    bedReady: "yes",
    homeCare: "not_needed"
  });
  assert.equal(result.status, "ready_basic");
  assert.ok(!result.dischargeActions.some((item) => /confirm_(transfer|walking)_support/.test(item.id)));
});
