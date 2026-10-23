/**
 * Verifies that Yoast's site-wide WebSite/connector references use the same
 * secure canonical origin as rendered page URLs. This catches a WordPress
 * Settings > General regression (home/siteurl set to HTTP) even when a theme
 * output filter already fixes individual <link rel="canonical"> elements.
 * No personal data, network requests or changes to WordPress.
 */
export function yoastHttpsGraphErrors(raw, path, origin="https://zaprazi.cz"){
  const errors=[];
  if(!raw || typeof raw!=="string")return [{code:"YOAST_SCHEMA_MISSING",details:"No Yoast schema graph"}];
  let schema;
  try{schema=JSON.parse(raw);}
  catch{return [{code:"YOAST_SCHEMA_INVALID_JSON",details:"Malformed JSON-LD"}];}
  if(!Array.isArray(schema?.["@graph"]))return [{code:"YOAST_GRAPH_MISSING",details:"Missing @graph"}];

  const hasType=(node,type)=>[].concat(node?.["@type"]||[]).includes(type);
  const website=schema["@graph"].find(node=>hasType(node,"WebSite"));
  const webpage=schema["@graph"].find(node=>hasType(node,"WebPage"));
  const expectedSite=origin+"/";
  const expectedRef=origin+"/#website";
  const expectedPage=origin+path;
  if(!website)errors.push({code:"YOAST_WEBSITE_MISSING",details:"No WebSite node"});
  else{
    if(website["@id"]!==expectedRef)
      errors.push({code:"YOAST_WEBSITE_ID_SCHEME",details:String(website["@id"]||"")});
    if(website.url!==expectedSite)
      errors.push({code:"YOAST_WEBSITE_URL_SCHEME",details:String(website.url||"")});
    const actions=[].concat(website.potentialAction||[]);
    const search=actions.find(action=>hasType(action,"SearchAction"));
    const target=search?.target;
    const template=typeof target==="string"?target:target?.urlTemplate;
    if(template!==origin+"/?s={search_term_string}")
      errors.push({code:"YOAST_SEARCH_SCHEME",details:String(template||"")});
  }
  if(!webpage)errors.push({code:"YOAST_WEBPAGE_MISSING",details:"No WebPage node"});
  else{
    if(webpage.url!==expectedPage)
      errors.push({code:"YOAST_WEBPAGE_URL",details:String(webpage.url||"")});
    if(webpage.isPartOf?.["@id"]!==expectedRef)
      errors.push({code:"YOAST_WEBPAGE_WEBSITE_REF",details:String(webpage.isPartOf?.["@id"]||"")});
  }
  return errors;
}
