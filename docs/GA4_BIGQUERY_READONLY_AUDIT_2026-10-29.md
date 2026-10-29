# GA4 → BigQuery: bezpečné agregované měření Zápraží

**29. 10. 2026 — připravený read-only nástroj, nikoliv potvrzená data ani deploy.**

## Proč

Vlastník připojil GA4 export do Google BigQuery. Dataset `prometheus-503317.analytics_527349118` je však na základě kontrolního SQL **Klix.cz**, nikoliv Zápraží. Zápraží má mít vlastní `analytics_<GA4_PROPERTY_ID>`; před prvním exportem nebo při neúplném denním exportu neinterpretovat chybějící řádky jako nulu. Nepřebírat čísla Klixu do Zápraží Growth Graphu.

## Použití

Po prvním denním exportu Zápraží zjistit jeho **vlastní** číselné GA4 property ID. Spustit lokálně:

~~~sh
node scripts/ga4-bigquery-readonly.mjs prometheus-503317 <ZAPRAZI_PROPERTY_ID> 20261029 20261029
~~~

Nástroj vypíše **tři pouze čtecí BigQuery Standard SQL dotazy** pro ruční spuštění v konzoli: (1) kontrolu integrity domény GA4 property, (2) součty page_view a povolených funnel událostí **pouze pro přesný host zaprazi.cz / www.zaprazi.cz**, (3) součty možných privacy incidentů v celé GA4 property včetně podezřelých názvů vlastních event parametrů a přítomnosti GA4 user properties. Dotazy nevracejí syrové URL, vyhledávací výrazy, odpovědi, osobní identifikátory ani uživatelské řádky. Vstupy jsou validované; interval je nejvýše 31 dní. Přímý přístup k BigQuery zde není nastaven a skript nemá žádné přihlašovací údaje.

## Povinná kontrola domény před vyhodnocením

1. Spustit nejprve první SQL (source integrity). Vrací jen agregované počty `events_on_zaprazi_host`, `events_on_other_hosts`, `events_without_valid_page_location` a odpovídající počty pro funnel. **Nikdy nevypisuje cizí hostnames ani surové URL.**
2. Pokud `events_on_other_hosts > 0`, property sdílí více domén nebo má chybné tagování; **nesčítat všechny eventy jako návštěvnost Zápraží**. Pokud `funnel_events_without_valid_page_location > 0`, část funnelu nemá ověřitelný host a nebude v doménově filtrovaných výsledcích.
3. Druhé SQL používá fail-closed filtr na `page_location` s přesným hostem `zaprazi.cz` nebo `www.zaprazi.cz`; `klix.cz`, podobné domény a události bez `page_location` se do funnelu nedostanou. Vzorek je proto případně neúplný, nikdy jej nedopočítávat na celou populaci.
4. Třetí SQL prověřuje privacy signály **napříč celou property**, protože únik citlivých parametrů na jiné doméně by se neměl skrýt doménovým filtrem. Ani nulové výsledky nejsou důkazem správně nastaveného souhlasu.

Před zápisem do Growth Graphu ověřit, že jde o vlastní GA4 property Zápraží, že je denní export úplný a že funnel události mají `page_location`. Pouhé číselné ID datasetu toto nepotvrzuje. Nástroj nic neodesílá a nic nepublikuje.

## Interpretace

- `builder_start`, `builder_complete`, `recommendation_view` a `merchant_click` jsou počty **událostí v souhlasící části provozu**, nikoli počet unikátních lidí. Počty mohou být neúplné kvůli consentu, opožděnému exportu nebo jiným GA4 limitům.
- `events_with_risky_auto_params`, `events_with_url_query_or_fragment`, `events_with_search_page_url`, `automatic_search_events` a `automatic_interaction_events` jsou **signály k prověření**. Nenulový počet znamená audit GA4 Enhanced Measurement, tagů a consent adapteru; nezobrazovat syrové hodnoty v reportu. Nulový počet **nedokazuje**, že nebylo měřeno bez souhlasu nebo že jsou všechny události bezpečné.
- Počty `events_with_sensitive_param_keys`, `events_with_sensitive_event_names`, `events_with_user_properties` a `events_with_sensitive_user_property_keys` hlídají další kanály úniku: vlastní event parametry (např. `answer_1`, `health_profile`), **názvy událostí** (např. `answer_2_yes`, `q3_yes`) a GA4 user properties. Kontrola používá **jen názvy**, nikdy hodnoty parametrů nebo vlastností; z názvů událostí vrací pouze agregovaný počet, nikoli jejich výpis. Jakýkoliv nenulový výsledek vyžaduje kontrolu tagování a odstranění případného odesílání odpovědí či profilů. Nulové hodnoty nevylučují netypicky pojmenované klíče či události ani problém souhlasu. **Nepřepisovat odpovědi ani hodnoty do reportu, issue nebo logu.**
- `merchant_click` nebo `affiliate_click` není schválená objednávka. Schválené provize pouze ze síťových výpisů; GSC pro organické kliky samostatně.
- Pokud BigQuery Sandbox maže tabulky po ~60 dnech, před delším srovnáváním upravit retenci datasetu a stávajících tabulek.

Do `config/growth-state.json` se smí zapsat pouze **doložené agregáty za jednotné 28denní období** a odpovídající HTTPS důkaz (`metricSources`). Žádné zdravotní odpovědi ani URL s parametry. Produkční WP deploy tento nástroj nevyžaduje; jde o bezpečné testovatelné doplnění měřicího řetězce.
