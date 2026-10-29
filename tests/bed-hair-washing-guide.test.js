import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const page = read("page-myti-vlasu-na-luzku.php");
const functions = read("functions.php");
const section = (id) => {
  const index = page.indexOf('id="' + id + '"');
  assert.ok(index >= 0, "Section missing: " + id);
  const start = page.lastIndexOf("<section", index);
  const end = page.indexOf("</section>", index);
  assert.ok(start >= 0 && end > index, "Section not enclosed: " + id);
  return page.slice(start, end);
};

test("bed hair-washing editorial page answers question clearly with meaningful decision paths", () => {
  assert.equal((page.match(/<h1\b/g) || []).length, 1);
  assert.match(page, /Jak umýt vlasy ležícímu člověku doma/);
  assert.equal((section("bezpecnost-myti-vlasu").match(/class="zp-decision-card"/g) || []).length, 4);
  assert.equal((section("vyber-myti-vlasu").match(/class="zp-decision-card"/g) || []).length, 4);
  assert.equal((section("srovnani-pomucek-vlasy").match(/class="zp-decision-card"/g) || []).length, 3);
  assert.equal((section("postup-myti-vlasu").match(/<li>/g) || []).length, 7);
  assert.equal((section("kontrolni-seznam-vlasy").match(/<li>/g) || []).length, 7);
  assert.equal((section("faq-myti-vlasu").match(/<details>/g) || []).length, 6);
  assert.match(page, /nafukovací vanička|vaničku na mytí vlasů/);
  assert.match(page, /bezoplachová mycí čepice/i);
});

test("editorial safety and product trust block unsafe transfers, water hazards and unsupported offers", () => {
  for (const phrase of [
    "neotáčejte ani nezaklánějte hlavu", "neprovádějte oplachování",
    "Nesnažte se jej sami přetáčet", "Není nutné začínat koupí", "bezpečnou polohu",
    "přerušte činnost", "domácí sestrou", "Nenahrazuje"
  ]) {
    assert.ok(page.toLocaleLowerCase("cs").includes(phrase.toLocaleLowerCase("cs")), phrase);
  }
  assert.match(page, /Při akutní dušnosti či vážném zhoršení volejte 155/);
  assert.doesNotMatch(page, /data-zp-affiliate-target|data-zp-merchant-link|ehub\.cz\/system\/scripts\/click/);
  assert.doesNotMatch(page, /100\s*%|zaručeně nejlepší|garantuje bezpečnost/i);
  assert.match(page, /Externí odborná revize|nenahrazuje individuální zdravotní plán/i);
});

test("page cites primary care guidance and moves to relevant existing decision journeys", () => {
  const sources = section("zdroje-myti-vlasu");
  assert.match(sources, /oporadiakonie\.cz\/media\/2025\/04/);
  assert.match(sources, /nhs\.uk\/social-care-and-support/);
  assert.match(sources, /alzheimers\.org\.uk/);
  assert.match(page, /\/navrat-z-nemocnice\/#plan-navratu/);
  assert.match(page, /\/polohovaci-postel\/#poradce-postel/);
  assert.match(page, /\/koupelna-a-wc\/#poradce-koupelna/);
});

test("WordPress creates new slug once and does not overwrite legacy articles", () => {
  assert.match(functions, /function zaprazi_2_ensure_bed_hair_washing_page/);
  assert.match(functions, /get_page_by_path\( \$slug, OBJECT, 'page' \)/);
  const start=functions.indexOf("function zaprazi_2_ensure_bed_hair_washing_page");
  const end=functions.indexOf("add_action( 'init', 'zaprazi_2_ensure_bed_hair_washing_page'",start);
  assert.ok(end > start);
  const registration=functions.slice(start,end);
  assert.match(registration, /post_name' => \$slug/);
  assert.match(registration, /'post_status' => 'publish'/);
  assert.match(registration, /page-myti-vlasu-na-luzku\.php/);
  assert.doesNotMatch(registration, /wp_update_post|delete_post|wp_delete_post/);
  assert.match(functions, /zaprazi_2_is_bed_hair_washing_page/);
  assert.match(functions, /zaprazi_bed_hair_washing_page_v1/);
  assert.match(functions, /Mytí vlasů na lůžku: bezpečný postup a pomůcky \| Zápraží/);
  assert.match(functions, /function zaprazi_2_bed_hair_washing_meta_fallback/);
  assert.match(functions, /defined\( 'WPSEO_VERSION' \)/);
});

test("page discovery routes are contextual and new URL is sitemap-required, now production-required", () => {
  for (const path of ["page-navrat-z-nemocnice.php", "page-koupelna-a-wc.php", "page-polohovaci-postel.php"]) {
    assert.match(read(path), /\/myti-vlasu-na-luzku\/#vyber-myti-vlasu/, path);
  }
  assert.match(functions, /'page-myti-vlasu-na-luzku.php'/);
  const sitemap=read("scripts/audit-public-sitemap.mjs");
  const requiredCopy=sitemap.split("export const requiredDecisionPaths")[1].split("]);")[0];
  assert.ok(requiredCopy.includes('"/myti-vlasu-na-luzku/"'));
  const required=sitemap.split("export const requiredDecisionPaths")[1].split("]);")[0];
  assert.ok(required.includes('"/myti-vlasu-na-luzku/"'));
  const version = read("style.css").match(/^Version:\s*(\d+\.\d+\.\d+)/m)?.[1];
  assert.ok(version, "Theme version not defined");
  assert.ok(page.includes("ZP_RELEASE_" + version.replaceAll(".", "_")));
});
