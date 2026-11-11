/**
 * Read-only presentation of Prometheus' already privacy-suppressed, exact-page
 * GSC intent buckets. Never accepts/prints query strings or arbitrary paths.
 * Called only AFTER the full 28-day source/property validator succeeds.
 */
const ALLOWED = new Map([
  ["/choditko-na-pojistovnu/", ["reimbursement","rental","rollator","walker_selection"]],
  ["/pujceni-choditka/", ["reimbursement","rental","rollator","walker_selection"]],
  ["/rollator-pro-seniory/", ["reimbursement","rental","rollator","walker_selection"]],
  ["/choditka-pro-seniory/", ["reimbursement","rental","rollator","walker_selection"]],
  ["/co-zmerit-pred-vyberem-choditka/", ["reimbursement","rental","rollator","walker_selection"]],
  ["/prevoz-seniora-k-lekari/", ["transport_eligibility","transport_cost","vehicle_transfer","transport_arrangement"]]
]);
const LABELS=Object.freeze({
  reimbursement:"Úhrada / ePoukaz",
  rental:"Půjčení / pronájem",
  rollator:"Rollátor / sedátko",
  walker_selection:"Výběr typu chodítka",
  transport_eligibility:"Nárok a úhrada převozu",
  transport_cost:"Cena převozu",
  vehicle_transfer:"Nástup a přesun do vozidla",
  transport_arrangement:"Zajištění přepravy"
});
const fmt=n=>new Intl.NumberFormat("cs-CZ").format(n);
const decimal=n=>n===null?"n/a":n.toLocaleString("cs-CZ",{maximumFractionDigits:2});
const unavailable=[
  "## 1c. Stránkově filtrované vyhledávací záměry — soukromí chráněno",
  "UNKNOWN: pro dané finální období nemáme dostatečně bezpečný agregát " +
  "nebo není ověřen jeho formát. Není to nulová poptávka ani důvod k SEO zásahu."
].join("\n\n");
const plainObject=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const keysOnly=(x,allowed)=>Object.keys(x).every(k=>allowed.includes(k));
const count=x=>Number.isSafeInteger(x)&&x>=0;
const ratio=(clicks,impressions,ctr)=>Number.isFinite(ctr)&&ctr>=0&&ctr<=1&&
  Math.abs(ctr-clicks/impressions)<=0.00015;

/**
 * Fail closed for the entire optional lane if any part is malformed; no
 * exception contains input fields or values. Source GSC totals still render.
 * Query-row cardinality is enforced in the PINNED upstream Core producer,
 * not re-identifiable from its sanitized bucket output.
 */
export function renderSafeIntentEvidence(evidence) {
  if(!plainObject(evidence))return unavailable;
  if(!keysOnly(evidence,["status","source","pagesAttempted","pagesResponded",
    "pagesWithSafeGroups","limitations","pages"]))return unavailable;
  if(evidence.source!=="page-filtered GSC query dimension, final 28 days"||
    evidence.pagesAttempted!==6||!count(evidence.pagesResponded)||
    evidence.pagesResponded>6||!count(evidence.pagesWithSafeGroups)||
    evidence.pagesWithSafeGroups>evidence.pagesResponded||
    !Array.isArray(evidence.pages)||evidence.pages.length>6)return unavailable;
  if(!["privacy_aggregated","no_safe_groups_or_unavailable"].includes(evidence.status))
    return unavailable;
  if(evidence.status==="no_safe_groups_or_unavailable")
    return evidence.pages.length===0&&evidence.pagesWithSafeGroups===0?unavailable:unavailable;
  if(evidence.pages.length!==evidence.pagesWithSafeGroups||
    evidence.pages.length===0)return unavailable;

  const rows=[],seenPages=new Set();
  for(const page of evidence.pages){
    if(!plainObject(page)||!keysOnly(page,["path","intents"])||
      !ALLOWED.has(page.path)||seenPages.has(page.path)||
      !Array.isArray(page.intents)||page.intents.length<1||
      page.intents.length>4)return unavailable;
    seenPages.add(page.path);
    const seenLabels=new Set();
    for(const item of page.intents){
      if(!plainObject(item)||!keysOnly(item,["label","clicks","impressions","ctr","position"])||
        !ALLOWED.get(page.path).includes(item.label)||seenLabels.has(item.label)||
        !count(item.clicks)||!count(item.impressions)||
        item.impressions<10||item.clicks>item.impressions||
        !ratio(item.clicks,item.impressions,item.ctr)||
        (item.position!==null&&(!Number.isFinite(item.position)||
          item.position<1||item.position>1000)))return unavailable;
      seenLabels.add(item.label);
      rows.push({path:page.path,label:item.label,clicks:item.clicks,
        impressions:item.impressions,position:item.position});
    }
  }
  rows.sort((a,b)=>b.impressions-a.impressions||b.clicks-a.clicks||
    a.path.localeCompare(b.path)||a.label.localeCompare(b.label));
  const selected=rows.slice(0,6);
  return [
    "## 1c. Stránkově filtrované vyhledávací záměry — soukromí chráněno",
    "**Pouze agregované kategorie z přesného filtru stránky**, ne konkrétní dotazy. " +
      "Prometheus před publikací potlačuje skupiny s méně než 10 impresími nebo " +
      "3 různými dotazovými řádky. Zde se znovu kontrolují pouze povolené URL, " +
      "štítky a číselná konzistence. Celý přehled má "+rows.length+
      " bezpečných skupin na "+seenPages.size+" URL; zobrazeno max. 6.",
    "| Existující URL | Záměr (souhrnná kategorie) | Imprese | Kliky | Pozice |",
    "|---|---|---:|---:|---:|",
    ...selected.map(r=>"| "+r.path+" | "+LABELS[r.label]+" | "+
      fmt(r.impressions)+" | "+fmt(r.clicks)+" | "+decimal(r.position)+" |"),
    "**Další krok:** ověřit konkrétní potřebu a odpověď na stávající URL; " +
      "bez kontroly SERP a indexace neměnit titulek automaticky. " +
      "Tyto dílčí součty nejsou další návštěvnost webu ani důkaz provizí."
  ].join("\n\n");
}
