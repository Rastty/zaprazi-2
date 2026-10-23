import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const page=read("page-schody-pro-seniora-doma.php");
const site=read("page-bezpecny-byt-pro-seniora.php");
const discharge=read("page-otazky-pred-propustenim-z-nemocnice.php");
const functions=read("functions.php");
const search=read("src/seo/search-guidance.php");

test("stairs topic owns one distinct problem-focused page and 7 practical checks",()=>{
  assert.match(page,/Template Name: Zápraží — Schody pro seniora doma/);
  assert.match(page,/ZP_RELEASE_0_8_151/);
  assert.equal((page.match(/<h1[\s>]/g)||[]).length,1);
  for(const id of ["plan-schody","situace-schody","co-zmerit-schody","prispevek-schody","zdroje-schody"])
    assert.ok(page.includes('id="'+id+'"'),"Missing jump target "+id);
  for(let i=1;i<=7;i++)assert.ok(page.includes('0'+i+" ·"),"Missing checklist item "+i);
  assert.match(page,/schodišťovou sedačku/);
  assert.match(page,/plošina/);
  assert.match(page,/schodolez/);
  assert.match(page,/bez rizikového přenášení/);
  assert.match(page,/Nezaměňujte pomůcky/);
  assert.match(page,/samotná kontrola neznamená schválení bezpečnosti/);
  assert.match(page,/Externí odborná revize tohoto návodu zatím není doložena/);
});

test("stairs aid financing uses primary source and cannot promise automatic insurance payment",()=>{
  for(const source of ["https://mpsv.gov.cz/prispevek-na-zvlastni-pomucku",
      "https://www.ipzs.gov.cz/pomucka-kdy-mohu-ziskat",
      "https://mmr.gov.cz/"])
    assert.ok(page.includes(source),"Missing authority "+source);
  assert.match(page,/není automatický nárok pro každého seniora/);
  assert.match(page,/Úřadu práce ČR/);
  assert.match(page,/běžným hrazením zdravotnického prostředku/);
  assert.doesNotMatch(page,/affiliate|ehub\.cz|cj\.com|data-zp-offer|data-zp-affiliate-target|Koupit nyní/i);
  assert.doesNotMatch(page,/<form\b|name="(?:diagnosis|age|weight|patient)"/i);
});

test("problem guide is linked from two distinct existing editorial contexts and routes back",()=>{
  const destination="/schody-pro-seniora-doma/#plan-schody";
  assert.ok(site.includes(destination),"Home audit must lead to stair problem");
  assert.ok(discharge.includes(destination),"Hospital discharge question must lead to stair problem");
  for(const path of ["/bezpecny-byt-pro-seniora/#audit-bytu",
                     "/navrat-z-nemocnice/#plan-navratu",
                     "/otazky-pred-propustenim-z-nemocnice/",
                     "/invalidni-vozik/#poradce-vozik",
                     "/projede-invalidni-vozik-dvermi/#mereni-pruchodu"])
    assert.ok(page.includes(path),"Missing relevant journey link "+path);
  assert.match(search, /'\/schody-pro-seniora-doma\/#plan-schody'/);
});

test("auto-registration is one-slug only, does not overwrite other WP pages, has own SEO metadata",()=>{
  assert.match(functions,/function zaprazi_2_ensure_stairs_page\(\)/);
  const start=functions.indexOf("function zaprazi_2_ensure_stairs_page()");
  const hook=functions.indexOf("add_action( 'init', 'zaprazi_2_ensure_stairs_page', 34 );",start);
  assert.ok(start>0 && hook>start,"Non-destructive on-init publishing hook absent");
  const block=functions.slice(start,hook);
  assert.match(block,/get_page_by_path\( \$slug, OBJECT, 'page' \)/);
  assert.match(block,/file_exists\( get_theme_file_path/);
  assert.match(block,/wp_insert_post/);
  assert.match(block,/'post_name' => \$slug/);
  assert.match(block,/'_wp_page_template' => 'page-schody-pro-seniora-doma.php'/);
  assert.doesNotMatch(block,/wp_update_post|wp_delete_post|wp_trash_post|wp_set_post_terms/);
  assert.ok(functions.includes("is_page( 'schody-pro-seniora-doma' )"));
  assert.ok(functions.includes("zaprazi_2_stairs_meta_fallback"));
  assert.match(functions,/ZAPRAZI_RELEASE', '0\.8\.151'/);
});
