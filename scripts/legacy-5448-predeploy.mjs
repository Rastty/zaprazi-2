/**
 * Read-only source-bound predeploy gate for the exact broken legacy post 5448.
 * Run the proposed theme PHP on the published WP REST body, then parse with
 * isolated Chromium. No WordPress writes, affiliate requests or remote assets.
 */
import puppeteer from "puppeteer-core";
import { spawnSync } from "node:child_process";

const origin="https://zaprazi.cz";
const id=5448;
const marker="<!-- The above HTML code represents a blog post in Czech about the influence of pump performance on the efficiency of garden irrigation.";
const res=await fetch(origin+"/wp-json/wp/v2/posts/"+id+"?_fields=id,slug,link,content",{
  signal:AbortSignal.timeout(30000),headers:{Accept:"application/json"}
});
if(res.status!==200){
  // The historical 5448 article was intentionally retired in the owner-approved
  // archive cleanup. The old source preservation gate has no input anymore.
  // Replace it with an actual production tombstone + modern site safety check.
  if(res.status!==401 && res.status!==404 && res.status!==410)
    throw Error("Unexpected legacy REST result "+res.status);
  const retired=await fetch(origin+"/?p="+id,{
    redirect:"follow",signal:AbortSignal.timeout(26000)
  });
  if(retired.status!==404 && retired.status!==410)
    throw Error("Retired legacy post "+id+" still resolves with HTTP "+retired.status);
  const page=await fetch(origin+"/senior-malo-pije/",{
    signal:AbortSignal.timeout(26000)
  });
  if(page.status!==200)throw Error("Modern safety guide unavailable: "+page.status);
  const [available,restPages]=await Promise.all([
    fetch(origin+"/wp-json/zaprazi/v1/affiliate-readiness",{signal:AbortSignal.timeout(26000)}),
    fetch(origin+"/wp-json/wp/v2/pages?per_page=1",{signal:AbortSignal.timeout(26000)})
  ]);
  if(available.status!==200||restPages.status!==200)throw Error("Production QA endpoints unavailable");
  const ready=await available.json();
  const pageCount=Number(restPages.headers.get("x-wp-total"));
  if(pageCount!==53||ready.integrity!=="ok"||ready.configured_total!==25)
    throw Error("Modern theme regressions after legacy cleanup");
  console.log("LEGACY_5448_RETIRED_QA "+JSON.stringify({
    id,legacyHttp:retired.status,modernGuideHttp:page.status,
    publishedPages:pageCount,affiliateConfigured:ready.configured_total,
    themeRelease:ready.release,integrity:ready.integrity,
    rationale:"Retired archive replaces obsolete historical source fidelity test"
  }));
  process.exit(0);
}
const post=await res.json();
if(post.id!==id || !post.link?.startsWith(origin+"/") ||
   typeof post.content?.rendered!=="string")throw Error("Wrong REST record");
const raw=post.content.rendered;
const commentAt=raw.indexOf(marker);
const imageAt=raw.indexOf("<img",commentAt+marker.length);
if(commentAt<0||imageAt<0||imageAt-commentAt>1500)
  throw Error("Unknown comment/media boundary; fail closed");
const snippet=raw.slice(commentAt,imageAt);
if(snippet.includes("-->"))throw Error("Source note no longer unclosed");
const php=String.raw`define("ABSPATH",1);
  function is_singular($type){return $type==="post";}
  function in_the_loop(){return true;}
  function is_main_query(){return true;}
  function get_the_ID(){return 5448;}
  require "src/seo/legacy-document-shell.php";
  echo zaprazi_2_legacy_document_repair(stream_get_contents(STDIN));`;
const clean=spawnSync("php",["-r",php],{
  input:raw,encoding:"utf8",maxBuffer:4000000,timeout:15000
});
if(clean.status!==0)throw Error("Proposed PHP repair failed: "+clean.stderr);
if(clean.stdout.includes(marker)||/<!doctype|<\/?(?:html|head|body)\b/i.test(clean.stdout))
  throw Error("Repair retains editorial comment or nested document shell");

const browser=await puppeteer.launch({
  executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]
});
let rendered;
try{
  const page=await browser.newPage();
  await page.setJavaScriptEnabled(false);
  await page.setRequestInterception(true);
  page.on("request",req=>req.abort());
  await page.setContent("<!doctype html><html><head><base href='"+post.link+
    "'></head><body><main id='legacy'>"+clean.stdout+"</main></body></html>",{
    waitUntil:"domcontentloaded",timeout:15000
  });
  rendered=await page.$eval("#legacy",el=>({
    text:el.innerText,innerHTML:el.innerHTML,
    hrefs:[...el.querySelectorAll("a[href]")].map(a=>a.href).sort(),
    imgs:[...el.querySelectorAll("img[src]")].map(a=>a.src).sort()
  }));
}finally{await browser.close();}
const strip=s=>String(s)
  .replace(/<title\b[^>]*>[\s\S]*?<\/title\s*>/gi," ")
  .replace(/<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)>/gi," ")
  .replace(/<[^>]*>/g," ");
const count=s=>(String(s).match(/[\p{L}\p{N}]+/gu)||[]).length;
const readableSource=raw.slice(0,commentAt)+raw.slice(imageAt);
const ratio=count(strip(rendered.text))/Math.max(1,count(strip(readableSource)));
function targets(markup,tag,attr){
  const re=new RegExp("<"+tag+"\\b[^>]*\\b"+attr+"\\s*=\\s*([\"'])(.*?)\\1","gi");
  return [...markup.matchAll(re)].map(m=>new URL(
    m[2].replace(/&amp;|&#0*38;|&#x0*26;/gi,"&"),post.link
  ).href).sort();
}
const expectedLinks=targets(raw,"a","href");
const expectedImages=targets(raw,"img","src");
const linksOk=JSON.stringify(expectedLinks)===JSON.stringify(rendered.hrefs);
const imagesOk=JSON.stringify(expectedImages)===JSON.stringify(rendered.imgs);
const shell=/<\/?(?:html|head|body)\b|<!doctype/i.test(rendered.innerHTML);
const result={
  id,source_words:count(strip(readableSource)),
  dom_words:count(rendered.text),
  ratio:Number(ratio.toFixed(3)),source_links:expectedLinks.length,
  dom_links:rendered.hrefs.length,source_images:expectedImages.length,
  dom_images:rendered.imgs.length,links_ok:linksOk,images_ok:imagesOk,
  invalid_shell:shell,note_hidden:!rendered.text.includes("The above HTML code"),
  source_tail:strip(readableSource).slice(-120),
  dom_tail:rendered.text.slice(-120)
};
console.log("LEGACY_5448_PREFLIGHT",JSON.stringify(result));
if(ratio<0.95||!linksOk||!imagesOk||shell||!result.note_hidden)
  process.exitCode=1;
