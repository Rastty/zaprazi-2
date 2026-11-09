import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const home = read("front-page.php");
const stylesheet = read("style.css");
const version = stylesheet.match(/^Version:\s*(\d+\.\d+\.\d+)\s*$/m)?.[1];
const hero = home.split('<section class="zp-hero zp-illustrated-hero zp-home-hero">')[1]?.split("</section>")[0] ?? "";

test("Homepage first-screen offers three practical situations without extra decisions", () => {
  assert.ok(version, "Theme version is required");
  assert.ok(home.includes("ZP_RELEASE_" + version.replaceAll(".", "_")),
    "Homepage release marker must match the current theme version");
  assert.equal(hero.split("<a ").length - 1, 3, "Exactly three direct hero actions");
  assert.ok(hero.includes("home_url( '/senior-spadl-doma/#prvni-krok-pad' )"));
  assert.ok(hero.includes("home_url( '/navrat-z-nemocnice/' )"));
  assert.ok(hero.includes('href="#co-resite"'));
  assert.ok(hero.indexOf("Senior spadl: co dělat teď") < hero.indexOf("Návrat z nemocnice"));
  assert.ok(hero.indexOf("Návrat z nemocnice") < hero.indexOf("Vybrat pomůcku podle situace"));
});

test("Full homepage, trusted advice and private gated Mobility advisor remain", () => {
  assert.ok(home.indexOf('id="co-resite"') < home.indexOf('id="poradce"'));
  assert.ok(home.includes('href="#poradce"'), "Existing Mobility entry retained inside the choice section");
  for (const path of [
    "/choditka-pro-seniory/", "/koupelna-a-wc/", "/polohovaci-postel/",
    "/invalidni-vozik/", "/senior-doma-sam-sos-pomoc/", "/sobestacnost/"
  ]) {
    assert.ok(home.includes(path), "Existing topical route: " + path);
  }
  assert.ok(home.includes('id="zp-mobility-advisor"'));
  for (const forbidden of ["data-zp-merchant-link", "data-zp-affiliate-target", "affiliateKey", "<form"]) {
    assert.ok(!hero.includes(forbidden), "No merchant or form in direct home hero: " + forbidden);
  }
  assert.equal(home.split("<h1>").length - 1, 1);
});
