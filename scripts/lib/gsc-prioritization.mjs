/**
 * Local-only Google Search Console CSV triage for Zápraží.
 * GSC performance table dimensions have different aggregation semantics:
 * never join independent "Pages" and "Queries" exports by row number.
 * No API, logging, network requests, mutation, SEO changes or synthetic data.
 */
import { requiredDecisionPaths } from "../audit-public-sitemap.mjs";

const CORE=new Set(["/",...requiredDecisionPaths]);
const MAX_BYTES=5_000_000;
const MAX_ROWS=25000;
const aliases={
  page:["top pages","pages","page","url","nejlepsi stranky","stranky","stranka","nejcastejsi stranky"],
  query:["top queries","queries","query","nejlepsi dotazy","dotazy","dotaz","vyhledavaci dotazy"],
  clicks:["clicks","kliknuti","prokliky"],
  impressions:["impressions","zobrazeni"],
  ctr:["ctr","average ctr","prumerna mira prokliku","mira prokliku"],
  position:["position","average position","prumerna pozice","pozice"]
};
const fold=s=>String(s??"").replace(/^\uFEFF/,"").normalize("NFD")
  .replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/\s+/g," ");
function column(headers,name){
  const ix=headers.findIndex(x=>aliases[name].includes(fold(x)));
  if(ix<0)throw new Error("Missing GSC column "+name);
  return ix;
}
export function csvRecords(input){
  if(typeof input!=="string"||Buffer.byteLength(input,"utf8")>MAX_BYTES)
    throw new Error("GSC input missing or exceeds the 5 MB local safety bound");
  const source=input.replace(/^\uFEFF/,"");
  const header=source.split(/\r?\n/,1)[0];
  const comma=(header.match(/,/g)||[]).length,semi=(header.match(/;/g)||[]).length;
  const delimiter=semi>comma?";":",";
  let quote=false,cell="",record=[],out=[],startOfField=true;
  for(let i=0;i<source.length;i++){
    const ch=source[i];
    if(quote){
      if(ch==='"'&&source[i+1]==='"'){cell+='"';i++;}
      else if(ch==='"')quote=false;
      else cell+=ch;
      continue;
    }
    if(ch==='"'&&startOfField){quote=true;startOfField=false;continue;}
    if(ch===delimiter){record.push(cell);cell="";startOfField=true;continue;}
    if(ch==="\n"||ch==="\r"){
      if(ch==="\r"&&source[i+1]==="\n")i++;
      record.push(cell);
      if(record.some(v=>v.trim()!=="")){out.push(record);if(out.length>MAX_ROWS+1)throw new Error("Too many CSV rows");}
      record=[];cell="";startOfField=true;continue;
    }
    if(ch==='"')throw new Error("CSV quote inside unquoted value");
    cell+=ch;startOfField=false;
  }
  if(quote)throw new Error("Unterminated CSV quote");
  record.push(cell);
  if(record.some(v=>v.trim()!==""))out.push(record);
  if(out.length<2)throw new Error("GSC CSV needs a header and at least one row");
  const width=out[0].length;
  if(out.some(row=>row.length!==width))throw new Error("Inconsistent CSV column count");
  return out;
}
function positiveCount(v){
  const input=String(v??"").trim().replace(/[\u00A0\u202F ]/g,"");
  // Thousands separators only, never interpret a fractional count as impressions.
  const s=/^\d{1,3}(?:[.,]\d{3})+$/.test(input)
    ?input.replace(/[.,]/g,""):input;
  if(!/^\d+$/.test(s))throw new Error("Invalid GSC count");
  const n=Number(s);
  if(!Number.isSafeInteger(n)||n<0)throw new Error("Unsafe GSC count");
  return n;
}
function positivePosition(v){
  const s=String(v??"").trim().replace(/\s/g,"").replace(",",".");
  if(!/^\d+(?:\.\d+)?$/.test(s))throw new Error("Invalid GSC position");
  const n=Number(s);
  if(!Number.isFinite(n)||n<0||n>10000)throw new Error("Invalid GSC position");
  return n;
}
function canonicalPath(s){
  try{
    const url=new URL(String(s).trim());
    if(!["https:","http:"].includes(url.protocol)||url.hostname.toLowerCase()!=="zaprazi.cz"||
        url.port||url.username||url.password||url.search||url.hash)return null;
    const normalized=url.pathname.replace(/\/+/g,"/");
    if(!normalized.startsWith("/")||/%2f|%5c/i.test(normalized))return null;
    return normalized.endsWith("/")?normalized:normalized+"/";
  }catch{return null;}
}
function toRow(row,ix,kind){
  const clicks=positiveCount(row[ix.clicks]),impressions=positiveCount(row[ix.impressions]);
  // Both counts are from the same GSC dimension and export period. A click
  // without an impression would produce an impossible CTR and false SEO triage.
  if(clicks>impressions)throw new Error("GSC clicks exceed impressions; verify CSV export");
  const position=positivePosition(row[ix.position]);
  const name=String(row[ix[kind]]??"").trim();
  if(!name)throw new Error("Empty GSC "+kind+" dimension");
  if(kind==="query")return{query:name,clicks,impressions,position,
    ctr:impressions?clicks/impressions:null};
  const path=canonicalPath(name);
  return {url:name,path,clicks,impressions,position,
    ctr:impressions?clicks/impressions:null};
}
export function parseGscCsv(csv,kind){
  if(!["page","query"].includes(kind))throw new Error("Only page or query GSC exports supported");
  const [header,...body]=csvRecords(csv);
  const ix={};
  for(const col of [kind,"clicks","impressions","position"])ix[col]=column(header,col);
  // A GSC CTR column may appear but CTR is recomputed from exact displayed counts.
  const rows=body.map(row=>toRow(row,ix,kind));
  const keys=new Set();
  for(const row of rows){
    const key=kind==="page"?(row.path??row.url):row.query;
    if(keys.has(key))throw new Error("Duplicate GSC "+kind+" dimension; check export filters");
    keys.add(key);
  }
  return rows;
}
const safeText=s=>String(s).replaceAll("|","\\|").replaceAll(/\r|\n/g," ")
  .replaceAll("<","&lt;").replaceAll(">","&gt;").slice(0,180);
function number(n){return new Intl.NumberFormat("cs-CZ").format(n);}
function percent(r){return r===null?"n/a":(r*100).toLocaleString("cs-CZ",{maximumFractionDigits:2})+" %";}
function score(row){
  if(row.impressions<20)return 0;
  const exposure=row.impressions>=1000?3:row.impressions>=100?2:1;
  const reach=row.position>=4&&row.position<=20?2:row.position>20&&row.position<=40?1:0;
  const ctrOpportunity=row.position>=4&&row.position<=10&&row.impressions>=100&&row.ctr!==null&&row.ctr<0.02?1:0;
  return exposure+reach+ctrOpportunity;
}
function action(row,isCore){
  if(!isCore)return "REVIEW_ONLY — nejdřív obsah, GSC dotazy a externí odkazy";
  if(row.impressions<20)return "NÍZKÁ EVIDENCE — bez změny, sledovat";
  if(row.position>=4&&row.position<=20)return "PROVĚŘIT TITULEK/INTENT + CESTU K PORADCI";
  if(row.impressions>=100&&row.position<4&&row.ctr!==null&&row.ctr<0.02)
    return "PROVĚŘIT SNIPPET A SERP — CTR samotné není chyba";
  return "UDRŽET / REDAKČNĚ ZKONTROLOVAT";
}
export function analyzeGsc({pages,queries=[],periodStart,periodEnd}){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(periodStart)||!/^\d{4}-\d{2}-\d{2}$/.test(periodEnd)||
      !Number.isFinite(Date.parse(periodStart+"T00:00:00Z"))||
      !Number.isFinite(Date.parse(periodEnd+"T00:00:00Z"))||
      new Date(periodStart+"T00:00:00Z").toISOString().slice(0,10)!==periodStart||
      new Date(periodEnd+"T00:00:00Z").toISOString().slice(0,10)!==periodEnd||
      periodStart>periodEnd)
    throw new Error("Use valid --from/--to ISO dates from the same export");
  if(!Array.isArray(pages)||!pages.length)throw new Error("A GSC Pages.csv export is required");
  const accepted=pages.filter(p=>p.path!==null);
  const ignored=pages.filter(p=>p.path===null).length;
  const core=accepted.filter(p=>CORE.has(p.path)).sort((a,b)=>score(b)-score(a)||b.impressions-a.impressions);
  const other=accepted.filter(p=>!CORE.has(p.path)).sort((a,b)=>b.clicks-a.clicks||b.impressions-a.impressions);
  const paths=new Set(core.map(r=>r.path));
  const missing=[...CORE].filter(path=>!paths.has(path));
  return {periodStart,periodEnd,exported_page_rows:pages.length,accepted_page_rows:accepted.length,
    skipped_external_or_parameterized_rows:ignored,core,other,queries:[...queries].sort((a,b)=>b.impressions-a.impressions),
    missing_core_from_export:missing,limitations:[
      "GSC CSV rows are a limited export, not a census of all indexed URLs.",
      "Missing page is UNKNOWN, not zero impressions/clicks or deindexation.",
      "Page and query exports aggregate at different dimensions; no page-to-query join is possible from them.",
      "Scores only prioritize editorial review; no predicted clicks, rankings, traffic lift or conversion.",
      "Other/legacy URLs are review-only: never bulk noindex, delete, merge or redirect without additional evidence."
    ]};
}
export function renderGscReport(r){
  const line=(row,isCore)=>"| "+safeText(row.path??row.query)+" | "+number(row.clicks)+
    " | "+number(row.impressions)+" | "+percent(row.ctr)+" | "+
    row.position.toLocaleString("cs-CZ",{maximumFractionDigits:2})+" | "+
    (isCore?score(row):"—")+" | "+(row.path?action(row,isCore):"Samostatný dotaz, bez přiřazené URL")+" |";
  const header="| URL nebo dotaz | Kliky | Zobrazení | CTR | Pozice | Skóre revize | Další krok |\n|---|---:|---:|---:|---:|---:|---|";
  const table=(rows,isCore)=>header+"\n"+(rows.length?rows.map(row=>line(row,isCore)).join("\n"):"| — | — | — | — | — | — | Bez doložených řádků |");
  return [
    "# Zápraží — SEO příležitosti z reálného exportu Google Search Console",
    "**Časové období:** "+r.periodStart+" až "+r.periodEnd+" (datum deklarované při exportu).",
    "**Rozsah souboru:** "+r.exported_page_rows+" řádků Pages, z toho "+
      r.accepted_page_rows+" bezpečně rozpoznaných URL a "+
      r.skipped_external_or_parameterized_rows+" vyřazených externích/parametrických URL.",
    "## 1. Stávající rozhodovací a poradenské stránky — priorita redakční revize",
    table(r.core.slice(0,27),true),
    "## 2. Jiné a historické stránky — POUZE návrhy ke kontrole, žádné přesměrování",
    table(r.other.slice(0,30),false),
    "## 3. Dotazy v exportu — na úrovni celé property, ne jednotlivé URL",
    table(r.queries.slice(0,20),false),
    "## 4. Hlavní URL, které **nejsou v omezeném exportu** (výkon neznámý)",
    r.missing_core_from_export.length?r.missing_core_from_export.map(x=>"- "+x+" — **unknown**, nikoliv 0").join("\n"):"Všechny hlavní URL jsou v dodaném exportu zastoupené.",
    "## Interpretace a bezpečnost",
    ...r.limitations.map(x=>"- "+x),
    "**Následující krok:** před úpravou ověřit skutečné dotazy pro jednotlivé URL v GSC (filtr na stránku), relevanci obsahu, indexaci a až poté zvažovat změny."
  ].join("\n\n")+"\n";
}
