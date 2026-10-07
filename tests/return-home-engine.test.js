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
