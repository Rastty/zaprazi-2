/**
 * Audit of completed archival cleanup, not an inventory of "311 remaining".
 * 310 of the previously 311 residual posts were subsequently trashed.
 * Authenticated SQL (2026-10-27) remains authoritative for DB status.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const origin="https://zaprazi.cz";
const manifest=JSON.parse(readFileSync(new URL("../data/archive-residual-311-review-20261027.json",import.meta.url),"utf8"));
assert.equal(manifest.entries.length,311);
assert.equal(manifest.entries.filter(x=>Number(x.id)===3638).length,1,"Preserved article ID missing");
const get=async(path,accept="text/html")=>{
 const r=await fetch(origin+path,{headers:{Accept:accept,"Cache-Control":"no-cache"},
   redirect:"follow",signal:AbortSignal.timeout(28000)});
 return {status:r.status,text:await r.text(),headers:r.headers};
};
const posts=await get("/wp-json/wp/v2/posts?per_page=1","application/json");
assert.equal(posts.status,200);
const publicRestTotal=Number(posts.headers.get("x-wp-total"));
assert.ok(publicRestTotal>=0&&publicRestTotal<=1,"Unexpected public post REST count: "+publicRestTotal);
const pages=await get("/wp-json/wp/v2/pages?per_page=1","application/json");
assert.equal(pages.status,200);
const publicPagesTotal=Number(pages.headers.get("x-wp-total"));
assert.equal(publicPagesTotal,53,"All modern published pages must remain");
const checkPaths=[
 "/solarni-panely-a-jejich-prinos-pro-ekologickou-dopravu/",
 "/retencni-nadrze-na-destovou-vodu-ekonomicke-vyhody-a-uspory-pro-domacnosti/",
 "/jak-zachovat-hygienickou-cistotu-ve-zubni-ordinaci-s-vyuzitim-specializovaneho-nabytku/"
];
for(const path of checkPaths){
 const r=await get(path);
 assert.ok(r.status===404||r.status===410,"Old unrelated post still publicly reachable "+path+": "+r.status);
}
for(const path of ["/","/senior-malo-pije/","/koupelna-a-wc/","/sobestacnost/"]){
 const r=await get(path);
 assert.equal(r.status,200,"Protected guide unavailable "+path);
 assert.ok(r.text.includes('name="zaprazi-release" content="0.8.177"'),"Unexpected live theme "+path);
}
const read=await get("/wp-json/zaprazi/v1/affiliate-readiness","application/json");
assert.equal(read.status,200);
const ready=JSON.parse(read.text);
assert.equal(ready.release,"0.8.177");
assert.equal(ready.integrity,"ok");
assert.equal(ready.slot_total,25);
assert.equal(ready.configured_total,25);
const postMap=await get("/post-sitemap.xml","application/xml");
const pagesMap=await get("/page-sitemap.xml","application/xml");
assert.equal(pagesMap.status,200);
assert.ok(pagesMap.text.includes("senior-malo-pije"),"Modern guide lost from sitemap");
const preserved=await get("/stoly-bezpecne-pro-deti-a-seniory-jake-jsou-kriteria-vyberu/");
console.log("ZP_POST_CLEANUP_AUDIT "+JSON.stringify({
 authenticatedSQLSnapshot:{trashedByCleanup:4359,publishedPosts:1,publishedPages:53,protectedPostId:3638},
 manifestBeforeSecondWave:manifest.entries.length,secondWaveTrash:310,
 livePublicRESTCount:publicRestTotal,livePublicPagesCount:publicPagesTotal,
 removedSamples404or410:checkPaths.length,
 protectedPost3638PublicStatus:preserved.status,
 oldPostSitemapHTTP:postMap.status,
 newPagesInPageSitemap:true,liveRelease:ready.release,integrity:ready.integrity,
 affiliateConfigured:ready.configured_total,
 caveat:"REST visibility can differ from authenticated DB SQL. No Google Search Console indexation inference."
}));
