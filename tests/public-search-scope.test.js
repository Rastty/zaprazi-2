import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const php=read("functions.php"),search=read("search.php"),recovery=read("404.php");

test("public main search uses published decision Pages only",()=>{
  const handler=php.split("function zaprazi_2_scope_public_search_to_pages")[1]?.split("add_action( 'pre_get_posts'")[0];
  assert.ok(handler,"Missing scoping function");
  assert.ok(handler.includes("is_admin()"),"Admin queries must stay intact");
  assert.ok(handler.includes("$query->is_main_query()"),"Secondary queries must stay intact");
  assert.ok(handler.includes("$query->is_search()"),"Only site search may be filtered");
  assert.ok(handler.includes("$query->set( 'post_type', 'page' )"));
  assert.ok(handler.includes("$query->set( 'post_status', 'publish' )"));
  for(const forbidden of ["wp_redirect","wp_delete_post","wp_trash_post","query_vars","$query->set( 's'"]) {
    assert.ok(!handler.includes(forbidden),"Unexpected search mutation: "+forbidden);
  }
  assert.ok(php.includes("add_action( 'pre_get_posts', 'zaprazi_2_scope_public_search_to_pages', 10, 1 )"));
});

test("contextual assistance and honest legacy 404 remain available",()=>{
  assert.ok(search.includes("zaprazi_2_search_guidance_for_query"));
  assert.ok(search.includes("Historický archiv energetiky a stavebnictví byl vyřazen"));
  assert.ok(recovery.includes("Stránka nenalezena · 404"));
});
