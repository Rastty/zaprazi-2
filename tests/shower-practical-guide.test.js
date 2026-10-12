import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("shower guide adds five practical checks without replacing or bypassing the Advisor", () => {
  const page=read("page-sprchovaci-zidle-pro-seniory.php");
  assert.equal((page.match(/<main\b/g)||[]).length,1);
  assert.equal((page.match(/<h1\b/g)||[]).length,1);
  assert.equal((page.match(/data-zp-editorial-guide="shower-chair"/g)||[]).length,1);
  assert.match(page, /id="zp-shower-chair-advisor"/);
  const start=page.indexOf('data-zp-editorial-guide="shower-chair"');
  const end=page.indexOf('<section class="zp-section">',start);
  assert.ok(start>0&&end>start);
  const section=page.slice(start,end);
  assert.equal((section.match(/<h3\b/g)||[]).length,5);
  for(const phrase of ["Sprchový kout, nebo vana","Stabilní podlaha","Změřit skutečný prostor",
    "Výška sedu a nosnost","bezpečný další krok","55 cm","48 cm","38–50,5 cm","136 kg",
    "fyzické pomoci druhé osoby","12. 10. 2026","individuální externí odborná revize"])
    assert.ok(section.includes(phrase),"Missing verified practical guidance: "+phrase);
  for(const source of ["unizdrav.cz/zbozi/2062/sprchovaci-zidle-s-ruckami",
    "guysandstthomas.nhs.uk/health-information/daily-tasks-using-1-hand",
    "cuh.nhs.uk/patient-information/one-handed-living-tips/"])
    assert.ok(section.includes(source),"Source missing: "+source);
  assert.match(section,/\/sprchovaci-zidle-pro-seniory\/#poradce-sprchovaci-zidle/);
  assert.match(section,/\/sedatko-do-vany-pro-seniory\/#poradce-sedatko-vana/);
  assert.doesNotMatch(section,/data-zp-merchant-link|zp-offer\b|href="https:\/\/(?:ehub|awin|cj)\b/);
  assert.match(section,/při nejistotě|dokud není ověřený/i);
});

test("guide stays within existing bathroom model and release integrity",()=>{
  const page=read("page-sprchovaci-zidle-pro-seniory.php");
  const functions=read("functions.php");
  assert.match(page,/zp-shower-chair-fit-stage/);
  assert.match(page,/zp-shower-chair-result/);
  assert.ok(functions.includes("page-sprchovaci-zidle-pro-seniory.php"));
  assert.doesNotMatch(page,/recommendBathroom\s*\(/);
});
