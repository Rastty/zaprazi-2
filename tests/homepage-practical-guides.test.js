import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const homepage = fs.readFileSync(new URL("../front-page.php", import.meta.url), "utf8");
const resources = [
  "/otazky-pred-propustenim-z-nemocnice/",
  "/nocni-cesta-z-postele-na-wc/",
  "/bezpecny-byt-pro-seniora/"
];

test("Homepage exposes three distinct practical guides before presenting product decisions", () => {
  const start = homepage.indexOf('<section id="prakticke-kontroly"');
  const advisor = homepage.indexOf('<section id="poradce"');
  assert.ok(start > homepage.indexOf('<section id="co-resite"') && start < advisor);
  const region = homepage.slice(start, advisor);
  assert.equal((region.match(/class="zp-decision-card"/g) || []).length, 3);
  for (const path of resources) {
    const link = `home_url( '${path}' )`;
    assert.ok(region.includes(link), `missing canonical internal link: ${path}`);
  }
  assert.match(region, /Praktické návody bez nákupu/);
  assert.match(region, /Návody nejsou individuálním zdravotním posouzením/);
  assert.doesNotMatch(region, /affiliateMap|data-zp-merchant-link|data-zp-affiliate|awin1\.com|click\.php/i);
});

test("Homepage practical guides reuse pages and keep single H1 and existing six-scenario Advisor", () => {
  assert.equal((homepage.match(/<h1[ >]/g) || []).length, 1);
  assert.equal((homepage.match(/id="prakticke-kontroly"/g) || []).length, 1);
  assert.equal((homepage.match(/id="zp-mobility-advisor"/g) || []).length, 1);
  for (const label of ["Chůze a opora", "Koupelna a WC", "Polohovací postel", "Invalidní vozík", "Návrat z nemocnice", "Každodenní soběstačnost"]) {
    assert.ok(homepage.includes(label));
  }
});
