import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const page = read("page-pujceni-choditka.php");
const insurance = read("page-choditko-na-pojistovnu.php");
const functions = read("functions.php");
const css = read("style.css");
const sourceVersion = css.match(/^Version:\s*(\d+\.\d+\.\d+)$/m)?.[1];
const marker = "ZP_RELEASE_" + sourceVersion?.replaceAll(".", "_");

test("SEO rental and insurance keep the current release markers and source identity", () => {
  assert.match(sourceVersion, /^[0-9]+[.][0-9]+[.][0-9]+$/);
  assert.ok(functions.includes("define( 'ZAPRAZI_RELEASE', '" + sourceVersion + "' );"));
  assert.ok(page.includes(marker));
  assert.ok(insurance.includes(marker));
});

test("high-intent insurance and rental pages have distinct truthful title and Yoast descriptions", () => {
  const title = functions.slice(functions.indexOf("function zaprazi_2_front_title("),
    functions.indexOf("add_filter( 'pre_get_document_title'"));
  const yoast = functions.slice(functions.indexOf("function zaprazi_2_wpseo_title("),
    functions.indexOf("add_filter( 'wpseo_title'"));
  const description = functions.slice(functions.indexOf("function zaprazi_2_wpseo_description("),
    functions.indexOf("add_filter( 'wpseo_metadesc'"));
  for (const segment of [title, yoast]) {
    assert.match(segment, /is_page\( 'choditko-na-pojistovnu' \)/);
    assert.match(segment, /is_page\( 'pujceni-choditka' \)/);
    assert.match(segment, /Chodítko na pojišťovnu 2026: ePoukaz a postup/);
    assert.match(segment, /Půjčení chodítka: cena, kauce a postup/);
  }
  assert.match(description, /jak řešit ePoukaz/);
  assert.match(description, /u koho ověřit úhradu a doplatek/);
  assert.match(description, /Čtyři kroky před objednáním/);
  assert.match(description, /Sazby jsou příklady, ne závazná nabídka/);
  assert.doesNotMatch(description, /aktuální ceník|garantovaná úhrada|0 Kč doplatek/i);
});

test("rental first screen resolves the practical rental intent without new URL or direct commerce", () => {
  assert.equal((page.match(/id="jak-pujcit-choditko"/g) || []).length, 1);
  assert.equal((page.match(/href="#jak-pujcit-choditko"/g) || []).length, 1);
  const start = page.indexOf('<section id="jak-pujcit-choditko"');
  const end = page.indexOf('<section class="zp-wrap">', start);
  assert.ok(start > page.indexOf("</section>") && end > start);
  const section = page.slice(start, end);
  assert.match(section, /Čtyři kroky před objednáním/);
  assert.equal((section.match(/<li>/g) || []).length, 4);
  assert.match(section, /Nejdřív bezpečný typ/);
  assert.match(section, /Ověřte, co půjčovna skutečně nabízí/);
  assert.match(section, /Porovnejte celkovou cenu/);
  assert.match(section, /Domluvte bezpečné předání/);
  assert.match(section, /Sazby níže jsou příklady z veřejných ceníků/);
  for (const path of ["/choditka-pro-seniory/", "/co-zmerit-pred-vyberem-choditka/",
    "/choditko-na-pojistovnu/"]) assert.ok(section.includes(path));
  for (const anchor of ["rozpocet-pujceni-choditka", "zp-otazky-pujcovna"])
    assert.ok(page.includes('id="' + anchor + '"'));
  assert.doesNotMatch(section, /rel="sponsored"|data-zp-merchant-link|<form\b|<input\b/);
  assert.match(page, /\$zp_rental_is_fresh/);
  assert.equal((page.match(/<h1>/g) || []).length, 1);
});
