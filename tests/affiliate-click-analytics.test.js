import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../assets/js/analytics-consent.js", import.meta.url), "utf8");

function harness(savedConsent = null) {
  const listeners = {};
  const controls = {};
  const appendedScripts = [];
  const consent = { value: savedConsent };
  let reloads = 0;
  const banner = { hidden: true };
  for (const name of ["allow", "deny", "settings"]) {
    controls[name] = { addEventListener(event, fn) { listeners[name + ":" + event] = fn; }, focus() {} };
  }
  const document = {
    readyState: "loading",
    cookie: "",
    head: { appendChild(script) { appendedScripts.push(script); } },
    createElement() { return {}; },
    addEventListener(event, fn) { listeners["document:" + event] = fn; },
    querySelector(selector) {
      return {
        "#zp-analytics-consent": banner,
        "#zp-analytics-allow": controls.allow,
        "#zp-analytics-deny": controls.deny,
        "#zp-analytics-settings": controls.settings,
      }[selector] || null;
    },
  };
  const window = {
    ZaPraziAnalyticsConfig: { measurementId: "G-TEST123", storageKey: "zp-consent-test" },
    location: { hostname: "zaprazi.cz", reload() { reloads += 1; } },
    localStorage: {
      getItem() { return consent.value; },
      setItem(key, value) { consent.value = value; },
    },
    setTimeout(fn) { fn(); },
    addEventListener(event, fn) { listeners["window:" + event] = fn; },
  };
  vm.runInNewContext(source, { document, window, Date, encodeURIComponent });
  const click = (kind = "affiliate", inAdvisor = true) => {
    const link = { closest(selector) { return selector === ".zp-result" && inAdvisor ? {} : null; } };
    const target = { closest(selector) { return selector === 'a[rel~="sponsored"]' && kind === "affiliate" ? link : null; } };
    listeners["document:click"]({ target });
  };
  const eventNames = () => (window.dataLayer || []).map((args) => Array.from(args)).filter((args) => args[0] === "event").map((args) => args[1]);
  return {
    click, eventNames, consent, listeners, banner, appendedScripts, get reloads() { return reloads; }
  };
}

test("outbound affiliate event requires explicit analytics consent", () => {
  const h = harness(null);
  assert.equal(h.appendedScripts.length, 0);
  h.click();
  assert.deepEqual(h.eventNames(), []);
  h.listeners["document:DOMContentLoaded"]();
  assert.equal(h.banner.hidden, false);
  h.listeners["allow:click"]();
  assert.equal(h.consent.value, "granted");
  assert.equal(h.appendedScripts.length, 1);
  h.click();
  assert.deepEqual(h.eventNames(), ["affiliate_click"]);
  h.click("regular");
  h.click("affiliate", false);
  assert.deepEqual(h.eventNames(), ["affiliate_click"], "no regular or non-advisor links counted");
  h.listeners["deny:click"]();
  assert.equal(h.consent.value, "denied");
  assert.equal(h.reloads, 1);
  h.click();
  assert.deepEqual(h.eventNames(), ["affiliate_click"], "revoked consent drops later events");
});

test("a previously denied visitor gets no Google load or affiliate events", () => {
  const h = harness("denied");
  h.click();
  assert.deepEqual(h.eventNames(), []);
  assert.equal(h.appendedScripts.length, 0);
});

test("events are generic and carry no destination, product or answers", () => {
  const h = harness("granted");
  h.click();
  assert.deepEqual(h.eventNames(), ["affiliate_click"]);
  const calls = h.listeners;
  assert.ok(typeof calls["document:click"] === "function");
  assert.equal(h.appendedScripts.length, 1);
});
