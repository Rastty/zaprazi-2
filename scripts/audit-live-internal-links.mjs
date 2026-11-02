/**
 * Read-only link audit: homepage plus all required decision/problem pages -> all public
 * first-party HTML path targets. Never clicks commerce, never follows redirects.
 */
import { accessSync, constants } from "node:fs";
import puppeteer from "puppeteer-core";
import { requiredDecisionPaths } from "./audit-public-sitemap.mjs";
import { liveVerifiedProblemPaths } from "./lib/live-verified-problem-paths.mjs";
import { prepareInternalLinks, auditInternalTargets, prepareInternalFragments, auditInternalFragments, publicFragmentReport, isSafeMainFrameNavigation } from "./lib/internal-link-health.mjs";

const origin="https://zaprazi.cz";
const chrome=[process.env.CHROME_BIN,"/usr/bin/google-chrome","/usr/bin/chromium"].filter(Boolean)
  .find(path=>{try{accessSync(path,constants.X_OK);return true;}catch{return false;}});
if(!chrome)throw new Error("Chrome required for read-only DOM link scan");
const browser=await puppeteer.launch({executablePath:chrome,headless:true,
  args:["--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage"]});
const pages=[], idsByPath=new Map();
let fragmentTargets=[];

// Puppeteer follows 3xx automatically, unlike the bounded fetch link probe.
// Abort any top-level navigation away from the exact curated public page.
// Never log rejected Location URLs: they may contain user-provided data.
async function lockMainFrame(page,path){
  await page.setRequestInterception(true);
  page.on("request",request=>{
    const allowed=!request.isNavigationRequest() ||
      request.frame()!==page.mainFrame() ||
      isSafeMainFrameNavigation(request.url(),path);
    (allowed?request.continue():request.abort("blockedbyclient")).catch(()=>{});
  });
}
async function openExact(page,path){
  await lockMainFrame(page,path);
  const response=await page.goto(origin+path,{waitUntil:"domcontentloaded",timeout:25000});
  if(response?.status()!==200 || page.url()!==origin+path)
    throw new Error("Source page not exact HTTP 200: "+path);
}

try{
  for(const path of ["/",...new Set([...requiredDecisionPaths,...liveVerifiedProblemPaths])]){
    const page=await browser.newPage();
    try{
      await openExact(page,path);
      const links=await page.$$eval("main a[href]",anchors=>anchors.map(a=>a.getAttribute("href")));
      const ids=await page.$$eval("[id]",nodes=>nodes.map(node=>node.id));
      pages.push({path,links});
      idsByPath.set(path,new Set(ids));
    }finally{await page.close();}
  }
  fragmentTargets=prepareInternalFragments(pages);
  // Most targets are already scanned source pages. Fetch only missing target DOMs,
  // without following redirects or touching commerce endpoints.
  const additional=[...new Set(fragmentTargets.map(t=>t.path))]
    .filter(path=>!idsByPath.has(path));
  for(const path of additional){
    const page=await browser.newPage();
    try{
      await openExact(page,path);
      idsByPath.set(path,new Set(await page.$$eval("[id]",nodes=>nodes.map(node=>node.id))));
    }catch(error){console.error("FRAGMENT_TARGET_UNAVAILABLE","navigation_failed");}
    finally{await page.close();}
  }
}finally{await browser.close();}
const ready=prepareInternalLinks(pages);
const checked=await auditInternalTargets(ready.targets);
const result={source_pages:pages.length, audited_source_paths:pages.map(p=>p.path),links_total:pages.reduce((a,p)=>a+p.links.length,0),
  unique_safe_targets:ready.targets.length,excluded:ready.excluded,
  insecure_internal_links:ready.insecure_internal_links,
  noncanonical_internal_links:ready.noncanonical_internal_links,
  unsafe_first_party_links:ready.unsafe_first_party_links,...checked};
const fragmentReport=auditInternalFragments(fragmentTargets,idsByPath);
const {checked_paths,...summary}=result;
console.log("LINK_HEALTH_SUMMARY",JSON.stringify(summary));
console.log("LINK_HEALTH_TARGETS",JSON.stringify(checked_paths));
console.log("LINK_FRAGMENT_SUMMARY",JSON.stringify(publicFragmentReport(fragmentReport)));
if(result.broken.length||ready.insecure_internal_links.count||
    ready.noncanonical_internal_links.count||ready.unsafe_first_party_links.count||
    fragmentReport.broken.length||fragmentReport.unchecked.length)
  process.exitCode=1;
