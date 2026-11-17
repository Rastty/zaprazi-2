/**
 * Editorial change-window guard for a validated, final GSC snapshot.
 * These are Git merge dates, NOT WordPress deploy dates. GSC collected before
 * a change cannot measure it. No automated content or indexing decisions.
 */
import {requiredDecisionPaths} from "../audit-public-sitemap.mjs";

const ISO=/^\d{4}-\d{2}-\d{2}$/;
const PR=/^https:\/\/github\.com\/Rastty\/zaprazi-2\/pull\/[1-9]\d{0,5}$/;
const allowed=new Set(requiredDecisionPaths);

function day(value){
  if(typeof value!=="string"||!ISO.test(value))throw Error("Invalid editorial date");
  const stamp=Date.parse(value+"T00:00:00Z");
  if(!Number.isFinite(stamp)||new Date(stamp).toISOString().slice(0,10)!==value)
    throw Error("Invalid editorial date");
  return stamp;
}

export function reviewMaterialEditWindow(period,manifest){
  const from=day(period?.from),to=day(period?.to);
  if(from>to||!manifest||manifest.schemaVersion!==1||
      !Array.isArray(manifest.changes)||manifest.changes.length>20)
    throw Error("Invalid editorial review input");
  const seen=new Set();
  const rows=manifest.changes.map(change=>{
    const path=change?.path;
    if(!allowed.has(path)||seen.has(path)||!PR.test(change.pullRequest))
      throw Error("Invalid editorial change record");
    seen.add(path);
    const merged=day(change.mergedDate);
    const window=to<merged?"gsc_predates_merge":from<=merged?
      "gsc_mixed_window":"gsc_after_merge_window";
    return {path,mergedDate:change.mergedDate,pullRequest:change.pullRequest,window};
  });
  return rows;
}

const labels={
  gsc_predates_merge:"GSC končí před změnou",
  gsc_mixed_window:"GSC zahrnuje období před změnou",
  gsc_after_merge_window:"GSC celé po merge (deploy neověřen)"
};

export function renderMaterialEditWindow(period,manifest){
  const rows=reviewMaterialEditWindow(period,manifest);
  return [
    "## 1a. Poslední materiální změny vs. GSC období",
    "Tyto datumy jsou **Git merge**, ne potvrzení WordPress nasazení. "+
      "Starý nebo smíšený GSC interval nesmí být vydáván za měření účinku změny. "+
      "Výjimkou pro urgentní zásah je doložená safety/privacy závada.",
    "| URL | Git merge | Evidence | Vztah k finálnímu GSC intervalu |",
    "|---|---|---|---|",
    ...rows.map(row=>"| `"+row.path+"` | "+row.mergedDate+" | [PR]("+
      row.pullRequest+") | "+labels[row.window]+" |"),
    "**Redakční rozhodnutí:** před dalším přepisem stejné URL nejdřív ověřit "+
      "nasazení, skutečný page-filtered vyhledávací záměr a dokončené GSC období "+
      "po změně. Celé období po merge samo o sobě nedokazuje uplift ani provozní publikaci. "+
      "Seznam pokrývá pouze výslovně evidované změny; jiné stránky nejsou automaticky bez nedávných úprav."
  ].join("\n");
}
