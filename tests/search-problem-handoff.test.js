import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");

const guides = [
  ["page-senior-odmita-choditko.php", ["proc-senior-odmita", "sedm-kroku-bez-natlaku"]],
  ["page-senior-odmita-koupani.php", ["vyber-hygieny-bez-sprchy", "plan-hygiena-bez-natlaku"]],
  ["page-senior-malo-pije.php", ["varovne-priznaky-malo-pije", "proc-senior-malo-pije"]],
  ["page-senior-doma-sam-sos-pomoc.php", ["jak-funguje-pomoc-sos", "vyber-sos-pomoci"]]
];

test("caregiver intent routes target existing guide sections, not shop or affiliate URLs", () => {
  const routes = read("src/seo/search-guidance.php");
  for (const [path, anchors] of guides) {
    const template = read(path);
    const slug = path.replace(/^page-/, "").replace(/\.php$/, "");
    for (const anchor of anchors) {
      assert.ok(template.includes('id="' + anchor + '"'), "Missing target section " + path + "#" + anchor);
      assert.ok(routes.includes("/" + slug + "/#" + anchor), "Missing safe route " + slug + "#" + anchor);
    }
  }
  assert.doesNotMatch(routes, /data-zp-merchant-link|click\.php|desturl=|[?&](?:s|q|answers)=/i);
});

test("guided search has a visible primary action without passing query or answers to the Advisor", () => {
  const search = read("search.php");
  assert.match(search, /if \( \$zaprazi_guided_results \)/);
  assert.match(search, /home_url\( \$zaprazi_guided_results\[0\]\[0\] \)/);
  assert.match(search, /Otevřít první praktický návod/);
  assert.match(search, /Všechny domácí poradce/);
  assert.doesNotMatch(search, /home_url\([^\n]*(?:get_search_query|\$zaprazi_search_query)/);
  assert.doesNotMatch(search, /data-zp-merchant-link|data-zp-offer|utm_source=/);
});

test("a real fall is prioritized before transport and product handoffs", () => {
  const source = read("src/seo/search-guidance.php");
  const fall = source.indexOf("if (\n    preg_match( '/\\b(?:spadl");
  const transfer = source.indexOf("$transfer_verb = preg_match");
  const transport = source.indexOf("$transport_word = preg_match");
  const care = source.indexOf("$care_allowance_intent = preg_match");
  assert.ok(fall > 0 && fall < transfer && fall < care && fall < transport,
    "Urgent fall guidance must precede routine care/transport/product rules");
  assert.equal(source.split("'/senior-spadl-doma/#prvni-krok-pad'").length - 1, 1,
    "Keep exactly one authoritative fall routing branch");
  for (const anchor of ["prvni-krok-pad", "plan-po-padu"]) {
    assert.match(read("page-senior-spadl-doma.php"), new RegExp('id="' + anchor + '"'));
  }
});
