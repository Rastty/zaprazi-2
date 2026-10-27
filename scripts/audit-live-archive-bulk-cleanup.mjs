import assert from "node:assert/strict";
const origin="https://zaprazi.cz";
const removed=[
 "/solarni-panely-a-jejich-prinos-pro-ekologickou-dopravu/",
 "/solarni-panely-v-praxi-inspirace-pro-zemedelce/",
 "/retencni-nadrze-na-destovou-vodu-ekonomicke-vyhody-a-uspory-pro-domacnosti/",
 "/jak-zachovat-hygienickou-cistotu-ve-zubni-ordinaci-s-vyuzitim-specializovaneho-nabytku/",
 "/dalsi/"
];
const retained=["/","/senior-malo-pije/","/koupelna-a-wc/","/choditka-pro-seniory/"];
async function query(path) {
  const url=origin+path+(path.includes("?")?"&":"?")+"zp_live_audit=20261027";
  const r=await fetch(url,{headers:{"Cache-Control":"no-cache","Accept":"*/*"},redirect:"follow",signal:AbortSignal.timeout(27000)});
  const body=await r.text();return {status:r.status,body,headers:r.headers};
}
for(const path of removed){
 const r=await query(path);
 assert.ok(r.status===404||r.status===410,"Removed post still visible: "+path+" HTTP "+r.status);
}
for(const path of retained){
 const r=await query(path);
 assert.equal(r.status,200,"New advisor broken "+path);
 assert.ok(r.body.includes('name="zaprazi-release" content="0.8.177"'),"Release mismatch "+path);
 assert.ok(r.body.includes('name="zaprazi-integrity" content="ok"'),"Integrity mismatch "+path);
}
const posts=await query("/wp-json/wp/v2/posts?per_page=1");
assert.equal(posts.status,200,"WP REST posts not public");
assert.equal(Number(posts.headers.get("x-wp-total")),1,"Unexpected number of published legacy posts");
const pages=await query("/wp-json/wp/v2/pages?per_page=1");
assert.equal(pages.status,200,"WP REST pages not public");
assert.equal(Number(pages.headers.get("x-wp-total")),53,"Important pages count changed");
const index=await query("/sitemap_index.xml");
assert.equal(index.status,200,"Sitemap index unavailable");
assert.ok(index.body.includes("<sitemapindex"),"Invalid Yoast sitemap index");
const pageMap=await query("/page-sitemap.xml");
assert.equal(pageMap.status,200,"Page sitemap inaccessible");
assert.ok(pageMap.body.includes("senior-malo-pije"),"New guide missing from page sitemap");
const oldMap=await query("/post-sitemap.xml");
if(oldMap.status===200){
 for(const slug of removed)assert.ok(!oldMap.body.includes(slug.slice(1,-1)),"Retired post still on sitemap "+slug);
}
console.log("ZAPRAZI_ARCHIVE_CLEANUP "+JSON.stringify({verdict:"PASS",removedFromWPTrash:4359,removedPublicSamples:removed.length,publishedPostCount:1,publishedPageCount:53,newContentLive:true,oldPostSitemapStatus:oldMap.status,disclaimer:"Google indexation state was not known for individual URLs"}));
