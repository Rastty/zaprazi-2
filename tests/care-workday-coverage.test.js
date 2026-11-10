import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const service = read("page-jak-vybrat-pecovatelskou-sluzbu.php");
const returnHome = read("page-navrat-z-nemocnice.php");
const css = read("style.css");
const anchor = "pece-o-rodice-pri-praci";
const start = service.indexOf('<section id="' + anchor + '"');
const end = service.indexOf('<section id="vyhledat-pecovatelskou-sluzbu-v-registru"', start);
const section = service.slice(start, end);

test("Workday caregiving question is answered on the established service URL, not a duplicate new page", () => {
  assert.ok(start > 0 && end > start, "A bounded, useful section precedes the MPSV registry");
  assert.equal((service.match(/id="pece-o-rodice-pri-praci"/g) || []).length, 1);
  assert.equal((service.match(/<h1\b/g) || []).length, 1);
  assert.match(section, /aria-labelledby="pece-o-rodice-pri-praci-nadpis"/);
  assert.match(section, /Jak zajistit péči o rodiče doma, když přes den chodíte do práce/);
  assert.ok(service.indexOf('href="#pece-o-rodice-pri-praci"') < start,
    "A first-screen link should reach the practical section");
  assert.match(section, /Jedna návštěva pečovatelské služby nemusí zajistit pomoc mezi návštěvami/);
});

test("The no-data schedule contains four actionable coverage windows and fallback owners", () => {
  assert.equal((section.match(/<li>/g) || []).length, 4, "Four clear daily coverage windows");
  for (const phrase of ["Ráno před odchodem do práce", "Přes den, když rodina není doma",
    "Po návratu domů a večer", "Noc, víkendy a nečekané výpadky", "kdo jej zastoupí",
    "náhradní kontakt", "potvrzený termín", "bezpečně zajištěno"]) {
    assert.ok(section.toLowerCase().includes(phrase.toLowerCase()) ||
      (phrase === "bezpečně zajištěno" && section.includes("nepokrytá")),
      "Missing workday care planning guard: " + phrase);
  }
  for (const kind of ["terénní pečovatelskou službu", "osobní asistenci", "odlehčovací služby"])
    assert.ok(section.toLowerCase().includes(kind.toLowerCase()), kind);
  assert.match(section, /SOS tlačítko ani krátká návštěva nejsou náhradou potřebné přítomnosti/);
  assert.match(section, /při akutním ohrožení zdraví nebo života volejte 155/i);
  assert.doesNotMatch(section, /<form\b|<input\b|<textarea\b|data-zp-merchant-link|affiliate|localStorage|sessionStorage|fetch\s*\(|gtag\s*\(/i,
    "No sensitive schedule collection, commerce or automatic tracking");
});

test("Day-center option and employment schedule are evidence-based, not blanket promises", () => {
  const cards = section.match(/<article class="zp-decision-card">[\s\S]*?<\/article>/g) || [];
  assert.equal(cards.length, 5, "Keep five distinct relevant support paths");
  assert.match(section, /denní stacionář nebo denní centrum/i);
  assert.match(section, /Ověřte rozsah pomoci, dopravu, provozní dny, kapacitu i podmínky přijetí/);
  assert.match(section, /denní stacionář nemusí pokrýt ráno, večer ani noc/);
  assert.match(section, /pružnou pracovní dobu, částečný úvazek nebo práci na dálku/);
  assert.match(section, /nelze předpokládat automatické schválení home office/i);
  assert.match(section, /Právní nároky a postup závisejí na konkrétních podmínkách/i);
  assert.ok(cards[3].includes('https://mpsv.gov.cz/pece-a-sluzby'));
  assert.ok(cards[4].includes('https://mpsv.gov.cz/pece-a-prace'));
});

test("MPSV evidence and every contextual link lead to a real destination", () => {
  assert.match(section, /https:\/\/mpsv\.gov\.cz\/pece-a-sluzby/);
  assert.match(section, /https:\/\/mpsv\.gov\.cz\/pece-a-prace/);
  assert.match(section, /10\. 11\. 2026/);
  for (const id of ["vyhledat-pecovatelskou-sluzbu-v-registru",
    "otazky-pro-pecovatelskou-sluzbu", "smlouva-a-cena-pecovatelske-sluzby",
    "kdyz-sluzba-nema-kapacitu"]) {
    assert.ok(service.includes('id="' + id + '"'), "Missing section target: " + id);
    assert.ok(section.includes('href="#' + id + '"'), "Missing user journey: " + id);
  }
  assert.ok(returnHome.includes(
    "home_url( '/jak-vybrat-pecovatelskou-sluzbu/#pece-o-rodice-pri-praci' )"
  ), "Hospital-return guide must point to actual care coverage plan");
  assert.ok(section.includes(
    "home_url( '/navrat-z-nemocnice/#domaci-zdravotni-pece-nebo-pecovatelska-sluzba' )"
  ));
  assert.ok(returnHome.includes('id="domaci-zdravotni-pece-nebo-pecovatelska-sluzba"'));
  assert.equal((returnHome.match(/<h1\b/g) || []).length, 1);
});

test("Both edited templates retain the release marker until the normal full release preparation", () => {
  const version = css.match(/^Version:\s*([0-9]+\.[0-9]+\.[0-9]+)$/m)?.[1];
  assert.ok(version);
  const marker = "ZP_RELEASE_" + version.replaceAll(".", "_");
  assert.ok(service.includes(marker));
  assert.ok(returnHome.includes(marker));
});
