import test from "node:test";
import assert from "node:assert/strict";
import {requestContainsAdvisorAnswer} from "./advisor-request-privacy.mjs";

const answer = {name:"supportNeed", value:"steady"};
const req = (url, body="") => ({url:()=>url, postData:()=>body});

test("Advisor privacy canary detects direct, nested and encoded request leaks", () => {
  assert.equal(requestContainsAdvisorAnswer(req("https://zaprazi.cz/?supportNeed=steady"), answer), true);
  assert.equal(requestContainsAdvisorAnswer(req("https://analytics.example/collect?ep.supportNeed=steady"), answer), true);
  assert.equal(requestContainsAdvisorAnswer(req("https://analytics.example/collect", '{"supportNeed":"steady"}'), answer), true);
  assert.equal(requestContainsAdvisorAnswer(req("https://analytics.example/collect", "supportNeed=steady&event=complete"), answer), true);
  const nested = encodeURIComponent(encodeURIComponent("supportNeed=steady"));
  assert.equal(requestContainsAdvisorAnswer(req("https://analytics.example/collect?payload="+nested), answer), true);
});

test("Advisor privacy canary ignores unrelated telemetry and nonmatching values", () => {
  assert.equal(requestContainsAdvisorAnswer(req("https://analytics.example/collect?event=builder_start"), answer), false);
  assert.equal(requestContainsAdvisorAnswer(req("https://analytics.example/collect?supportNeed=light"), answer), false);
  assert.equal(requestContainsAdvisorAnswer(req("https://analytics.example/collect", '{"supportNeed":"light","other":"steady"}'), answer), false);
  assert.equal(requestContainsAdvisorAnswer(req("https://analytics.example/collect?x=%badencoding"), answer), false);
  assert.equal(requestContainsAdvisorAnswer(req("https://analytics.example/collect"), {name:"",value:"yes"}), false);
});
