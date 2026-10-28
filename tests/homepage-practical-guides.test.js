import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const homepage = fs.readFileSync(new URL("../front-page.php", import.meta.url), "utf8");
const resources = [
  "/senior-spadl-doma/#prvni-krok-pad",
  "/prevoz-seniora-k-lekari/#vyber-dopravy",
  "/senior-nestihne-dojit-na-wc/#prvni-bezpecnost-wc",
  "/senior-odmita-choditko/#proc-senior-odmita",
  "/senior-odmita-koupani/#duvody-odmitani-koupani",
  "/senior-malo-pije/#proc-senior-malo-pije",
  "/senior-nemuze-vstat-z-postele/#co-delat-postel",
  "/otazky-pred-propustenim-z-nemocnice/",
  "/nocni-cesta-z-postele-na-wc/",
  "/bezpecny-byt-pro-seniora/",
  "/prahy-pro-choditko-a-vozik/#mereni-prahu",
  "/sprchova-zidle-maly-kout-80x80/#sedm-mereni-sprchy"
];

test("Homepage keeps all twelve distinct practical guides after the actual Advisor", () => {
  const start = homepage.indexOf('<section id="prakticke-kontroly"');
  const advisor = homepage.indexOf('<section id="poradce"');
  assert.ok(advisor > homepage.indexOf('<section id="co-resite"') && advisor < start);
  const next = homepage.indexOf('<section id="jak-vybrat"',start);
  assert.ok(next > start,"Guide catalog must remain a distinct accessible section");
  const region = homepage.slice(start, next);
  assert.equal((region.match(/class="zp-decision-card"/g) || []).length, 12);
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
