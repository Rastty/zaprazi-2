/**
 * Read-only, fail-closed presentation of the 15 canonical Google indexed-version
 * inspection outcomes already returned by Prometheus' fixed allowlisted capture.
 * The report is NOT a live URL test and cannot change indexing or WordPress.
 */
const PATHS=Object.freeze([
  "/","/choditko-na-pojistovnu/","/pujceni-choditka/",
  "/rollator-pro-seniory/","/choditka-pro-seniory/",
  "/choditko-do-bytu-pro-seniory/","/co-zmerit-pred-vyberem-choditka/",
  "/kompenzacni-pomucky-pro-seniory/","/koupelna-a-wc/",
  "/sprchovaci-zidle-pro-seniory/","/navrat-z-nemocnice/",
  "/invalidni-vozik/","/polohovaci-postel/","/bezpecny-byt-pro-seniora/",
  "/sobestacnost/"
]);
const SOURCE="GSC URL Inspection API — indexed-version snapshot, NOT live URL test";
const COVERAGE=new Set([
 "submitted_indexed","indexed_outside_sitemap","crawled_not_indexed",
 "discovered_not_indexed","google_canonical_differs","alternate_canonical",
 "duplicate_without_canonical","blocked_noindex","blocked_robots",
 "http_404","soft_404","redirect","server_error","other"
]);
const BLOCKED=new Set(["blocked_noindex","blocked_robots","http_404",
  "soft_404","redirect","server_error"]);
const STATES=new Map([["indexed","PASS"],["excluded","NEUTRAL"],["error","FAIL"]]);
const plain=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const noExtra=(x,fields)=>Object.keys(x).every(k=>fields.includes(k));
const integer=x=>Number.isSafeInteger(x)&&x>=0;
const date=x=>x===null||(typeof x==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&
  !Number.isNaN(Date.parse(x+"T00:00:00Z"))&&
  new Date(x+"T00:00:00Z").toISOString().slice(0,10)===x);
const unknown=[
  "## Indexace Google — stav poslední evidované verze",
  "UNKNOWN: chybí ověřený úplný výsledek 15 URL. Neznamená to 0 indexovaných, " +
  "0 procházených ani závadu na živém webu."
].join("\n\n");
function stage(row){
  if(row.status==="unknown")return "Stav nelze určit; získat nový záznam Google";
  if(row.status==="error")return "Prověřit konkrétní důvod v GSC a stav živé URL";
  if(row.coverage==="discovered_not_indexed"&&row.lastCrawlDate===null)
    return "Objeveno, zatím bez doloženého crawl — ověřit dostupnost v sitemapě a interních odkazech; sledovat";
  if(row.coverage==="crawled_not_indexed")
    return "Google už procházel — prověřit relevanci, duplicitu a záměr; bez automatického přepisu";
  if(BLOCKED.has(row.coverage))
    return "Podezření na technický blok — nezávisle prověřit HTTP, robots a canonical na živém webu";
  if(row.coverage==="google_canonical_differs"||row.googleCanonical==="differs")
    return "Porovnat Google canonical a živou canonical URL; bez automatického redirectu";
  return "Důvod potřebuje individuální kontrolu v GSC; automaticky neměnit obsah";
}
export function renderGoogleIndexReview(data){
  if(!plain(data)||data.status!=="google_indexed_version_only"||
    data.source!==SOURCE||!Array.isArray(data.pages)||data.pages.length!==PATHS.length||
    !["inspected","indexed","excluded","error","unknown"].every(k=>integer(data[k]))||
    data.inspected!==PATHS.length||
    data.indexed+data.excluded+data.error+data.unknown!==PATHS.length)
    return unknown;
  let indexed=0,excluded=0,error=0,unknownCount=0;
  const reviews=[];
  for(let i=0;i<PATHS.length;i++){
    const row=data.pages[i];
    if(!plain(row)||!noExtra(row,["path","status","verdict","coverage","robots",
       "indexing","pageFetch","googleCanonical","userCanonical","lastCrawlDate",
       "sitemapReported","reviewPriority","reason"])||
       row.path!==PATHS[i]||
       !["indexed","excluded","error","unknown"].includes(row.status))return unknown;
    if(row.status==="unknown"){
      if(!noExtra(row,["path","status","reason"])||
        row.reason!=="inspection_unavailable")return unknown;
      unknownCount++;
    }else{
      if(row.verdict!==STATES.get(row.status)||!COVERAGE.has(row.coverage)||
        !date(row.lastCrawlDate)||
        !["matches","differs","unknown"].includes(row.googleCanonical)||
        !["matches","differs","unknown"].includes(row.userCanonical)||
        typeof row.sitemapReported!=="boolean"||
        !["technical_blocker","canonical_review","coverage_review","monitor"].includes(row.reviewPriority)||
        !["ALLOWED","DISALLOWED","UNKNOWN"].includes(row.robots)||
        !["INDEXING_ALLOWED","BLOCKED_BY_META_TAG","BLOCKED_BY_HTTP_HEADER",
          "BLOCKED_BY_ROBOTS_TXT","UNKNOWN"].includes(row.indexing)||
        !["SUCCESSFUL","SOFT_404","BLOCKED_ROBOTS_TXT","NOT_FOUND","ACCESS_DENIED",
         "SERVER_ERROR","REDIRECT_ERROR","ACCESS_FORBIDDEN","BLOCKED_4XX",
         "INTERNAL_CRAWL_ERROR","INVALID_URL","UNKNOWN"].includes(row.pageFetch))
        return unknown;
      if(row.status==="indexed")indexed++;
      else if(row.status==="excluded")excluded++;
      else error++;
    }
    if(row.status!=="indexed"||row.reviewPriority!=="monitor")reviews.push(row);
  }
  if([indexed,excluded,error,unknownCount].some((n,i)=>
     n!==[data.indexed,data.excluded,data.error,data.unknown][i]))return unknown;
  const selected=reviews.slice(0,6);
  return [
    "## Indexace Google — stav poslední evidované verze",
    "**15 pevně sledovaných URL:** "+indexed+" indexovaných · "+
      excluded+" nyní nezařazené · "+error+" chybových stavů · "+
      unknownCount+" bez odpovědi. Toto není audit všech 53 hlavních URL.",
    ...(selected.length?[
      "| URL | Google eviduje | Bezpečný další krok |",
      "|---|---|---|",
      ...selected.map(r=>"| "+r.path+" | "+
        (r.status==="excluded"?"Mimo index":r.status==="error"?"Chyba":"UNKNOWN")+
        " | "+stage(r)+" |")
    ]:["**Není doložená žádná otevřená indexační položka v tomto omezeném vzorku.**"]),
    "**Pozor:** Google URL Inspection vrací poslední indexovanou/evidovanou verzi, "+
    "nikoli právě načtený WordPress. Není prokázána příčina vyloučení. "+
    "Neprovádět automatické žádosti o indexaci, mazání, redirecty, noindex ani změny canonical."
  ].join("\n");
}
