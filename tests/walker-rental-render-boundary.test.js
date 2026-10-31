import test from "node:test";
import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";

// Render the actual WordPress page template without WordPress, network access,
// analytics or visitor answers. A source-only regex test cannot establish that
// the live PHP branches really hide the calculator after evidence expires.
const renderRentalAt = date => {
  const php = [
    'function current_time($format) { return getenv("ZP_TEST_DATE"); }',
    'function get_header() {}',
    'function get_footer() {}',
    'function home_url($path = "") { return "https://example.test" . $path; }',
    'function esc_url($url) { return htmlspecialchars($url, ENT_QUOTES, "UTF-8"); }',
    'include "page-pujceni-choditka.php";'
  ].join("\n");
  return execFileSync("php",["-r",php],{
    cwd:fileURLToPath(new URL("../",import.meta.url)),
    env:{...process.env,ZP_TEST_DATE:date},
    encoding:"utf8"
  });
};

test("rental calculator renders through the last verified day, then fails closed",()=>{
  const lastDay=renderRentalAt("2026-11-06");
  const expired=renderRentalAt("2026-11-07");
  assert.match(lastDay,/<form id="zp-walker-rental-budget"/);
  assert.match(lastDay,/data-monthly-price="360"/);
  assert.match(lastDay,/Spočítat orientační půjčovné/);
  assert.doesNotMatch(lastDay,/Přepočet není k dispozici/);

  assert.doesNotMatch(expired,/<form id="zp-walker-rental-budget"/);
  assert.doesNotMatch(expired,/data-monthly-price=/);
  assert.doesNotMatch(expired,/Spočítat orientační půjčovné/);
  assert.match(expired,/Proč nyní nepřepočítáváme starší ceny půjčoven/);
  assert.match(expired,/Přepočet není k dispozici/);
  assert.match(expired,/Nejdřív ověřte aktuální cenu a dostupnost bezpečně vybraného typu/);
});

test("expired rendered cards, FAQ and source notes disclose historical rental amounts",()=>{
  const expired=renderRentalAt("2026-11-07");
  const prices=expired.slice(expired.indexOf('<section id="ceny"'),expired.indexOf('<section id="rozpocet-pujceni-choditka"'));
  assert.match(prices,/historicky 12 Kč \/ den/);
  assert.match(prices,/historicky 360 Kč/);
  assert.match(prices,/historicky 1 000 Kč/);
  assert.match(prices,/ověřit u půjčovny \(starší příklad: 1 000 Kč\)/);
  assert.doesNotMatch(prices,/<dd>1 000 Kč<\/dd>/);
  assert.equal((expired.match(/Historické příklady, nikoli aktuální nabídka/g)||[]).length,4,
    "Both price FAQ and both source paragraphs must mark stale prices");
  assert.match(expired,/Připravit pět otázek pro půjčovnu/);
  assert.match(expired,/href="#zp-otazky-pujcovna"/);
});

test("dated rental entry and provider links never claim live pricing after expiry",()=>{
  const fresh=renderRentalAt("2026-11-06");
  const expired=renderRentalAt("2026-11-07");
  assert.match(fresh,/kolik stojí konkrétní příklady v roce 2026/);
  assert.doesNotMatch(fresh,/jak ověřit cenu místo zastaralých příkladů/);
  assert.match(expired,/jak ověřit cenu místo zastaralých příkladů z roku 2026/);
  assert.doesNotMatch(expired,/kolik stojí konkrétní příklady v roce 2026/);
  assert.match(expired,/ověřte platnou cenu a dostupnost přímo u půjčovny/);
  assert.doesNotMatch(expired,/Aktuální ceník (RehaKomp|MEYRA)/);
  assert.equal((expired.match(/Ověřit cenu u RehaKomp/g)||[]).length,2);
  assert.match(expired,/Ověřit cenu u MEYRA/);
  assert.match(expired,/href="https:\/\/www\.rehakomp\.cz\/content\/18-cenik-pronajmu-pomucek"/);
  assert.match(expired,/href="https:\/\/www\.meyra\.cz\/cenik-meyra\.html"/);
  assert.match(expired,/Připravit telefonát do půjčovny/);
  assert.doesNotMatch(expired,/data-zp-merchant-link|data-zp-offer|data-monthly-price=/);
});
