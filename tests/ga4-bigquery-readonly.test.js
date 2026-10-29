import test from "node:test";
import assert from "node:assert/strict";
import {buildGa4ReadOnlyQueries,ga4Cli} from "../scripts/ga4-bigquery-readonly.mjs";

const options = {project:"prometheus-503317",propertyId:"527349118",start:"20261026",end:"20261027"};

test("BigQuery SQL reads only selected GA4 daily export and returns aggregate counts", () => {
  const {funnel,privacy,sourceIntegrity}=buildGa4ReadOnlyQueries(options);
  for (const sql of [funnel,privacy,sourceIntegrity]) {
    assert.match(sql,/`prometheus-503317\.analytics_527349118\.events_\*`/);
    assert.match(sql,/_TABLE_SUFFIX BETWEEN '20261026' AND '20261027'/);
    assert.doesNotMatch(sql,/\b(?:INSERT|UPDATE|DELETE|MERGE|CREATE|DROP|EXPORT\s+DATA)\b/i);
    assert.doesNotMatch(sql,/user_pseudo_id|user_id|geo\.|device\.|traffic_source\./);
  }
  for (const event of ["builder_start","builder_complete","recommendation_view","merchant_click"])
    assert.match(funnel,new RegExp("COUNTIF\(event_name = '"+event+"'\)"));
  // A property may accidentally include other websites: only Zápraží events
  // with an exact page_location hostname can enter the funnel.
  assert.match(funnel,/AND EXISTS \(SELECT 1 FROM UNNEST\(event_params\) p/);
  assert.ok(funnel.includes("zaprazi\\.cz"));
  assert.ok(funnel.includes("www\\."));
  assert.doesNotMatch(funnel,/klix\.cz/);
  // The property-wide source audit must not expose raw URLs or other hosts.
  assert.match(sourceIntegrity,/events_on_zaprazi_host/);
  assert.match(sourceIntegrity,/events_without_valid_page_location/);
  assert.match(sourceIntegrity,/events_on_other_hosts/);
  assert.match(sourceIntegrity,/funnel_events_without_valid_page_location/);
  assert.match(sourceIntegrity,/funnel_events_on_other_hosts/);
  assert.doesNotMatch(sourceIntegrity,/GROUP BY|SELECT\s+host\b|SELECT\s+\*/i);
  assert.match(ga4Cli(Object.values(options)),/Verify property domain BEFORE using funnel metrics/);
  assert.match(privacy,/search_term/);
  assert.match(privacy,/url_query_or_fragment/);
  assert.match(privacy,/automatic_search_events/);
  assert.doesNotMatch(privacy,/SELECT\s+\*/i);
  assert.match(ga4Cli(Object.values(options)),/FROM inspected;/);
});

test("Reject SQL injection, invalid dates and oversized scans", () => {
  for (const change of [
    {project:"prometheus-503317;DROP"},
    {propertyId:"527349118 OR 1=1"},
    {propertyId:"analytics_527349118"},
    {start:"20260230"},
    {end:"20261131"},
    {start:"20261028",end:"20261027"},
    {start:"20260101",end:"20261027"}
  ]) assert.throws(()=>buildGa4ReadOnlyQueries({...options,...change}));
  assert.throws(()=>ga4Cli(["only-one-arg"]),/Usage/);
});
