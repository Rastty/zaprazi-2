/**
 * Pure bounded verifier for the public, anonymous GA4 Basic Consent Mode queue.
 * Never receives raw questionnaire answers, merchant destinations or cookies.
 */
import assert from "node:assert/strict";

// This whitelist is the ONLY detail allowed into public GitHub Actions logs
// when a browser assertion fails. Never echo page bodies, raw dataLayer calls,
// storage values, event details, URLs, exception stacks or browser requests.
const CONSENT_SCENARIO_STAGES=new Set([
  "setup","navigation","initial_snapshot","preconsent_silence",
  "grant_click","grant_queue","anonymous_event","tag_request",
  "revoke_click","revoked_snapshot","request_boundary"
]);
export function safeConsentAuditFailure(error){
  const message=typeof error?.message==="string"?error.message:"";
  const matched=/^CONSENT_SCENARIO_(unknown|denied|granted)_([a-z_]+)$/.exec(message);
  if(matched&&CONSENT_SCENARIO_STAGES.has(matched[2]))return message;
  return "CONSENT_STAGE_UNCLASSIFIED";
}

export function verifyBasicConsentQueue(calls,expectedLocation){
  assert.ok(Array.isArray(calls)&&calls.length>=4&&calls.length<=16,
    "Unbounded or missing public consent queue");
  assert.ok(Array.isArray(calls[0])&&Array.isArray(calls[1]),
    "Consent entries are not ordered calls");
  const [defaults,grant,js,config]=calls;
  assert.equal(defaults[0],"consent");
  assert.equal(defaults[1],"default");
  assert.deepEqual(defaults[2],{
    analytics_storage:"denied",ad_storage:"denied",
    ad_user_data:"denied",ad_personalization:"denied"
  },"All four purposes must start denied");
  assert.equal(grant[0],"consent");
  assert.equal(grant[1],"update");
  assert.deepEqual(grant[2],{analytics_storage:"granted"},
    "Only analytics consent may be granted");
  assert.equal(js[0],"js");
  assert.equal(js.length,2,"GA4 initialization must be a single timestamp");
  assert.ok(Number.isFinite(Date.parse(js[1])),"Invalid GA4 initialization date");
  assert.equal(config[0],"config");
  assert.equal(config.length,3,"No extra GA4 configuration parameters");
  assert.equal(typeof config[1],"string");
  assert.match(config[1],/^G-[A-Z0-9]+$/i);
  const options=config[2];
  assert.ok(options&&typeof options==="object"&&!Array.isArray(options));
  assert.equal(options.page_location,expectedLocation);
  assert.equal(options.page_referrer,"","First-party QA page must have no referrer");
  assert.equal(options.send_page_view,true);
  assert.equal(options.allow_google_signals,false);
  assert.equal(options.allow_ad_personalization_signals,false);
  assert.deepEqual(Object.keys(options).sort(),[
    "allow_ad_personalization_signals","allow_google_signals",
    "page_location","page_referrer","send_page_view"
  ]);
  for(const call of calls.slice(4)){
    assert.ok(Array.isArray(call)&&call[0]==="event"&&call.length===2,
      "GA4 event must be anonymous and name-only");
    assert.ok(["builder_start","builder_complete"].includes(call[1]),
      "Unexpected event in isolated public smoke");
  }
  return {consentMode:"basic",adPurposes:"denied",pageLocation:"sanitized",
    anonymousEvents:calls.length-4};
}
