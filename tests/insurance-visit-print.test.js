import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("insurance visit checklist is discoverable and safely printable", () => {
  const page = read("page-choditko-na-pojistovnu.php");
  assert.match(page, /data-zp-paper-print hidden>Vytisknout otázky pro lékaře a výdejnu/);
  const marker = '<section class="zp-section zp-paper-checklist" data-zp-paper-checklist="walker-epoukaz-visit"';
  const start = page.indexOf(marker);
  const end = page.indexOf("</main>", start);
  assert.ok(start > 0 && end > start, "Print sheet must be an isolated main section");
  const sheet = page.slice(start, end);
  const questions = sheet.match(/<ol class="zp-paper-questions">([\s\S]*?)<\/ol>/)?.[1];
  assert.ok(questions, "Shared print worksheet structure must be used");
  assert.equal((questions.match(/<li>/g) || []).length, 6);
  for (const phrase of [
    "bezpečný typ chodítka",
    "ePoukaz",
    "označení modelu",
    "výdejce oprávněný",
    "aktuální úhrada",
    "rozměry, nosnost, nastavení, brzdy"
  ]) assert.ok(questions.includes(phrase), "Missing visit question: " + phrase);
  assert.match(sheet, /nekupujte chodítko s očekáváním zpětného proplacení/);
  assert.match(sheet, /Zápraží nepotvrzuje vhodnost pomůcky ani nárok na úhradu/);
  assert.doesNotMatch(sheet, /<form\b|<input\b|<textarea\b|fetch\s*\(|localStorage|sessionStorage|data-zp-merchant-link/i);
  assert.equal((page.match(/<h1\b/g) || []).length, 1);
});

test("print helper loads only for the selected editorial page and preserves normal reading", () => {
  const php = read("functions.php");
  const start = php.indexOf("function zaprazi_2_family_checklist_print_asset()");
  const end = php.indexOf("add_action( 'wp_enqueue_scripts', 'zaprazi_2_family_checklist_print_asset', 20 );", start);
  assert.ok(start > 0 && end > start);
  assert.match(php.slice(start, end), /'choditko-na-pojistovnu'/);
  const css = read("style.css");
  assert.match(css, /\.zp-paper-checklist\{display:none\}/);
  assert.match(css, /body\.zp-paper-print-mode main > :not\(\.zp-paper-checklist\)\{display:none!important\}/);
  const js = read("assets/js/family-checklist-print.js");
  assert.match(js, /window\.print\(\)/);
  assert.doesNotMatch(js, /fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|navigator\.sendBeacon|dataLayer|gtag\s*\(/);
});
