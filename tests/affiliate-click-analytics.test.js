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
    addEventListener(event, fn) {
      const key = "document:" + event;
      const prior = listeners[key];
      listeners[key] = prior ? payload => { prior(payload); fn(payload); } : fn;
    },
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
    location: { hostname: "zaprazi.cz", origin:"https://zaprazi.cz", pathname:"/", href:"https://zaprazi.cz/", reload() { reloads += 1; } },
    localStorage: {
      getItem() { return consent.value; },
      setItem(key, value) { consent.value = value; },
    },
    setTimeout(fn) { fn(); },
    addEventListener(event, fn) { listeners["window:" + event] = fn; },
  };
  vm.runInNewContext(source, { document, window, Date, encodeURIComponent, URL });
  const click = (kind = "affiliate", inAdvisor = true) => {
    const href = ({
      affiliate:"https://www.dpbolvw.net/click-123", internal:"/pujceni-choditka/",
      external:"https://example.com/help", anchor:"#faq", query:"/pujceni-choditka/?answer=no",
      download:"/dokument.pdf", regular:"#faq"
    })[kind] || "#faq";
    const link = {
      href,
      closest(selector) { return selector === ".zp-result" && inAdvisor ? {} : null; },
      matches(selector) { return selector === 'a[rel~="sponsored"]' && kind === "affiliate"; },
      getAttribute(key) { return key === "href" ? href : null; },
      hasAttribute(key) { return key === "download" && kind === "download"; }
    };
    const target = {
      closest(selector) {
        if (selector === 'a[rel~="sponsored"]') return kind === "affiliate" ? link : null;
        if (selector === 'a[href]') return link;
        return null;
      }
    };
    listeners["document:click"]({ target });
  };
  const eventNames = () => Array.from(window.dataLayer || [], (args) => Array.from(args)).filter((args) => args[0] === "event").map((args) => args[1]);
  const emit = event => listeners["window:zaprazi:analytics"]({ detail: { event } });
  const eventCalls = () => Array.from(window.dataLayer || [], (args) => Array.from(args)).filter(args => args[0] === "event");
  return {
    click, emit, eventNames, eventCalls, consent, listeners, banner, appendedScripts, get reloads() { return reloads; }
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


test("one generic funnel stage is counted only once per page render, without sensitive params", () => {
  const h = harness("granted");
  h.emit("builder_start");
  h.emit("builder_start");
  h.emit("builder_complete");
  h.emit("builder_complete");
  h.emit("recommendation_view");
  h.emit("recommendation_view");
  h.emit("product_click");
  h.emit("product_click");
  assert.deepEqual(h.eventNames(), [
    "builder_start", "builder_complete", "recommendation_view",
    "product_click", "product_click"
  ]);
  assert.ok(h.eventCalls().every(call => call.length === 2), "no answer payload or event params");
});

test("next-step signal covers only local Advisor-result navigation after consent", () => {
  const h = harness("granted");
  h.click("internal");
  h.click("external");
  h.click("anchor");
  h.click("query");
  h.click("download");
  h.click("affiliate");
  h.click("internal", false);
  assert.deepEqual(h.eventNames(), ["next_step_click", "affiliate_click"]);
  assert.ok(h.eventCalls().every(call => call.length === 2));
});

test("denied and unknown consent drop next-step clicks and never load Google", () => {
  for (const consent of [null, "denied"]) {
    const h = harness(consent);
    h.click("internal");
    h.emit("builder_complete");
    assert.deepEqual(h.eventNames(), []);
    assert.equal(h.appendedScripts.length, 0);
  }
});

test("funnel stage before consent is not retroactively sent on opt-in", () => {
  const h = harness(null);
  h.emit("builder_complete");
  h.listeners["document:DOMContentLoaded"]();
  h.listeners["allow:click"]();
  assert.deepEqual(h.eventNames(), []);
  h.emit("builder_complete");
  h.emit("builder_complete");
  assert.deepEqual(h.eventNames(), ["builder_complete"]);
});
