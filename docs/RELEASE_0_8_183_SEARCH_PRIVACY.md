# Release 0.8.183 — ochrana interního hledání před GA4
Datum: 28. 10. 2026

## Problém
WordPress interní hledání používá `?s=`; dotaz může popisovat citlivé rodinné či zdravotní okolnosti. Dřívější GA4 `config` odesílal pageview bez upravených `page_location` a `page_referrer`. Google tyto parametry standardně přebírá z URL a referreru.

## Implementace
- Na interních vyhledávacích stránkách s `?s=` se GA4 **nespustí**, a to ani po analytickém souhlasu. Souhlas se dál uloží pro ostatní stránky.
- Na ostatních stránkách má GA4 `page_location` jen origin + pathname (bez query) a `page_referrer` pouze origin předchozí stránky.
- Generické funnel eventy a affiliate routing se nemění. Bez individuálních odpovědí, produktových ID, URL hledání a zdravotních profilů.
- Vysvětlení je zveřejněno i na stránce ochrany soukromí.

## Vedlejší dopady a zbylá rizika
Měření nevykazuje hledané výrazy. Ořez URL odstraní některé UTM parametry a část detailní atribuce; doména externího referreru zůstává. Tato změna **negarantuje** vypnutí všech nastavení GA4 Enhanced Measurement ani případných další externě instalovaných tagů: vlastník streamu musí v GA4 zkontrolovat automatické události, zejména hledání a outbound clicks.

## Release QA
Povinný 96/96 marker upgrade na 0.8.183, shoda `style.css` s `ZAPRAZI_RELEASE`, `npm test`, PHP lint a aktuální CI. Po nasazení `main=dev`: živé `release=0.8.183`, `integrity=ok`, konfigurovaných 25/25 affiliate slotů, 14 poradců, vyhledávání a vlastní prohlížečový test bez GA requestů na `?s=`.

Zdroje:
- https://developers.google.com/analytics/devguides/collection/ga4/reference/config
- https://developers.google.com/analytics/devguides/collection/ga4/views
