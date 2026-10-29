#!/usr/bin/env node
/**
 * Generate two read-only, aggregate-only BigQuery GA4 export queries.
 * No credentials, network, raw event rows, user identifiers or health answers.
 */
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";

const funnelEvents = Object.freeze([
  "page_view", "builder_start", "builder_complete", "recommendation_view",
  "product_click", "merchant_click", "affiliate_click", "next_step_click"
]);

function checkedDay(day) {
  if (!/^\d{8}$/.test(day)) throw new Error("Date must be YYYYMMDD");
  const iso = day.slice(0,4)+"-"+day.slice(4,6)+"-"+day.slice(6,8);
  const date = new Date(iso+"T00:00:00Z");
  if (!Number.isFinite(date.valueOf()) || date.toISOString().slice(0,10) !== iso)
    throw new Error("Invalid calendar date");
  return date;
}

export function buildGa4ReadOnlyQueries({project, propertyId, start, end}) {
  if (!/^[a-z][a-z0-9-]{4,61}[a-z0-9]$/.test(project))
    throw new Error("Invalid Google Cloud project ID");
  if (!/^[1-9]\d{5,15}$/.test(propertyId))
    throw new Error("Invalid numeric GA4 property ID");
  const first = checkedDay(start), last = checkedDay(end);
  const days = (last - first) / 86400000 + 1;
  if (days < 1 || days > 31) throw new Error("Choose a 1–31 day inclusive window");
  const source = String.fromCharCode(96)+project+".analytics_"+propertyId+".events_*"+String.fromCharCode(96);
  const where = "_TABLE_SUFFIX BETWEEN '"+start+"' AND '"+end+"'";
  const count = event => "  COUNTIF(event_name = '"+event+"') AS "+event;
  const funnel = [
    "-- Aggregate GA4 funnel; counts are consented events, NOT unique users or approved orders.",
    "-- Missing daily export tables or delayed GA4 export can make counts incomplete.",
    "SELECT", "  COUNT(*) AS total_events,",
    funnelEvents.map(count).join(",\n"),
    "FROM "+source, "WHERE "+where+";"
  ].join("\n");
  const privacy = [
    "-- Privacy canary: only aggregated counts, NEVER raw URLs, search text, answers or IDs.",
    "-- Any nonzero risk counter requires investigation; zero cannot prove consent compliance.",
    "WITH inspected AS (",
    "  SELECT event_name,",
    "    EXISTS (SELECT 1 FROM UNNEST(event_params) p",
    "      WHERE p.key IN ('search_term','link_url','link_text','form_id',",
    "        'form_name','form_destination','file_name','file_extension')) AS risky_auto_params,",
    "    EXISTS (SELECT 1 FROM UNNEST(event_params) p",
    "      WHERE p.key IN ('page_location','page_referrer')",
    "        AND REGEXP_CONTAINS(COALESCE(p.value.string_value,''), r'[?#]')) AS url_query_or_fragment,",
    "    EXISTS (SELECT 1 FROM UNNEST(event_params) p",
    "      WHERE p.key = 'page_location'",
    "        AND REGEXP_CONTAINS(COALESCE(p.value.string_value,''), r'(?i)[?&]s=')) AS search_page_seen",
    "  FROM "+source, "  WHERE "+where, ")",
    "SELECT COUNT(*) AS inspected_events,",
    "  COUNTIF(risky_auto_params) AS events_with_risky_auto_params,",
    "  COUNTIF(url_query_or_fragment) AS events_with_url_query_or_fragment,",
    "  COUNTIF(search_page_seen) AS events_with_search_page_url,",
    "  COUNTIF(event_name = 'view_search_results') AS automatic_search_events,",
    "  COUNTIF(event_name IN ('click','file_download','form_start','form_submit')) AS automatic_interaction_events",
    "FROM inspected;"
  ].join("\n");
  return {funnel, privacy};
}

export function ga4Cli(args) {
  if (args.length !== 4) throw new Error("Usage: node scripts/ga4-bigquery-readonly.mjs PROJECT PROPERTY_ID START_YYYYMMDD END_YYYYMMDD");
  const {funnel, privacy} = buildGa4ReadOnlyQueries({project:args[0],propertyId:args[1],start:args[2],end:args[3]});
  return funnel + "\n\n" + privacy + "\n";
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try { process.stdout.write(ga4Cli(process.argv.slice(2))); }
  catch (error) { process.stderr.write("GA4_SQL_FAILED: " + error.message + "\n"); process.exitCode=1; }
}
