/**
 * Non-mutating production check: compare visible live legacy article content
 * with the *published* WP REST HTML for the same post. Do not assume that
 * HTML-shell removal alone preserves content in the browser's repaired DOM.
 */
import puppeteer from "puppeteer-core";
import { spawnSync } from "node:child_process";

const origin = "https://zaprazi.cz";
const cases = [
  { id:8105,slug:"solarni-panely-v-praxi-inspirace-pro-zemedelce" },
  { id:8106,slug:"solarni-panely-a-jejich-prinos-pro-ekologickou-dopravu" },
  { id:6801,slug:"efektivni-solarni-system-minimalizace-ztrat-prenosu" }
];
const cleanText=s=>String(s).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ")
  .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi," ")
  .replace(/<[^>]*>/g," ")
  .replace(/&(?:nbsp|amp|quot|lt|gt|mdash|hellip);/gi," ")
  .replace(/&#(?:x[0-9a-f]+|\d+);/gi," ")
  .replace(/\s+/g," ").trim();
const words=s=>(String(s).match(/[\p{L}\p{N}]+/gu)||[]).length;
const chrome=process.env.CHROME_BIN||"/usr/bin/google-chrome";
const browser=await puppeteer.launch({executablePath:chrome,headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
let failed=0;
try{
  for(const item of cases){
    const rest=await fetch(origin+"/wp-json/wp/v2/posts/"+item.id+"?_fields=id,slug,content",{signal:AbortSignal.timeout(25000)});
    if(rest.status!==200)throw new Error("REST unavailable for id "+item.id+": "+rest.status);
    const json=await rest.json();
    if(json.id!==item.id||json.slug!==item.slug||!json.content?.rendered)throw new Error("REST record mismatch "+item.id);
    const page=await browser.newPage();
    try{
      const target=origin+"/"+item.slug+"/";
      const pageResponse=await page.goto(target,{waitUntil:"domcontentloaded",timeout:25000});
      if(pageResponse?.status()!==200)throw new Error("Live page failed "+target);
      const actual=await page.$eval(".zp-legacy-body",el=>({
        text:el.innerText,innerHTML:el.innerHTML,
        hrefs:[...el.querySelectorAll("a[href]")].map(a=>a.href),
        imgs:[...el.querySelectorAll("img[src]")].map(a=>a.src)
      }));
      const sourceResponse=await fetch(target,{signal:AbortSignal.timeout(25000)});
      const rawPage=await sourceResponse.text();
      const rawStart=rawPage.indexOf('<div class="zp-legacy-body">');
      const rawEnd=rawPage.indexOf('<nav class="zp-post-nav"',rawStart);
      const rawRegion=rawStart>=0?rawPage.slice(rawStart,rawEnd>rawStart?rawEnd:undefined):"";
      const php=String.raw`define("ABSPATH",1);
        require "src/seo/legacy-document-shell.php";
        $in=stream_get_contents(STDIN);
        $out=zaprazi_2_strip_legacy_document_shell($in);
        echo json_encode([
          "changed"=>($in!==$out),
          "raw_len"=>strlen($in),"filtered_len"=>strlen($out),
          "filtered_doctype"=>preg_match_all("/<!doctype\\b/i",$out),
          "filtered_html"=>preg_match_all("/<html\\b/i",$out),
          "filtered_end"=>substr(strip_tags($out),-170)
        ],JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE);`;
      const phpRun=spawnSync("php",["-r",php],{
        input:json.content.rendered,encoding:"utf8",timeout:10000
      });
      if(phpRun.status!==0)throw new Error("PHP canary diagnostic failed: "+phpRun.stderr);
      console.log("LEGACY_CANARY_SOURCE",JSON.stringify({
        id:item.id,rawPageLen:rawPage.length,rawRegionLen:rawRegion.length,
        rawRegionDoctype:(rawRegion.match(/<!doctype/gi)||[]).length,
        rawRegionHtml:(rawRegion.match(/<html\b/gi)||[]).length,
        rawRegionH2:(rawRegion.match(/<h2\b/gi)||[]).length,
        rawRegionHref:(rawRegion.match(/\bhref=["']/gi)||[]).length,
        sanitizer:JSON.parse(phpRun.stdout)
      }));
      if(item.id!==6801){
        const htmlRun=spawnSync("php",["-r",`define("ABSPATH",1);
          require "src/seo/legacy-document-shell.php";
          $in=stream_get_contents(STDIN);
          echo zaprazi_2_strip_legacy_document_shell($in);`],{
          input:json.content.rendered,encoding:"utf8",timeout:10000
        });
        if(htmlRun.status!==0)throw new Error("PHP clean HTML failed: "+htmlRun.stderr);
        const sandbox=await browser.newPage();
        await sandbox.setContent('<div id="test-legacy-body">'+htmlRun.stdout+'</div>',{waitUntil:"domcontentloaded"});
        const sanitized=await sandbox.$eval("#test-legacy-body",el=>({
          text:el.innerText, links:el.querySelectorAll("a[href]").length,
          imgs:el.querySelectorAll("img[src]").length
        }));
        console.log("LEGACY_CANARY_OFFLINE_RENDER",JSON.stringify({
          id:item.id,sourceWords:words(cleanText(json.content.rendered)),
          afterCleanerWords:words(cleanText(htmlRun.stdout)),
          offlineDomWords:words(cleanText(sanitized.text)),
          offlineDomLinks:sanitized.links,offlineDomImages:sanitized.imgs,
          rawServerHasLaterContent:rawPage.includes(cleanText(json.content.rendered).slice(-60)),
          rawServerDoctypes:(rawPage.match(/<!doctype/gi)||[]).length,
          rawServerHTMLheads:(rawPage.match(/<head/gi)||[]).length
        }));
        await sandbox.close();
      }
      const sourceText=cleanText(json.content.rendered);
      const observedText=cleanText(actual.text);
      const expectedWords=words(sourceText),domWords=words(observedText);
      const expectedLinks=[...json.content.rendered.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi)].map(x=>x[1]);
      const expectedImages=[...json.content.rendered.matchAll(/<img\b[^>]*src\s*=\s*["']([^"']+)["']/gi)].map(x=>x[1]);
      const ratio=Number((domWords/Math.max(expectedWords,1)).toFixed(3));
      const details={id:item.id,canary:item.id!==6801,rest_words:expectedWords,dom_words:domWords,
        dom_to_rest_ratio:ratio,rest_links:expectedLinks.length,dom_links:actual.hrefs.length,
        rest_imgs:expectedImages.length,dom_imgs:actual.imgs.length,
        dom_nested_doctype:/<!doctype/i.test(actual.innerHTML),
        source_ending:sourceText.slice(-140),dom_ending:observedText.slice(-140)};
      console.log("LEGACY_CANARY_DOM",JSON.stringify(details));
      // 6801 is deliberately untouched: informative negative control only.
      if(item.id!==6801 && (ratio<0.8 || actual.hrefs.length<expectedLinks.length ||
            actual.imgs.length<expectedImages.length))failed++;
    }finally{await page.close();}
  }
}finally{await browser.close();}
if(failed){console.error("CANARY_DOM_REGRESSION: "+failed+" canary post(s) show partial rendered content");process.exitCode=1;}
