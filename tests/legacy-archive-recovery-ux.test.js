import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync, existsSync} from "node:fs";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const recovery=read("404.php"), search=read("search.php");

test("removed archive links return an honest 404 page, not a misleading redirect",()=>{
  assert.match(recovery,/Stránka nenalezena · 404/);
  assert.match(recovery,/Starý obsah o energetice a stavebnictví jsme vyřadili/);
  assert.match(recovery,/Nechceme vás přesměrovat na nesouvisející článek/);
  assert.doesNotMatch(recovery,/wp_redirect|status_header\(\s*200|redirect_canonical|window\.location/);
  assert.ok(recovery.includes('id="main-content"'));
  assert.ok(recovery.includes('aria-labelledby="zp-recovery-title"'));
});

test("404 offers only live editorial guide paths with a real source template",()=>{
  const slugs=["choditka-pro-seniory","koupelna-a-wc","bezpecny-byt-pro-seniora","navrat-z-nemocnice"];
  for(const slug of slugs){
    assert.ok(recovery.includes("home_url( '/"+slug+"/' )"),"Missing guide route "+slug);
    assert.ok(existsSync(new URL("../page-"+slug+".php",import.meta.url)),"Missing route template "+slug);
  }
  assert.ok(recovery.includes("home_url( '/#poradce' )"));
  assert.doesNotMatch(recovery,/fotovoltaika\/|tepelna-cerpadla\/|get_categories\(/);
});

test("search does not invite visitors to an already retired archive",()=>{
  assert.match(search,/Historický archiv energetiky a stavebnictví byl vyřazen/);
  assert.doesNotMatch(search,/Výsledky mohou obsahovat starší články|Ve starším archivu nemáme/);
  assert.match(search,/Další odpovídající stránku jsme nenašli/);
  assert.ok(search.includes("zaprazi_2_search_guidance_for_query"));
  assert.ok(search.includes("esc_html( get_search_query() )"));
});
