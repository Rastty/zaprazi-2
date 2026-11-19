import test from "node:test";
import assert from "node:assert/strict";
import {verifyBasicConsentQueue,safeConsentAuditFailure} from "../scripts/lib/basic-consent-audit.mjs";

const LOCATION="https://zaprazi.cz/choditka-pro-seniory/";
function acceptedQueue(){
  return [
    ["consent","default",{
      analytics_storage:"denied",ad_storage:"denied",
      ad_user_data:"denied",ad_personalization:"denied"
    }],
    ["consent","update",{analytics_storage:"granted"}],
    ["js","2026-11-19T00:00:00.000Z"],
    ["config","G-TEST123",{
      send_page_view:true,page_location:LOCATION,page_referrer:"",
      allow_google_signals:false,allow_ad_personalization_signals:false
    }]
  ];
}

test("explicit basic consent precedes anonymous GA4 configuration",()=>{
  assert.deepEqual(verifyBasicConsentQueue(acceptedQueue(),LOCATION),{
    consentMode:"basic",adPurposes:"denied",pageLocation:"sanitized",anonymousEvents:0
  });
  const calls=acceptedQueue();
  calls.push(["event","builder_start"]);
  assert.equal(verifyBasicConsentQueue(calls,LOCATION).anonymousEvents,1);
});

test("browser error diagnostics allow only fixed stages, never raw data",()=>{
  assert.equal(safeConsentAuditFailure(new Error("CONSENT_SCENARIO_unknown_initial_snapshot")),
    "CONSENT_SCENARIO_unknown_initial_snapshot");
  assert.equal(safeConsentAuditFailure(new Error("CONSENT_SCENARIO_denied_preconsent_silence")),
    "CONSENT_SCENARIO_denied_preconsent_silence");
  assert.equal(safeConsentAuditFailure(new Error("CONSENT_SCENARIO_unknown_private-data")),
    "CONSENT_STAGE_UNCLASSIFIED");
  assert.equal(safeConsentAuditFailure(new Error("value=private answers and user URL")),
    "CONSENT_STAGE_UNCLASSIFIED");
});

for(const [scenario,mutate] of [
  ["no consent default",c=>c.shift()],
  ["late default",c=>c.reverse()],
  ["ad storage granted",c=>c[0][2].ad_storage="granted"],
  ["ad personalization granted",c=>c[1][2].ad_personalization="granted"],
  ["unknown analytics consent",c=>c[1][2].analytics_storage="denied"],
  ["query string in GA4 location",c=>c[3][2].page_location=LOCATION+"?s=private"],
  ["full referrer",c=>c[3][2].page_referrer="https://example.com/private"],
  ["advertising signals",c=>c[3][2].allow_google_signals=true],
  ["unapproved metadata",c=>c[3][2].user_id="fake"],
  ["GA4 event properties",c=>c.push(["event","builder_start",{answer:"private"}])],
  ["unapproved event",c=>c.push(["event","purchase"])],
  ["missing date",c=>c[2].pop()],
  ["extra config arg",c=>c[3].push("extra")],
  ["too many calls",c=>{for(let i=0;i<13;i++)c.push(["event","builder_start"])}]
]){
  test("rejects "+scenario,()=>{
    const calls=acceptedQueue();
    mutate(calls);
    assert.throws(()=>verifyBasicConsentQueue(calls,LOCATION));
  });
}
