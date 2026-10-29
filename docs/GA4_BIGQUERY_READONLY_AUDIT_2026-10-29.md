# GA4 → BigQuery: bezpečné agregované měření Zápraží

**29. 10. 2026 — připravený read-only nástroj, nikoliv potvrzená data ani deploy.**

## Proč

Vlastník připojil GA4 export do Google BigQuery. Dataset `prometheus-503317.analytics_527349118` je však na základě kontrolního SQL **Klix.cz**, nikoliv Zápraží. Zápraží má mít vlastní `analytics_<GA4_PROPERTY_ID>`; před prvním exportem nebo při neúplném denním exportu neinterpretovat chybějící řádky jako nulu. Nepřebírat čísla Klixu do Zápraží Growth Graphu.

## Použití

Po prvním denním exportu Zápraží zjistit jeho **vlastní** číselné GA4 property ID. Spustit lokálně:

~~~sh
node scripts/ga4-bigquery-readonly.mjs prometheus-503317 <ZAPRAZI_PROPERTY_ID> 20261029 20261029
~~~

Nástroj vypíše **dva pouze čtecí BigQuery Standard SQL dotazy** pro ruční spuštění v konzoli: (1) součty page_view a povolených funnel událostí, (2) součty možných privacy incidentů. Dotazy nevracejí syrové URL, vyhledávací výrazy, odpovědi, osobní identifikátory ani uživatelské řádky. Vstupy jsou validované; interval je nejvýše 31 dní. Přímý přístup k BigQuery zde není nastaven a skript nemá žádné přihlašovací údaje.

## Interpretace

- `builder_start`, `builder_complete`, `recommendation_view` a `merchant_click` jsou počty **událostí v souhlasící části provozu**, nikoli počet unikátních lidí. Počty mohou být neúplné kvůli consentu, opožděnému exportu nebo jiným GA4 limitům.
- `events_with_risky_auto_params`, `events_with_url_query_or_fragment`, `events_with_search_page_url`, `automatic_search_events` a `automatic_interaction_events` jsou **signály k prověření**. Nenulový počet znamená audit GA4 Enhanced Measurement, tagů a consent adapteru; nezobrazovat syrové hodnoty v reportu. Nulový počet **nedokazuje**, že nebylo měřeno bez souhlasu nebo že jsou všechny události bezpečné.
- `merchant_click` nebo `affiliate_click` není schválená objednávka. Schválené provize pouze ze síťových výpisů; GSC pro organické kliky samostatně.
- Pokud BigQuery Sandbox maže tabulky po ~60 dnech, před delším srovnáváním upravit retenci datasetu a stávajících tabulek.

Do `config/growth-state.json` se smí zapsat pouze **doložené agregáty za jednotné 28denní období** a odpovídající HTTPS důkaz (`metricSources`). Žádné zdravotní odpovědi ani URL s parametry. Produkční WP deploy tento nástroj nevyžaduje; jde o bezpečné testovatelné doplnění měřicího řetězce.
