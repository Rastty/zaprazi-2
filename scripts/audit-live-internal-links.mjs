/**
 * Read-only link audit: 27 core decision/resource entry pages -> all public
 * first-party HTML path targets. Never clicks commerce, never follows redirects.
 */
import { accessSync, constants } from "node:fs";
import puppeteer from "puppeteer-core";
import { requiredDecisionPaths } from "./audit-public-sitemap.mjs";
import { prepareInternalLinks, auditInternalTargets } from "./lib/internal-link-health.mjs";

const origin="https://zaprazi.cz";
const chrome=[process.env.CHROME_BIN,"/usr/bin/google-chrome","/usr/bin/chromium"].filter(Boolean)
  .find(path=>{try{accessSync(path,constants.X_OK);return true;}catch{return false;}});
if(!chrome)throw new Error("Chrome required for read-only DOM link scan");
const browser=await puppeteer.launch({executablePath:chrome,headless:true,
  args:["--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage"]});
const pages=[];
try{
  for(const path of ["/",...requiredDecisionPaths]){
    const page=await browser.newPage();
    try{
      const response=await page.goto(origin+path,{waitUntil:"domcontentloaded",timeout:25000});
      if(response?.status()!==200)throw new Error("Source page not HTTP 200: "+path);
      const links=await page.$$eval("main a[href]",anchors=>anchors.map(a=>a.getAttribute("href")));
      pages.push({path,links});
    }finally{await page.close();}
  }
}finally{await browser.close();}
const ready=prepareInternalLinks(pages);
const checked=await auditInternalTargets(ready.targets);
const result={source_pages:pages.length,links_total:pages.reduce((a,p)=>a+p.links.length,0),
  unique_safe_targets:ready.targets.length,excluded:ready.excluded,...checked};
const {checked_paths,...summary}=result;
console.log("LINK_HEALTH_SUMMARY",JSON.stringify(summary));
console.log("LINK_HEALTH_TARGETS",JSON.stringify(checked_paths));
if(result.broken.length)process.exitCode=1;
