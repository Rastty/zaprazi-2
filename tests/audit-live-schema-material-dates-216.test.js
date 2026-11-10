import test from "node:test";
import assert from "node:assert/strict";
import {assertMaterialWebpageSchema} from "../scripts/audit-live-schema-material-dates-216.mjs";

const release="0.8.216",path="/choditko-na-pojistovnu/";
const sourceDate="2026-11-10",url="https://zaprazi.cz"+path;
const now=new Date("2026-11-11T05:00:00Z");
function html({mod="2026-11-10T00:00:00+00:00",pub="2026-10-06T20:35:01+00:00",
  canonical=url,pageUrl=url,id=url,version=release,integrity="ok",twice=false}={}){
  const node={"@type":"WebPage","@id":id,url:pageUrl,dateModified:mod,datePublished:pub};
  const graph=JSON.stringify({"@context":"https://schema.org","@graph":twice?[node,node]:[node]});
  return '<html><head><meta name="zaprazi-release" content="'+version+'">'+
    '<meta name="zaprazi-integrity" content="'+integrity+'">'+
    '<link rel="canonical" href="'+canonical+'">'+
    '<script type="application/ld+json" class="yoast-schema-graph">'+graph+'</script>'+
    '</head><body><main><h1>Poradce</h1></main></body></html>';
}
test("exact live 216 WebPage JSON-LD is at or after sourced material date",()=>{
  assert.deepEqual(assertMaterialWebpageSchema(html(),path,sourceDate,release,now),{path,verified:true});
  assert.deepEqual(assertMaterialWebpageSchema(html({mod:"2026-11-10T01:00:00+00:00"}),
    path,sourceDate,release,now),{path,verified:true});
});
test("reject stale, future, malformed, older than publication",()=>{
  assert.throws(()=>assertMaterialWebpageSchema(html({mod:"2026-10-06T20:35:01+00:00"}),path,sourceDate,release,now),
    /SCHEMA_MODIFIED_MATERIAL_DATE_NOT_VERIFIED/);
  assert.throws(()=>assertMaterialWebpageSchema(html({mod:"2026-11-12T00:00:00+00:00"}),path,sourceDate,release,now),
    /SCHEMA_MODIFIED_MATERIAL_DATE_NOT_VERIFIED/);
  assert.throws(()=>assertMaterialWebpageSchema(html({mod:"garbage"}),path,sourceDate,release,now),
    /SCHEMA_MODIFIED_ISO_INVALID/);
  assert.throws(()=>assertMaterialWebpageSchema(html({pub:"2026-11-10T02:00:00+00:00"}),path,sourceDate,release,now),
    /SCHEMA_CHRONOLOGY_INVALID/);
});
test("reject wrong source, canonical, identity, release, integrity or duplicates",()=>{
  assert.throws(()=>assertMaterialWebpageSchema(html(),path,"2026-11-09",release,now),
    /SCHEMA_SOURCE_DATE_NOT_ALLOWLISTED/);
  assert.throws(()=>assertMaterialWebpageSchema(html({canonical:"https://other.example/"}),path,sourceDate,release,now),
    /SCHEMA_CANONICAL_MISMATCH/);
  assert.throws(()=>assertMaterialWebpageSchema(html({pageUrl:"https://other.example/"}),path,sourceDate,release,now),
    /SCHEMA_WEBPAGE_URL_MISMATCH/);
  assert.throws(()=>assertMaterialWebpageSchema(html({id:"https://other.example/"}),path,sourceDate,release,now),
    /SCHEMA_WEBPAGE_ID_MISMATCH/);
  assert.throws(()=>assertMaterialWebpageSchema(html({version:"0.8.215"}),path,sourceDate,release,now),
    /SCHEMA_LIVE_RELEASE_MISMATCH/);
  assert.throws(()=>assertMaterialWebpageSchema(html({integrity:"partial"}),path,sourceDate,release,now),
    /SCHEMA_LIVE_INTEGRITY_FAILED/);
  assert.throws(()=>assertMaterialWebpageSchema(html({twice:true}),path,sourceDate,release,now),
    /SCHEMA_WEBPAGE_NODE_MISSING_OR_DUPLICATE/);
});
