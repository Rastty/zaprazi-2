#!/usr/bin/env node
/**
 * Read-only Zápraží growth graph. No network, analytics credentials, health
 * inputs, WordPress writes, affiliate requests, fabricated measurements or CI deploys.
 */
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";

export const METRICS = [
  "organic_clicks_28d", "organic_impressions_28d", "advisor_starts_28d",
  "advisor_completes_28d", "merchant_clicks_28d",
  "approved_affiliate_commission_28d"
];
const STATES=new Set(["pending","in_progress","verified","paused"]);
const cleanString=s=>String(s).replace(/[|\r\n<>]/g," ").slice(0,180);
const percent=(a,b)=>b>0?a/b:null;
// Evidence is stored in public Git history and rendered by CI. Do not allow
// credentials, signed query links or fragments that can expose private data.
function safeEvidenceUrl(value){
  if(typeof value!=="string"||value.length>2048||/\s/.test(value))return false;
  try{
    const url=new URL(value);
    return url.protocol==="https:"&&Boolean(url.hostname)&&!url.username&&
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
  for(const e of g.feedbackEdges){
    if(!ids.has(e.from)||!ids.has(e.to))throw new Error("Unknown feedback node");
  }
  return g;
}

export function planGrowth(g,s){
  validateGraph(g);
  if(!s||s.schemaVersion!==1||typeof s.metrics!=="object"||!s.metrics||
      Array.isArray(s.metrics)||typeof s.metricSources!=="object"||!s.metricSources||
      Array.isArray(s.metricSources)||typeof s.nodes!=="object"||!s.nodes||
      Array.isArray(s.nodes))throw new Error("Invalid growth state schema");
  const ids=new Set(g.nodes.map(n=>n.id));
  const nodeById=new Map(g.nodes.map(n=>[n.id,n]));
  for(const k of Object.keys(s.nodes))if(!ids.has(k))throw new Error("Unknown state node "+k);
  for(const [k,v] of Object.entries(s.metrics)){
    if(!METRICS.includes(k)||!Number.isFinite(v)||v<0)
      throw new Error("Invalid or unsupported aggregate metric "+k);
    if(!safeEvidenceUrl(s.metricSources[k]))
      throw new Error("Aggregate metric requires explicit HTTPS evidence: "+k);
  }
  for(const k of Object.keys(s.metricSources))
    if(!METRICS.includes(k)||!Object.hasOwn(s.metrics,k))throw new Error("Orphan metric evidence "+k);
  for(const [id,record] of Object.entries(s.nodes)){
    if(!record||!STATES.has(record.status))throw new Error("Invalid node state "+id);
    if(record.status==="verified"&&
        (!safeEvidenceUrl(record.evidenceUrl)))
      throw new Error("Verified node must cite HTTPS evidence: "+id);
    // A cited PR is not enough to certify a downstream step while its safety
    // or evidence prerequisites are still unverified. Never silently mark it done.
    if(record.status==="verified"){
      const unmet=nodeById.get(id).dependsOn.filter(dep=>s.nodes[dep]?.status!=="verified");
      if(unmet.length)throw new Error("Verified node requires verified dependencies: "+id+" -> "+unmet.join(", "));
    }
  }
  if(s.asOf!==null&&s.asOf!==undefined&&
      (!/^\d{4}-\d{2}-\d{2}$/.test(s.asOf)||
       Number.isNaN(Date.parse(s.asOf+"T00:00:00Z"))||
       new Date(s.asOf+"T00:00:00Z").toISOString().slice(0,10)!==s.asOf))
    throw new Error("Invalid observation date");
  const m=s.metrics;
  const uplift={
    intent_evidence:(m.organic_impressions_28d??0)>=100?8:0,
    affiliate_audit:(m.merchant_clicks_28d??0)>=20&&
      Object.hasOwn(m,"approved_affiliate_commission_28d")&&
      m.approved_affiliate_commission_28d===0?8:0,
    conversion_ux:(m.advisor_starts_28d??0)>=30&&
      Object.hasOwn(m,"advisor_completes_28d")&&
      percent(m.advisor_completes_28d,m.advisor_starts_28d)<0.4?5:0
  };
  const tasks=g.nodes.map(n=>{
    const record=s.nodes[n.id]??{status:"pending"};
    const unmet=n.dependsOn.filter(id=>s.nodes[id]?.status!=="verified");
    const status=record.status==="verified"?"verified":
      record.status==="paused"?"paused":unmet.length?"waiting_dependencies":
      record.status==="in_progress"?"in_progress":"ready";
    return {id:n.id,lane:n.lane,score:n.priority+(uplift[n.id]??0),
      status,unmet,action:n.action,doneWhen:n.doneWhen,
      evidenceUrl:record.evidenceUrl??null};
  });
  const rank={in_progress:0,ready:1,waiting_dependencies:2,paused:3,verified:4};
  tasks.sort((a,b)=>rank[a.status]-rank[b.status]||b.score-a.score||a.id.localeCompare(b.id));
  return {asOf:s.asOf??null,metrics:Object.fromEntries(METRICS.map(k=>[k,m[k]??null])),
    tasks,next:tasks.filter(t=>t.status==="ready"||t.status==="in_progress").slice(0,3),
    limitations:[
      "Chybějící metrika je unknown, nikoli nula.",
      "GSC, GA4 (consented sample) a affiliate network mají odlišnou atribuci; nepropojovat řádky ani nevyvozovat prodeje z kliků.",
      "Pravidla jsou plánovací, nikoli oprávnění měnit bezpečnostní engine, indexaci nebo produkci bez PR a smoke.",
      "Uplift skóre znamená prioritu revize, nikoliv odhad nárůstu návštěvnosti či provize."
    ]};
}
export function renderGrowthPlan(p){
  const metricNames={
    organic_clicks_28d:"Organické kliky / 28 d",
    organic_impressions_28d:"Zobrazení GSC / 28 d",
    advisor_starts_28d:"Starty poradce / 28 d (GA4 vzorek)",
    advisor_completes_28d:"Dokončení poradce / 28 d (GA4 vzorek)",
    merchant_clicks_28d:"Odchozí kliky / 28 d (GA4 vzorek)",
    approved_affiliate_commission_28d:"Schválené provize / 28 d (síť)"
  };
  return [
    "# Zápraží Growth Graph — řídicí plán",
    "Pozorování: "+(p.asOf??"nebylo dodáno")+"; bez výkonnostních důkazů nejsou žádné výsledky přisuzovány změnám.",
    "## Skutečné agregované metriky",
    ...Object.entries(p.metrics).map(([k,v])=>"- "+metricNames[k]+": "+(v===null?"UNKNOWN":v)),
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
