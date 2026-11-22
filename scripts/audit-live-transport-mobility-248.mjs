#!/usr/bin/env node
/** Exact 0.8.248+ WordPress read-only acceptance of two safe contextual journeys. */
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {SOURCE_THEME_RELEASE} from "./lib/live-release.mjs";
import {readReleaseMarkers} from "./audit-live-release-coherence.mjs";
const ORIGIN="https://zaprazi.cz";
const TRANSPORT=ORIGIN+"/prevoz-seniora-k-lekari/";
const STAIRS=ORIGIN+"/schody-pro-seniora-doma/";
const WALKER=ORIGIN+"/choditka-pro-seniory/#vyber-typu";
const TRANSPORT_ACTION=ORIGIN+"/prevoz-seniora-k-lekari/#vyber-dopravy";
const invalid=message=>{throw Error("TRANSPORT_MOBILITY_248: "+message);};
function versionGte(a,b){
  const re=/^\d+\.\d+\.\d+$/;
  if(!re.test(a)||!re.test(b))invalid("invalid release");
  const x=a.split(".").map(Number),y=b.split(".").map(Number);
  for(let i=0;i<3;i++)if(x[i]!==y[i])return x[i]>y[i];
  return true;
}
function anchors(fragment){
  return [...fragment.matchAll(/<a\b[^>]*>/gi)].map(m=>m[0]);
}
function linkIs(tag,target){
  const m=tag.match(/\bhref\s*=\s*(["'])(.*?)\1/i);
  return !!m&&m[2]===target;
}
export function verifyTransportMobility248({transport,stairs},expected){
  if(!versionGte(expected,"0.8.248"))invalid("requires 0.8.248+ source release");
  for(const html of [transport,stairs]){
    if(typeof html!=="string"||readReleaseMarkers(html).release!==expected)
      invalid("mixed release or invalid integrity");
  }
  const hero=transport.match(/<section\b[^>]*class=["'][^"']*\bzp-hero\b[^"']*["'][^>]*>[\s\S]*?<\/section>/i)?.[0];
  if(!hero)invalid("transport hero missing");
  const matches=[...hero.matchAll(/<p\b[^>]*class=["'][^"']*\bzp-transport-mobility-route\b[^"']*["'][^>]*>[\s\S]*?<\/p>/gi)];
  if(matches.length!==1)invalid("exact transport first-screen note missing or duplicated");
  const note=matches[0][0],safeLinks=anchors(note);
  if(safeLinks.length!==1||!linkIs(safeLinks[0],WALKER))
    invalid("transport first-screen action is not exact safe walking-type guide");
  for(const phrase of ["dojít bezpečně k autu nebo do ordinace",
    "bez fyzického přidržování","Chodítko ale neřeší nemožnost bezpečně nastoupit do auta",
    "odborné posouzení"])
    if(!note.includes(phrase))invalid("missing transport safety context");
  const cards=[...stairs.matchAll(/<article\b[^>]*class=["'][^"']*\bzp-decision-card\b[^"']*["'][^>]*>[\s\S]*?<\/article>/gi)]
    .map(m=>m[0]);
  const cardMatches=cards.filter(card=>card.includes("<h3>4. Před propuštěním z nemocnice vše domluvte</h3>"));
  if(cardMatches.length!==1)invalid("stairs discharge card missing");
  const card=cardMatches[0],hrefs=anchors(card);
  if(hrefs.filter(tag=>linkIs(tag,TRANSPORT_ACTION)).length!==1||
     card.split(TRANSPORT_ACTION).length!==2)
    invalid("stairs-to-transport route absent or duplicated");
  for(const phrase of ["schody komplikují i cestu na plánované vyšetření",
     "automaticky nezakládají nárok na hrazenou sanitku",
     "rozhoduje lékař"])
    if(!card.includes(phrase))invalid("stairs transport safety context missing");
  if(/data-zp-merchant-link|data-zp-affiliate-target|affiliateMap|click\.php|utm_|[?&]answers=/i.test(note+card)||
     safeLinks.some(tag=>/\b(?:target\s*=\s*["']_blank|rel\s*=\s*["'][^"']*sponsored)/i.test(tag)))
    invalid("contextual guide cannot bypass fit or transmit answers");
  return {status:"verified",release:expected,source:"public_read_only",
    transport_to_walker:"verified",stairs_to_transport:"verified",
    get_requests:2,merchant_requests:0,posts:0,wordpress_writes:0};
}
export async function auditLiveTransportMobility248(fetchImpl=fetch,expected=SOURCE_THEME_RELEASE){
  if(!versionGte(expected,"0.8.248"))
    return {status:"not_applicable",source_release:expected,wordpress_writes:0};
  const pages=[];
  for(const url of [TRANSPORT,STAIRS]){
    const response=await fetchImpl(url,{
      method:"GET",redirect:"error",cache:"no-store",
      headers:{Accept:"text/html","Cache-Control":"no-cache"},
      signal:AbortSignal.timeout(20000)
    });
    if(response?.status!==200||response.url&&response.url!==url)
      invalid("public canonical HTTP read failed");
    pages.push(await response.text());
  }
  return verifyTransportMobility248({transport:pages[0],stairs:pages[1]},expected);
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
  auditLiveTransportMobility248().then(result=>{
    process.stdout.write("ZP_LIVE_TRANSPORT_MOBILITY_248 "+JSON.stringify(result)+"\n");
  }).catch(()=>{
    process.stderr.write("ZP_LIVE_TRANSPORT_MOBILITY_248_FAILED: exact safe live handoffs or release integrity not verified.\n");
    process.exitCode=1;
  });
}
