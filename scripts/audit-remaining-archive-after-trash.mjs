/**
 * Read-only public WP REST audit after bulk archive retirement.
 * Does not use WP credentials, mutate posts, assume Google indexation or access private analytics.
 */
import assert from "node:assert/strict";
const origin="https://zaprazi.cz";
const categories={
  1161:"tepelná čerpadla a fotovoltaika",
  11:"zařízení",1159:"čerpadla a vodárny",1162:"ventilátory",
  1160:"retenční nádrže",1157:"nábytek pro zdravotnictví",
  1156:"úklid",5:"tipy",14:"zahrada",13:"stavba",3:"úspora"
};
async function request(path,{json=true}={}){
 const response=await fetch(origin+path,{
  headers:{"Accept":json?"application/json":"text/html","Cache-Control":"no-cache"},
  signal:AbortSignal.timeout(30000),redirect:"follow"
 });
 if(!response.ok)throw new Error("HTTP "+response.status+" "+path);
 const content=json?await response.json():await response.text();
 return {response,content};
}
const pages=[];
for(let page=1;page<=7;page++){
 const query="/wp-json/wp/v2/posts?status=publish&per_page=100&page="+page+
   "&_fields=id,slug,title,categories,link,status";
 const response=await fetch(origin+query,{
  headers:{"Accept":"application/json","Cache-Control":"no-cache"},
  signal:AbortSignal.timeout(30000)
 });
 if(response.status===400){
  const bad=await response.json();
  if(bad.code==="rest_post_invalid_page_number")break;
 }
 assert.equal(response.status,200,"Cannot enumerate published archive "+page);
 const batch=await response.json();
 assert.ok(Array.isArray(batch),"REST did not return list");
 pages.push(...batch);
 if(batch.length<100)break;
}
assert.equal(new Set(pages.map(p=>p.id)).size,pages.length,"Duplicate REST ID");
const olderCats=new Set([1161,11,1159,1162]);
const groups={};let offTopicRemaining=[];
const classified=pages.map(p=>{
 const cats=(p.categories||[]).map(id=>Number(id));
 for(const id of cats)groups[categories[id]||String(id)]=(groups[categories[id]||String(id)]||0)+1;
 if(cats.some(id=>olderCats.has(id)))offTopicRemaining.push(p.id);
 const title=(p.title?.rendered||"").replace(/<[^>]*>/g,"");
 const seniorWords=/senior|staře|stár|rehabilit|pečov|kompenzač|chodít|postel|hygien|madl|bezpečn|bariér|invalid|vozík|soběstač|schodiš|koupeln/i;
 const likelyRelevant=seniorWords.test(title);
 return {id:p.id,slug:p.slug,title,categories:cats,possibleRelevance:likelyRelevant,link:p.link};
});
const possible=classified.filter(p=>p.possibleRelevance);
const notRelevant=classified.filter(p=>!p.possibleRelevance);
const report={
 release:"0.8.177 (expected, not asserted here)",
 publishCount:classified.length,
 categories:groups,
 offTopicRemaining,
 protectedPost3638:classified.some(p=>p.id===3638),
 potentialRelevant:possible.map(p=>({id:p.id,title:p.title,categories:p.categories})),
 remainingByCategoryAndTitle:notRelevant.map(p=>({id:p.id,slug:p.slug,title:p.title,categories:p.categories})),
 caveat:"Title keyword is a screening hint only, not GSC indexation, traffic, expertise or a protected content classification."
};
const old=await fetch(origin+"/solarni-panely-a-jejich-prinos-pro-ekologickou-dopravu/",{redirect:"manual",signal:AbortSignal.timeout(20000)});
report.trashedSolarSampleHttp=old.status;
const ready=await request("/wp-json/zaprazi/v1/affiliate-readiness");
report.liveRelease=ready.content.release;
report.runtimeIntegrity=ready.content.integrity;
report.affiliateConfigured=ready.content.configured_total;
console.log("ARCHIVE_REMAINING_SUMMARY "+JSON.stringify({
 published:classified.length,categories:groups,offTopicRemaining,protectedPost3638:report.protectedPost3638,
 possibleRelevantCount:possible.length,nonmatchingCount:notRelevant.length,
 trashedSolarSampleHttp:report.trashedSolarSampleHttp,
 release:report.liveRelease,integrity:report.runtimeIntegrity,affiliateSlots:report.affiliateConfigured
}));
console.log("ARCHIVE_REMAINING_POTENTIAL "+JSON.stringify(report.potentialRelevant));
console.log("ARCHIVE_REMAINING_ALL "+JSON.stringify(report.remainingByCategoryAndTitle));
if(classified.length>350)throw new Error("New legacy batch or REST unexpected count; inspect urgently");
if(!report.protectedPost3638)throw new Error("Protected senior-related post 3638 is not published");
if(offTopicRemaining.some(id=>id!==3638))throw new Error("Unexpected off-topic posts still public: "+offTopicRemaining);
if(old.status!==404&&old.status!==410)throw new Error("Trashed sample still available: "+old.status);
