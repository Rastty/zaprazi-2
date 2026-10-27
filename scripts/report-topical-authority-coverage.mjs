/**
 * Offline read-only internal authority coverage audit for authored page templates.
 * This is a navigational discovery report, NOT GSC data or a traffic prediction.
 * Executes over local repository files; no WordPress, affiliate or Google requests.
 */
import {readFileSync,readdirSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve,join} from "node:path";
const dir=fileURLToPath(new URL("../",import.meta.url));
const files=["front-page.php",...readdirSync(dir).filter(x=>/^page-[a-z0-9-]+\.php$/.test(x))];
const pathFromFile=(filename)=>filename==="front-page.php"?"/":"/"+filename.slice(5,-4)+"/";
const known=new Map(files.map(file=>{
 const html=readFileSync(join(dir,file),"utf8");
 const paths=[...html.matchAll(/home_url\(\s*(["'])(\/[^"']*)\1\s*\)/g)]
  .map(x=>{try{return new URL(x[2],"https://zaprazi.cz").pathname}catch{return null}}).filter(Boolean);
 return [pathFromFile(file),{file,paths,html,inbound:new Set()}];
}));
for(const [source,info] of known) for(const dest of new Set(info.paths))
 if(dest!==source&&known.has(dest))known.get(dest).inbound.add(source);
const pages=[...known].map(([path,x])=>{
 const html=x.html;
 return {path,sourceFile:x.file,inbound:x.inbound.size,inboundFrom:[...x.inbound].sort(),
  distinctOutbound:new Set(x.paths).size,sourceLinks:x.paths.length,
  images:(html.match(/<img\b/g)||[]).length,characters:html.length,
  h1:(html.match(/<h1\b/g)||[]).length};
}).sort((a,b)=>a.inbound-b.inbound||a.path.localeCompare(b.path));
const publicPages=pages.filter(p=>!/ochrana-soukromi|jak-vznika-doporuceni/.test(p.path)&&p.path!=="/");
const report={
 type:"authored_template_link_coverage",
 limitations:"Static literal home_url graph only; dynamic JS/WP links, Google indexation and real traffic are unknown.",
 pages:pages.length,
 publicContent:publicPages.length,
 sourcesWithZeroInbound:publicPages.filter(p=>p.inbound===0).length,
 sourcesWithSingleInbound:publicPages.filter(p=>p.inbound===1).length,
 pagesWithoutStaticImg:publicPages.filter(p=>p.images===0).length,
 lowInbound:publicPages.filter(p=>p.inbound<=2),
 topByInbound:pages.slice().sort((a,b)=>b.inbound-a.inbound).slice(0,12).map(p=>({path:p.path,inbound:p.inbound})),
 all:pages.map(({path,inbound,distinctOutbound,images,h1})=>({path,inbound,outbound:distinctOutbound,images,h1}))
};
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
 console.log("ZP_TOPOLOGY_REPORT "+JSON.stringify(report));
}
export {report};
