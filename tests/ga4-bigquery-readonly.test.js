import test from "node:test";
import assert from "node:assert/strict";
import {buildGa4ReadOnlyQueries,ga4Cli} from "../scripts/ga4-bigquery-readonly.mjs";

const options = {project:"prometheus-503317",propertyId:"527349118",start:"20261026",end:"20261027"};

test("BigQuery SQL reads only selected GA4 daily export and returns aggregate counts", () => {
  const {funnel,privacy}=buildGa4ReadOnlyQueries(options);
  for (const sql of [funnel,privacy]) {
    assert.match(sql,/`prometheus-503317\.analytics_527349118\.events_\*`/);
    assert.match(sql,/_TABLE_SUFFIX BETWEEN '20261026' AND '20261027'/);
    assert.doesNotMatch(sql,/\b(?:INSERT|UPDATE|DELETE|MERGE|CREATE|DROP|EXPORT\s+DATA)\b/i);
    assert.doesNotMatch(sql,/user_pseudo_id|user_id|geo\.|device\.|traffic_source\./);
  }
  for (const event of ["builder_start","builder_complete","recommendation_view","merchant_click"])
    assert.match(funnel,new RegExp("COUNTIF\\(event_name = '"+event+"'\\)"));
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
