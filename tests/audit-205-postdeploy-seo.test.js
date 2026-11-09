import test from "node:test";
import assert from "node:assert/strict";
import {assertHomepageCards,assertMaterialLastmod,SOURCE_DATES} from "../scripts/audit-205-postdeploy-seo.mjs";

const html=String.raw`<html><main>
<article class="zp-decision-card"><h3>Chůze a opora</h3>
<p><a class="zp-text-link" href="https://zaprazi.cz/co-zmerit-pred-vyberem-choditka/">Sedm věcí, které změřit</a></p></article>
<article class="zp-decision-card"><h3>Koupelna a WC</h3>
<a href="https://zaprazi.cz/sprchovaci-zidle-pro-seniory/">Sprchovací židle: co ověřit</a></article>
</main></html>`;
const xml='<urlset>'+Object.entries(SOURCE_DATES).map(([path,date])=>
  '<url><loc>https://zaprazi.cz'+path+'</loc><lastmod>'+date+'T00:00:00+00:00</lastmod></url>').join('')+'</urlset>';
test("Exact visible homepage decision cards link to matching useful guides",()=>{
  const v=assertHomepageCards(html);
  assert.equal(v.linksVerified,2);
  for(const path of ["/co-zmerit-pred-vyberem-choditka/","/sprchovaci-zidle-pro-seniory/"])
    assert.ok(v.paths.includes(path));
  assert.throws(()=>assertHomepageCards(html.replace("Sedm věcí, které změřit","Koupit hned")),
    /MISSING_CONTEXTUAL_HOME_LINK/);
  assert.throws(()=>assertHomepageCards(html.replace("https://zaprazi.cz/sprchovaci-zidle","http://zaprazi.cz/sprchovaci-zidle")),
    /MISSING_CONTEXTUAL_HOME_LINK/);
  assert.throws(()=>assertHomepageCards(html.replace("/co-zmerit-pred-vyberem-choditka/","/co-zmerit-pred-vyberem-choditka/?symptom=x")),
    /MISSING_CONTEXTUAL_HOME_LINK/);
});
test("Only six exact substantial changes must have real not-in-future sitemap dates",()=>{
  const v=assertMaterialLastmod(xml,"2026-11-10");
  assert.equal(v.lastmodsVerified,6);
  assert.deepEqual(v.pages.map(x=>x.path),Object.keys(SOURCE_DATES));
  assert.throws(()=>assertMaterialLastmod(xml.replaceAll("<lastmod>","<lastmid>"),"2026-11-10"),
    /SITEMAP_LASTMOD_UNVERIFIED/);
  assert.throws(()=>assertMaterialLastmod(xml.replace("2026-11-09T00","2026-10-09T00"),"2026-11-10"),
    /SITEMAP_LASTMOD_OUTSIDE_MATERIAL_WINDOW/);
  assert.throws(()=>assertMaterialLastmod(xml.replace("2026-11-09T00","2026-12-09T00"),"2026-11-10"),
    /SITEMAP_LASTMOD_OUTSIDE_MATERIAL_WINDOW/);
  assert.throws(()=>assertMaterialLastmod(xml+xml,"2026-11-10"),
    /SITEMAP_MISSING_OR_DUPLICATE_PAGE/);
  assert.throws(()=>assertMaterialLastmod(xml.replace("https://zaprazi.cz/pujceni-choditka/","https://other.example/pujceni-choditka/"),"2026-11-10"),
    /SITEMAP_MISSING_OR_DUPLICATE_PAGE/);
});
