/**
 * Read-only browser audit of the 26 key decision/resource URLs and homepage.
 * Produces a diagnostic report, never changes content/merchant data.
 * Requires Chrome plus puppeteer-core (installed only by GitHub workflow).
 */
import { accessSync, constants } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import puppeteer from "puppeteer-core";
import { requiredDecisionPaths } from "./audit-public-sitemap.mjs";
import { summarizeEditorialPages } from "./lib/editorial-seo-rules.mjs";

const base="https://zaprazi.cz";
const paths=["/",...requiredDecisionPaths];
const chrome=[process.env.CHROME_BIN,"/usr/bin/google-chrome","/usr/bin/chromium"].filter(Boolean)
  .find(path => {try {accessSync(path,constants.X_OK);return true;}catch{return false;}});
if(!chrome)throw new Error("Chrome/Chromium required for public DOM audit");

const browser=await puppeteer.launch({executablePath:chrome,headless:true,
  args:["--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage"]});
const observed=[];
try{
  for(const path of paths){
    const page=await browser.newPage();
    try{
      await page.setViewport({width:390,height:844,deviceScaleFactor:1});
      await page.setDefaultTimeout(12000);
      const response=await page.goto(base+path,{waitUntil:"domcontentloaded",timeout:25000});
      const result=await page.evaluate(() => {
        const content=document.querySelector("main");
        const canon=document.querySelector('link[rel="canonical"]');
        const meta=document.querySelector('meta[name="description"]');
        const robots=document.querySelector('meta[name="robots"]');
        const safeHref=a=>{
          try{const u=new URL(a.getAttribute("href"),location.href);
            if(u.hostname!=="zaprazi.cz")return null;
            if(!["https:","http:"].includes(u.protocol))return null;
            if(u.search||u.username||u.password)return null;
            return u.href;
          }catch{return null;}
        };
        return{
          title:document.title,
          h1:[...(content?.querySelectorAll("h1")||[])].map(h=>h.textContent.trim()),
          description:meta?.content||"",
          canonical:canon?.href||"",
          ogUrl:document.querySelector('meta[property="og:url"]')?.content||"",
          release:document.querySelector('meta[name="zaprazi-release"]')?.content||"",
          robots:robots?.content||"",
          ids:[...document.querySelectorAll("[id]")].map(x=>x.id),
          mainWords:(content?.innerText||"").split(/\s+/).filter(Boolean).length,
          mainContentLinks:[...(content?.querySelectorAll("a[href]")||[])]
            .map(safeHref).filter(Boolean),
          mobileOverflow:document.documentElement.scrollWidth-window.innerWidth
        };
      });
      observed.push({path,status:response?.status(),...result});
      console.log("PAGE_AUDIT",JSON.stringify({
        path,status:response?.status(),h1:result.h1.length,
        description:result.description.length,canonical:result.canonical,
        outgoing:result.mainContentLinks.length,mobileOverflow:result.mobileOverflow
      }));
    }catch(error){
      observed.push({path,status:"fetch_error",h1:[],title:"",description:"",
        canonical:"",robots:"",ids:[],mainWords:0,mainContentLinks:[],
        error:String(error).slice(0,300)});
      console.error("PAGE_AUDIT_FAILURE",path,String(error).slice(0,300));
    }finally{await page.close();}
  }
}finally{await browser.close();}
const report=summarizeEditorialPages(observed);
for (const page of observed) {
  // Yoast sometimes emitted HTTP og:url alongside an HTTP canonical.
  // Check it separately; absence may be intentional for a specific template.
  if (page.status !== 200 || !page.ogUrl) continue;
  const expected=base+page.path;
  if (page.ogUrl!==expected) {
    report.errors.push({path:page.path,code:"OG_URL_MISMATCH",details:page.ogUrl});
  }
}
const knownOldCanonical=process.env.ZP_ALLOW_CANONICAL_HTTP_ON_0_8_134==="true" &&
  observed.every(page=>page.release==="0.8.134") &&
  report.errors.every(e=>e.code==="CANONICAL_MISMATCH" &&
    /^http:\/\/zaprazi\.cz\//i.test(e.details));
if(knownOldCanonical && report.errors.length) {
  console.warn("KNOWN_PREDEPLOY_0_8_134_HTTP_CANONICAL",
    "Existing release has HTTP Yoast canonical; fixed by new output filter in 0.8.135.",
    "Count:",report.errors.length);
}
const {pages,...summary}=report;
console.log("EDITORIAL_SEO_SUMMARY",JSON.stringify(summary));
console.log("EDITORIAL_SEO_PAGES",JSON.stringify(pages));
if(report.errors.length && !knownOldCanonical)process.exitCode=1;
