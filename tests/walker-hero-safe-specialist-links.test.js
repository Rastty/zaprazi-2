import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("Walker hub first screen offers safe direct indoor and rollator questionnaires", () => {
  const hub = read("page-choditka-pro-seniory.php");
  const heroStart = hub.indexOf('<section class="zp-hero zp-illustrated-hero">');
  const heroEnd = hub.indexOf("</section>", heroStart);
  assert.ok(heroStart >= 0 && heroEnd > heroStart);
  const hero = hub.slice(heroStart, heroEnd);

  const indoorPath = "/choditko-do-bytu-pro-seniory/#poradce-choditko-byt";
  const outdoorPath = "/rollator-pro-seniory/#poradce-rollator";
  for (const route of [indoorPath, outdoorPath]) {
    assert.ok(hero.includes("home_url( '" + route + "' )"), "Direct safety-gated route missing: " + route);
    assert.equal(hero.split("home_url( '" + route + "' )").length - 1, 1, "No duplicate direct hero path");
  }
  assert.match(read("page-choditko-do-bytu-pro-seniory.php"), /id="poradce-choditko-byt"/);
  assert.match(read("page-rollator-pro-seniory.php"), /id="poradce-rollator"/);

  assert.ok(hero.indexOf(indoorPath) < hero.indexOf('href="#vyber-typu"'));
  assert.ok(hero.indexOf(outdoorPath) < hero.indexOf('href="#vyber-typu"'));
  assert.match(hero, /bezpečné ovládání a rozměry se teprve ověřují/);
  assert.match(hero, /Venku: poradce pro rollátor a brzdy/);
  assert.match(hero, /Nejste si jistí rozdílem/);
});

test("Direct guide links never skip fit gates, send answers or impersonate commerce CTAs", () => {
  const hub = read("page-choditka-pro-seniory.php");
  const hero = hub.split('<section class="zp-hero zp-illustrated-hero">')[1]?.split("</section>")[0];
  assert.ok(hero);
  const primary = [...hero.matchAll(/<a\s+class="zp-btn"[^>]*>/g)];
  assert.equal(primary.length, 1, "Retain only one visually primary fallback");
  assert.match(primary[0][0], /data-zp-journey="advisor"/);
  assert.match(primary[0][0], /home_url\( '\/#poradce' \)/);
  const direct = [...hero.matchAll(/<a\s+class="zp-text-link"[^>]*>/g)]
    .map(match => match[0]).filter(anchor => /#poradce-choditko-byt|#poradce-rollator/.test(anchor));
  assert.equal(direct.length, 2);
  for (const anchor of direct) {
    assert.match(anchor, /data-zp-journey="advisor"/);
    assert.doesNotMatch(anchor, /target="_blank"|rel="sponsored"|data-zp-merchant-link|[?&](?:answer|diagnosis|health)=/i);
    assert.match(anchor, /esc_url\( home_url\(/);
  }
  assert.doesNotMatch(hero, /affiliateMap|data-zp-offer|checkout|merchant_click|localStorage|sessionStorage|fetch\(/i);
  assert.ok(hub.includes("href=\"#jak-ziskat-choditko\""), "Existing buy/rent/insurance navigation remains");
  assert.ok(hub.includes("href=\"#hul-nebo-choditko\""), "Existing comparison for uncertain visitors remains");
});
