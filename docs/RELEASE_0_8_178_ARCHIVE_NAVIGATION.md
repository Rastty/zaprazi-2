# Zápraží 0.8.178 — dokončení archivní čistky navigace / SEO

28. 10. 2026. Produkční obsah již prošel hromadnou čistkou (PR #462): 4 359 historických příspěvků v koši, jeden post ID 3638 zůstal v DB publikovaný, všech 53 Pages zachováno. Read-only QA PR #464 kontroluje namátkové HTTP 404, sitemapu, nové poradce, 25/25 affiliate slotů.

## Provedená změna
- Odstraněn blok Starší archiv z univerzální patičky, včetně dynamických odkazů do vyprazdněných kategorií a starého katalogu. Hlavní poradci, metodika a nastavení GDPR zůstávají.
- Patička z 4 na 3 sloupce s beze změny mobilním sloupcovým layoutem.
- Staré `category` a `post_tag` archivy zobrazují `noindex, follow` přes Yoast a WordPress fallback; jsou vyřazeny z Yoast taxonomy sitemapy podle oficiálního filtru `wpseo_sitemap_exclude_taxonomy`. Samostatné WordPress Page poradce se to netýká. Požadujeme ověření veřejného HTML/sitemapy.
- Žádné další WP trash, permanenty ani klamavé 301 redirecty.
- Zdroj: https://yoast.com/help/how-to-customize-the-sitemap-index/

## Vydání
Content PR musí projít zelenými testy, následně release marker všech 96 chráněných souborů a konstanta/style.css pro **0.8.178**. WP se změní až po uživatelském Deployer for Git → Pull → Deploy z větve dev. GSC indexace a ranking nejsou tvrzeny.

## Důležitá poznámka k dostupnosti
Veřejné WP REST API momentálně vrací nula příspěvků, zatímco poslední autentizované SQL vykázalo jeden `publish` post ID 3638. To není rozpor ve stavu DB, ale signalizuje rozdílnou veřejnou viditelnost, která vyžaduje samostatné ověření při obnově tohoto článku.
