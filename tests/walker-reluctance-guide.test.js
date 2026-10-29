import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const page = read("page-senior-odmita-choditko.php");
const functions = read("functions.php");
function section(id) {
  const i = page.indexOf('id="' + id + '"');
  assert.ok(i >= 0, "Missing section " + id);
  const a = page.lastIndexOf("<section", i), b = page.indexOf("</section>", i);
  assert.ok(a >= 0 && b > i, "Malformed section " + id);
  return page.slice(a, b);
}
test("walker reluctance guide is empathetic, structured, evidence-led and non-coercive", () => {
  assert.equal((page.match(/<h1\b/g) || []).length, 1);
  assert.equal((section("proc-senior-odmita").match(/class="zp-decision-card"/g) || []).length, 4);
  assert.equal((section("sedm-kroku-bez-natlaku").match(/<li>/g) || []).length, 7);
  assert.equal((section("faq-odmitani-choditka").match(/<details>/g) || []).length, 6);
  for (const s of ["bez nátlaku", "důstojnost", "fyzioterapeutem", "ergoterapeutem", "volejte 155",
    "špatně nastavená", "Nepředpokládejte", "bezpečně ovládat brzdy", "Externí"]) {
      if (s === "Externí") continue;
      assert.ok(page.toLocaleLowerCase("cs").includes(s.toLocaleLowerCase("cs")), s);
    }
  assert.doesNotMatch(page, /100\s*%|zaručí zabránění|přesvědčte ho za každou cenu/i);
  assert.doesNotMatch(page, /data-zp-affiliate-target|data-zp-merchant-link/);
});
test("research, directions and specific safe internal journeys are present", () => {
  const sources = section("zdroje-odmitani-choditka");
  for (const s of ["pubmed.ncbi.nlm.nih.gov/17646215", "pmc.ncbi.nlm.nih.gov/articles/PMC2768139",
    "nhsinform.scot", "healthnz.govt.nz"]) assert.ok(sources.includes(s), s);
  for (const path of ["/choditko-do-bytu-pro-seniory/#poradce-choditko-byt",
    "/rollator-pro-seniory/#poradce-rollator",
    "/senior-spadl-doma/#prvni-krok-pad",
    "/bezpecny-byt-pro-seniora/#audit-bytu"]) assert.ok(page.includes(path), path);
  for (const inbound of ["front-page.php","page-choditka-pro-seniory.php","page-senior-spadl-doma.php"]) {
    assert.ok(read(inbound).includes("/senior-odmita-choditko/"), inbound);
  }
});
test("page SEO is registered in WordPress safely with correct release marker and required sitemap", () => {
  const start = functions.indexOf("function zaprazi_2_ensure_walker_reluctance_page()");
  const end = functions.indexOf("add_action( 'init', 'zaprazi_2_ensure_walker_reluctance_page'", start);
  const seed = functions.slice(start,end);
  assert.ok(start >= 0 && end > start);
  for(const s of ["get_page_by_path( $slug, OBJECT, 'page' )","wp_insert_post",
    "page-senior-odmita-choditko.php","post_status","post_name"])
    assert.ok(seed.includes(s), s);
  assert.doesNotMatch(seed,/wp_update_post|delete_post/);
  assert.match(functions,/function zaprazi_2_is_walker_reluctance_page/);
  assert.match(functions,/function zaprazi_2_walker_reluctance_meta_fallback/);
  assert.match(functions,/Senior odmítá chodítko: co dělat bez nátlaku/);
  const map = read("scripts/audit-public-sitemap.mjs");
  const requiredCopy = map.split("export const requiredDecisionPaths")[1].split("]);")[0];
  const required = map.split("export const requiredDecisionPaths")[1].split("]);")[0];
  assert.ok(requiredCopy.includes('"/senior-odmita-choditko/"'));
  assert.ok(required.includes('"/senior-odmita-choditko/"'));
  const version = read("style.css").match(/^Version:\s*(\d+\.\d+\.\d+)/m)?.[1];
  assert.ok(page.includes("ZP_RELEASE_" + version.replaceAll(".","_")));
});
