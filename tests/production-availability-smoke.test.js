import test from "node:test";
import assert from "node:assert/strict";
import { anchors, assertHomepage, assertMobility, runSmoke } from "../scripts/production-availability-smoke.mjs";

const homepage = \`<!doctype html><html><h1>Bezpečně a samostatně doma.</h1>
<a href="https://zaprazi.cz/choditka-pro-seniory/">Vybrat chodítko</a>
<section id="poradce"><div id="zp-mobility-advisor"></div></section>\${"x".repeat(150)}</html>\`;
const mobility = \`<!doctype html><html><h1>Chodítka pro seniory: jak vybrat správný typ.</h1>
<a class="zp-btn" data-zp-journey="advisor" href="https://zaprazi.cz/#poradce">Začít poradcem</a>
\${"x".repeat(150)}</html>\`;
const response = html => ({
  status: 200,
  headers: { get: key => key === "content-type" ? "text/html; charset=UTF-8" : null },
  text: async () => html
});

test("accepts the canonical public mobility path, including absolute WordPress links", () => {
  assertHomepage(homepage);
  assertMobility(mobility);
  assert.equal(anchors(mobility)[0]["data-zp-journey"], "advisor");
});

test("runs only two read-only public GETs without redirects or user data", async () => {
  const calls = [];
  const result = await runSmoke(async (url, init) => {
    calls.push({ url, init });
    return response(url.endsWith("choditka-pro-seniory/") ? mobility : homepage);
  });
  assert.match(result, /^PASS/);
  assert.deepEqual(calls.map(c => c.url), ["https://zaprazi.cz/", "https://zaprazi.cz/choditka-pro-seniory/"]);
  for (const call of calls) {
    assert.equal(call.init.method, "GET");
    assert.equal(call.init.redirect, "manual");
    assert.equal(new URL(call.url).search, "");
  }
});

test("rejects missing homepage advisor anchor or homepage Mobility entry", () => {
  assert.throws(() => assertHomepage(homepage.replace('id="poradce"', 'id="other"')), /anchor/);
  assert.throws(() => assertHomepage(homepage.replace("https://zaprazi.cz/choditka-pro-seniory/", "https://elsewhere.test/choditka-pro-seniory/")), /link missing/);
});

test("rejects unsafe or broken editorial CTA without checking merchant links", () => {
  for (const wrong of [
    "https://example.com/#poradce",
    "/#other",
    "/#poradce?health=private",
    "/?answers=private#poradce",
    "https://zaprazi.cz/choditka-pro-seniory/#poradce",
    "javascript:alert(1)"
  ]) {
    assert.throws(() => assertMobility(mobility.replace("https://zaprazi.cz/#poradce",wrong)), /safe Mobility/);
  }
  assert.throws(() => assertMobility(mobility.replace('data-zp-journey="advisor"', 'data-zp-journey="other"')), /one explicit/);
  assert.throws(() => assertMobility(mobility.replace('class="zp-btn"', 'rel="sponsored"')), /merchant/);
  assert.throws(() => assertMobility(mobility.replace('data-zp-journey="advisor"', 'data-zp-journey="advisor" data-zp-merchant-link="1"')), /merchant/);
});

test("rejects HTTP failures, redirects, non-HTML and incomplete payloads", async () => {
  await assert.rejects(runSmoke(async () => ({ ...response(homepage), status:302 })), /HTTP 302/);
  await assert.rejects(runSmoke(async () => ({ ...response(homepage), headers:{get:()=> "text/plain"} })), /did not return HTML/);
  await assert.rejects(runSmoke(async () => response("short")), /unexpected HTML size/);
});
