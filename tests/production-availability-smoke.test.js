import test from "node:test";
import assert from "node:assert/strict";
import { anchors, assertHomepage, assertMobility, runSmoke } from "../scripts/production-availability-smoke.mjs";

const homepage = `<!doctype html><html><h1>Bezpečně a samostatně doma.</h1>
<a href="https://zaprazi.cz/choditka-pro-seniory/">Vybrat chodítko</a>
<section id="poradce"><div id="zp-mobility-advisor"></div></section>${"x".repeat(150)}</html>`;
const mobility = `<!doctype html><html><h1>Chodítka pro seniory: jak vybrat správný typ.</h1>
<a class="zp-btn" data-zp-journey="advisor" href="https://zaprazi.cz/#poradce">Začít poradcem</a>
${"x".repeat(150)}</html>`;
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

test("source smoke ignores commented, script, template and noscript decoy CTAs", () => {
  const cta = '<a class="zp-btn" data-zp-journey="advisor" href="https://zaprazi.cz/#poradce">Začít poradcem</a>';
  const wrappers = [
    value => '<!-- ' + value + ' -->',
    value => '<script type="text/plain">' + value + '</script>',
    value => '<template>' + value + '</template>',
    value => '<noscript>' + value + '</noscript>',
    value => '<style>' + value + '</style>'
  ];
  for (const wrap of wrappers) {
    assert.throws(() => assertMobility(mobility.replace(cta, wrap(cta))), /one explicit/,
      "inert CTA cannot satisfy the visitor handoff");
    assert.doesNotThrow(() => assertMobility(mobility + wrap(cta)),
      "inert duplicate must not make a working CTA fail");
  }
});

test("source smoke ignores dead homepage navigation and headings in comments or scripts", () => {
  const link = '<a href="https://zaprazi.cz/choditka-pro-seniory/">Vybrat chodítko</a>';
  const heading = '<h1>Bezpečně a samostatně doma.</h1>';
  assert.throws(() => assertHomepage(homepage.replace(link, '<!-- ' + link + ' -->')), /link missing/);
  assert.throws(() => assertHomepage(homepage.replace(heading, '<script type="text/plain">' + heading + '</script>')), /heading missing/);
  assert.throws(() => assertHomepage(homepage.replace('id="zp-mobility-advisor"', 'id="other"') +
    '<template><div id="zp-mobility-advisor"></div></template>'), /anchor/);
});

test("source smoke requires a usable name on both navigation links", () => {
  const homeLink = '<a href="https://zaprazi.cz/choditka-pro-seniory/">Vybrat chodítko</a>';
  const advisorLink = '<a class="zp-btn" data-zp-journey="advisor" href="https://zaprazi.cz/#poradce">Začít poradcem</a>';
  for (const replacement of [
    '<a href="https://zaprazi.cz/choditka-pro-seniory/"></a>',
    '<a href="https://zaprazi.cz/choditka-pro-seniory/">&nbsp;</a>',
    '<a hidden href="https://zaprazi.cz/choditka-pro-seniory/">Vybrat chodítko</a>',
    '<a aria-hidden="true" href="https://zaprazi.cz/choditka-pro-seniory/">Vybrat chodítko</a>',
    '<a tabindex="-1" href="https://zaprazi.cz/choditka-pro-seniory/">Vybrat chodítko</a>',
    '<a style="display:none" href="https://zaprazi.cz/choditka-pro-seniory/">Vybrat chodítko</a>'
  ]) assert.throws(() => assertHomepage(homepage.replace(homeLink, replacement)), /link missing/);
  for (const replacement of [
    '<a class="zp-btn" data-zp-journey="advisor" href="https://zaprazi.cz/#poradce"></a>',
    '<a class="zp-btn" data-zp-journey="advisor" href="https://zaprazi.cz/#poradce">&nbsp;</a>',
    '<a hidden class="zp-btn" data-zp-journey="advisor" href="https://zaprazi.cz/#poradce">Začít poradcem</a>',
    '<a aria-hidden="true" class="zp-btn" data-zp-journey="advisor" href="https://zaprazi.cz/#poradce">Začít poradcem</a>',
    '<a inert class="zp-btn" data-zp-journey="advisor" href="https://zaprazi.cz/#poradce">Začít poradcem</a>',
    '<a tabindex="-1" class="zp-btn" data-zp-journey="advisor" href="https://zaprazi.cz/#poradce">Začít poradcem</a>',
    '<a style="visibility:hidden" class="zp-btn" data-zp-journey="advisor" href="https://zaprazi.cz/#poradce">Začít poradcem</a>'
  ]) assert.throws(() => assertMobility(mobility.replace(advisorLink, replacement)), /accessible name or is hidden/);
  assert.doesNotThrow(() => assertMobility(mobility.replace("Začít poradcem</a>", '<span>Začít poradcem</span></a>')));
  assert.doesNotThrow(() => assertMobility(mobility.replace("Začít poradcem</a>", '</a>').replace(
    'data-zp-journey="advisor"', 'data-zp-journey="advisor" aria-label="Začít poradcem"')));
});
