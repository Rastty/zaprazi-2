import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const releaseMarker="ZP_RELEASE_"+read("style.css").match(/^Version:\s*(\S+)/m)[1].replaceAll(".","_");
const article = read("page-prevoz-seniora-k-lekari.php");
const route = "/prevoz-seniora-k-lekari/";
const expected = [
 "urgentni-situace-prevoz",
 "vyber-dopravy",
 "kdo-vystavuje-prikaz",
 "vozik-a-schody",
 "otazky-pro-lekare",
 "kontrolni-seznam-prevoz",
 "faq-prevoz",
 "zdroje-prevoz"
];

test("Senior transport page is useful without JavaScript and explains four safe pathways", () => {
 assert.equal((article.match(/<h1\b/g)||[]).length,1);
 for (const id of expected) assert.equal((article.match(new RegExp('id="'+id+'"', "g"))||[]).length,1,"Missing "+id);
 assert.ok(article.indexOf('id="urgentni-situace-prevoz"') < article.indexOf('id="vyber-dopravy"'));
 for (const term of ["volejte 155","Příkaz ke zdravotnímu transportu","lékař","vlastním autem","vozík","cesta zpět","sedm otázek","Doprovod"]) {
  assert.ok(article.toLowerCase().includes(term.toLowerCase()), "Missing critical explanation "+term);
 }
 assert.match(article, /stanovuje|posuzuje|rozhoduje/);
 assert.ok((article.match(/<details>/g)||[]).length >= 5);
 assert.ok((article.match(/<li>/g)||[]).length >= 20);
 assert.ok((article.match(/class="zp-decision-card"/g)||[]).length >= 7);
 assert.match(article,new RegExp(releaseMarker));
 assert.doesNotMatch(article,/<form\b|data-zp-merchant|data-zp-affiliate|rel="sponsored"|awin1\.com|click\.php/);
});

test("Claims about payment are anchored to official sources, not a made-up entitlement",()=>{
 for(const origin of ["https://www.nzip.cz/clanek/295-zdravotnicka-dopravni-sluzba",
 "https://www.vzp.cz/o-nas/nejcasteji-resite/otazka/mam-narok-na-proplaceni-dopravy-k-lekari",
 "https://www.vzp.cz/poskytovatele/informace-pro-praxi/poradna/preprava-pacienta-vozidlem-zdravotnicke-dopravni-sluzby"]){
 assert.ok(article.includes(origin),"Missing official primary source "+origin);
 }
 assert.ok(article.includes("28. 10. 2026"));
 assert.match(article,/externí odborná revize Zápraží není doložená/i);
 assert.ok(article.includes("Před rozhodnutím o přepravě ověřte"));
 assert.ok(!article.includes("na sanitku máte nárok"));
 assert.ok(!article.includes("sanitka zdarma pro každého"));
 assert.ok(!/v ceně|výhodná cena|sleva|kupte hned/i.test(article));
});

test("Guide is genuinely published via idempotent WordPress route registration",()=>{
 const f=read("functions.php");
 const fragment=f.slice(f.indexOf("function zaprazi_2_ensure_senior_transport_page()"));
 assert.ok(fragment.includes("get_page_by_path( $slug, OBJECT, 'page' )"));
 assert.ok(fragment.includes("file_exists( get_theme_file_path( '/page-prevoz-seniora-k-lekari.php' ) )"));
 assert.ok(fragment.includes("'post_status' => 'publish'"));
 assert.ok(fragment.includes("'post_name' => $slug"));
 assert.ok(fragment.includes("'_wp_page_template' => 'page-prevoz-seniora-k-lekari.php'"));
 assert.ok(fragment.includes("add_action( 'init', 'zaprazi_2_ensure_senior_transport_page', 58 )"));
 const sitemap=read("scripts/audit-public-sitemap.mjs");
 const staged=sitemap.slice(sitemap.indexOf("export const stagedDecisionPaths"),sitemap.indexOf("const decode ="));
 const required=sitemap.slice(sitemap.indexOf("export const requiredDecisionPaths"),sitemap.indexOf("export const stagedDecisionPaths"));
 // The published WordPress page and HTTPS Yoast sitemap were verified on 2026-10-28.
 // Once production is confirmed, a missing live route must become an audit failure.
 assert.ok(required.includes('"'+route+'"'),"Verified live guide must be required in sitemap QA");
 assert.ok(!staged.includes('"'+route+'"'),"Verified live guide cannot remain a staged-only URL");
});

test("Two topical entry pages lead to the transport guide without merchant redirects",()=>{
 for(const [path,anchor] of [
  ["page-navrat-z-nemocnice.php","vyber-dopravy"],
  ["page-nastupovani-seniora-do-auta.php","vyber-dopravy"]
 ]){
 const html=read(path);
 assert.ok(html.includes("home_url( '"+route+"#"+anchor+"' )"),path);
 assert.match(html,new RegExp(releaseMarker));
 }
 const destinations=[
  ["nastupovani-seniora-do-auta","#bezpecnost-nastupovani-auto"],
  ["invalidni-vozik-do-auta","#rozhodnuti-vozik-auto"],
  ["schody-pro-seniora-doma","#plan-schody"],
  ["navrat-z-nemocnice","#plan-navratu"]
 ];
 for(const [slug,hash] of destinations) {
  const path="page-"+slug+".php";
  const target=read(path);
  assert.ok(target.includes('id="'+hash.slice(1)+'"'),"Missing linked section "+slug+hash);
 }
});
