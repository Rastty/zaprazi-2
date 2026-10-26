# Zápraží — nový problémový SEO průvodce: nastupování seniora do auta

Datum: 26.10.2026. Staging: `/nastupovani-seniora-do-auta/`, verze pro vývoj 0.8.170; živé nasazení této nové URL zatím nepotvrzeno.

## Oddělení záměrů

- Nový intent: senior/rodič se nedokáže bezpečně posadit, natočit nebo přesunout nohy do auta. Nejde o převážení kompenzační pomůcky v kufru.
- Stávající URL `/invalidni-vozik-do-auta/` řeší převoz, rozměry a hmotnost vozíku. Nový průvodce se s ní kontextově propojuje, nemá ji nahrazovat ani přesměrovávat.
- Uživatelská cesta: *problém -> konkrétní fáze přesunu -> bezpečnost -> typ podpory -> checklist auta -> případná pomůcka/odborná pomoc*.
- Neprodejní rozlišení: sedání/vstávání vs. rotace vs. přenesení nohou vs. úchop. Neexistuje jedna nejlepší pomůcka pro všechny.

## Kvalitativní tržní a SERP evidence

- Nartis.cz publikuje komerční průvodce o otočném podsedáku s výrazně produktovými tvrzeními: https://www.nartis.cz/blog/vystupovani-z-auta-bolest-kycli-otocny-podsedak/. To znamená reálnou českou konkurenci. Zápraží musí být přesnější a bezpečnější než produktový reklamní popis.
- Actimed.cz prodává přenosné madlo do dveřní západky: https://www.actimed.cz/pomucka-pro-seniory-do-auta---operne-madlo-pro-snadne-nastupovani-a-vystupovani/. Uváděné univerzální použití však nelze bez ověření garantovat pro konkrétní auto.
- Meyra.cz uvádí specializovaný ETAC AutoTurn: https://www.meyra.cz/etac-immedia-autoturn.html. Nepřebírat cenu, sklad, úhradové závěry ani kompatibilitu automaticky.
- Není k dispozici autorizovaný kvantitativní podklad pro hledanost nebo GSC dotazy zaprazi.cz. Nevydávat kvalifikované příležitosti za potvrzená měsíční čísla.

## Dotazy k měření později (hypotézy)

- jak pomoci seniorovi nastoupit do auta
- nastupování do auta po operaci kyčle
- otočný sedák do auta pro seniory
- madlo do auta pro seniory
- jak vystoupit z auta když bolí kyčel / koleno
- pomůcka na zvednutí nohou do auta

## Odborné podklady, kontrola 26.10.2026

1. Royal College of Occupational Therapists: https://www.rcot.co.uk/learn-about-occupational-therapy/ot-advice/lift-up/mobility
2. RiDC: https://ridc.org.uk/getting-and-out-car/swivel-seats
3. NHS: https://www.nhs.uk/social-care-and-support/practical-tips-if-you-care-for-someone/how-to-move-lift-and-handle-someone-else/
4. BESIP: https://besip.gov.cz/Ucastnici-silnicniho-provozu/Seniori/Senior-ridic-a-spolujezdec/Senior-a-vozidlo

Kritická bezpečnost: RiDC varuje před kluznými pomůckami ponechanými za jízdy, RCOT rozlišuje pevné opory a nenosná stropní madla. Nesmí se říkat, že každý otočný podsedák zaručuje bezpečnou polohu po operaci, že jakékoliv madlo je vhodné pro všechny dveřní západky, nebo že běžná rodina může zvedat nesoběstačného člověka bez zaučení. Při potřebě přesunu z vozíku či omezení hybnosti musí rozhodnout odborník.

## Implementace a QA

- Nová page šablona v aktuálním vizuálním systému: 4 stop situace, 4 scénáře, 4 porovnání pomůcek, 7 kroků, 7 měření, 6 FAQ a 4 odborné zdroje.
- WP auto-create pouze pro volný slug (bez přepisování existujících WordPress stránek), unikátní title a Yoast description, fallback pouze bez Yoast.
- Inbound: návrat z nemocnice, převoz vozíku do auta, vstávání z křesla a otázky před propuštěním.
- URL staged, nikoliv required v sitemapě před nasazením. Chráněný soubor v runtime a testovém inventáři.
- Po zeleném CI nová verze 0.8.171 vyžaduje marker všech 92 protected souborů, aktualizaci functions.php a style.css a kompletní CI, až poté main=dev a WordPress Pull + Deploy.
- Po vydání kontrola HTTP 200, release integrity, canonical HTTPS, title/description, sitemap, 4 inbound odkazy, 14 poradců a affiliate konfigurace. Rozlišovat konfigurované odkazy a reálné objednávky.

## Následná priorita

Samostatný průvodce `senior doma sám — jak přivolá pomoc?`, s faktickým ověřením fungování SOS služby, signálu, baterie, poplatku a skutečného přijetí poplachu. Téma nepřidávat jako generickou Top 10.
