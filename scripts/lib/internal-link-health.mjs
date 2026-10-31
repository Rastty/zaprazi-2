/**
 * Read-only, exact-host internal HTML link checker for curated core pages.
 * Never follow redirects, merchant click routes or authenticated endpoints.
 * HTTP read requests are GET with redirect:'manual'; no writes are performed.
 */

// Percent-encoded path segments are intentionally excluded from public GET audits:
// a server may decode /%67o/ or /go%2Fmerchant/ into a click/affiliate route.
// Only plain ASCII public page slugs are eligible for network probing.
const blockedPath = /^\/(?:wp-|wp\/|go(?:\/|-|$)|out(?:\/|-|$)|click(?:\/|-|$)|affiliate(?:\/|-|$)|redirect(?:\/|-|$)|visit(?:\/|-|$)|track(?:\/|-|$))/i;

// Public CI reports must never echo raw link parameters or Location headers.
// They can contain tracking tokens or user-provided sensitive answers.
function classifyRedirect(location, origin) {
  if (!location) return "missing";
  try {
    const target = new URL(location, origin);
    return target.origin === origin && !target.username && !target.password
      ? "same_origin" : "off_origin_or_unsafe";
  } catch {
    return "invalid";
  }
}

export function prepareInternalLinks(sourcePages, origin="https://zaprazi.cz") {
  if (origin !== "https://zaprazi.cz") throw new Error("Only exact production origin is allowed");
  const targets=new Map(), excluded=[];
  for (const page of sourcePages) {
    for (const href of page.links || []) {
      let u;
      try {u=new URL(href,origin+page.path);} catch {
        excluded.push({source:page.path,why:"invalid_url"});continue;
      }
      if (u.hostname!=="zaprazi.cz" || u.protocol==="mailto:" || u.protocol==="tel:") continue;
      if (u.protocol!=="https:" && u.protocol!=="http:") {
        excluded.push({source:page.path,why:"unsafe_protocol"});continue;
      }
      if (u.protocol==="http:") excluded.push({source:page.path,why:"http_internal"});
      const path=u.pathname;
      // Only benign page-like paths. Do not request search, REST, routes
      // for click tracking or files that might trigger downloads.
      if (u.search || u.username || u.password || u.port || blockedPath.test(path) ||
          !/^\/(?:[a-z0-9_-]+\/)*$/i.test(path)) {
        excluded.push({source:page.path,why:"not_safe_public_page"});
        continue;
      }
      if (!targets.has(path))targets.set(path,new Set());
      targets.get(path).add(page.path);
    }
  }
  return {targets:[...targets].map(([path,sources])=>({path,sources:[...sources].sort()})),
    excluded:excluded.slice(0,60)};
}

export async function auditInternalTargets(targets,fetcher=fetch,origin="https://zaprazi.cz") {
  if (origin!=="https://zaprazi.cz") throw new Error("Only exact production origin is allowed");
  if (targets.length>120)throw new Error("Refusing unbounded crawl");
  const checked=[];
  // Small batches avoid hammering a production WP instance.
  for(let offset=0;offset<targets.length;offset+=4){
    const batch=targets.slice(offset,offset+4);
    const rows=await Promise.all(batch.map(async item=>{
      if(!/^\/(?:[a-z0-9_-]+\/)*$/i.test(item.path) || blockedPath.test(item.path))
        throw new Error("Unsafe path selected for GET");
      try{
        const response=await fetcher(origin+item.path,{
          method:"GET",redirect:"manual",signal:AbortSignal.timeout(16000),
          headers:{Accept:"text/html"}
        });
        const status=response.status;
        const location=response.headers?.get("location") || "";
        // Response headers are untrusted; never echo arbitrary header values to public CI logs.
        const contentType=(response.headers?.get("content-type") || "").split(";")[0].trim().toLowerCase();
        const type=contentType==="text/html"||contentType==="application/xhtml+xml"
          ? contentType : contentType ? "other" : "missing";
        if(response.body?.cancel)await response.body.cancel();
        return {path:item.path,sources:item.sources,status,redirect:classifyRedirect(location,origin),type,
          // A soft-200 JSON, download or empty MIME response is not a usable HTML page.
          outcome:status===200
            ? (type==="text/html"||type==="application/xhtml+xml"?"ok":"non_html_200")
            : status>=300&&status<400?"redirect":"bad_status"};
      }catch(error){
        return {path:item.path,sources:item.sources,status:null,outcome:"network_error",
          // Fetch errors may embed request URLs, headers or tokens. Keep only a safe class.
          reason:error?.name==="TimeoutError"||error?.name==="AbortError"
            ? "timeout_or_aborted" : "request_failed"};
      }
    }));
    checked.push(...rows);
  }
  return {
    checked:checked.length,ok:checked.filter(x=>x.outcome==="ok").length,
    broken:checked.filter(x=>["bad_status","network_error","non_html_200"].includes(x.outcome)),
    redirects:checked.filter(x=>x.outcome==="redirect"), checked_paths:checked,
    limitations:"Only hrefs in main on homepage and the required decision pages; read-only GET, redirects not followed. Not a scan of all legacy posts or external backlinks."
  };
}


/**
 * Validate live first-party fragment navigation, not just the destination HTTP
 * status. A 200 page with a missing #section is a dead end for visitors.
 * Only curated public page links are inspected; no commerce routes, queries,
 * cross-origin URLs or user-provided answer payloads are requested or logged.
 */
export function prepareInternalFragments(sourcePages,origin="https://zaprazi.cz") {
  if (origin!=="https://zaprazi.cz") throw new Error("Only exact production origin is allowed");
  const targets=new Map();
  for(const page of sourcePages){
    for(const href of page.links||[]){
      let url;
      try {url=new URL(href,origin+page.path);} catch {continue;}
      if(url.origin!==origin || !url.hash || url.search || url.username || url.password ||
          url.port || blockedPath.test(url.pathname) ||
          !/^\/(?:[a-z0-9_-]+\/)*$/i.test(url.pathname))continue;
      let fragment;
      try {fragment=decodeURIComponent(url.hash.slice(1));} catch {continue;}
      if(!fragment || fragment.length>120 || /[\x00-\x1f\x7f]/.test(fragment))continue;
      const key=JSON.stringify([url.pathname,fragment]);
      if(!targets.has(key))targets.set(key,{path:url.pathname,fragment,sources:new Set()});
      targets.get(key).sources.add(page.path);
    }
  }
  if(targets.size>240)throw new Error("Refusing unbounded fragment scan");
  return [...targets.values()].map(t=>({
    path:t.path,fragment:t.fragment,sources:[...t.sources].sort()
  }));
}

export function auditInternalFragments(targets,idsByPath) {
  if(targets.length>240)throw new Error("Refusing unbounded fragment scan");
  const broken=[],unchecked=[];
  for(const target of targets){
    const ids=idsByPath.get(target.path);
    if(!ids){unchecked.push({path:target.path,fragment:target.fragment,
      sources:target.sources,reason:"target_not_scanned"});continue;}
    if(!ids.has(target.fragment))broken.push({path:target.path,
      fragment:target.fragment,sources:target.sources,reason:"missing_dom_id"});
  }
  return {total:targets.length,checked:targets.length-unchecked.length,
    broken,unchecked,limitations:"Live DOM fragment IDs only on curated public pages; not a crawl of legacy posts or proof of Google indexing."};
}

/**
 * Public Actions logs must never include fragment IDs from hrefs. A broken
 * anchor can contain an answer, identifier or token even without a query
 * string. Preserve counts and curated source pages for triage; inspect the
 * actual href only in a controlled local run.
 */
export function publicFragmentReport(report) {
  const issues=[...report.broken,...report.unchecked];
  return {
    total:report.total,
    checked:report.checked,
    broken_count:report.broken.length,
    unchecked_count:report.unchecked.length,
    affected_source_pages:[...new Set(issues.flatMap(x=>x.sources))].sort(),
    limitations:report.limitations
  };
}
