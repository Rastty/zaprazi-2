# SEO Zápraží – druhá obsahová vlna (0.8.160, 26. 10. 2026)

## Obsahová hypotéza
Pro uživatele, kteří hledají „madlo na sádrokarton u WC“ a „toaletní židle vedle postele“, jsme ve veřejném českém vyhledávání našli spíše produktové popisy, obecné návody a původem zahraniční odborné guidance než dobrý rozhodovací český postup s měřením. **Kvantitativní hledanost, keyword difficulty, GSC clicks/impressions a nákupní konverze nemáme ověřené**. Neprohlašovat zaručeně nízkou konkurenci ani příjmy.

## Práce a diferenciace
- `/madlo-na-sadrokarton-u-wc/`: odlišný intent od `/madlo-k-wc-pro-seniory/`, který už funguje jako výběrový engine. Nový článek řeší bezpečnost podkladu, potřebu skutečné výztuhy, hranice výrobní nosnosti, montážní dokumentaci a vhodnou podlahovou alternativu. 7 kontrol, 3 volby, 5 FAQ, list pro montážníka, zdroje Kent NHS, Garaventa, NHS a Maltézská pomoc.
- `/toaletni-zidle-vedle-postele/`: odlišný intent od `/toaletni-zidle-pro-seniory/`. Nový článek řeší rozmístění vedle postele, pomocníka, šířku skutečné konstrukce, výšku sedu, světlo, brzdy a hygienické vyprázdnění. 7 kontrol, 3 volby, 5 FAQ a pracovní list. Podklady HealthLink BC, Fiona Stanley Hospital, NHS, Invira (výlučně technický příklad) a Maltézská pomoc.
- Každá nová stránka má nejméně 3 tematické inbound HTML cesty z již publikovaných redakčních stránek. Obě odkazují do původního bezpečnostního poradce; žádné přímé affiliate obchodní CTA, nové produktové doporučení ani změna léčebné rady.
- WordPress vytvoří nové stránky pouze při neobsazených slugech; existující ani historický příspěvek nepřepíše. Unikátní SEO title/meta přes Yoast a fallback bez duplicit.
- 84 runtime integrity markerů = verze 0.8.160, CSS header, WP release constant. Historický obsah 4 360 článků a 25 affiliate slotů se nemění.

## Ověřené externí podklady
- https://www.kentcht.nhs.uk/service/technician-service-occupational-therapy/
- https://www.garaventalift.cz/aktuality/bezbarierova-koupelna
- https://www.nhs.uk/social-care-and-support/care-services-equipment-and-care-homes/home-adaptations/
- https://www.healthlinkbc.ca/healthwise/caregiving-using-bedside-commode-toilet
- https://fsfhg.health.wa.gov.au/Our-services/Occupational-Therapy/Using-occupational-therapy-equipment-safely
- https://www.invira.cz/p/toaletni-zidle-nova
- https://osobni-asistence.cz/jak-upravit-byt-pro-seniory

## Po deploy
1. GitHub CI / predeploy fidelity / production advisors QA 3/3 zelené. Jen poté merge, srovnání dev=main.
2. Uživatel Pull + Deploy 0.8.160 v WP. Bez WPVibe.
3. Read-only live ověření release/integrity, obou nových URL 200, 1 H1, 7 checklist cards, 5 FAQ, Yoast canonical/meta, 3 inbound HTML odkazy a page sitemap.
4. Za 14/28 dní vyhodnocovat URL/query data (GSC), zobrazení/prokliky poradce a skutečné affiliate konverze. Bez aktuálního exportu nespekulovat o pořadí či výsledcích.
