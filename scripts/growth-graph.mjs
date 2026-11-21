#!/usr/bin/env node
/**
 * Read-only Zápraží growth graph. No network, analytics credentials, health
 * inputs, WordPress writes, affiliate requests, fabricated measurements or CI deploys.
 */
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {SOURCE_THEME_RELEASE} from "./lib/live-release.mjs";

export const METRICS = [
  "organic_clicks_28d", "organic_impressions_28d", "advisor_starts_28d",
  "advisor_completes_28d", "merchant_clicks_28d",
  "organic_sessions_28d", "organic_decision_page_sessions_28d",
  "organic_retired_archive_sessions_28d", "organic_unassigned_sessions_28d",
  "approved_affiliate_commission_28d"
];
const STATES=new Set(["pending","in_progress","verified","paused"]);
const cleanString=s=>String(s).replace(/[|\r\n<>]/g," ").slice(0,180);
const percent=(a,b)=>b>0?a/b:null;
const validISODate=value=>typeof value==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&
  !Number.isNaN(Date.parse(value+"T00:00:00Z"))&&
  new Date(value+"T00:00:00Z").toISOString().slice(0,10)===value;
// Evidence is stored in public Git history and rendered by CI. Do not allow
// credentials, signed query links or fragments that can expose private data.
function safeEvidenceUrl(value){
  if(typeof value!=="string"||value.length>2048||/\s/.test(value))return false;
  try{
    const url=new URL(value);
    const host=url.hostname.toLowerCase().replace(/\.$/,"");
    // Public evidence must not point to loopback, private network or local hosts.
    // Public evidence must not target local, reserved or link-local addresses.
    // Reject IPv6 literals conservatively, including mapped IPv4 and ULA.
    const ipv6Literal=host.startsWith("[")&&host.endsWith("]");
    const ipv4=/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
    const octets=ipv4?.slice(1).map(Number);
    const nonPublicIPv4=Boolean(octets)&&(
      octets.some(n=>n>255)||octets[0]===0||octets[0]===10||
      octets[0]===127||octets[0]>=224||
      (octets[0]===100&&octets[1]>=64&&octets[1]<=127)||
      (octets[0]===169&&octets[1]===254)||
      (octets[0]===172&&octets[1]>=16&&octets[1]<=31)||
      (octets[0]===192&&(octets[1]===0||octets[1]===168))||
      (octets[0]===198&&(octets[1]===18||octets[1]===19||octets[1]===51&&octets[2]===100))||
      (octets[0]===192&&octets[1]===0&&octets[2]===2)||
      (octets[0]===203&&octets[1]===0&&octets[2]===113));
    const localHost=host==="localhost"||host.endsWith(".localhost")||
      host.endsWith(".local")||host.endsWith(".internal")||
      host==="0.0.0.0"||ipv6Literal||nonPublicIPv4;
    return url.protocol==="https:"&&Boolean(url.hostname)&&!localHost&&!url.username&&
      !url.password&&!url.search&&!url.hash;
  }catch{return false;}
}

export function validateGraph(g){
  if(!g||g.schemaVersion!==1||!Array.isArray(g.nodes)||g.nodes.length===0)
    throw new Error("Invalid growth graph schema");
  const ids=new Set();
  for(const n of g.nodes){
    if(!/^[a-z][a-z0-9_]*$/.test(n.id)||ids.has(n.id)||
        !Number.isInteger(n.priority)||n.priority<0||n.priority>100||
        !Array.isArray(n.dependsOn)||typeof n.action!=="string"||!n.action||
        typeof n.doneWhen!=="string"||!n.doneWhen)
      throw new Error("Invalid or duplicate graph node");
    if(new Set(n.dependsOn).size!==n.dependsOn.length)
      throw new Error("Duplicate prerequisite edge");
    ids.add(n.id);
  }
  const visiting=new Set(),visited=new Set(),byId=new Map(g.nodes.map(n=>[n.id,n]));
  function visit(id){
    if(!byId.has(id))throw new Error("Unknown dependency: "+id);
    if(visiting.has(id))throw new Error("Cycle in prerequisite DAG");
    if(visited.has(id))return;
    visiting.add(id);
    for(const dep of byId.get(id).dependsOn){
      if(dep===id)throw new Error("Self-dependency: "+id);
      visit(dep);
    }
    visiting.delete(id);visited.add(id);
  }
  for(const n of g.nodes)visit(n.id);
  if(!Array.isArray(g.feedbackEdges))throw new Error("Missing feedback edges");
  const feedbackSeen=new Set();
  for(const e of g.feedbackEdges){
    if(!e||!ids.has(e.from)||!ids.has(e.to))throw new Error("Unknown feedback node");
    if(e.from===e.to)throw new Error("Self-feedback edge");
    const key=e.from+" -> "+e.to;
    if(feedbackSeen.has(key))throw new Error("Duplicate feedback edge");
    feedbackSeen.add(key);
  }
  return g;
}

export function planGrowth(g,s,now=new Date(),sourceRelease=SOURCE_THEME_RELEASE){
  validateGraph(g);
  if(typeof sourceRelease!=="string"||!/^\d+\.\d+\.\d+$/.test(sourceRelease))
    throw new Error("Invalid source release for graph evidence");
  if(!s||s.schemaVersion!==1||typeof s.metrics!=="object"||!s.metrics||
      Array.isArray(s.metrics)||typeof s.metricSources!=="object"||!s.metricSources||
      Array.isArray(s.metricSources)||typeof s.nodes!=="object"||!s.nodes||
      Array.isArray(s.nodes))throw new Error("Invalid growth state schema");
  // State is committed to public Git history. Reject unexpected top-level
  // payloads (including accidental raw Advisor answers) before any planning.
  // Do not echo untrusted keys or values into public CI logs.
  const allowedStateFields=new Set(["schemaVersion","asOf","metrics","metricSources","metricAsOf","nodes"]);
  if(Object.keys(s).some(key=>!allowedStateFields.has(key)))
    throw new Error("Unsupported growth state field");
  // State keys are untrusted: accidental answer text may be used as a JSON key.
  // Never echo unknown keys into public CI logs or workflow summaries.
  const ids=new Set(g.nodes.map(n=>n.id));
  const nodeById=new Map(g.nodes.map(n=>[n.id,n]));
  // A green production QA run certifies its *specific* theme version only.
  // On the next source release, safety_qa becomes actionable again and its
  // dependent affiliate/UX work cannot inherit a stale safety approval.
  const isVerifiedForRelease=id=>{
    const record=s.nodes[id];
    return record?.status==="verified" &&
      (id!=="safety_qa"||record.verifiedRelease===sourceRelease);
  };
  for(const k of Object.keys(s.nodes))if(!ids.has(k))throw new Error("Unknown state node");
  for(const [k,v] of Object.entries(s.metrics)){
    // Funnel/search event counts are discrete; only approved commission is currency.
    if(!METRICS.includes(k)||!Number.isFinite(v)||v<0||
        (k!=="approved_affiliate_commission_28d"&&!Number.isSafeInteger(v)))
      throw new Error("Invalid or unsupported aggregate metric");
    if(!safeEvidenceUrl(s.metricSources[k]))
      throw new Error("Aggregate metric requires explicit HTTPS evidence");
  }
  for(const k of Object.keys(s.metricSources))
    if(!METRICS.includes(k)||!Object.hasOwn(s.metrics,k))throw new Error("Orphan metric evidence");
  // GA4 and GSC aggregates may be captured on different days. A single
  // snapshot date must not silently make an older metric look fresher.
  if(s.metricAsOf!==undefined&&(!s.metricAsOf||typeof s.metricAsOf!=="object"||
      Array.isArray(s.metricAsOf)))throw new Error("Invalid metric observation dates");
  for(const [k,date] of Object.entries(s.metricAsOf??{})){
    if(!METRICS.includes(k)||!Object.hasOwn(s.metrics,k)||!validISODate(date))
      throw new Error("Invalid or orphan metric observation date");
  }
  // Qualified organic traffic is not total organic traffic. The current
  // GA4 classification uses an exact retired-archive manifest and an audited
  // set of live decision-page entries; anonymized (not set) is NOT an engaged
  // session. Reconcile only when all independently sourced cohort counts exist.
  const organicLandingKeys=[
    "organic_decision_page_sessions_28d",
    "organic_retired_archive_sessions_28d",
    "organic_unassigned_sessions_28d"
  ];
  const organicTotal=s.metrics.organic_sessions_28d;
  if(Object.hasOwn(s.metrics,"organic_sessions_28d")){
    for(const key of organicLandingKeys){
      if(Object.hasOwn(s.metrics,key)&&s.metrics[key]>organicTotal)
        throw new Error("GA4 organic landing cohort cannot exceed organic sessions");
    }
    if(organicLandingKeys.every(key=>Object.hasOwn(s.metrics,key))){
      if(organicLandingKeys.reduce((n,key)=>n+s.metrics[key],0)!==organicTotal)
        throw new Error("GA4 organic landing cohorts must reconcile to Organic Search sessions");
      const dates=["organic_sessions_28d",...organicLandingKeys].map(key=>s.metricAsOf?.[key]??s.asOf);
      if(new Set(dates).size!==1)
        throw new Error("GA4 organic landing cohorts must use the same observation date");
    }
  }
  // Both GSC totals cover the same 28-day window. A click requires an
  // impression, so impossible aggregates must not influence the graph plan.
  // Do not apply this rule to GA4 events: consent and window boundaries differ.
  if(Object.hasOwn(s.metrics,"organic_clicks_28d")&&
     Object.hasOwn(s.metrics,"organic_impressions_28d")&&
     s.metrics.organic_clicks_28d>s.metrics.organic_impressions_28d)
    throw new Error("Invalid GSC aggregates: clicks exceed impressions");
  for(const [id,record] of Object.entries(s.nodes)){
    if(!record||typeof record!=="object"||Array.isArray(record)||
        !STATES.has(record.status))throw new Error("Invalid node state "+id);
    // Even pending/paused evidence is rendered in public JSON and CI artifacts.
    // Validate it before serialization; unknown fields may carry private answers.
    if(Object.keys(record).some(k=>k!=="status"&&k!=="evidenceUrl"&&
        !(id==="safety_qa"&&k==="verifiedRelease")))
      throw new Error("Unsupported node state field: "+id);
    if(id==="safety_qa"&&record.status==="verified"&&
        (typeof record.verifiedRelease!=="string"||
        !/^\d+\.\d+\.\d+$/.test(record.verifiedRelease)))
      throw new Error("Verified safety QA requires a valid release identifier");
    // A public state must not claim production acceptance of a release that
    // has not yet become the current source. This catches mistyped version
    // evidence rather than quietly presenting it as an ordinary stale QA.
    if(id==="safety_qa"&&record.status==="verified"&&
        record.verifiedRelease.split(".").map(Number).some((part,i)=>
          part>sourceRelease.split(".").map(Number)[i]&&
          record.verifiedRelease.split(".").slice(0,i).every((prev,j)=>
            Number(prev)===Number(sourceRelease.split(".")[j]))))
      throw new Error("Safety QA cannot certify a future source release");
    if(record.status==="verified"&&!safeEvidenceUrl(record.evidenceUrl))
      throw new Error("Verified node must cite HTTPS evidence: "+id);
    if(Object.hasOwn(record,"evidenceUrl")&&!safeEvidenceUrl(record.evidenceUrl))
      throw new Error("Node evidence must cite HTTPS evidence: "+id);
    // A cited PR is not enough to certify a downstream step while its safety
    // or evidence prerequisites are still unverified. Never silently mark it done.
    if(record.status==="verified"){
      const unmet=nodeById.get(id).dependsOn.filter(dep=>!isVerifiedForRelease(dep));
      if(unmet.length)throw new Error("Verified node requires verified dependencies: "+id+" -> "+unmet.join(", "));
    }
  }
  if(s.asOf!==null&&s.asOf!==undefined&&!validISODate(s.asOf))
    throw new Error("Invalid observation date");
  // An undated 28-day aggregate cannot be compared or used to prioritize work.
  if(Object.keys(s.metrics).length&&s.asOf==null)
    throw new Error("Aggregate metrics require observation date");
  // A dated aggregate can be genuine but too old to guide today's priorities.
  // Keep its reported value visible; suppress only its automatic score uplift.
  // Use the project's Prague calendar date to avoid midnight CET/UTC skew.
  if(!(now instanceof Date)||Number.isNaN(now.getTime()))
    throw new Error("Invalid planning reference date");
  const today=new Intl.DateTimeFormat("sv-SE",{timeZone:"Europe/Prague",
    year:"numeric",month:"2-digit",day:"2-digit"}).format(now);
  if(s.asOf!=null&&s.asOf>today)
    throw new Error("Observation date cannot be in the future");
  for(const date of Object.values(s.metricAsOf??{}))
    if(date>today||date>s.asOf)throw new Error("Metric observation date cannot exceed snapshot date");
  const metricDates=Object.fromEntries(Object.keys(s.metrics).map(k=>
    [k,s.metricAsOf?.[k]??s.asOf]));
  const metricFresh=k=>Object.hasOwn(metricDates,k)&&
    Math.round((Date.parse(today+"T00:00:00Z")-
      Date.parse(metricDates[k]+"T00:00:00Z"))/86400000)<=14;
  const freshness=Object.keys(metricDates).map(metricFresh);
  const evidenceFreshness=freshness.length===0?"unknown":
    freshness.every(Boolean)?"fresh":freshness.some(Boolean)?"mixed":"stale";
  const m=s.metrics;
  const uplift={
    intent_evidence:metricFresh("organic_impressions_28d")&&(m.organic_impressions_28d??0)>=100?8:0,
    affiliate_audit:metricFresh("merchant_clicks_28d")&&
      metricFresh("approved_affiliate_commission_28d")&&(m.merchant_clicks_28d??0)>=20&&
      Object.hasOwn(m,"approved_affiliate_commission_28d")&&
      m.approved_affiliate_commission_28d===0?8:0,
    conversion_ux:metricFresh("advisor_starts_28d")&&
      metricFresh("advisor_completes_28d")&&(m.advisor_starts_28d??0)>=30&&
      Object.hasOwn(m,"advisor_completes_28d")&&
      percent(m.advisor_completes_28d,m.advisor_starts_28d)<0.4?5:0
  };
  const tasks=g.nodes.map(n=>{
    const record=s.nodes[n.id]??{status:"pending"};
    const unmet=n.dependsOn.filter(id=>!isVerifiedForRelease(id));
    const staleSafety=n.id==="safety_qa"&&record.status==="verified"&&
      !isVerifiedForRelease(n.id);
    const status=staleSafety?"needs_revalidation":
      unmet.length?"waiting_dependencies":
      record.status==="verified"?"verified":
      record.status==="paused"?"paused":
      record.status==="in_progress"?"in_progress":"ready";
    return {id:n.id,lane:n.lane,score:n.priority+(uplift[n.id]??0),
      status,unmet,action:n.action,doneWhen:n.doneWhen,
      evidenceUrl:record.evidenceUrl??null};
  });
  const rank={needs_revalidation:0,in_progress:1,ready:2,waiting_dependencies:3,paused:4,verified:5};
  tasks.sort((a,b)=>rank[a.status]-rank[b.status]||b.score-a.score||a.id.localeCompare(b.id));
  return {sourceRelease,asOf:s.asOf??null,evidenceFreshness,metrics:Object.fromEntries(METRICS.map(k=>[k,m[k]??null])),
    metricAsOf:Object.fromEntries(METRICS.map(k=>[k,metricDates[k]??null])),
    tasks,next:tasks.filter(t=>["needs_revalidation","ready","in_progress"].includes(t.status)).slice(0,3),
    limitations:[
      "Chybějící metrika je unknown, nikoli nula.",
      "GSC, GA4 (agregáty; konektor sám nepotvrzuje stav souhlasu) a affiliate síť mají odlišnou atribuci; nepropojovat řádky ani nevyvozovat prodeje z kliků.",
      "Nezaměňovat organické relace (včetně historického archivu) za vhodné návštěvy decision pages; klasifikace není měření skutečného zdravotního stavu ani objednávky.",
      "Pravidla jsou plánovací, nikoli oprávnění měnit bezpečnostní engine, indexaci nebo produkci bez PR a smoke.",
      "Uplift skóre znamená prioritu revize, nikoliv odhad nárůstu návštěvnosti či provize.",
      ...(["stale","mixed"].includes(evidenceFreshness)?["Starší agregáty zůstávají viditelné, ale jednotlivě nesmějí zvýšit prioritu po 14 dnech."]:[])
    ]};
}
export function renderGrowthPlan(p){
  const metricNames={
    organic_clicks_28d:"Organické kliky / 28 d",
    organic_impressions_28d:"Zobrazení GSC / 28 d",
    organic_sessions_28d:"Organické relace / 28 d (GA4, pozorované)",
    organic_decision_page_sessions_28d:"Vstupy na současné decision pages / 28 d (GA4)",
    organic_retired_archive_sessions_28d:"Vstupy na historické archivní slugs / 28 d (GA4)",
    organic_unassigned_sessions_28d:"Neurčená vstupní stránka / 28 d (GA4)",
    advisor_starts_28d:"Starty poradce / 28 d (GA4 agregát)",
    advisor_completes_28d:"Dokončení poradce / 28 d (GA4 agregát)",
    merchant_clicks_28d:"Odchozí kliky / 28 d (GA4 agregát)",
    approved_affiliate_commission_28d:"Schválené provize / 28 d (síť)"
  };
  return [
    "# Zápraží Growth Graph — řídicí plán",
    "Zdrojový release: "+p.sourceRelease+"; bezpečnostní schválení se nepřenáší na novou verzi.",
    "Pozorování: "+(p.asOf??"nebylo dodáno")+" (datum souhrnu; každá metrika může mít vlastní datum); bez výkonnostních důkazů nejsou žádné výsledky přisuzovány změnám.",
    "Aktuálnost agregátů: "+(p.evidenceFreshness==="stale"?"ZASTARALÉ (více než 14 dní)":p.evidenceFreshness==="fresh"?"aktuální (nejvýše 14 dní)":p.evidenceFreshness==="mixed"?"SMÍŠENÁ (ověřit jednotlivá data)":"UNKNOWN")+".",
    "## Skutečné agregované metriky",
    ...Object.entries(p.metrics).map(([k,v])=>"- "+metricNames[k]+": "+(v===null?"UNKNOWN":v)+
      (p.metricAsOf?.[k]?" (stav k "+p.metricAsOf[k]+")":"")),
    "## Kvalita organických vstupů",
    ...([p.metrics.organic_sessions_28d,
      p.metrics.organic_decision_page_sessions_28d,
      p.metrics.organic_retired_archive_sessions_28d,
      p.metrics.organic_unassigned_sessions_28d].every(Number.isSafeInteger) &&
      p.metrics.organic_sessions_28d>0 ? [
      "- Podíl vstupů na současné rozhodovací stránky: "+
        (100*p.metrics.organic_decision_page_sessions_28d/p.metrics.organic_sessions_28d).toFixed(2)+
        " % ("+p.metrics.organic_decision_page_sessions_28d+" z "+p.metrics.organic_sessions_28d+").",
      "- Retired archive je členství ve starém manifestu, nikoliv ověřená živá HTTP 404; (not set) není automaticky kvalitní vstup. Vzorek je malý a GA4 omezeno souhlasem."
    ] : ["- Podíl vstupů na rozhodovací stránky: UNKNOWN (chybí úplná GA4 landing-page klasifikace nebo organické relace)."]),
    "## 3 další bezpečně proveditelné uzly",
    ...(p.next.length?p.next.map(t=>"- "+t.id+" (skóre "+t.score+"): "+cleanString(t.action)):["- Žádný automaticky připravený uzel; ověřit závislosti a evidence."]),
    "## Stav grafu",
    "| Uzel | Stav | Skóre | Blokující předchůdci |",
    "|---|---|---:|---|",
    ...p.tasks.map(t=>"| "+t.id+" | "+t.status+" | "+t.score+" | "+(t.unmet.join(", ")||"—")+" |"),
    "## Hranice interpretace",
    ...p.limitations.map(x=>"- "+x)
  ].join("\n")+"\n";
}
export function growthCli(argv){
  if(argv.length>1||argv.some(a=>a!=="--json"))
    throw new Error("Usage: node scripts/growth-graph.mjs [--json]");
  const root=new URL("../",import.meta.url);
  const g=JSON.parse(readFileSync(new URL("config/growth-graph.json",root),"utf8"));
  const s=JSON.parse(readFileSync(new URL("config/growth-state.json",root),"utf8"));
  const p=planGrowth(g,s);
  return argv.includes("--json")?JSON.stringify(p,null,2)+"\n":renderGrowthPlan(p);
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
  try{process.stdout.write(growthCli(process.argv.slice(2)));}
  catch(error){process.stderr.write("GROWTH_GRAPH_FAILED: "+error.message+"\n");process.exitCode=1;}
}
