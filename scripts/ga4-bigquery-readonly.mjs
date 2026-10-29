#!/usr/bin/env node
/**
 * Generate three read-only, aggregate-only BigQuery GA4 export queries.
 * No credentials, network, raw event rows, user identifiers or health answers.
 */
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";

// Flag suspicious parameter NAMES only. Values are never selected or returned.
// RE2-compatible and deliberately conservative; nonzero means manual review.
export const SENSITIVE_KEY_PATTERN = "(?:^|[_-])(?:answer|answers|odpoved[a-z]*|question[a-z]*|otazk[a-z]*|symptom[a-z]*|diagnos[a-z]*|health[a-z]*|zdrav[a-z]*|condition|disability|mobility|mobilita|pain|bolest|fall|pady|birth|narozeni|rodne|email|phone|telefon|address|adresa|jmeno|patient|pacient|fit|choice|selected)(?:$|[_0-9-])|^q[0-9]+(?:$|[_-])";

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
  // Exact site scope: a GA4 property can collect several websites.
  // Never silently attribute other domains' events to Zápraží.
  const targetHostSql = "EXISTS (SELECT 1 FROM UNNEST(event_params) p "+
    "WHERE p.key = 'page_location' AND REGEXP_CONTAINS("+
    "LOWER(COALESCE(p.value.string_value,'')), "+
    "r'^https?://(?:www\\.)?zaprazi\\.cz(?:[/:?#]|$)'))";
  const funnelNames = funnelEvents.map(e=>"'"+e+"'").join(",");
  const funnel = [
    "-- Aggregate GA4 funnel: only explicit analytics_storage=Yes; NOT unique users or approved orders.",
    "-- No/Unset/null consent states are excluded pending implementation verification.",
    "-- Missing daily export tables or delayed GA4 export can make counts incomplete.",
    "SELECT", "  COUNT(*) AS total_events,",
    funnelEvents.map(count).join(",\n"),
    "FROM "+source, "WHERE "+where,
    "  AND privacy_info.analytics_storage = 'Yes'",
    "  AND "+targetHostSql+";"
  ].join("\n");
  const privacy = [
    "-- Privacy canary: only aggregated counts, NEVER raw URLs, search text, answers or IDs.",
    "-- Any nonzero risk counter requires investigation; zero cannot prove consent compliance.",
    "WITH inspected AS (",
    "  SELECT event_name,",
    "    REGEXP_CONTAINS(LOWER(event_name), r'"+SENSITIVE_KEY_PATTERN+"') AS suspicious_event_name,",
    "    EXISTS (SELECT 1 FROM UNNEST(event_params) p",
    "      WHERE p.key IN ('search_term','link_url','link_text','form_id',",
    "        'form_name','form_destination','file_name','file_extension')) AS risky_auto_params,",
    "    EXISTS (SELECT 1 FROM UNNEST(event_params) p",
    "      WHERE p.key IN ('page_location','page_referrer')",
    "        AND REGEXP_CONTAINS(COALESCE(p.value.string_value,''), r'[?#]')) AS url_query_or_fragment,",
    "    EXISTS (SELECT 1 FROM UNNEST(event_params) p",
    "      WHERE p.key = 'page_location'",
    "        AND REGEXP_CONTAINS(COALESCE(p.value.string_value,''), r'(?i)[?&]s=')) AS search_page_seen,",
    "    EXISTS (SELECT 1 FROM UNNEST(event_params) p",
    "      WHERE REGEXP_CONTAINS(LOWER(p.key), r'"+SENSITIVE_KEY_PATTERN+"')) AS suspicious_answer_param_key,",
    "    IFNULL(ARRAY_LENGTH(user_properties),0) > 0 AS has_user_properties,",
    "    EXISTS (SELECT 1 FROM UNNEST(user_properties) p",
    "      WHERE REGEXP_CONTAINS(LOWER(p.key), r'"+SENSITIVE_KEY_PATTERN+"')) AS suspicious_user_property_key",
    "  FROM "+source, "  WHERE "+where, ")",
    "SELECT COUNT(*) AS inspected_events,",
    "  COUNTIF(risky_auto_params) AS events_with_risky_auto_params,",
    "  COUNTIF(url_query_or_fragment) AS events_with_url_query_or_fragment,",
    "  COUNTIF(search_page_seen) AS events_with_search_page_url,",
    "  COUNTIF(suspicious_answer_param_key) AS events_with_sensitive_param_keys,",
    "  COUNTIF(suspicious_event_name) AS events_with_sensitive_event_names,",
    "  COUNTIF(has_user_properties) AS events_with_user_properties,",
    "  COUNTIF(suspicious_user_property_key) AS events_with_sensitive_user_property_keys,",
    "  COUNTIF(event_name = 'view_search_results') AS automatic_search_events,",
    "  COUNTIF(event_name IN ('click','file_download','form_start','form_submit')) AS automatic_interaction_events",
    "FROM inspected;"
  ].join("\n");
  // Only aggregate host integrity counts: never emit actual foreign hosts or URLs.
  // This query intentionally includes the whole property, unlike the site-scoped funnel.
  const sourceIntegrity = [
    "-- Verify property domain BEFORE using funnel metrics in Growth Graph.",
    "-- Do not report raw URLs, hostnames, health answers or user identifiers.",
    "WITH inspected AS (",
    "  SELECT event_name,",
    "    COALESCE(privacy_info.analytics_storage, 'Unset') AS analytics_storage,",
    "    LOWER(REGEXP_EXTRACT(",
    "      (SELECT ANY_VALUE(p.value.string_value) FROM UNNEST(event_params) p",
    "       WHERE p.key = 'page_location'),",
    "      r'^https?://([^/:?#]+)')) AS host",
    "  FROM "+source,
    "  WHERE "+where,
    ")",
    "SELECT COUNT(*) AS total_events,",
    "  COUNTIF(analytics_storage = 'Yes') AS events_with_analytics_consent,",
    "  COUNTIF(analytics_storage = 'No') AS events_without_analytics_consent,",
    "  COUNTIF(analytics_storage NOT IN ('Yes','No')) AS events_with_unset_or_unknown_analytics_consent,",
    "  COUNTIF(host IN ('zaprazi.cz','www.zaprazi.cz') AND analytics_storage = 'Yes') AS zaprazi_events_with_analytics_consent,",
    "  COUNTIF(host IN ('zaprazi.cz','www.zaprazi.cz') AND analytics_storage != 'Yes') AS zaprazi_events_without_explicit_analytics_consent,",
    "  COUNTIF(host IN ('zaprazi.cz','www.zaprazi.cz')) AS events_on_zaprazi_host,",
    "  COUNTIF(host IS NULL) AS events_without_valid_page_location,",
    "  COUNTIF(host IS NOT NULL AND host NOT IN ('zaprazi.cz','www.zaprazi.cz')) AS events_on_other_hosts,",
    "  COUNTIF(event_name IN ("+funnelNames+") AND host IS NULL) AS funnel_events_without_valid_page_location,",
    "  COUNTIF(event_name IN ("+funnelNames+") AND host IS NOT NULL AND host NOT IN ('zaprazi.cz','www.zaprazi.cz')) AS funnel_events_on_other_hosts",
    "FROM inspected;"
  ].join("\n");
  return {funnel, privacy, sourceIntegrity};
}

export function ga4Cli(args) {
  if (args.length !== 4) throw new Error("Usage: node scripts/ga4-bigquery-readonly.mjs PROJECT PROPERTY_ID START_YYYYMMDD END_YYYYMMDD");
  const {funnel, privacy, sourceIntegrity} = buildGa4ReadOnlyQueries({project:args[0],propertyId:args[1],start:args[2],end:args[3]});
  return sourceIntegrity + "\n\n" + funnel + "\n\n" + privacy + "\n";
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try { process.stdout.write(ga4Cli(process.argv.slice(2))); }
  catch (error) { process.stderr.write("GA4_SQL_FAILED: " + error.message + "\n"); process.exitCode=1; }
}
