import test from "node:test";
import assert from "node:assert/strict";
import {yoastHttpsGraphErrors} from "../scripts/lib/yoast-https-graph.mjs";

const root="https://zaprazi.cz";
const make=(path="/koupelna-a-wc/")=>JSON.stringify({
  "@context":"https://schema.org",
  "@graph":[
    {"@type":"WebPage","@id":root+path,"url":root+path,
      "isPartOf":{"@id":root+"/#website"}},
    {"@type":"WebSite","@id":root+"/#website","url":root+"/",
      "potentialAction":[{"@type":"SearchAction",
        "target":{"@type":"EntryPoint","urlTemplate":root+"/?s={search_term_string}"}}]}
  ]
});

test("Yoast WebSite, Page linkage and search target are HTTPS on published pages",()=>{
  assert.deepEqual(yoastHttpsGraphErrors(make(),"/koupelna-a-wc/"),[]);
  assert.deepEqual(yoastHttpsGraphErrors(make("/"),"/"),[]);
});
test("Catch old HTTP WordPress siteurl leaking into Yoast JSON-LD while canonical is HTTPS",()=>{
  const a=JSON.parse(make());
  const graph=a["@graph"];
  const website=graph.find(x=>x["@type"]==="WebSite");
  const page=graph.find(x=>x["@type"]==="WebPage");
  website.url="http://zaprazi.cz/";
  website["@id"]="http://zaprazi.cz/#website";
  website.potentialAction[0].target.urlTemplate="http://zaprazi.cz/?s={search_term_string}";
  page.isPartOf["@id"]="http://zaprazi.cz/#website";
  const codes=yoastHttpsGraphErrors(JSON.stringify(a),"/koupelna-a-wc/").map(e=>e.code);
  for(const code of ["YOAST_WEBSITE_ID_SCHEME","YOAST_WEBSITE_URL_SCHEME",
    "YOAST_SEARCH_SCHEME","YOAST_WEBPAGE_WEBSITE_REF"])assert.ok(codes.includes(code),code);
});
test("Fail closed on missing, malformed or unrelated Yoast schema",()=>{
  assert.deepEqual(yoastHttpsGraphErrors("","/"),[
    {code:"YOAST_SCHEMA_MISSING",details:"No Yoast schema graph"}]);
  assert.ok(yoastHttpsGraphErrors("{oops","/").some(e=>e.code==="YOAST_SCHEMA_INVALID_JSON"));
  assert.ok(yoastHttpsGraphErrors("{}","/").some(e=>e.code==="YOAST_GRAPH_MISSING"));
  const obj=JSON.parse(make());
  obj["@graph"][0].url="https://zaprazi.cz/incorrect/";
  assert.ok(yoastHttpsGraphErrors(JSON.stringify(obj),"/koupelna-a-wc/")
    .some(e=>e.code==="YOAST_WEBPAGE_URL"));
});
