/**
 * Read-only predeployment batch probe. It does NOT change WP or require
 * released theme 0.8.135: it applies the new PHP pure formatter offline and
 * renders the result in an isolated Chromium document.
 */
import { spawnSync } from "node:child_process";
import puppeteer from "puppeteer-core";
const base="https://zaprazi.cz";
const url=base+"/wp-json/wp/v2/posts?status=publish&per_page=100&page=1&_fields=id,slug,content";
const response=await fetch(url,{signal:AbortSignal.timeout(30000)});
if(response.status!==200)throw new Error("Published source API failed: "+response.status);
const list=await response.json();
if(!Array.isArray(list))throw new Error("Malformed WP REST corpus");
if(list.length<80){
  // Reassigned after the production-wide archival cleanup: the old 100-item
  // legacy cohort is intentionally gone. Confirm tombstone and modern site
  // health instead of expecting and reprocessing discarded technical posts.
  if(list.length>1)throw new Error("Unexpected legacy articles still public: "+list.length);
  const old=await fetch(base+"/?p=6801",{signal:AbortSignal.timeout(25000),redirect:"follow"});
  if(old.status!==404&&old.status!==410)throw new Error("Old post 6801 unexpectedly accessible: "+old.status);
  const [r,p]=await Promise.all([
    fetch(base+"/wp-json/zaprazi/v1/affiliate-readiness",{signal:AbortSignal.timeout(25000)}),
    fetch(base+"/wp-json/wp/v2/pages?per_page=1",{signal:AbortSignal.timeout(25000)})
  ]);
  if(r.status!==200||p.status!==200)throw new Error("Modern site audit endpoint failure");
  const data=await r.json(),pageCount=Number(p.headers.get("x-wp-total"));
  if(pageCount!==53||data.integrity!=="ok"||data.configured_total!==25)
    throw new Error("Modern content or affiliate safety changed after archive cleanup");
  console.log("RETIRED_LEGACY_COHORT_QA "+JSON.stringify({
    oldPost6801HTTP:old.status,oldPublicRESTCount:list.length,
    modernPublishedPages:pageCount,affiliateConfigured:data.configured_total,
    release:data.release,integrity:data.integrity
  }));
  process.exit(0);
}
const chosen=list.filter(p=>p.id>0 && p.id%8===0 && typeof p.content?.rendered==="string");
const special=await fetch(base+"/wp-json/wp/v2/posts/6801?_fields=id,slug,content",
  {signal:AbortSignal.timeout(25000)});
if(special.status!==200)throw new Error("Known severe control 6801 unavailable");
chosen.unshift(await special.json());
if(chosen.length<8)throw new Error("Too few eligible real posts for meaningful preflight");
const browser=await puppeteer.launch({executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage"]});
const countWords=s=>(String(s).match(/[\p{L}\p{N}]+/gu)||[]).length;
const cleanText=s=>String(s).replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi," ")
  .replace(/<[^>]*>/g," ");
let processed=0,changed=0;
try{
  const page=await browser.newPage();
  for(const p of chosen){
    const php=String.raw`define("ABSPATH",1);require "src/seo/legacy-document-shell.php";
      $in=stream_get_contents(STDIN);echo zaprazi_2_strip_legacy_document_shell($in);`;
    const run=spawnSync("php",["-r",php],{
      input:p.content.rendered,encoding:"utf8",timeout:10000,maxBuffer:4000000
    });
    if(run.status!==0)throw new Error("PHP repair failed for "+p.id+": "+run.stderr);
    const cleaned=run.stdout;
    if(cleaned!==p.content.rendered)changed++;
    // Wrapper exposes identical browser parsing to a WordPress legacy body.
    await page.setContent('<div id="legacy">'+cleaned+'</div>',{waitUntil:"domcontentloaded"});
    const html=await page.$eval("#legacy",el=>({
      text:el.innerText,html:el.innerHTML,
      links:[...el.querySelectorAll("a[href]")].map(a=>a.getAttribute("href")),
      images:[...el.querySelectorAll("img[src]")].map(a=>a.getAttribute("src"))
    }));
    const orig=p.content.rendered;
    const expectedLinks=[...orig.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi)].map(x=>x[1]);
    const expectedImgs=[...orig.matchAll(/<img\b[^>]*src\s*=\s*["']([^"']+)["']/gi)].map(x=>x[1]);
    const denom=countWords(cleanText(orig));
    const visible=countWords(html.text);
    const ratio=denom?visible/denom:1;
    console.log("COHORT_PREFLIGHT",JSON.stringify({id:p.id,originalWords:denom,visibleWords:visible,
      ratio:Number(ratio.toFixed(3)),links:[expectedLinks.length,html.links.length],
      images:[expectedImgs.length,html.images.length],cleaned:cleaned!==orig}));
    if(ratio<.8||html.links.length<expectedLinks.length||
       html.images.length<expectedImgs.length||
       (cleaned!==orig && /<!doctype|<\/?(?:html|head|body)\b/i.test(html.html))){
      throw new Error("Unsafe loss of article content in preflight id "+p.id);
    }
    processed++;
  }
  await page.close();
}finally{await browser.close();}
console.log("COHORT_PREFLIGHT_SUMMARY",JSON.stringify({inspected:processed,cleaned:changed,
  sample_from_latest:chosen.length-1,known_damaged_control_id:6801,
  note:"Dry-run test; not proof of all 4,360 posts or Google indexing"}));
