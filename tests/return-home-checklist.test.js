import test from "node:test";
import assert from "node:assert/strict";
import { buildReturnHomePlan } from "../src/return-home/engine.js";
import { buildReturnHomeChecklist } from "../src/return-home/checklist.js";

const base = {
  timing: "later", entranceReady: "yes", transferAbility: "independent",
  walking: "independent", toiletReady: "yes", bathroomReady: "yes",
  bedReady: "yes", homeCare: "not_needed"
};

test("safe baseline does not invent checklist tasks", () => {
  const plan = buildReturnHomePlan(base);
  assert.equal(plan.status, "ready_basic");
  assert.deepEqual(buildReturnHomeChecklist(plan), []);
});

test("practical priorities come only from the original engine", () => {
  const plan = buildReturnHomePlan({ ...base, transferAbility: "steadying", walking: "needs_support", toiletReady: "no", bedReady: "unknown" });
  const original = JSON.stringify(plan);
  const tasks = buildReturnHomeChecklist(plan);
  assert.deepEqual(tasks.filter(t => t.kind === "discharge").map(t => t.label), plan.dischargeActions.map(t => t.label));
  assert.ok(tasks.some(t => t.kind === "advisor" && t.href === "/#poradce"));
  assert.ok(tasks.some(t => t.kind === "advisor" && t.href.includes("/koupelna-a-wc/")));
  assert.ok(tasks.some(t => t.kind === "advisor" && t.href.includes("/polohovaci-postel/")));
  assert.ok(tasks.every(t => t.label && t.reason));
  assert.deepEqual(tasks.map(t => t.priority), [...tasks.map(t => t.priority)].sort((a,b) => a-b));
  assert.equal(JSON.stringify(plan), original, "presenting task checklist never alters decision status or merchant routing");
});

test("critical blockers remain visible in the original result and cannot be checked away", () => {
  const plan = buildReturnHomePlan({ ...base, entranceReady: "no", transferAbility: "person_assist" });
  assert.equal(plan.status, "blocked_before_discharge");
  const tasks = buildReturnHomeChecklist(plan);
  assert.ok(plan.blockers.length >= 2);
  assert.ok(tasks.some(t => t.kind === "discharge" && t.label.includes("Před propuštěním")));
  assert.ok(!tasks.some(t => t.kind === "blocker"));
  assert.equal(plan.status, "blocked_before_discharge");
});

test("only advisor tasks can have a route; checklist tolerates absent optional collections", () => {
  assert.deepEqual(buildReturnHomeChecklist({}), []);
  const tasks = buildReturnHomeChecklist({ priorities: [{ priority: 1, label: "Ověřit", reason: "Důvod" }] });
  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].href, null);
});
