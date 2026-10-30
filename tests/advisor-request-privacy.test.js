import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {requestContainsAdvisorAnswer, persistentStorageContainsAdvisorAnswer} from "./advisor-request-privacy.mjs";

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

test("Advisor privacy canary inspects outbound request headers without logging values", () => {
  const withHeaders = headers => ({
    url: () => "https://analytics.example/collect",
    postData: () => "",
    headers: () => headers
  });
  assert.equal(requestContainsAdvisorAnswer(
    withHeaders({"referer":"https://zaprazi.cz/?supportNeed=steady"}), answer), true);
  assert.equal(requestContainsAdvisorAnswer(
    withHeaders({"x-event-data":encodeURIComponent('{"supportNeed":"steady"}')}), answer), true);
  assert.equal(requestContainsAdvisorAnswer(
    withHeaders({"supportneed":"steady"}), answer), true);
  assert.equal(requestContainsAdvisorAnswer(
    withHeaders({"cookie":"supportNeed=steady; consent=accepted"}), answer), true);
  assert.equal(requestContainsAdvisorAnswer(
    withHeaders({"x-event-data":"supportNeed=light", "cookie":"consent=accepted"}), answer), false);
  assert.throws(() => requestContainsAdvisorAnswer(
    withHeaders(null), answer), /Malformed request headers/);
});

test("Advisor persistence canary catches exact keys, nested JSON and encoded cookies", () => {
  const chosen = {name:"supportNeed",value:"steady"};
  assert.equal(persistentStorageContainsAdvisorAnswer([["supportNeed","steady"]], "", chosen), true);
  assert.equal(persistentStorageContainsAdvisorAnswer([["zp-form",'{"answers":{"supportNeed":"steady"}}']], "", chosen), true);
  assert.equal(persistentStorageContainsAdvisorAnswer([["zp-form",encodeURIComponent("supportNeed=steady")]], "", chosen), true);
  assert.equal(persistentStorageContainsAdvisorAnswer([], "supportNeed=steady; theme=light", chosen), true);
  assert.equal(persistentStorageContainsAdvisorAnswer([], "form="+encodeURIComponent('{"supportNeed":"steady"}'), chosen), true);
});
test("Advisor persistence canary allows benign unrelated browser state", () => {
  const chosen = {name:"supportNeed",value:"steady"};
  assert.equal(persistentStorageContainsAdvisorAnswer([["theme","steady"],["supportNeed","light"]], "consent=accepted", chosen), false);
  assert.equal(persistentStorageContainsAdvisorAnswer([], "", chosen), false);
  assert.throws(() => persistentStorageContainsAdvisorAnswer([["broken"]], "", chosen), /Malformed storage/);
});

// Guard against a future refactor that detaches the request listener before
// an Advisor's incomplete submit, which can trigger analytics independently
// from the preceding answer-change event.
test("live Advisor request canary remains active through incomplete submit", () => {
  const source = readFileSync(new URL("./production-advisor-smoke.mjs", import.meta.url), "utf8");
  const attach = source.indexOf('page.on("request", onRequest);');
  const submit = source.indexOf("await page.$eval(formSelector + ' button[id$=\"-submit\"]', button => button.click());", attach);
  const detach = source.indexOf('page.off("request", onRequest);', attach);
  assert.ok(attach >= 0 && submit > attach && detach > submit,
    "The request listener must cover answer selection AND incomplete submission");
});

test("all-Advisor browser QA checks an alternative answer and re-submit without leaking either value", () => {
  const source = readFileSync(new URL("./production-advisor-smoke.mjs", import.meta.url), "utf8");
  const first = source.indexOf("const firstAnswer = await page.$eval(formSelector");
  const alternate = source.indexOf("const alternateAnswer = await page.$eval(formSelector", first);
  const editAttach = source.indexOf('page.on("request", onEditRequest);', alternate);
  const editSubmit = source.indexOf("await page.$eval(formSelector + ' button[id$=\"-submit\"]', button => button.click());", editAttach);
  const editDetach = source.indexOf('page.off("request", onEditRequest);', editAttach);
  assert.ok(first >= 0 && alternate > first && editAttach > alternate &&
    editSubmit > editAttach && editDetach > editSubmit,
    "Privacy QA must observe both answer change and subsequent incomplete submit");
  assert.match(source, /\[firstAnswer, alternateAnswer\]\.some\(answer =>/);
  assert.match(source, /for \(const answer of \[firstAnswer, alternateAnswer\]\)/);
  assert.match(source, /await checkNoMerchant\(page, resultSelector\);/);
});
