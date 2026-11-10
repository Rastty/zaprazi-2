import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("Rollator 60 cm doorway answer is findable and evidence-specific", () => {
  const page = read("page-rollator-pro-seniory.php");
  const start = page.indexOf('<section id="rollator-uzke-dvere"');
  const end = page.indexOf('<section id="rollator-se-sedatkem"', start);
  assert.ok(start > 0 && end > start, "The narrow-doorway answer belongs to the existing rollator URL");
  const guide = page.slice(start, end);

  assert.equal((page.match(/id="rollator-uzke-dvere"/g) || []).length, 1);
  assert.ok(page.slice(0, start).includes('href="#rollator-uzke-dvere"'),
    "First-screen editorial link to narrow-doorway answer missing");
  assert.match(guide, /Projde rollátor dveřmi širokými 60 cm/);
  assert.match(guide, /61,5 cm/);
  assert.match(guide, /60 cm/);
  assert.match(guide, /59 cm/);
  assert.match(guide, /rozdíln|liší/i, "Conflicting product documentation must be disclosed");
  assert.match(guide, /přesné dodávané varianty/);
  assert.match(guide, /10\. 11\. 2026/);
  assert.ok(guide.includes("eshop.meyra.cz/product/choditka_-berle_-hole/ctyrkolove-choditko-ideal-rollator-/191"));
  assert.ok(guide.includes("www.meyra.cz/upload/files/produkty/Hole-berle-choditka/Navod-k-pouziti-rollator-3061982.pdf"));
  assert.ok(guide.includes("/co-zmerit-pred-vyberem-choditka/#co-zmerit"));
  assert.ok(guide.includes("/choditko-do-bytu-pro-seniory/#poradce-choditko-byt"));
  assert.ok(guide.includes('href="#poradce-rollator"'));
  assert.equal((guide.match(/<article class="zp-decision-card">/g) || []).length, 3);
  assert.doesNotMatch(guide, /data-zp-merchant-link|data-zp-offer|rel="[^"]*sponsored|<form|<input|<textarea/);
});

test("The producer still uses conservative current width and safe fit gates", () => {
  const catalog = read("src/mobility/catalog.js");
  const start = catalog.indexOf('id: "meyra-ideal-3061982"');
  assert.ok(start >= 0, "Exact MEYRA candidate must remain in the existing catalog");
  assert.match(catalog.slice(start, start + 550), /widthCm: 61\.5/);
  const gate = read("src/mobility/offer-fit-gate.js");
  assert.match(gate, /Šířka tohoto modelu bezpečně projde všemi potřebnými místy/);
});
