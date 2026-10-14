/**
 * Read-only preflight for ALL posts eligible for the 0.8.135 display repair.
 * Reads the public WordPress REST corpus sequentially and checks each member
 * with the actual PHP normalizer and isolated, JS-disabled Chrome. No GET to
 * affiliate URLs and no authenticated WordPress write.
 */
import puppeteer from "puppeteer-core";
import { spawnSync } from "node:child_process";

const base = "https://zaprazi.cz",size=100,hardCap=60;
const phpSource=String.raw`define('ABSPATH',1);
  require 'src/seo/legacy-document-shell.php';
  echo zaprazi_2_strip_legacy_document_shell(stream_get_contents(STDIN));`;
const countWords = s => (String(s).match(/[\p{L}\p{N}]+/gu) || []).length;
const strip = s => String(s).replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi," ")
  .replace(/<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)>/gi," ")
  .replace(/<[^>]*>/g," ");
const decodeBasic = s => s.replace(/&amp;|&#38;|&#x26;/gi,"&")
  .replace(/&quot;|&#34;/gi,'"').replace(/&#39;|&apos;/gi,"'");
function links(html, tag, attr) {
  const re=new RegExp("<"+tag+"\\b[^>]*\\b"+attr+"\\s*=\\s*([\\\"'])(.*?)\\1","gi");
  return [...html.matchAll(re)].map(x=>decodeBasic(x[2]));
}
function targets(urls, pageUrl) {
  return urls.map(url=>new URL(url,pageUrl).href).sort();
}
const fetchJson=async url=>{
  const res=await fetch(url,{
    method:"GET",redirect:"manual",headers:{Accept:"application/json"},
    signal:AbortSignal.timeout(30000)
  });
  if(res.status!==200||!/(?:application|[^/]+\/[^;]*\+json)\/?json/i.test(res.headers.get("content-type")||"application/json")){
    // Content-Type can vary by WordPress; status is authoritative here.
    if(res.status!==200)throw Error("Public WP REST status "+res.status+" for "+url);
  }
  return {response:res,body:await res.json()};
};
const browser=await puppeteer.launch({executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",
  headless:true,args:["--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage"]});
const page=await browser.newPage();
await page.setJavaScriptEnabled(false);
await page.setRequestInterception(true);
page.on("request",request=>request.abort());
const seen=new Set(), failures=[], highRisk=[];
let total=null,totalPages=null,published=0,eligible=0,changed=0,unchanged=0,checked=0;
try{
  for(let pageNo=1;pageNo<=Math.min(totalPages??hardCap,hardCap);pageNo++){
    const u=new URL("/wp-json/wp/v2/posts",base);
    for(const [key,value] of Object.entries({
      status:"publish",per_page:String(size),page:String(pageNo),
      _fields:"id,slug,link,content"
    }))u.searchParams.set(key,value);
    const {response,body}=await fetchJson(u);
    const n=Number(response.headers.get("x-wp-total"));
    const p=Number(response.headers.get("x-wp-totalpages"));
    if(!Number.isSafeInteger(n)||n<1||n>6000||
       !Number.isSafeInteger(p)||p<1||p>hardCap)throw Error("Unsafe corpus metadata");
    if(total===null){total=n;totalPages=p;}
    else if(n!==total||p!==totalPages)throw Error("Corpus changed during audit");
    if(!Array.isArray(body)||body.length===0||body.length>size)throw Error("Invalid REST page");
    for(const post of body){
      if(!Number.isSafeInteger(post.id)||seen.has(post.id))
        throw Error("Invalid or duplicate published ID: "+post.id);
      seen.add(post.id);published++;
      if(post.id%8!==0 && ![6801,8105,8106].includes(post.id))continue;
      eligible++;
      const url=base+"/"+post.slug+"/";
      if(post.link!==url || !/^\/[a-z0-9-]+\/$/.test(new URL(post.link).pathname)
         || typeof post.content?.rendered!=="string")throw Error("Unsafe post reference "+post.id);
      const raw=post.content.rendered;
      const php=spawnSync("php",["-r",phpSource],{
        input:raw,encoding:"utf8",timeout:10000,maxBuffer:4000000
      });
      if(php.status!==0)throw Error("PHP shell formatter failed on "+post.id+": "+php.stderr);
      const output=php.stdout;
      if(output===raw)unchanged++;else changed++;
      try{
        await page.setContent("<!doctype html><html><head><base href=\\""+url+
          "\\"></head><body><main id=\\"legacy\\">"+output+"</main></body></html>",
          {waitUntil:"domcontentloaded",timeout:15000});
        const rendered=await page.$eval("#legacy",el=>({
          text:el.innerText, html:el.innerHTML,
          hrefs:[...el.querySelectorAll("a[href]")].map(el=>el.href),
          images:[...el.querySelectorAll("img[src]")].map(el=>el.src)
        }));
        const expectedLinks=targets(links(raw,"a","href"),url);
        const expectedImages=targets(links(raw,"img","src"),url);
        const ratio=countWords(strip(raw))>0
          ? countWords(rendered.text)/countWords(strip(raw)) : 1;
        const linksOk=JSON.stringify(expectedLinks)===
          JSON.stringify(rendered.hrefs.slice().sort());
        const imagesOk=JSON.stringify(expectedImages)===
          JSON.stringify(rendered.images.slice().sort());
        const invalidShell=/<\/?(?:html|head|body)\b|<!doctype/i.test(rendered.html);
        if(ratio<.95 || !linksOk || !imagesOk || invalidShell){
          const row={id:post.id,ratio:Number(ratio.toFixed(3)),
            source_links:expectedLinks.length,rendered_links:rendered.hrefs.length,
            source_images:expectedImages.length,rendered_images:rendered.images.length,
            links_ok:linksOk,images_ok:imagesOk,embedded_shell:invalidShell,
            cleaner_changed:output!==raw};
          failures.push(row);
          if(highRisk.length<18)highRisk.push(row);
        }
      }catch(error){
        const row={id:post.id,error:String(error).slice(0,150)};
        failures.push(row);
        if(highRisk.length<18)highRisk.push(row);
      }
      checked++;
      if(checked%100===0)console.log("COHORT_FULL_PROGRESS",checked);
    }
  }
}finally{
  await page.close();
  await browser.close();
}
if(published!==total||seen.size!==total||checked!==eligible)
  throw Error("Incomplete corpus or selected cohort "+published+"/"+total+" eligible "+eligible);
const summary={
  published,eligible,checked,changed,unchanged,failed:failures.length,
  failing_examples:highRisk,
  source:"Public REST post.content.rendered, PHP cleaning and isolated browser DOM",
  limitations:"No live HTML GET for every post, no GSC performance/indexing claims. No WordPress write."
};
console.log("COHORT_FULL_SUMMARY",JSON.stringify(summary));
if(failures.length)process.exitCode=1;
