import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const page = read("page-senior-odmita-koupani.php"), fn = read("functions.php");
function part(id) {
  const i = page.indexOf('id="' + id + '"');
  assert.ok(i >= 0,"Missing section #" + id);
  const start=page.lastIndexOf("<section",i),end=page.indexOf("</section>",i);
  assert.ok(start >= 0 && end > i,"Malformed " + id);
  return page.slice(start,end);
}
test("Respectful hygiene guide is thorough and contains safe stop paths", () => {
  assert.equal((page.match(/<h1\b/g)||[]).length, 1);
  assert.equal((part("duvody-odmitani-koupani").match(/class="zp-decision-card"/g)||[]).length, 4);
  assert.equal((part("vyber-hygieny-bez-sprchy").match(/class="zp-decision-card"/g)||[]).length, 4);
  assert.equal((part("plan-hygiena-bez-natlaku").match(/<li>/g)||[]).length, 7);
  assert.equal((part("kontroly-koupani-rodina").match(/<li>/g)||[]).length, 8);
  assert.equal((part("faq-odmitani-hygieny").match(/<details>/g)||[]).length, 6);
  for (const phrase of ["bez nátlaku", "nepřenášejte jej silou", "volejte 155",
    "pečovatelskou službu", "sprchovací židli", "soukromí"]) {
    assert.ok(page.toLocaleLowerCase("cs").includes(phrase.toLocaleLowerCase("cs")),phrase);
  }
  assert.doesNotMatch(page,/data-zp-affiliate-target|data-zp-merchant-link|100 % bezpečné/);
});
test("Evidence, safe conversion and reciprocal internal paths", () => {
  const sources=part("zdroje-odmitani-hygieny");
  for(const s of ["nzip.cz/clanek/1285","nhs.uk/conditions/dementia","alzheimers.org.uk","nia.nih.gov"])
    assert.ok(sources.includes(s),s);
  for(const to of ["/koupelna-a-wc/#poradce-koupelna","/hygiena-leziciho-seniora-doma/#vyber-hygieny-na-luzku","/sprchovaci-zidle-pro-seniory/","/sedatko-do-vany-pro-seniory/"])
    assert.ok(page.includes(to),to);
  for(const source of ["front-page.php","page-koupelna-a-wc.php","page-hygiena-leziciho-seniora-doma.php"])
    assert.ok(read(source).includes("/senior-odmita-koupani/#"),source);
});
test("SEO, safe WordPress publishing, staged sitemap and version marker", () => {
  const start=fn.indexOf("function zaprazi_2_ensure_hygiene_reluctance_page()"),
    end=fn.indexOf("add_action( 'init', 'zaprazi_2_ensure_hygiene_reluctance_page'",start);
  assert.ok(start>=0 && end>start);
  const seed=fn.slice(start,end);
  for(const s of ["get_page_by_path( $slug, OBJECT, 'page' )","wp_insert_post","page-senior-odmita-koupani.php","post_status"])
    assert.ok(seed.includes(s),s);
  assert.doesNotMatch(seed,/wp_update_post|delete_post/);
  assert.match(fn,/function zaprazi_2_hygiene_reluctance_meta_fallback/);
  assert.match(fn,/Senior odmítá koupání: jak pomoci bez nátlaku/);
  const map=read("scripts/audit-public-sitemap.mjs");
  assert.ok(map.split("export const stagedDecisionPaths")[1].split("]);")[0].includes('"/senior-odmita-koupani/"'));
  assert.ok(!map.split("export const requiredDecisionPaths")[1].split("]);")[0].includes('"/senior-odmita-koupani/"'));
  const version=read("style.css").match(/^Version:\s*(\d+\.\d+\.\d+)/m)?.[1];
  assert.ok(page.includes("ZP_RELEASE_"+version.replaceAll(".","_")));
});
